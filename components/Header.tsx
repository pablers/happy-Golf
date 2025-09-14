import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, GolfBallIcon, MetronomeIcon, ScorecardIcon, ProfileIcon, AnalysisIcon, LogoutIcon, SettingsIcon, GolfBagIcon } from './icons';

type View = 'metronome' | 'newRound' | 'profile' | 'analysis' | 'settings' | 'clubhouse';

interface HeaderProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
}> = ({ onClick, children }) => (
    <a onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
        {children}
    </a>
);


const Header: React.FC<HeaderProps> = ({ onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleNavigation = (view: View) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };
  
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
              <NavLink onClick={() => handleNavigation('newRound')}><ScorecardIcon className="w-5 h-5" /> Nueva Ronda</NavLink>
              <NavLink onClick={() => handleNavigation('analysis')}><AnalysisIcon className="w-5 h-5" /> Análisis</NavLink>
              <NavLink onClick={() => handleNavigation('clubhouse')}><GolfBagIcon className="w-5 h-5" /> Mi juego de palos</NavLink>
              <NavLink onClick={() => handleNavigation('metronome')}><MetronomeIcon className="w-5 h-5" /> Metrónomo</NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <NavLink onClick={() => handleNavigation('profile')}><ProfileIcon className="w-5 h-5" /> Perfil</NavLink>
              <NavLink onClick={() => handleNavigation('settings')}><SettingsIcon className="w-5 h-5" /> Ajustes</NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <NavLink onClick={handleLogout}><LogoutIcon className="w-5 h-5" /> Salir</NavLink>
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