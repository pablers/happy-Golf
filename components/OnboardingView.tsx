import React, { useState } from 'react';
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon, GolfBallIcon } from './icons';
import { TRAINING_OBJECTIVES } from '../data/trainingData';
import { GOLF_COURSES } from '../constants';
import type { GolfCourse } from '../types';

interface OnboardingViewProps {
    onComplete: (handicap: number, trainingObjective: string, favoriteCourseIds: string[]) => void;
    initialName: string;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, initialName }) => {
    const [step, setStep] = useState(1);
    const [handicap, setHandicap] = useState(36);
    const [trainingObjective, setTrainingObjective] = useState('');
    const [favoriteCourseIds, setFavoriteCourseIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = GOLF_COURSES.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.municipality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.province?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20);

    const toggleCourse = (courseId: string) => {
        if (favoriteCourseIds.includes(courseId)) {
            setFavoriteCourseIds(favoriteCourseIds.filter(id => id !== courseId));
        } else {
            setFavoriteCourseIds([...favoriteCourseIds, courseId]);
        }
    };

    const handleNext = () => {
        if (step === 1 && handicap >= 0 && handicap <= 54) {
            setStep(2);
        } else if (step === 2 && trainingObjective) {
            setStep(3);
        }
    };

    const handleComplete = () => {
        onComplete(handicap, trainingObjective, favoriteCourseIds);
    };

    const canProceed = () => {
        if (step === 1) return handicap >= 0 && handicap <= 54;
        if (step === 2) return trainingObjective !== '';
        if (step === 3) return true; // Favorite courses are optional
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/60 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <GolfBallIcon className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">¡Bienvenido, {initialName}!</h1>
                    </div>
                    <p className="text-green-100">Configura tu perfil para comenzar</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/40">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex items-center ${s !== 3 ? 'flex-1' : ''}`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${s < step
                                        ? 'bg-green-600 text-white'
                                        : s === step
                                            ? 'bg-green-500 text-white ring-4 ring-green-200 dark:ring-green-800'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {s < step ? <CheckIcon className="w-5 h-5" /> : s}
                            </div>
                            {s !== 3 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Step 1: Handicap */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selecciona tu Hándicap de Inicio</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Esto nos ayudará a personalizar tu experiencia. Puedes actualizarlo más tarde.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="handicap" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hándicap (0-54)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        id="handicap-slider"
                                        min="0"
                                        max="54"
                                        step="0.5"
                                        value={handicap}
                                        onChange={(e) => setHandicap(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                                    />
                                    <input
                                        type="number"
                                        id="handicap"
                                        min="0"
                                        max="54"
                                        step="0.5"
                                        value={handicap}
                                        onChange={(e) => setHandicap(Math.min(54, Math.max(0, parseFloat(e.target.value) || 0)))}
                                        className="w-20 p-2.5 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-center font-bold text-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Valor actual: <span className="font-bold text-green-600 dark:text-green-400">{handicap}</span>
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Consejo:</strong> Si no conoces tu hándicap exacto, puedes usar una estimación basada en tu nivel:
                                    <br />• Principiante: 28-54 | Intermedio: 18-27 | Avanzado: 0-17
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Training Objective */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Elige tu Objetivo de Entrenamiento</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Selecciona el aspecto de tu juego que más quieres mejorar.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {TRAINING_OBJECTIVES.map((objective) => (
                                    <button
                                        key={objective.id}
                                        onClick={() => setTrainingObjective(objective.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${trainingObjective === objective.id
                                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${trainingObjective === objective.id
                                                        ? 'border-green-600 bg-green-600'
                                                        : 'border-gray-400'
                                                    }`}
                                            >
                                                {trainingObjective === objective.id && <CheckIcon className="w-4 h-4 text-white" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{objective.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {objective.levels.principiante.description.substring(0, 80)}...
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={() => setTrainingObjective('recommended')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${trainingObjective === 'recommended'
                                            ? 'border-green-600 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${trainingObjective === 'recommended'
                                                    ? 'border-green-600 bg-green-600'
                                                    : 'border-gray-400'
                                                }`}
                                        >
                                            {trainingObjective === 'recommended' && <CheckIcon className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Recomendado</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Te recomendaremos objetivos basados en tu progreso
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Favorite Courses */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Selecciona tus Campos Favoritos</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Opcional: Selecciona los campos donde juegas más frecuentemente.
                                </p>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Buscar campo de golf..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-2 max-h-96 overflow-y-auto">
                                {filteredCourses.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredCourses.map((course) => (
                                            <button
                                                key={course.id}
                                                onClick={() => toggleCourse(course.id)}
                                                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${favoriteCourseIds.includes(course.id)
                                                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-600'
                                                        : 'bg-white dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${favoriteCourseIds.includes(course.id)
                                                                ? 'border-green-600 bg-green-600'
                                                                : 'border-gray-400'
                                                            }`}
                                                    >
                                                        {favoriteCourseIds.includes(course.id) && <CheckIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{course.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {course.municipality && `${course.municipality}, `}
                                                            {course.province}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        {searchTerm ? 'No se encontraron campos' : 'Empieza a buscar campos de golf'}
                                    </p>
                                )}
                            </div>

                            {favoriteCourseIds.length > 0 && (
                                <div className="text-sm text-green-600 dark:text-green-400">
                                    {favoriteCourseIds.length} campo{favoriteCourseIds.length !== 1 ? 's' : ''} seleccionado{favoriteCourseIds.length !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg transition-colors"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Atrás
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg transition-all duration-200 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Siguiente
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg transition-all duration-200 hover:bg-green-700"
                            >
                                <CheckIcon className="w-5 h-5" />
                                Completar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default OnboardingView;
