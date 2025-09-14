
import React, { useMemo } from 'react';
import type { SavedRound, HoleScore, PostRoundAnswers, QuestionCategory, HcpRecord } from '../types';
import { ALL_QUESTIONS } from '../data/questionnaireData';
import { ChevronLeftIcon } from './icons';
import LineChart from './LineChart';
import Heatmap from './Heatmap';

interface RoundAnalysisProps {
  round: SavedRound;
  onBack: () => void;
}

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};


const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

const RoundAnalysis: React.FC<RoundAnalysisProps> = ({ round, onBack }) => {
    
    const analysis = useMemo(() => {
        const completedHoles = round.scores.filter(s => s.strokes !== null);
        const totalStrokes = completedHoles.reduce((sum, s) => sum + s.strokes!, 0);
        const totalPutts = completedHoles.reduce((sum, s) => sum + (s.putts || 0), 0);
        const roundHcp = getLatestHcp(round.userProfile.hcpHistory);

        const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
            if (playerHCP <= 0) return 0;
            const baseStrokes = Math.floor(playerHCP / 18);
            const extraStrokes = playerHCP % 18;
            return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
        };

        const getNetScore = (score: HoleScore): number | null => {
            if (score.strokes === null) return null;
            const hcpStrokes = calculateHandicapStrokes(score.strokeIndex, roundHcp);
            return score.strokes - score.par - hcpStrokes;
        };
        
        const netScore = completedHoles.reduce((sum, s) => sum + (getNetScore(s) || 0), 0);
        const doubleBogeys = completedHoles.filter(s => getNetScore(s) !== null && getNetScore(s)! >= 2).length;
        const fairwayOpportunities = completedHoles.filter(s => s.par > 3).length;
        const fairwaysHit = completedHoles.filter(s => s.fairwayHit === true).length;

        const strokesData = round.scores.map(s => s.strokes);
        const puttsData = round.scores.map(s => s.putts);
        const holeLabels = round.scores.map(s => `H${s.hole}`);

        const parAdjustedStrokes = round.scores.map(score => {
            const hcpStrokes = calculateHandicapStrokes(score.strokeIndex, roundHcp);
            return score.par + hcpStrokes;
        });
        
        const expectedPutts = round.scores.map(() => 2);

        const responses = Object.entries(round.answers)
            .map(([key, value]) => {
                const question = ALL_QUESTIONS.find(q => q.key === key);
                if (!question || !value) return null;
                const option = question.options.find(o => o.value === value);
                
                let hole = "Pre-ronda";
                if (key.includes('_h7_')) hole = "Hoyo 7";
                else if (key.includes('_h15_')) hole = "Hoyo 15";
                else if (['physical_state', 'mental_state', 'turf_condition', 'green_speed'].includes(key)) {
                     hole = "Final";
                }
                
                return {
                    category: question.category.charAt(0).toUpperCase() + question.category.slice(1),
                    response: `${option?.label || value}`,
                    hole,
                };
            })
            .filter(Boolean)
            .sort((a,b) => (a.hole > b.hole) ? 1 : ((b.hole > a.hole) ? -1 : 0));

        return { totalStrokes, totalPutts, netScore, doubleBogeys, fairwayOpportunities, fairwaysHit, strokesData, puttsData, holeLabels, getNetScore, responses, parAdjustedStrokes, expectedPutts };
    }, [round]);

    return (
        <div className="w-full flex-grow flex flex-col p-4 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
             <header className="relative text-center mb-4 flex-shrink-0">
                <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Análisis de Ronda</h1>
            </header>
            
            <div className="space-y-4">
                {/* General Info */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{round.userProfile.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{round.setup.course.name}</p>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(round.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <StatCard label="Golpes" value={analysis.totalStrokes} />
                    <StatCard label="Putts" value={analysis.totalPutts} />
                    <StatCard label="Neto" value={analysis.netScore > 0 ? `+${analysis.netScore}`: analysis.netScore} />
                    <StatCard label="Salidas" value={`${analysis.fairwaysHit}/${analysis.fairwayOpportunities}`} />
                    <StatCard label="Doble Bogeys+" value={analysis.doubleBogeys} />
                </div>

                {/* Charts */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Golpes por Hoyo</h3>
                    <LineChart data={analysis.strokesData} labels={analysis.holeLabels} secondaryData={analysis.parAdjustedStrokes} />
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Putts por Hoyo</h3>
                    <LineChart data={analysis.puttsData} labels={analysis.holeLabels} secondaryData={analysis.expectedPutts} />
                </div>
                
                {/* Heatmap */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Mapa de Calor (Neto)</h3>
                     <Heatmap scores={round.scores} getNetScore={analysis.getNetScore} />
                </div>
                
                {/* Responses */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Respuestas a Preguntas</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="py-2">Categoría</th>
                                <th className="py-2">Respuesta</th>
                                <th className="py-2 text-right">Hoyo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                             {analysis.responses.map((r, i) => r && (
                                <tr key={i}>
                                    <td className="py-2">{r.category}</td>
                                    <td className="py-2">{r.response}</td>
                                    <td className="py-2 text-right">{r.hole}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RoundAnalysis;