import type { Question, QuestionGroup, QuestionCategory } from '../types';

export const ALL_QUESTIONS: Question[] = [
    // --- Initial Questions ---
    {
        key: 'practice_time',
        text: '¿Has practicado antes?',
        category: 'climate', // Using climate category for grouping initial questions
        options: [
            { value: 'none', label: 'No' },
            { value: '5min', label: '< 5 min' },
            { value: '5-15min', label: '5-15 min' },
            { value: '15+min', label: '+15 min' },
        ],
    },
    {
        key: 'initial_weather',
        text: '¿Cómo está el día?',
        category: 'climate',
        options: [
            { value: 'sunny', label: 'Soleado' },
            { value: 'cloudy', label: 'Nublado' },
            { value: 'rainy', label: 'Lluvioso' },
            { value: 'variable', label: 'Variable' },
        ],
    },
    {
        key: 'initial_wind',
        text: '¿Y el viento?',
        category: 'climate',
        options: [
            { value: 'none', label: 'Sin' },
            { value: 'light', label: 'Suave' },
            { value: 'moderate', label: 'Moderado' },
            { value: 'strong', label: 'Fuerte' },
        ],
    },
    // --- H7 Questions ---
    { key: 'weather_h7_confirm', text: 'En el hoyo 7, ¿sigue igual el clima y viento?', category: 'climate', options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }] },
    { key: 'weather_h7_new', text: '¿Cómo ha cambiado el clima?', category: 'climate', options: [{ value: 'sunny', label: 'Soleado' }, { value: 'cloudy', label: 'Nublado' }, { value: 'rainy', label: 'Lluvioso' }] },
    { key: 'wind_h7_change', text: '¿Y el viento?', category: 'climate', options: [{ value: 'same', label: 'Igual' }, { value: 'higher', label: 'Ha subido' }, { value: 'lower', label: 'Ha bajado' }] },
    
    // --- H15 Questions ---
    { key: 'weather_h15_confirm', text: 'En el hoyo 15, ¿sigue igual el clima y viento?', category: 'climate', options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }] },
    { key: 'weather_h15_new', text: '¿Cómo ha cambiado el clima?', category: 'climate', options: [{ value: 'sunny', label: 'Soleado' }, { value: 'cloudy', label: 'Nublado' }, { value: 'rainy', label: 'Lluvioso' }] },
    { key: 'wind_h15_change', text: '¿Y el viento?', category: 'climate', options: [{ value: 'same', label: 'Igual' }, { value: 'higher', label: 'Ha subido' }, { value: 'lower', label: 'Ha bajado' }] },

    // --- Dynamic Questions ---
    { key: 'turf_condition', category: 'turf', text: 'Césped general (greens/fairways/rough):', options: [{ value: 'very_short', label: 'Muy corto' }, { value: 'correct', label: 'Correcto' }, { value: 'longish', label: 'Algo largo' }, { value: 'long', label: 'Largo' }, { value: 'irregular', label: 'Irregular' }] },
    { key: 'green_speed', category: 'greens', text: 'Velocidad de los greens:', options: [{ value: 'fast', label: 'Rápido' }, { value: 'medium', label: 'Medio' }, { value: 'slow', label: 'Lento' }, { value: 'irregular', label: 'Irregular' }] },
    { key: 'physical_state', category: 'physical', text: '¿Cómo te encuentras físicamente?', options: [{ value: 'good', label: 'Bien' }, { value: 'bit_tired', label: 'Algo cansado' }, { value: 'tired', label: 'Cansado' }, { value: 'discomfort', label: 'Molestia' }] },
    { key: 'mental_state', category: 'mental', text: '¿Y mentalmente?', options: [{ value: 'focused', label: 'Concentrado' }, { value: 'neutral', label: 'Neutral' }, { value: 'distracted', label: 'Distraído' }, { value: 'frustrated', label: 'Frustrado' }] },
];

export const QUESTION_GROUPS: QuestionGroup[] = [
    {
        title: "Inicio de Ronda",
        questions: ALL_QUESTIONS.filter(q => ['practice_time', 'initial_weather', 'initial_wind'].includes(String(q.key)))
    },
    {
        title: "Condiciones (Hoyo 7)",
        questions: ALL_QUESTIONS.filter(q => String(q.key).includes('_h7_'))
    },
    {
        title: "Condiciones (Hoyo 15)",
        questions: ALL_QUESTIONS.filter(q => String(q.key).includes('_h15_'))
    },
    {
        title: "Análisis Final",
        questions: ALL_QUESTIONS.filter(q => ['turf_condition', 'green_speed', 'physical_state', 'mental_state'].includes(String(q.key)))
    }
];

export const QUESTION_PRIORITY: QuestionCategory[] = ['physical', 'mental', 'turf', 'greens'];
export const FINAL_MANDATORY_QUESTIONS: QuestionCategory[] = ['physical', 'mental'];