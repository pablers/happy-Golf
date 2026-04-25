


import React, { useMemo, useState } from 'react';
import type { SavedRoundAnalysis, HcpRecord } from '../types';
import { ChevronLeftIcon, ChartPieIcon, CheckCircleIcon, TrendingUpIcon, TrendingDownIcon, InformationCircleIcon, TargetIcon } from './icons';
import LineChart from './LineChart';

interface CourseAnalysisViewProps {
  courseAnalysis: SavedRoundAnalysis;
  onBack: () => void;
}

const kpiDescriptions: { [key: string]: string } = {
    'Media de Golpes': 'Número medio de golpes que necesitarías para completar 18 hoyos en este campo. Se calcula promediando tu rendimiento en los hoyos jugados.',
    'GIR %': 'Porcentaje de Greenes en Regulación. Mide la frecuencia con la que tu bola llega al green con golpes de sobra para hacer 2 putts para el par (ej. en el green en 1 golpe en un par 3, o en 2 en un par 4). Es un indicador clave de la precisión en el juego largo.',
    'Putts por GIR': 'Media de putts que realizas cuando alcanzas un Green en Regulación. Un valor cercano a 2.0 es el estándar. Un valor inferior indica un putt excelente.',
    'Fairways %': 'Porcentaje de Salidas en Calle. Mide la frecuencia con la que tu primer golpe en un par 4 o par 5 termina en la calle. Es un indicador clave de la precisión con el driver y las maderas.'
};

const StatCard: React.FC<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    isInfoOpen: boolean;
    onInfoClick: () => void;
}> = ({ label, value, icon, description, isInfoOpen, onInfoClick }) => (
    <div className="relative">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 h-full">
            <div className="text-green-500 dark:text-green-400 flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onInfoClick();
                        }}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
                        aria-label={`Información sobre ${label}`}
                    >
                        <InformationCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
        {isInfoOpen && (
            <div
                className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="font-bold mb-1">{label}</p>
                <p>{description}</p>
            </div>
        )}
    </div>
);


const HoleRanking: React.FC<{ title: string; holes: { hole: number; avgNet: number }[]; icon: React.ReactNode }> = ({ title, holes, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">{icon} {title}</h3>
        <ul className="space-y-2">
            {holes.map(({ hole, avgNet }) => (
                <li key={hole} className="flex justify-between items-center text-sm">
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">Hoyo {hole}</span>
                    <span className={`font-bold tabular-nums ${avgNet < 0 ? 'text-blue-500' : avgNet > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {avgNet > 0 ? `+${avgNet.toFixed(2)}` : avgNet.toFixed(2)}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};


const CourseAnalysisView: React.FC<CourseAnalysisViewProps> = ({ courseAnalysis, onBack }) => {
    const [selectedHole, setSelectedHole] = useState<number>(1);
    const [openInfo, setOpenInfo] = useState<string | null>(null);
    
    const handleInfoClick = (label: string) => {
        setOpenInfo(prev => (prev === label ? null : label));
    };

    const analysis = useMemo(() => {
        const { rounds } = courseAnalysis;
        let totalStrokes = 0;
        let totalPutts = 0;
        let totalGIRs = 0;
        let totalGIRPutts = 0;
        let holesPlayedWithStrokes = 0;
        let holesPlayedWithGIR = 0;
        let totalFairwayOpportunities = 0;
        let totalFairwaysHit = 0;

        const scoreDistribution = { birdie: 0, par: 0, bogey: 0, doubleBogey: 0 };
        const holeStats: { [hole: number]: { totalNet: number; count: number; totalPutts: number; } } = {};
        const holeEvolution: { [hole: number]: (number | null)[] } = {};

        for(let i = 1; i <= 18; i++) {
            holeStats[i] = { totalNet: 0, count: 0, totalPutts: 0 };
            holeEvolution[i] = Array(rounds.length).fill(null);
        }

        const questionCounts: { [answer: string]: number } = {};

        const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
            const baseStrokes = Math.floor(playerHCP / 18);
            const extraStrokes = playerHCP % 18;
            return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
        };

        rounds.forEach((round, roundIndex) => {
            const roundHcp = getLatestHcp(round.userProfile.hcpHistory);
            round.scores.forEach(score => {
                if (score && score.strokes !== null) {
                    const hcpStrokes = calculateHandicapStrokes(score.strokeIndex, roundHcp);
                    const netScore = score.strokes - score.par - hcpStrokes;
                    
                    totalStrokes += score.strokes;
                    holesPlayedWithStrokes++;

                    holeStats[score.hole].totalNet += netScore;
                    holeStats[score.hole].count++;
                    holeEvolution[score.hole][roundIndex] = score.strokes;
                    
                    if (netScore <= -1) scoreDistribution.birdie++;
                    else if (netScore === 0) scoreDistribution.par++;
                    else if (netScore === 1) scoreDistribution.bogey++;
                    else scoreDistribution.doubleBogey++;

                    if (score.par > 3) {
                        totalFairwayOpportunities++;
                        if (score.fairwayHit === true) {
                            totalFairwaysHit++;
                        }
                    }

                    if (score.putts !== null) {
                        const isGIR = score.strokes - score.putts <= score.par - 2;
                        if (isGIR) {
                            totalGIRs++;
                            totalGIRPutts += score.putts;
                        }
                        holesPlayedWithGIR++;
                        totalPutts += score.putts;
                        holeStats[score.hole].totalPutts += score.putts;
                    }
                }
            });

            Object.values(round.answers).forEach(answer => {
                if (answer) questionCounts[answer] = (questionCounts[answer] || 0) + 1;
            });
        });
        
        const avgStrokes = holesPlayedWithStrokes > 0 ? (totalStrokes / holesPlayedWithStrokes) * 18 : 0;
        const girPercentage = holesPlayedWithGIR > 0 ? (totalGIRs / holesPlayedWithGIR) * 100 : 0;
        const puttsPerGIR = totalGIRs > 0 ? totalGIRPutts / totalGIRs : 0;
        const fairwaysPercentage = totalFairwayOpportunities > 0 ? (totalFairwaysHit / totalFairwayOpportunities) * 100 : 0;


        const rankedHoles = Object.entries(holeStats)
            .filter(([, stats]) => stats.count > 0)
            .map(([hole, stats]) => ({ 
                hole: Number(hole), 
                avgNet: stats.totalNet / stats.count, 
                avgPutts: stats.count > 0 ? stats.totalPutts / stats.count : 0,
                par: rounds[0].scores[Number(hole)-1].par
             }))
            .sort((a, b) => a.hole - b.hole);

        const bestHoles = [...rankedHoles].sort((a,b) => a.avgNet - b.avgNet).slice(0, 3);
        const worstHoles = [...rankedHoles].sort((a,b) => b.avgNet - a.avgNet).slice(0, 3);

        const topAnswers = Object.entries(questionCounts)
            .map(([answer, count]) => {
                const labelMap: {[key:string]: string} = { 'bit_tired': 'Algo cansado', 'tired': 'Cansado', 'discomfort': 'Molestia', 'distracted': 'Distraído', 'frustrated': 'Frustrado', 'focused': 'Concentrado' };
                return { label: labelMap[answer] || answer, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return { avgStrokes, girPercentage, puttsPerGIR, fairwaysPercentage, scoreDistribution, rankedHoles, bestHoles, worstHoles, holeEvolution, topAnswers };
    }, [courseAnalysis]);
    
    const parForSelectedHole = courseAnalysis.rounds[0]?.scores[selectedHole - 1]?.par || 0;

    return (
        <div 
            className="w-full flex-grow flex flex-col p-4 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto"
            onClick={() => openInfo && setOpenInfo(null)}
        >
             <header className="relative text-center mb-4 flex-shrink-0">
                <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate px-8">{courseAnalysis.courseName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{courseAnalysis.roundCount} rondas analizadas</p>
            </header>
            
            <div className="space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-4">
                   <StatCard 
                        label="Media de Golpes" 
                        value={analysis.avgStrokes.toFixed(2)} 
                        icon={<ChartPieIcon className="w-8 h-8"/>} 
                        description={kpiDescriptions['Media de Golpes']}
                        isInfoOpen={openInfo === 'Media de Golpes'}
                        onInfoClick={() => handleInfoClick('Media de Golpes')}
                   />
                   <StatCard 
                        label="Fairways %" 
                        value={`${analysis.fairwaysPercentage.toFixed(1)}%`} 
                        icon={<TargetIcon className="w-8 h-8"/>} 
                        description={kpiDescriptions['Fairways %']}
                        isInfoOpen={openInfo === 'Fairways %'}
                        onInfoClick={() => handleInfoClick('Fairways %')}
                    />
                   <StatCard 
                        label="GIR %" 
                        value={`${analysis.girPercentage.toFixed(1)}%`} 
                        icon={<CheckCircleIcon className="w-8 h-8"/>} 
                        description={kpiDescriptions['GIR %']}
                        isInfoOpen={openInfo === 'GIR %'}
                        onInfoClick={() => handleInfoClick('GIR %')}
                    />
                   <StatCard 
                        label="Putts por GIR" 
                        value={analysis.puttsPerGIR.toFixed(2)} 
                        icon={<CheckCircleIcon className="w-8 h-8"/>}
                        description={kpiDescriptions['Putts por GIR']}
                        isInfoOpen={openInfo === 'Putts por GIR'}
                        onInfoClick={() => handleInfoClick('Putts por GIR')}
                    />
                </div>
                
                {/* Best/Worst holes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HoleRanking title="Mejores Hoyos (vs Par Neto)" holes={analysis.bestHoles} icon={<TrendingUpIcon className="w-6 h-6 text-green-500"/>} />
                    <HoleRanking title="Peores Hoyos (vs Par Neto)" holes={analysis.worstHoles} icon={<TrendingDownIcon className="w-6 h-6 text-red-500"/>} />
                </div>

                {/* Hole Evolution */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">Evolución por Hoyo</h3>
                        <select
                            value={selectedHole}
                            onChange={(e) => setSelectedHole(Number(e.target.value))}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm focus:ring-green-500 focus:border-green-500"
                        >
                            {[...Array(18)].map((_, i) => <option key={i+1} value={i+1}>Hoyo {i+1}</option>)}
                        </select>
                    </div>
                    <LineChart data={analysis.holeEvolution[selectedHole]} labels={courseAnalysis.rounds.map((r,i) => `R${i+1}`)} secondaryData={Array(courseAnalysis.rounds.length).fill(parForSelectedHole)} />
                </div>
                
                {/* Hole Performance Table */}
                 <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Rendimiento por Hoyo</h3>
                    <div className="h-48 overflow-y-auto">
                        <table className="w-full text-center text-sm">
                           <thead className="sticky top-0 bg-white dark:bg-gray-800">
                                <tr>
                                    <th className="p-1 font-semibold text-gray-600 dark:text-gray-300">Hoyo</th>
                                    <th className="p-1 font-semibold text-gray-600 dark:text-gray-300">Par</th>
                                    <th className="p-1 font-semibold text-gray-600 dark:text-gray-300">Media Neto</th>
                                    <th className="p-1 font-semibold text-gray-600 dark:text-gray-300">Media Putts</th>
                                </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {analysis.rankedHoles.map(h => (
                                    <tr key={h.hole}>
                                        <td className="p-1 font-bold">{h.hole}</td>
                                        <td className="p-1 text-gray-500 dark:text-gray-400">{h.par}</td>
                                        <td className={`p-1 font-semibold tabular-nums ${h.avgNet < 0 ? 'text-blue-500' : h.avgNet > 0 ? 'text-red-500' : 'text-gray-500'}`}>{h.avgNet > 0 ? `+${h.avgNet.toFixed(2)}` : h.avgNet.toFixed(2)}</td>
                                        <td className="p-1">{h.avgPutts.toFixed(2)}</td>
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    </div>
                </div>

                {/* Score Distribution & Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                         <h3 className="font-bold text-gray-900 dark:text-white mb-3">Distribución de Resultados</h3>
                         <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                            <div className="flex justify-between"><span>Birdie o mejor</span> <span className="font-bold">{analysis.scoreDistribution.birdie}</span></div>
                            <div className="flex justify-between"><span>Par</span> <span className="font-bold">{analysis.scoreDistribution.par}</span></div>
                            <div className="flex justify-between"><span>Bogey</span> <span className="font-bold">{analysis.scoreDistribution.bogey}</span></div>
                            <div className="flex justify-between"><span>Doble Bogey+</span> <span className="font-bold">{analysis.scoreDistribution.doubleBogey}</span></div>
                         </div>
                     </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                         <h3 className="font-bold text-gray-900 dark:text-white mb-3">Tendencias Mentales/Físicas</h3>
                          <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                            {analysis.topAnswers.length > 0 ? analysis.topAnswers.map(({label, count}) => (
                                <li key={label} className="flex justify-between"><span>{label}</span> <span className="font-bold">{count}</span></li>
                            )) : <p className="text-gray-500">No hay suficientes datos.</p>}
                          </ul>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAnalysisView;
