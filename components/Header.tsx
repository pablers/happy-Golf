import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, GolfBallIcon, MetronomeIcon, ScorecardIcon, ProfileIcon, AnalysisIcon, LogoutIcon, SettingsIcon, GolfBagIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
      navigate('/login');
  };

  return (
    <header className="relative w-full p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between z-40 flex-shrink-0">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        {isMenuOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-fade-in-down">
            <nav className="p-2">
              <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <ScorecardIcon className="w-5 h-5" /> Nueva Ronda
              </button>
              <button onClick={() => handleNavigation('/analysis')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <AnalysisIcon className="w-5 h-5" /> Análisis
              </button>
              <button onClick={() => handleNavigation('/clubhouse')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <GolfBagIcon className="w-5 h-5" /> Mi juego de palos
              </button>
              <button onClick={() => handleNavigation('/metronome')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <MetronomeIcon className="w-5 h-5" /> Metrónomo
              </button>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <button onClick={() => handleNavigation('/profile')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <ProfileIcon className="w-5 h-5" /> Perfil
              </button>
              <button onClick={() => handleNavigation('/settings')} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <SettingsIcon className="w-5 h-5" /> Ajustes
              </button>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <LogoutIcon className="w-5 h-5" /> Salir
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Golf Master</h1>
        <GolfBallIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
      </div>
      
      <div className="w-10"></div>
    </header>
  );
};

export default Header;