import React from 'react';
import type { ClubTempoConfig } from '../types';

interface ClubSelectorProps {
  clubs: ClubTempoConfig[];
  selectedClubId: string;
  onSelectClub: (clubId: string) => void;
}

const ClubSelector: React.FC<ClubSelectorProps> = ({ clubs, selectedClubId, onSelectClub }) => {
  return (
    <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-700/50 rounded-full p-1 gap-1">
      {clubs.map((club) => {
        const isActive = club.id === selectedClubId;
        return (
          <button
            key={club.id}
            onClick={() => onSelectClub(club.id)}
            className={`w-full px-3 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
              ${isActive
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600/70'
              }`}
          >
            {club.name}
          </button>
        );
      })}
    </div>
  );
};

export default ClubSelector;