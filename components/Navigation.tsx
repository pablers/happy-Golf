import React from 'react';
import { MetronomeIcon, ScorecardIcon, ProfileIcon } from './icons';

type View = 'metronome' | 'scorecard' | 'profile';

interface NavigationProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}> = ({ isActive, onClick, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`w-full flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-400
      ${isActive ? 'text-green-400' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}
    `}
  >
    {children}
  </button>
);


const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="w-full flex items-center justify-around bg-gray-800 border-t border-gray-700/50 p-1">
      <NavButton
        isActive={activeView === 'metronome'}
        onClick={() => onViewChange('metronome')}
        ariaLabel="Go to Metronome"
      >
        <MetronomeIcon className="w-6 h-6" />
        <span className="text-xs font-semibold">Metrónomo</span>
      </NavButton>
      <NavButton
        isActive={activeView === 'scorecard'}
        onClick={() => onViewChange('scorecard')}
        ariaLabel="Go to Scorecard"
      >
        <ScorecardIcon className="w-6 h-6" />
        <span className="text-xs font-semibold">Tarjeta</span>
      </NavButton>
      <NavButton
        isActive={activeView === 'profile'}
        onClick={() => onViewChange('profile')}
        ariaLabel="Go to Profile"
      >
        <ProfileIcon className="w-6 h-6" />
        <span className="text-xs font-semibold">Perfil</span>
      </NavButton>
    </nav>
  );
};

export default Navigation;