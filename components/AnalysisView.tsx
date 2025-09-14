import React, { useState, useMemo } from 'react';
import type { SavedRound, SavedRoundAnalysis, HcpRecord } from '../types';
import LatestRoundsView from './LatestRoundsView';
import { GOLF_COURSES } from '../constants';

interface AnalysisViewProps {
  savedRounds: SavedRound[];
  onSelectRound: (roundId: string) => void;
  onSelectCourse: (courseAnalysis: SavedRoundAnalysis) => void;
}

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
    if (playerHCP <= 0) return 0;
    const baseStrokes = Math.floor(playerHCP / 18);
    const extraStrokes = playerHCP % 18;
    return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const getRoundHcp = (round: SavedRound): number => {
    if (!round.userProfile.hcpHistory || round.userProfile.hcpHistory.length === 0) return 18;
    const relevantHistory = round.userProfile.hcpHistory
        .filter(h => new Date(h.date) <= new Date(round.date))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return relevantHistory.length > 0 ? relevantHistory[0].hcp : 18;
}


const CourseList: React.FC<{
    savedRounds: SavedRound[];
    onSelectCourse: (courseAnalysis: SavedRoundAnalysis) => void;
}> = ({ savedRounds, onSelectCourse }) => {
    
    const coursesAnalysis = useMemo(() => {
        const analysisMap = new Map<string, { rounds: SavedRound[], totalNetScore: number }>();
        
        savedRounds.forEach(round => {
            if (!analysisMap.has(round.setup.course.id)) {
                analysisMap.set(round.setup.course.id, { rounds: [], totalNetScore: 0 });
            }
            const courseData = analysisMap.get(round.setup.course.id)!;
            courseData.rounds.push(round);
            
            const roundHcp = getRoundHcp(round);
            
            const netScore = round.scores.reduce((total, hole) => {
                if (hole.strokes === null) return total;
                const hcpStrokes = calculateHandicapStrokes(hole.strokeIndex, roundHcp);
                return total + (hole.strokes - hole.par - hcpStrokes);
            }, 0);

            courseData.totalNetScore += netScore;
        });

        return Array.from(analysisMap.entries()).map(([courseId, data]) => {
            const course = GOLF_COURSES.find(c => c.id === courseId)!;
            return {
                courseId,
                courseName: course.name,
                rounds: data.rounds,
                roundCount: data.rounds.length,
                avgNetScore: data.totalNetScore / data.rounds.length,
            };
        }).sort((a, b) => b.roundCount - a.roundCount);

    }, [savedRounds]);

    if (coursesAnalysis.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No hay rondas guardadas para analizar por campo.</p>;
    }

    return (
        <div className="p-4 space-y-3">
            {coursesAnalysis.map(analysis => (
                <div key={analysis.courseId} onClick={() => onSelectCourse(analysis)} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{analysis.courseName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{analysis.roundCount} rondas</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-500 dark:text-gray-400">Media Neto</p>
                             <p className={`text-lg font-bold ${analysis.avgNetScore > 0 ? 'text-red-500' : 'text-blue-500'}`}>{analysis.avgNetScore > 0 ? `+${analysis.avgNetScore.toFixed(2)}` : analysis.avgNetScore.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const AnalysisView: React.FC<AnalysisViewProps> = ({ savedRounds, onSelectRound, onSelectCourse }) => {
    const [activeTab, setActiveTab] = useState<'history' | 'courses'>('history');

    return (
        <div className="w-full flex-grow flex flex-col bg-gray-100 dark:bg-gray-900 overflow-y-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex justify-center bg-gray-200 dark:bg-gray-700/50 rounded-full p-1 gap-1">
                    <button onClick={() => setActiveTab('history')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                        Historial
                    </button>
                    <button onClick={() => setActiveTab('courses')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'courses' ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                        Campos
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'history' ? (
                    <LatestRoundsView savedRounds={savedRounds} onSelectRound={onSelectRound} />
                ) : (
                    <CourseList savedRounds={savedRounds} onSelectCourse={onSelectCourse} />
                )}
            </div>
        </div>
    );
};

export default AnalysisView;