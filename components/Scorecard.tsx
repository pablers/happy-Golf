
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { INITIAL_HOLE_SCORES } from '../constants';
import type { HoleScore, ScorecardSessionSetup, PostRoundAnswers, RoundState, QuestionCategory, Question, UserProfile, SavedRound, HcpRecord, ScorecardPlayer } from '../types';
import { ALL_QUESTIONS } from '../data/questionnaireData';
import { GoogleGenAI } from "@google/genai";
import { SpinnerIcon, MicrophoneIcon, ChevronDownIcon, ChevronRightIcon, TargetIcon } from './icons';
import QuestionnaireModal from './QuestionnaireModal';
import ReviewQuestionsModal from './ReviewQuestionsModal';


interface ScorecardProps {
    setup: ScorecardSessionSetup;
    userProfile: UserProfile;
    onSaveRound: (round: SavedRound) => void;
}

const SESSION_STORAGE_KEY = 'golf-multiplayer-session-data';

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 36;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
    if (playerHCP <= 0) return 0;
    const baseStrokes = Math.floor(playerHCP / 18);
    const extraStrokes = playerHCP % 18;
    return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const ScoreResult: React.FC<{ result: number | null }> = ({ result }) => {
    if (result === null || isNaN(result)) return <span className="text-gray-500 dark:text-gray-500">-</span>;
    const displayClass = result < 0 ? 'text-blue-500 dark:text-blue-400' : result > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300';
    const displayText = result > 0 ? `+${result}` : result === 0 ? 'E' : String(result);
    return <span className={`font-bold tabular-nums ${displayClass}`}>{displayText}</span>;
}

const Scorecard: React.FC<ScorecardProps> = ({ setup, userProfile, onSaveRound }) => {
    const [players, setPlayers] = useState<ScorecardPlayer[]>([]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    
    const [answers, setAnswers] = useState<Partial<PostRoundAnswers>>({});
    const [roundState, setRoundState] = useState<RoundState>({ cooldown: 0, pendingQuestions: [], askedThisHalf: {}, questionBudget: 3, patternsMetThisRound: [] });
    const [expandedHole, setExpandedHole] = useState<number | null>(null);
    const [transcribingHole, setTranscribingHole] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeHoleForUpload, setActiveHoleForUpload] = useState<number | null>(null);
    
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // FIX: All hooks are moved before any potential early returns to ensure consistent call order.
    const ai = useMemo(() => {
        if (!process.env.API_KEY) return null;
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);
    
    const activePlayer = players[activePlayerIndex];
    
    const getNetScore = useCallback((score: HoleScore, hcp: number): number | null => {
        if (score.strokes === null) return null;
        const hcpStrokes = calculateHandicapStrokes(score.strokeIndex, hcp);
        return score.strokes - score.par - hcpStrokes;
    }, []);

    const visibleHoles = useMemo(() => {
        if (!activePlayer) return [];
        switch (setup.roundType) {
            case 'front': return activePlayer.scores.slice(0, 9);
            case 'back': return activePlayer.scores.slice(9, 18);
            default: return activePlayer.scores;
        }
    }, [activePlayer, setup.roundType]);

    const totals = useMemo(() => {
        if (!activePlayer) return { strokes: 0, putts: 0, score: 0, fairwaysHit: 0, fairwayOpportunities: 0 };
        
        const completedHoles = visibleHoles.filter(s => s.strokes !== null);
        if (completedHoles.length === 0) {
            return { strokes: 0, putts: 0, score: 0, fairwaysHit: 0, fairwayOpportunities: 0 };
        }
        
        const totalStrokes = completedHoles.reduce((sum, s) => sum + s.strokes!, 0);
        const totalPutts = completedHoles.reduce((sum, s) => sum + (s.putts || 0), 0);
        const totalScore = completedHoles.reduce((sum, s) => sum + (getNetScore(s, activePlayer.hcp) || 0), 0);

        const fairwayOpportunities = visibleHoles.filter(s => s.par > 3 && s.strokes !== null).length;
        const fairwaysHit = visibleHoles.filter(s => s.fairwayHit === true).length;
        
        return { strokes: totalStrokes, putts: totalPutts, score: totalScore, fairwaysHit, fairwayOpportunities };
    }, [visibleHoles, activePlayer, getNetScore]);

    const saveSession = useCallback(() => {
        if (players.length === 0) return;
        const sessionData = {
            setup,
            players,
            answers,
            roundState,
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }, [setup, players, answers, roundState]);

    // Initialize or load session
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(SESSION_STORAGE_KEY);
            const savedSession = savedData ? JSON.parse(savedData) : null;
            if (savedSession && savedSession.setup?.course.id === setup.course.id && savedSession.setup?.roundType === setup.roundType) {
                setPlayers(savedSession.players);
                setAnswers(savedSession.answers || {});
                setRoundState(savedSession.roundState || { cooldown: 0, pendingQuestions: [], askedThisHalf: {}, questionBudget: 3, patternsMetThisRound: [] });
            } else {
                const initialPlayers: ScorecardPlayer[] = [
                    { id: 1, name: userProfile.name, hcp: getLatestHcp(userProfile.hcpHistory), scores: JSON.parse(JSON.stringify(INITIAL_HOLE_SCORES)) },
                    { id: 2, name: 'Jugador 2', hcp: 18.0, scores: JSON.parse(JSON.stringify(INITIAL_HOLE_SCORES)) },
                    { id: 3, name: 'Jugador 3', hcp: 18.0, scores: JSON.parse(JSON.stringify(INITIAL_HOLE_SCORES)) },
                    { id: 4, name: 'Jugador 4', hcp: 18.0, scores: JSON.parse(JSON.stringify(INITIAL_HOLE_SCORES)) },
                ];
                setPlayers(initialPlayers);
                setAnswers({
                    practice_time: setup.practiceTime,
                    initial_weather: setup.weather,
                    initial_wind: setup.wind,
                });
                setRoundState({ cooldown: 0, pendingQuestions: [], askedThisHalf: {}, questionBudget: 3, patternsMetThisRound: [] });
            }
        } catch (error) {
            console.error("Failed to load session data:", error);
            // Fallback to fresh state
        }
    }, [setup, userProfile]);
    
    // Save session on any change
    useEffect(() => {
        saveSession();
    }, [saveSession]);
    
    if (!activePlayer) {
      return (
        <div className="flex items-center justify-center h-full">
            <SpinnerIcon className="w-8 h-8 animate-spin text-green-500" />
        </div>
      );
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !activeHoleForUpload || !ai) return;
        
        const file = event.target.files[0];
        setTranscribingHole(activeHoleForUpload);

        try {
            const base64Audio = await fileToBase64(file);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ inlineData: { mimeType: file.type, data: base64Audio } }, { text: "Transcribe este audio sobre una nota de golf." }] }],
            });
            const transcription = response.text.trim();
            handleCommentChange(activeHoleForUpload, transcription);
        } catch (error) {
            console.error("Error transcribing audio:", error);
            alert("No se pudo transcribir el audio.");
        } finally {
            setTranscribingHole(null);
            setActiveHoleForUpload(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    const handleAudioUpload = (hole: number) => {
        setActiveHoleForUpload(hole);
        fileInputRef.current?.click();
    };

    const handleCommentChange = (hole: number, text: string) => {
        const updatedPlayers = [...players];
        updatedPlayers[0].scores = updatedPlayers[0].scores.map(s => s.hole === hole ? { ...s, comment: text } : s);
        setPlayers(updatedPlayers);
    };

    const handleCommentSave = () => setExpandedHole(null);
    
    const runDecisionEngine = (updatedScores: HoleScore[], changedHoleIndex: number) => {
        const currentHoleNumber = changedHoleIndex + 1;
        let nextRoundState = { ...roundState };
        let questionToAsk: Question | null = null;
        
        if (currentHoleNumber === 10) {
            nextRoundState.askedThisHalf = {};
            nextRoundState.questionBudget = 3;
        }

        if (currentHoleNumber === 7 || currentHoleNumber === 15) {
            const climateQuestionKey = `weather_h${currentHoleNumber}_confirm` as keyof PostRoundAnswers;
            if (!answers[climateQuestionKey]) {
                questionToAsk = ALL_QUESTIONS.find(q => q.key === climateQuestionKey) || null;
                if (questionToAsk) {
                   setRoundState(next => ({ ...next, cooldown: Math.max(1, next.cooldown) }));
                   setCurrentQuestion(questionToAsk);
                   return;
                }
            }
        }
        
        if (nextRoundState.cooldown > 0) nextRoundState.cooldown--;
        
        if (nextRoundState.cooldown === 0 && nextRoundState.pendingQuestions.length > 0) {
            const categoryToAsk = nextRoundState.pendingQuestions.shift()!;
            if (!nextRoundState.askedThisHalf[categoryToAsk] && nextRoundState.questionBudget > 0) {
                 questionToAsk = ALL_QUESTIONS.find(q => q.category === categoryToAsk)!;
                 nextRoundState.questionBudget--;
                 nextRoundState.askedThisHalf[categoryToAsk] = true;
            }
        }

        if (!questionToAsk && nextRoundState.cooldown === 0) {
            const recentScores = updatedScores.slice(Math.max(0, changedHoleIndex - 4), changedHoleIndex + 1);
            
            const QUESTION_PRIORITY: QuestionCategory[] = ['physical', 'mental', 'turf', 'greens'];
            for (const category of QUESTION_PRIORITY) {
                if (!nextRoundState.askedThisHalf[category] && nextRoundState.questionBudget > 0) {
                    let patternMet = false, newCooldown = 2;
                    const getNet = (s: HoleScore) => getNetScore(s, players[0].hcp);

                    switch (category) {
                        case 'physical':
                            const last4Net = recentScores.slice(-4).map(getNet);
                            const badInLast4 = last4Net.filter(n => n !== null && n >= 2).length >= 2;
                            if (badInLast4) { patternMet = true; newCooldown = 3; }
                            break;
                        case 'mental':
                            const last3Net = recentScores.slice(-3).map(getNet);
                            if (last3Net.length >= 2 && last3Net.every(n => n !== null)) {
                                if (Math.abs(last3Net[last3Net.length-1]! - last3Net[last3Net.length-2]!) >= 2) {
                                    patternMet = true; newCooldown = 3;
                                }
                            }
                            break;
                        case 'greens':
                             const threePuttsInLast3 = recentScores.slice(-3).filter(s => s.putts !== null && s.putts >= 3).length >= 2;
                             if (threePuttsInLast3) patternMet = true;
                             break;
                    }
                    if (patternMet) {
                        if (!nextRoundState.patternsMetThisRound.includes(category)) nextRoundState.patternsMetThisRound.push(category);
                        questionToAsk = ALL_QUESTIONS.find(q => q.category === category)!;
                        nextRoundState.questionBudget--;
                        nextRoundState.askedThisHalf[category] = true;
                        nextRoundState.cooldown = newCooldown;
                        break;
                    }
                }
            }
        }
        setRoundState(nextRoundState);
        if (questionToAsk) setCurrentQuestion(questionToAsk);
    };

    const handleScoreChange = (hole: number, type: 'strokes' | 'putts', value: string) => {
        const numericValue = value === '' ? null : parseInt(value, 10);
        if (value !== '' && (isNaN(numericValue!) || numericValue! < 0)) return;

        const updatedPlayers = players.map((player, index) => {
            if (index === activePlayerIndex) {
                const updatedScores = player.scores.map(s => s.hole === hole ? { ...s, [type]: numericValue } : s);
                if (index === 0 && type === 'strokes' && numericValue !== null) {
                    const holeIndex = updatedScores.findIndex(s => s.hole === hole);
                    runDecisionEngine(updatedScores, holeIndex);
                }
                return { ...player, scores: updatedScores };
            }
            return player;
        });
        setPlayers(updatedPlayers);
    };
    
    const handleFairwayHitToggle = (holeNumber: number, par: number) => {
        if (par <= 3 || activePlayerIndex !== 0) return;

        const updatedPlayers = [...players];
        const playerScores = updatedPlayers[0].scores;
        const holeIndex = playerScores.findIndex(s => s.hole === holeNumber);
        if (holeIndex === -1) return;

        const currentStatus = playerScores[holeIndex].fairwayHit;
        let newStatus: boolean | null;

        if (currentStatus === null) {
            newStatus = true;
        } else if (currentStatus === true) {
            newStatus = false;
        } else {
            newStatus = null;
        }
        
        playerScores[holeIndex].fairwayHit = newStatus;
        setPlayers(updatedPlayers);
    };

    const handleAnswerQuestion = (key: keyof PostRoundAnswers, value: string) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);
        setCurrentQuestion(null);
    };
    
    const handleReviewSave = (newAnswers: Partial<PostRoundAnswers>) => {
        setAnswers(newAnswers);
        setIsReviewModalOpen(false);
    };

    const performSave = () => {
        const userRoundData: SavedRound = {
            id: `${setup.course.id}-${new Date().toISOString()}`,
            date: new Date().toISOString(),
            setup,
            scores: players[0].scores,
            answers,
            userProfile,
        };
        onSaveRound(userRoundData);
    };
    
    const handleSaveRound = () => {
        setIsReviewModalOpen(true);
    };

    const handlePlayerHcpChange = (newHcp: string) => {
        const hcpValue = parseFloat(newHcp);
        if (isNaN(hcpValue)) return;
        
        const updatedPlayers = [...players];
        updatedPlayers[activePlayerIndex].hcp = hcpValue;
        setPlayers(updatedPlayers);
    };
    
    const handleNameEditStart = (player: ScorecardPlayer) => {
        if (player.id === 1) return;
        setEditingPlayerId(player.id);
        setEditingName(player.name);
    };
    
    const handleNameEditSave = () => {
        if (editingPlayerId === null) return;
        const updatedPlayers = players.map(p => p.id === editingPlayerId ? { ...p, name: editingName } : p);
        setPlayers(updatedPlayers);
        setEditingPlayerId(null);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900/50">
             {currentQuestion && <QuestionnaireModal question={currentQuestion} onAnswer={handleAnswerQuestion} onClose={() => setCurrentQuestion(null)} />}
             <ReviewQuestionsModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                initialAnswers={answers}
                onSave={(newAnswers) => {
                    setAnswers(newAnswers);
                    setIsReviewModalOpen(false);
                    setTimeout(performSave, 100);
                }}
                scores={players.length > 0 ? players[0].scores : []}
                roundState={roundState}
            />
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{setup.course.name}</h1>
                <div className="flex -mb-4 -mx-4 border-b border-gray-200 dark:border-gray-700">
                    {players.map((player, index) => (
                        <button 
                            key={player.id} 
                            onClick={() => setActivePlayerIndex(index)}
                            onDoubleClick={() => handleNameEditStart(player)}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                                activePlayerIndex === index 
                                ? 'border-green-500 text-green-600 dark:text-green-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            {editingPlayerId === player.id ? (
                                <input 
                                    type="text" 
                                    value={editingName} 
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={handleNameEditSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNameEditSave()}
                                    autoFocus
                                    className="bg-transparent border-b border-green-500 text-center w-24"
                                />
                            ) : player.name}
                        </button>
                    ))}
                </div>
            </header>
            
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-between text-sm">
                <span>Jugador: <span className="font-bold">{activePlayer.name}</span></span>
                <div className="flex items-center gap-2">
                    <label htmlFor="playerHcp" className="font-semibold text-gray-700 dark:text-gray-300">HCP:</label>
                    {activePlayerIndex === 0 ? (
                        <span className="font-bold bg-green-500/20 text-green-600 dark:text-green-300 px-2 py-0.5 rounded">{activePlayer.hcp.toFixed(1)}</span>
                    ) : (
                        <input 
                            type="number" 
                            id="playerHcp"
                            step="0.1"
                            value={activePlayer.hcp} 
                            onChange={(e) => handlePlayerHcpChange(e.target.value)}
                            className="w-16 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded-md text-center" 
                        />
                    )}
                </div>
            </div>

            <main className="flex-grow overflow-y-auto">
                <table className="w-full text-center text-sm">
                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                        <tr>
                            {activePlayerIndex === 0 && <th className="p-2 w-8"></th>}
                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Hoyo</th>
                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Par</th>
                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">+/-</th>
                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Golpes</th>
                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Putts</th>
                            {activePlayerIndex === 0 && <th className="p-2 w-12 font-semibold text-gray-600 dark:text-gray-300">Salida</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {visibleHoles.map(hole => (
                            <React.Fragment key={hole.hole}>
                                <tr onClick={() => activePlayerIndex === 0 && setExpandedHole(expandedHole === hole.hole ? null : hole.hole)} className={activePlayerIndex === 0 ? "hover:bg-gray-200/70 dark:hover:bg-gray-700/50 cursor-pointer" : ""}>
                                    {activePlayerIndex === 0 && <td className="p-2 text-gray-500 dark:text-gray-400">{expandedHole === hole.hole ? <ChevronDownIcon className="w-5 h-5 mx-auto" /> : <ChevronRightIcon className="w-5 h-5 mx-auto" />}</td>}
                                    <td className="p-2 font-bold text-lg text-gray-900 dark:text-white">{hole.hole}</td>
                                    <td className="p-2 text-gray-500 dark:text-gray-400">{hole.par}</td>
                                    <td className="p-2"><ScoreResult result={getNetScore(hole, activePlayer.hcp)} /></td>
                                    <td className="p-2"><input type="number" inputMode='numeric' pattern="[0-9]*" value={hole.strokes === null ? '' : hole.strokes} onChange={(e) => handleScoreChange(hole.hole, 'strokes', e.target.value)} onClick={e => e.stopPropagation()} className="w-12 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded-md text-center" /></td>
                                    <td className="p-2"><input type="number" inputMode='numeric' pattern="[0-9]*" value={hole.putts === null ? '' : hole.putts} onChange={(e) => handleScoreChange(hole.hole, 'putts', e.target.value)} onClick={e => e.stopPropagation()} className="w-12 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded-md text-center" /></td>
                                    {activePlayerIndex === 0 && (
                                        <td className="p-2" onClick={(e) => { e.stopPropagation(); handleFairwayHitToggle(hole.hole, hole.par); }}>
                                            {hole.par > 3 ? (
                                                <div className="flex justify-center items-center cursor-pointer">
                                                    <TargetIcon className={`w-6 h-6 transition-colors ${
                                                        hole.fairwayHit === true ? 'text-green-500' :
                                                        hole.fairwayHit === false ? 'text-red-500' :
                                                        'text-gray-400 dark:text-gray-600'
                                                    }`} />
                                                </div>
                                            ) : <span className="text-gray-400">-</span>}
                                        </td>
                                    )}
                                </tr>
                                {activePlayerIndex === 0 && expandedHole === hole.hole && (
                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                        <td colSpan={7} className="p-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <textarea value={hole.comment || ''} onChange={(e) => handleCommentChange(hole.hole, e.target.value)} onClick={e => e.stopPropagation()} placeholder="Añadir comentario..." className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md text-sm flex-grow" rows={2} />
                                                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                                                    <button onClick={(e) => { e.stopPropagation(); handleAudioUpload(hole.hole); }} disabled={transcribingHole === hole.hole} className="p-2 bg-gray-300 dark:bg-gray-600 rounded-full text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50">{transcribingHole === hole.hole ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <MicrophoneIcon className="w-5 h-5" />}</button>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); handleCommentSave(); }} className="self-end px-4 py-1 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700">Ok</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                 {activePlayerIndex === 0 && (
                    <div className="p-4 space-y-4">
                        <button onClick={() => setIsReviewModalOpen(true)} className="w-full p-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors">Revisar Preguntas</button>
                        <button onClick={handleSaveRound} className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">Guardar Tarjeta</button>
                    </div>
                 )}
            </main>

            <footer className="sticky bottom-0 p-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid grid-cols-4 text-center">
                <div><span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">SALIDAS</span><p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{totals.fairwaysHit}/{totals.fairwayOpportunities}</p></div>
                <div><span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">GOLPES</span><p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.strokes}</p></div>
                <div><span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">PUNTUACIÓN</span><p className="text-2xl font-bold text-gray-900 dark:text-white"><ScoreResult result={totals.score} /></p></div>
                <div><span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">PUTTS</span><p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.putts}</p></div>
            </footer>
        </div>
    );
};

export default Scorecard;