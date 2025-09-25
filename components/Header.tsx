import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, GolfBallIcon, MetronomeIcon, ScorecardIcon, ProfileIcon, AnalysisIcon, LogoutIcon, SettingsIcon, GolfBagIcon } from './icons';

interface HeaderProps {
  onLogout: () => void;
}

const NavLink: React.FC<{
    to: string;
    onNavigate: () => void;
    children: React.ReactNode;
    isActive: boolean;
}> = ({ to, onNavigate, children, isActive }) => (
    <Link
        to={to}
        onClick={onNavigate}
        className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
            isActive ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-800 dark:text-white'
        }`}
    >
        {children}
    </Link>
);


const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  const handleLogout = () => {
      onLogout();
      setIsMenuOpen(false);
  }

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
              <NavLink to="/" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname === '/'}>
                <ScorecardIcon className="w-5 h-5" /> Nueva Ronda
              </NavLink>
              <NavLink to="/analysis" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/analysis')}>
                <AnalysisIcon className="w-5 h-5" /> Análisis
              </NavLink>
              <NavLink to="/clubhouse" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/clubhouse')}>
                <GolfBagIcon className="w-5 h-5" /> Mi juego de palos
              </NavLink>
              <NavLink to="/metronome" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/metronome')}>
                <MetronomeIcon className="w-5 h-5" /> Metrónomo
              </NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <NavLink to="/profile" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/profile')}>
                <ProfileIcon className="w-5 h-5" /> Perfil
              </NavLink>
              <NavLink to="/settings" onNavigate={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/settings')}>
                <SettingsIcon className="w-5 h-5" /> Ajustes
              </NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/40"
                >
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
      
      {/* Placeholder for right side content if needed */}
      <div className="w-10"></div>
    </header>
  );
};

export default Header;