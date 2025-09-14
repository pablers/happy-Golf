import React from 'react';
import type { Theme } from '../types';
import { SettingsIcon, SunIcon, MoonIcon, TrashIcon } from './icons';

interface SettingsViewProps {
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
  onClearRounds: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentTheme, onSetTheme, onClearRounds }) => {
  return (
    <div className="w-full flex-grow flex flex-col p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ajustes</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Personaliza tu experiencia.</p>
      </header>

      <main className="space-y-8">
        {/* Theme Settings */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Apariencia</h2>
          <div className="flex items-center justify-center p-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <button
              onClick={() => onSetTheme('light')}
              className={`w-full flex items-center justify-center gap-2 p-2 rounded-full text-sm font-semibold transition-colors ${
                currentTheme === 'light'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <SunIcon className="w-5 h-5" />
              Claro
            </button>
            <button
              onClick={() => onSetTheme('dark')}
              className={`w-full flex items-center justify-center gap-2 p-2 rounded-full text-sm font-semibold transition-colors ${
                currentTheme === 'dark'
                  ? 'bg-gray-800 text-green-400 shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <MoonIcon className="w-5 h-5" />
              Oscuro
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section>
           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Gestión de Datos</h2>
           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Limpiar Historial</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Borra permanentemente todas las rondas guardadas.</p>
                    </div>
                    <button
                        onClick={onClearRounds}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                        <TrashIcon className="w-5 h-5" />
                        Borrar
                    </button>
                </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsView;