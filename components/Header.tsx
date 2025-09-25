import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MenuIcon,
  GolfBallIcon,
  MetronomeIcon,
  ScorecardIcon,
  ProfileIcon,
  AnalysisIcon,
  LogoutIcon,
  SettingsIcon,
  GolfBagIcon,
} from './icons';

// Botón reutilizable que renderiza cada opción del menú lateral.
const NavLink: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({
  isActive,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold'
        : 'text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const Header: React.FC = () => {
  // Controla la apertura del menú desplegable en pantallas pequeñas.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Cierra el menú al hacer clic fuera para evitar que quede abierto accidentalmente.
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
              <NavLink isActive={location.pathname === '/'} onClick={() => handleNavigation('/')}>
                <ScorecardIcon className="w-5 h-5" /> Nueva Ronda
              </NavLink>
              <NavLink isActive={location.pathname.startsWith('/analysis')} onClick={() => handleNavigation('/analysis')}>
                <AnalysisIcon className="w-5 h-5" /> Análisis
              </NavLink>
              <NavLink isActive={location.pathname === '/clubhouse'} onClick={() => handleNavigation('/clubhouse')}>
                <GolfBagIcon className="w-5 h-5" /> Mi juego de palos
              </NavLink>
              <NavLink isActive={location.pathname === '/metronome'} onClick={() => handleNavigation('/metronome')}>
                <MetronomeIcon className="w-5 h-5" /> Metrónomo
              </NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <NavLink isActive={location.pathname === '/profile'} onClick={() => handleNavigation('/profile')}>
                <ProfileIcon className="w-5 h-5" /> Perfil
              </NavLink>
              <NavLink isActive={location.pathname === '/settings'} onClick={() => handleNavigation('/settings')}>
                <SettingsIcon className="w-5 h-5" /> Ajustes
              </NavLink>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <NavLink isActive={false} onClick={handleLogout}>
                <LogoutIcon className="w-5 h-5" /> Salir
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Golf Master</h1>
        <GolfBallIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
      </div>

      {/* Espacio reservado para acciones adicionales (p. ej. buscador o avatar). */}
      <div className="w-10" />
    </header>
  );
};

export default Header;
