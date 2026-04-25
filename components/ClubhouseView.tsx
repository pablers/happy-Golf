import React, { useState, useMemo, useRef } from 'react';
import { defaultClubSet } from '../data/clubset';
import type { ClubInBag, UserProfile, HcpRecord, ClubSpecs } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, GolfBagIcon, SpinnerIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";

// Helper to get latest HCP
const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 18; // Default to 18 if no history
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};

// Helper to convert file to base64 for Gemini API
const fileToGenerativePart = (file: File): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const [header, data] = result.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
            resolve({ mimeType, data });
        };
        reader.onerror = error => reject(error);
    });
};


const ClubhouseView: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [bag, setBag] = useState<ClubInBag[]>(defaultClubSet);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ai = useMemo(() => {
        if (!process.env.API_KEY) {
            console.warn("API_KEY environment variable not set. AI features will be disabled.");
            return null;
        }
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);

    const handleNextClub = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bag.length);
    };

    const handlePrevClub = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + bag.length) % bag.length);
    };

    const currentClub = bag[currentIndex];
    const hcp = getLatestHcp(userProfile.hcpHistory);

    const expectedPerformance = useMemo(() => {
    if (!currentClub || currentClub.id === 'putter') return null;

    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    // Ajuste de hándicap: referencia en 18
    const hcpModifier = (18 - hcp) / 100;

    // Datos base del palo
    const base = currentClub.stats;

    // 🔹 Distancia: poco afectada por hándicap (máx ±3%)
    const distanceFactor = 0.3;
    const distance = base.distance.value * (1 + hcpModifier * distanceFactor);

    // 🔹 Precisión: muy sensible al hándicap (máx ±20%)
    const accuracyFactor = 2.0;
    let accuracy = base.accuracy.value * (1 + hcpModifier * accuracyFactor);
    accuracy = clamp(accuracy, 25, 98);

    // 🔹 Consistencia: sensible pero menos que precisión (máx ±15%)
    const consistencyFactor = 1.5;
    let consistency = base.consistency.value * (1 + hcpModifier * consistencyFactor);
    consistency = clamp(consistency, 35, 98);

    // 🔹 Dispersión aleatoria para simular variabilidad (más dispersión con HCP alto)
    const variability = Math.max(0.02, (hcp / 36) * 0.15); // hasta ±15% de dispersión
    const randomize = (val: number) => {
        const deviation = (Math.random() * 2 - 1) * variability * val;
        return clamp(val + deviation, 0, 100);
    };

    return {
        distance: distance.toFixed(0),
        accuracy: randomize(accuracy).toFixed(0),
        consistency: randomize(consistency).toFixed(0),
    };
}, [currentClub, hcp]);

    const handleAnalyzeClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !ai) return;
        
        const file = event.target.files[0];
        setIsAnalyzing(true);
        setError(null);

        try {
            const { mimeType, data } = await fileToGenerativePart(file);

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING, description: 'La marca del palo de golf, ej: "TaylorMade", "Titleist".' },
                  model: { type: Type.STRING, description: 'El nombre del modelo del palo, ej: "P790", "T200".' },
                  type: { type: Type.STRING, description: 'El tipo de palo, ej: "Hierro", "Driver", "Madera", "Híbrido", "Wedge".' },
                  loft: { type: Type.STRING, description: 'El loft del palo en grados, ej: "34°".' },
                  lie: { type: Type.STRING, description: 'El ángulo de lie del palo en grados, ej: "63°".' },
                  construction: { type: Type.STRING, description: 'El tipo de construcción, ej: "Cavity Back", "Muscle Back", "Hollow Body".' },
                  player_level: { type: Type.STRING, description: 'El nivel de habilidad del jugador objetivo, ej: "Mejora de Juego", "Jugadores", "Súper Mejora de Juego".' },
                }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType, data } },
                        { text: "Identifica este palo de golf a partir de la imagen. Busca en internet su marca, modelo y características técnicas clave basándote en el esquema JSON proporcionado." }
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema
                }
            });
            
            const jsonText = response.text.trim();
            const specs = JSON.parse(jsonText) as ClubSpecs;
            
            const newBag = [...bag];
            newBag[currentIndex].specs = specs;
            setBag(newBag);

        } catch (err) {
            console.error("Error analyzing club:", err);
            setError("No se pudo analizar el palo. La imagen puede no ser clara o el modelo es desconocido. Inténtalo de nuevo.");
        } finally {
            setIsAnalyzing(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : parseFloat(e.target.value);
        const newBag = [...bag];
        newBag[currentIndex].userDistance = value;
        setBag(newBag);
    };

    return (
        <div className="w-full flex-grow flex flex-col p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
            <header className="text-center mb-6">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <GolfBagIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Mi Juego de Palos</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Analiza y conoce tu equipamiento.</p>
            </header>

            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevClub} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-2xl font-bold text-center text-green-600 dark:text-green-400 w-48 truncate">{currentClub.name}</h2>
                <button onClick={handleNextClub} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ChevronRightIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
            </div>

            <main className="flex-grow space-y-6">
                {currentClub.id !== 'putter' && (
                    <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Análisis con IA</h3>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button onClick={handleAnalyzeClick} disabled={isAnalyzing || !ai} className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {isAnalyzing ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : 'Analizar con Imagen'}
                        </button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                        {currentClub.specs && Object.keys(currentClub.specs).length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 mt-4 text-sm">
                                {Object.entries(currentClub.specs).filter(([, value]) => value).map(([key, value]) => (
                                    <div key={key}>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</span>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {expectedPerformance && (
                    <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Rendimiento Esperado (HCP: {hcp.toFixed(1)})</h3>
                        <div className="grid grid-cols-3 gap-4 text-center mt-2">
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{expectedPerformance.distance}<span className="text-base font-normal">m</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">DISTANCIA</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{expectedPerformance.accuracy}<span className="text-base font-normal">%</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PRECISIÓN</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{expectedPerformance.consistency}<span className="text-base font-normal">%</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">CONSISTENCIA</p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label htmlFor="userDistance" className="font-bold text-gray-900 dark:text-white mb-2 block">{currentClub.id === 'putter' ? 'Media de Putts por ronda' : 'Mi Distancia Real'}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            id="userDistance" 
                            value={currentClub.userDistance ?? ''} 
                            onChange={handleDistanceChange} 
                            placeholder="Introduce tu distancia..."
                            className="w-full p-2.5 pr-12 text-center text-lg font-bold bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                            {currentClub.stats.distance.unit}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ClubhouseView;
