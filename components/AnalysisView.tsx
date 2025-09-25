import React, { useState, useMemo } from 'react';
import type { SavedRound, SavedRoundAnalysis } from '../types';
import LatestRoundsView from './LatestRoundsView';
import { buildCourseAnalysis } from '../services/analysisService';

interface AnalysisViewProps {
  savedRounds: SavedRound[];
  onSelectRound: (roundId: string) => void;
  onSelectCourse: (courseAnalysis: SavedRoundAnalysis) => void;
}

const CourseList: React.FC<{
    savedRounds: SavedRound[];
    onSelectCourse: (courseAnalysis: SavedRoundAnalysis) => void;
}> = ({ savedRounds, onSelectCourse }) => {

    const coursesAnalysis = useMemo(() => {
        return buildCourseAnalysis(savedRounds);
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