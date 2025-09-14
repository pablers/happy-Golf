

import React, { useState, useMemo } from 'react';
import { GOLF_COURSES } from '../constants';
import { TRAINING_OBJECTIVES } from '../data/trainingData';
import type { UserProfile, HcpRecord } from '../types';
import { ProfileIcon, CloseIcon, InformationCircleIcon, EditIcon } from './icons';
import LineChart from './LineChart';

interface ProfileViewProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onShowTrainingGuide: () => void;
}

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onSave, onShowTrainingGuide }) => {
  const [name, setName] = useState(userProfile.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [hcpHistory, setHcpHistory] = useState(userProfile.hcpHistory || []);
  const [newHcp, setNewHcp] = useState<number>(getLatestHcp(userProfile.hcpHistory));
  const [trainingObjective, setTrainingObjective] = useState(userProfile.trainingObjective || TRAINING_OBJECTIVES[0].title);
  const [favoriteCourseIds, setFavoriteCourseIds] = useState(userProfile.favoriteCourseIds || []);
  const [searchTerm, setSearchTerm] = useState('');

  const currentHcp = useMemo(() => getLatestHcp(hcpHistory), [hcpHistory]);

  const favoriteCourses = useMemo(() => {
    return GOLF_COURSES.filter(course => favoriteCourseIds.includes(course.id));
  }, [favoriteCourseIds]);
  
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return GOLF_COURSES.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) && !favoriteCourseIds.includes(course.id)
    ).slice(0, 5);
  }, [searchTerm, favoriteCourseIds]);

  const handleAddFavorite = (courseId: string) => {
    if (!favoriteCourseIds.includes(courseId)) {
      setFavoriteCourseIds([...favoriteCourseIds, courseId]);
    }
    setSearchTerm('');
  };
  
  const handleRemoveFavorite = (courseId: string) => {
    setFavoriteCourseIds(favoriteCourseIds.filter(id => id !== courseId));
  };
  
  const handleUpdateHcp = () => {
    const newRecord: HcpRecord = {
      date: new Date().toISOString(),
      hcp: newHcp,
    };
    const updatedHistory = [newRecord, ...hcpHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHcpHistory(updatedHistory);
  };

  const handleSave = () => {
    onSave({ name, hcpHistory, favoriteCourseIds, trainingObjective });
  };
  
  const chartData = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filteredHistory = hcpHistory
      .filter(record => new Date(record.date) >= oneYearAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        labels: filteredHistory.map(r => new Date(r.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
        data: filteredHistory.map(r => r.hcp)
    };
  }, [hcpHistory]);


  return (
    <div className="w-full flex-grow flex flex-col p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-2">
          <ProfileIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
           {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white bg-transparent border-b-2 border-green-500 focus:outline-none text-center"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-full"
                aria-label="Editar nombre"
              >
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="space-y-6">
        {/* Basic Info */}
        <section>
          <div className="space-y-4">
            <div>
              <label htmlFor="hcp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hándicap Actual ({currentHcp.toFixed(1)})</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" id="hcp" value={newHcp} onChange={(e) => setNewHcp(parseFloat(e.target.value))} className="w-full p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition" />
                <button onClick={handleUpdateHcp} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Actualizar</button>
              </div>
            </div>
          </div>
        </section>

        {/* HCP Evolution Chart Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Evolución del Hándicap en el último año</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            {chartData.data.length >= 2 ? (
                <LineChart data={chartData.data} labels={chartData.labels} />
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Necesitas al menos dos registros en el último año para ver la evolución.
                </p>
            )}
          </div>
        </section>

        {/* Training Objective */}
        <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Objetivo de Entrenamiento</h2>
            <div className="flex items-center gap-2">
                 <select value={trainingObjective} onChange={(e) => setTrainingObjective(e.target.value)} className="flex-grow w-full p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition">
                  {TRAINING_OBJECTIVES.map(obj => <option key={obj.id} value={obj.title}>{obj.title}</option>)}
                </select>
                <button onClick={onShowTrainingGuide} className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <InformationCircleIcon className="w-6 h-6"/>
                </button>
            </div>
        </section>

        {/* Favorite Courses */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Campos Favoritos</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Buscar campo para añadir..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition" />
            {searchTerm && searchResults.length > 0 && (
              <ul className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 overflow-hidden">
                {searchResults.map(course => (
                  <li key={course.id} onClick={() => handleAddFavorite(course.id)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">{course.name}</li>
                ))}
              </ul>
            )}
            <div className="space-y-2">
              {favoriteCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{course.name}</p>
                  <button onClick={() => handleRemoveFavorite(course.id)} className="p-1 text-red-500 hover:text-red-700">
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8">
        <button onClick={handleSave} className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
          Guardar Perfil
        </button>
      </footer>
    </div>
  );
};

export default ProfileView;