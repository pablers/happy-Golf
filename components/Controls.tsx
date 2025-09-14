import React from 'react';
import { PlayIcon, PauseIcon, DownloadIcon, SpinnerIcon } from './icons';

interface ControlsProps {
  isPlaying: boolean;
  isDownloading: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, isDownloading, onPlayPause, onDownload }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pausar metrónomo" : "Reproducir metrónomo"}
        className="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 active:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-green-400"
      >
        {isPlaying 
          ? <PauseIcon className="w-12 h-12" /> 
          : <PlayIcon className="w-12 h-12 pl-1" />
        }
      </button>
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-green-400"
      >
        {isDownloading ? (
          <>
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            <span>Generando...</span>
          </>
        ) : (
          <>
            <DownloadIcon className="w-5 h-5" />
            <span>Descargar Audio</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Controls;