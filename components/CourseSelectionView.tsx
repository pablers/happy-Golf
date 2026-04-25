import React, { useState, useMemo } from 'react';
import { GOLF_COURSES } from '../constants';
import type { GolfCourse, UserProfile } from '../types';
import { SearchIcon, PlayIcon, GolfBallIcon } from './icons';

interface CourseSelectionViewProps {
  userProfile: UserProfile;
  onCourseSelected: (course: GolfCourse) => void;
}

const CourseSelectionView: React.FC<CourseSelectionViewProps> = ({ userProfile, onCourseSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);

  const favoriteCourses = useMemo(() => {
    return GOLF_COURSES.filter(c => userProfile.favoriteCourseIds?.includes(c.id));
  }, [userProfile.favoriteCourseIds]);

  const searchResults = useMemo(() => {
    if (!searchTerm) {
      // Show favorites by default if no search term
      return favoriteCourses;
    }
    return GOLF_COURSES.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, favoriteCourses]);

  const handleSelectCourse = (course: GolfCourse) => {
    setSelectedCourse(course);
    setSearchTerm(course.name);
  };
  
  const handleStart = () => {
    if (selectedCourse) {
      onCourseSelected(selectedCourse);
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col justify-between p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-2">
           <GolfBallIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
           <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Nueva Ronda</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Busca tu campo o elige un favorito para empezar.</p>
      </header>
      
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if(selectedCourse && e.target.value !== selectedCourse.name) {
                    setSelectedCourse(null);
                }
              }}
              placeholder="Busca un campo de golf..."
              className="w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full focus:ring-green-500 focus:border-green-500 transition"
            />
            <SearchIcon className="absolute left-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <button
              onClick={handleStart}
              disabled={!selectedCourse}
              className="absolute right-1.5 p-2 bg-green-500 rounded-full text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              aria-label="Iniciar ronda"
            >
              <PlayIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 max-h-64 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map(course => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`p-3 my-1 rounded-lg cursor-pointer transition-colors ${selectedCourse?.id === course.id ? 'bg-green-500/20' : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                  <p className="font-semibold text-gray-800 dark:text-white">{course.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.municipality}, {course.province}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">No se encontraron campos.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseSelectionView;
