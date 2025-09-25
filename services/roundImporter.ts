

import type { SavedRound, HoleScore, PostRoundAnswers, RoundType, PracticeTime, WeatherCondition, WindCondition } from '../types';
import { GOLF_COURSES, INITIAL_HOLE_SCORES } from '../constants';

export const parseRoundsCSV = (csvText: string): SavedRound[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const header = lines[0].split(';').map(h => h.trim());
    const rounds: SavedRound[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        if (values.length < header.length) continue;

        const rowData: { [key: string]: string } = {};
        header.forEach((key, index) => {
            rowData[key] = values[index]?.trim() || '';
        });

        const course = GOLF_COURSES.find(c => c.id === rowData.courseId);
        if (!course) continue;

        const scores: HoleScore[] = INITIAL_HOLE_SCORES.map(initialHole => {
            const holeNum = initialHole.hole;
            const strokesStr = rowData[`h${holeNum}_strokes`];
            const puttsStr = rowData[`h${holeNum}_putts`];
            const strokes = strokesStr ? parseInt(strokesStr, 10) : null;
            const putts = puttsStr ? parseInt(puttsStr, 10) : null;
            const comment = rowData[`h${holeNum}_comment`] || null;
            const fairwayHitStr = rowData[`h${holeNum}_fairwayHit`];
            const fairwayHit = fairwayHitStr === 'true' ? true : fairwayHitStr === 'false' ? false : null;
            return { ...initialHole, strokes, putts, comment, fairwayHit };
        });

        const answers: Partial<PostRoundAnswers> = {};
        const answerKeys: (keyof PostRoundAnswers)[] = [
            'practice_time', 'initial_weather', 'initial_wind', 
            'weather_h7_confirm', 'weather_h7_new', 'wind_h7_change',
            'weather_h15_confirm', 'weather_h15_new', 'wind_h15_change',
            'turf_condition', 'green_speed', 'physical_state', 'mental_state'
        ];
        answerKeys.forEach(key => {
            if (rowData[key]) {
                answers[key] = rowData[key] as any;
            }
        });

        const round: SavedRound = {
            id: rowData.id,
            date: rowData.date,
            userProfile: {
                name: rowData.userName,
                hcpHistory: [{ date: rowData.date, hcp: parseInt(rowData.userHcp, 10) }],
                favoriteCourseIds: [],
                trainingObjective: '',
            },
            setup: {
                course,
                roundType: rowData.roundType as RoundType,
                practiceTime: (answers.practice_time || 'none') as PracticeTime,
                weather: (answers.initial_weather || 'sunny') as WeatherCondition,
                wind: (answers.initial_wind || 'none') as WindCondition,
            },
            scores,
            answers,
        };
        rounds.push(round);
    }
    return rounds;
};

export const fetchAndParseRounds = async (): Promise<SavedRound[]> => {
    try {
        const response = await fetch('/data/registro-partidas.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        return parseRoundsCSV(csvText);
    } catch (error) {
        console.error("Error loading round data:", error);
        return [];
    }
};