import React, { useState, useMemo } from 'react';
import type { SavedRound, HcpRecord } from '../types';
import { ListIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface LatestRoundsViewProps {
  savedRounds: SavedRound[];
  onSelectRound: (roundId: string) => void;
}

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
    if (playerHCP <= 0) return 0;
    const baseStrokes = Math.floor(playerHCP / 18);
    const extraStrokes = playerHCP % 18;
    return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const calculateRoundNetScore = (round: SavedRound): number => {
    const roundHcp = getLatestHcp(round.userProfile.hcpHistory);
    return round.scores.reduce((total, hole) => {
        if (hole.strokes === null) return total;
        const hcpStrokes = calculateHandicapStrokes(hole.strokeIndex, roundHcp);
        return total + (hole.strokes - hole.par - hcpStrokes);
    }, 0);
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg text-center">
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);


const ListView: React.FC<{
    rounds: SavedRound[];
    onSelectRound: (id: string) => void;
}> = ({ rounds, onSelectRound }) => (
    <div className="space-y-3">
        {rounds.map(round => (
            <div key={round.id} onClick={() => onSelectRound(round.id)} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{round.setup.course.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(round.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold">{round.scores.reduce((sum, s) => sum + (s.strokes || 0), 0)}</p>
                        <p className="text-xs text-gray-500">Golpes</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const CalendarView: React.FC<{
    savedRounds: SavedRound[];
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    onSelectRound: (id: string) => void;
}> = ({ savedRounds, currentDate, setCurrentDate, onSelectRound }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const { daysInMonth, firstDayOfMonth, roundsByDay } = useMemo(() => {
        const d = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday as 0

        const roundsByDay = new Map<number, { rounds: SavedRound[], avgNet: number }>();
        savedRounds.forEach(round => {
            const roundDate = new Date(round.date);
            if (roundDate.getFullYear() === year && roundDate.getMonth() === month) {
                const day = roundDate.getDate();
                if (!roundsByDay.has(day)) {
                    roundsByDay.set(day, { rounds: [], avgNet: 0 });
                }
                roundsByDay.get(day)!.rounds.push(round);
            }
        });

        roundsByDay.forEach((value) => {
            const totalNet = value.rounds.reduce((sum, round) => sum + calculateRoundNetScore(round), 0);
            value.avgNet = totalNet / value.rounds.length;
        });

        return { daysInMonth, firstDayOfMonth, roundsByDay };
    }, [year, month, savedRounds]);

    const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-5 h-5" /></button>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
                {weekdays.map(day => <div key={day} className="font-semibold">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const dayData = roundsByDay.get(day);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                    return (
                        <div key={day} className={`aspect-square flex items-center justify-center rounded-lg ${dayData ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : ''} ${isToday ? 'bg-green-100 dark:bg-green-900/50' : ''}`}
                            onClick={() => dayData && dayData.rounds.length === 1 && onSelectRound(dayData.rounds[0].id)}
                        >
                            <div className="flex flex-col items-center">
                                <span className={`text-sm ${dayData ? 'font-bold' : 'text-gray-400 dark:text-gray-600'}`}>{day}</span>
                                {dayData && (
                                    <span className={`text-xs font-bold ${dayData.avgNet > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                        {dayData.avgNet > 0 ? `+${dayData.avgNet.toFixed(0)}` : dayData.avgNet.toFixed(0)}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const YearView: React.FC<{
    savedRounds: SavedRound[];
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}> = ({ savedRounds, currentDate, setCurrentDate }) => {
    const year = currentDate.getFullYear();

    const changeYear = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear() + offset, 0, 1));
    };

    const roundsByMonth = useMemo(() => {
        const monthlyData = Array(12).fill(null).map(() => ({ rounds: 0, totalNet: 0 }));
        savedRounds.forEach(round => {
            const roundDate = new Date(round.date);
            if (roundDate.getFullYear() === year) {
                const month = roundDate.getMonth();
                monthlyData[month].rounds++;
                monthlyData[month].totalNet += calculateRoundNetScore(round);
            }
        });
        return monthlyData.map(data => ({
            rounds: data.rounds,
            avgNet: data.rounds > 0 ? data.totalNet / data.rounds : 0
        }));
    }, [year, savedRounds]);

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeYear(-1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-5 h-5" /></button>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{year}</h3>
                <button onClick={() => changeYear(1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {monthNames.map((name, index) => {
                    const data = roundsByMonth[index];
                    return (
                        <div key={name} className={`p-3 rounded-lg text-center ${data.rounds > 0 ? 'bg-gray-100 dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{name}</p>
                            {data.rounds > 0 ? (
                                <>
                                    <p className={`text-xl font-bold ${data.avgNet > 0 ? 'text-red-500' : 'text-blue-500'}`}>{data.avgNet > 0 ? `+${data.avgNet.toFixed(1)}` : data.avgNet.toFixed(1)}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.rounds} rondas</p>
                                </>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-600">-</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LatestRoundsView: React.FC<LatestRoundsViewProps> = ({ savedRounds, onSelectRound }) => {
    const [viewMode, setViewMode] = useState<'list' | 'month' | 'year'>('list');
    const [listCount, setListCount] = useState<number>(10);
    const [currentDate, setCurrentDate] = useState(new Date());

    const filteredRounds = useMemo(() => {
        const allRounds = [...savedRounds].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        switch (viewMode) {
            case 'list':
                return allRounds.slice(0, listCount);
            case 'month':
                return allRounds.filter(r => {
                    const d = new Date(r.date);
                    return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
                });
            case 'year':
                 return allRounds.filter(r => new Date(r.date).getFullYear() === currentDate.getFullYear());
            default:
                return [];
        }
    }, [savedRounds, viewMode, listCount, currentDate]);

    const summaryStats = useMemo(() => {
        if (filteredRounds.length === 0) return { strokes: '0.00', putts: '0.00', net: '0.00', fairways: '0.0%' };
        
        let totalStrokes = 0, totalPutts = 0, totalNet = 0, fairwaysHit = 0, fairwayOpportunities = 0, holesPlayed = 0;
        
        filteredRounds.forEach(round => {
            totalNet += calculateRoundNetScore(round);
            round.scores.forEach(hole => {
                if (hole.strokes !== null) {
                    holesPlayed++;
                    totalStrokes += hole.strokes;
                    totalPutts += hole.putts || 0;
                    if (hole.par > 3) {
                        fairwayOpportunities++;
                        if (hole.fairwayHit) fairwaysHit++;
                    }
                }
            });
        });
        
        const avgStrokes = holesPlayed > 0 ? (totalStrokes / holesPlayed) * 18 : 0;
        const avgPutts = holesPlayed > 0 ? (totalPutts / holesPlayed) * 18 : 0;
        const avgNet = totalNet / filteredRounds.length;
        const avgFairways = fairwayOpportunities > 0 ? (fairwaysHit / fairwayOpportunities) * 100 : 0;
        
        return { 
            strokes: avgStrokes.toFixed(2),
            putts: avgPutts.toFixed(2),
            net: avgNet > 0 ? `+${avgNet.toFixed(2)}` : avgNet.toFixed(2),
            fairways: `${avgFairways.toFixed(1)}%`
        };
    }, [filteredRounds]);

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-200 dark:bg-gray-700/50 rounded-full p-1 gap-1">
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}><ListIcon className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('month')} className={`p-2 rounded-full transition-colors ${viewMode === 'month' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}><CalendarIcon className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('year')} className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${viewMode === 'year' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Año</button>
                </div>
                {viewMode === 'list' && (
                     <select value={listCount} onChange={e => setListCount(Number(e.target.value))} className="bg-gray-200 dark:bg-gray-700/50 p-2 rounded-full text-sm font-semibold border-none focus:ring-0">
                        <option value="5">5 Rondas</option>
                        <option value="10">10 Rondas</option>
                        <option value="20">20 Rondas</option>
                        <option value="40">40 Rondas</option>
                    </select>
                )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Media Golpes" value={summaryStats.strokes} />
                <StatCard label="Media Putts" value={summaryStats.putts} />
                <StatCard label="Media Neto" value={summaryStats.net} />
                <StatCard label="Media Fairways %" value={summaryStats.fairways} />
            </div>

            {viewMode === 'list' && <ListView rounds={filteredRounds} onSelectRound={onSelectRound} />}
            {viewMode === 'month' && <CalendarView savedRounds={savedRounds} currentDate={currentDate} setCurrentDate={setCurrentDate} onSelectRound={onSelectRound} />}
            {viewMode === 'year' && <YearView savedRounds={savedRounds} currentDate={currentDate} setCurrentDate={setCurrentDate} />}
        </div>
    );
};

export default LatestRoundsView;