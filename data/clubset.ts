import type { ClubInBag } from '../types';

export const defaultClubSet: ClubInBag[] = [
    {
        id: 'driver',
        name: 'Driver',
        stats: {
            distance: { value: 230, unit: 'm' },
            accuracy: { value: 55, unit: '%' },
            consistency: { value: 65, unit: '%' },
        },
        skills: {
            power: 85,
            control: 40,
            confidence: 60,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'wood-3',
        name: 'Madera 3',
        stats: {
            distance: { value: 205, unit: 'm' },
            accuracy: { value: 65, unit: '%' },
            consistency: { value: 70, unit: '%' },
        },
        skills: {
            power: 75,
            control: 60,
            confidence: 75,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'hybrid-4',
        name: 'Híbrido 4',
        stats: {
            distance: { value: 180, unit: 'm' },
            accuracy: { value: 75, unit: '%' },
            consistency: { value: 80, unit: '%' },
        },
        skills: {
            power: 65,
            control: 80,
            confidence: 85,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'iron-5',
        name: 'Hierro 5',
        stats: {
            distance: { value: 165, unit: 'm' },
            accuracy: { value: 80, unit: '%' },
            consistency: { value: 82, unit: '%' },
        },
        skills: {
            power: 60,
            control: 85,
            confidence: 88,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'iron-6',
        name: 'Hierro 6',
        stats: {
            distance: { value: 155, unit: 'm' },
            accuracy: { value: 82, unit: '%' },
            consistency: { value: 85, unit: '%' },
        },
        skills: {
            power: 58,
            control: 88,
            confidence: 90,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'iron-7',
        name: 'Hierro 7',
        stats: {
            distance: { value: 145, unit: 'm' },
            accuracy: { value: 85, unit: '%' },
            consistency: { value: 90, unit: '%' },
        },
        skills: {
            power: 55,
            control: 92,
            confidence: 95,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'iron-8',
        name: 'Hierro 8',
        stats: {
            distance: { value: 135, unit: 'm' },
            accuracy: { value: 88, unit: '%' },
            consistency: { value: 92, unit: '%' },
        },
        skills: {
            power: 52,
            control: 94,
            confidence: 96,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'iron-9',
        name: 'Hierro 9',
        stats: {
            distance: { value: 125, unit: 'm' },
            accuracy: { value: 90, unit: '%' },
            consistency: { value: 94, unit: '%' },
        },
        skills: {
            power: 50,
            control: 95,
            confidence: 97,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'pitching-wedge',
        name: 'Pitching Wedge',
        stats: {
            distance: { value: 110, unit: 'm' },
            accuracy: { value: 92, unit: '%' },
            consistency: { value: 95, unit: '%' },
        },
        skills: {
            power: 45,
            control: 97,
            confidence: 98,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'gap-wedge',
        name: 'Gap Wedge (52°)',
        stats: {
            distance: { value: 95, unit: 'm' },
            accuracy: { value: 94, unit: '%' },
            consistency: { value: 96, unit: '%' },
        },
        skills: {
            power: 40,
            control: 98,
            confidence: 98,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'sand-wedge',
        name: 'Sand Wedge (56°)',
        stats: {
            distance: { value: 80, unit: 'm' },
            accuracy: { value: 95, unit: '%' },
            consistency: { value: 97, unit: '%' },
        },
        skills: {
            power: 35,
            control: 99,
            confidence: 99,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'lob-wedge',
        name: 'Lob Wedge (60°)',
        stats: {
            distance: { value: 65, unit: 'm' },
            accuracy: { value: 93, unit: '%' },
            consistency: { value: 95, unit: '%' },
        },
        skills: {
            power: 30,
            control: 96,
            confidence: 94,
        },
        userDistance: null,
        specs: {},
    },
    {
        id: 'putter',
        name: 'Putter',
        stats: {
            distance: { value: 1.8, unit: 'putts' },
            accuracy: { value: 85, unit: '%' },
            consistency: { value: 90, unit: '%' },
        },
        skills: {
            power: 0,
            control: 95,
            confidence: 85,
        },
        userDistance: null,
        specs: {},
    },
];
