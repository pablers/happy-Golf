
import React from 'react';
import type { TempoOption } from '../types';

interface TempoSelectorProps {
  tempos: TempoOption[];
  selectedBpm: number;
  onSelectTempo: (tempo: TempoOption) => void;
}

const TempoSelector: React.FC<TempoSelectorProps> = ({ tempos, selectedBpm, onSelectTempo }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center text-gray-300 mb-4">Seleccionar Tempo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tempos.map((tempo) => {
          const isActive = tempo.bpm === selectedBpm;
          return (
            <button
              key={tempo.bpm}
              onClick={() => onSelectTempo(tempo)}
              className={`p-4 rounded-lg text-center transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-400
                ${isActive
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-700/80 text-gray-200 hover:bg-gray-600/80 hover:-translate-y-1'
                }`}
            >
              <span className="text-3xl font-bold">{tempo.bpm}</span>
              <span className="text-sm opacity-80"> BPM</span>
              <p className={`mt-1 text-xs font-semibold ${isActive ? 'text-green-100' : 'text-gray-400'}`}>{tempo.label}</p>
              <p className={`mt-1 text-xs ${isActive ? 'text-green-200' : 'text-gray-400'}`}>{tempo.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TempoSelector;
