import React, { useState, useMemo, useEffect } from 'react';
import { GOLF_COURSES } from '../constants';
import type { GolfCourse, RoundType, UserProfile } from '../types';
import { GolfBallIcon } from './icons';

interface ScorecardSetupProps {
  userProfile: UserProfile;
  onContinue: (course: GolfCourse, roundType: RoundType) => void;
}

const RoundButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-lg text-left font-semibold transition-all duration-200 border-2 ${
      isActive
        ? 'bg-green-500/20 border-green-400 text-white'
        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500'
    }`}
  >
    {children}
  </button>
);

const SelectInput: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}> = ({ label, value, onChange, children }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-2.5 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition"
        >
            {children}
        </select>
    </div>
);

const ScorecardSetup: React.FC<ScorecardSetupProps> = ({ userProfile, onContinue }) => {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedRoundType, setSelectedRoundType] = useState<RoundType | null>(null);

    useEffect(() => {
        if (userProfile.favoriteCourseIds && userProfile.favoriteCourseIds.length > 0) {
            const preferredCourseId = userProfile.favoriteCourseIds[0];
            const preferredCourse = GOLF_COURSES.find(c => c.id === preferredCourseId);
            if (preferredCourse) {
                setSelectedProvince(preferredCourse.province || '');
                setSelectedMunicipality(preferredCourse.municipality || '');
                setSelectedCourseId(preferredCourse.id);
            }
        }
    }, [userProfile.favoriteCourseIds]);

    const provinces = useMemo(() => {
        const provinceSet = new Set(GOLF_COURSES.map(c => c.province).filter(Boolean));
        return Array.from(provinceSet).sort();
    }, []);

    const municipalities = useMemo(() => {
        const municipalitySet = new Set(
            GOLF_COURSES
                .filter(c => !selectedProvince || c.province === selectedProvince)
                .map(c => c.municipality)
                .filter(Boolean)
        );
        return Array.from(municipalitySet).sort();
    }, [selectedProvince]);

    const filteredCourses = useMemo(() => {
        return GOLF_COURSES.filter(course => {
            const provinceMatch = !selectedProvince || course.province === selectedProvince;
            const municipalityMatch = !selectedMunicipality || course.municipality === selectedMunicipality;
            return provinceMatch && municipalityMatch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedProvince, selectedMunicipality]);

    const selectedCourse = useMemo(() => GOLF_COURSES.find(c => c.id === selectedCourseId) || null, [selectedCourseId]);
    
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(e.target.value);
        setSelectedMunicipality('');
        setSelectedCourseId('');
    };

    const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMunicipality(e.target.value);
        setSelectedCourseId('');
    };

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourseId(e.target.value);
    };

    const handleContinue = () => {
        if (selectedCourse && selectedRoundType) {
            onContinue(selectedCourse, selectedRoundType);
        }
    };

    const isContinueDisabled = !selectedCourseId || !selectedRoundType;

    return (
        <div className="w-full flex-grow flex flex-col justify-between p-6 bg-gray-900/50 overflow-y-auto">
            <header className="text-center mb-6">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <GolfBallIcon className="w-7 h-7 text-green-400" />
                    <h1 className="text-2xl font-bold tracking-tight text-white">Preparar Ronda</h1>
                </div>
                <p className="text-gray-400">Selecciona el campo y los hoyos que vas a jugar.</p>
            </header>

            <main className="space-y-6 flex-grow">
                {/* Filters */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-200">1. Elige el Campo</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput label="Provincia" value={selectedProvince} onChange={handleProvinceChange}>
                            <option value="">Todas</option>
                            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </SelectInput>
                        <SelectInput label="Municipio" value={selectedMunicipality} onChange={handleMunicipalityChange}>
                            <option value="">Todos</option>
                            {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                        </SelectInput>
                    </div>
                    <SelectInput label="Campo de Golf" value={selectedCourseId} onChange={handleCourseChange}>
                        <option value="">Selecciona un campo...</option>
                        {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </SelectInput>
                </div>

                {/* Course Details */}
                {selectedCourse && (
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-sm animate-fade-in">
                        <h3 className="font-bold text-white mb-2">{selectedCourse.name}</h3>
                        <div className="space-y-1 text-gray-300">
                           {selectedCourse.phone && <p><strong>Teléfono:</strong> {selectedCourse.phone}</p>}
                           {selectedCourse.email && <p><strong>Email:</strong> {selectedCourse.email}</p>}
                           {selectedCourse.url && <p><strong>Web:</strong> <a href={selectedCourse.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{selectedCourse.url}</a></p>}
                        </div>
                    </div>
                )}

                {/* Round Type */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-200 mt-6">2. Elige los Hoyos</h2>
                    <RoundButton onClick={() => setSelectedRoundType('front')} isActive={selectedRoundType === 'front'}>
                        Primeros 9 (1-9)
                    </RoundButton>
                    <RoundButton onClick={() => setSelectedRoundType('back')} isActive={selectedRoundType === 'back'}>
                        Segundos 9 (10-18)
                    </RoundButton>
                    <RoundButton onClick={() => setSelectedRoundType('full')} isActive={selectedRoundType === 'full'}>
                        18 Hoyos
                    </RoundButton>
                </div>
            </main>

            <footer className="mt-6">
                <button
                    onClick={handleContinue}
                    disabled={isContinueDisabled}
                    className="w-full p-4 bg-green-500 text-white font-bold rounded-lg transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
                >
                    Continuar
                </button>
            </footer>
        </div>
    );
};

export default ScorecardSetup;