import React, { useCallback, useMemo, useState } from 'react';
import { CLUB_TEMPO_CONFIGS } from '../constants';
import { useMetronome } from '../hooks/useMetronome';
import { generateWavBlob } from '../services/audioService';
import ClubSelector from '../components/ClubSelector';
import TempoSlider from '../components/TempoSlider';
import Controls from '../components/Controls';

const MetronomePage: React.FC = () => {
  const [selectedClubId, setSelectedClubId] = useState<string>(CLUB_TEMPO_CONFIGS[2].id);

  const selectedClubConfig = useMemo(
    () => CLUB_TEMPO_CONFIGS.find(club => club.id === selectedClubId)!,
    [selectedClubId],
  );

  const [bpm, setBpm] = useState<number>(selectedClubConfig.default);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Activa y detiene el metrónomo según el estado local.
  useMetronome(bpm, isPlaying);

  const handleClubChange = useCallback(
    (clubId: string) => {
      const newClubConfig = CLUB_TEMPO_CONFIGS.find(club => club.id === clubId)!;
      setSelectedClubId(clubId);
      setBpm(newClubConfig.default);
      if (isPlaying) setIsPlaying(false);
    },
    [isPlaying],
  );

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => setBpm(Number(event.target.value));
  const handlePlayPause = () => setIsPlaying(prev => !prev);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const blob = await generateWavBlob(bpm, 15);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `golf_metronome_${selectedClubConfig.name.replace(/\s/g, '_')}_${bpm}bpm.wav`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to download audio:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [bpm, selectedClubConfig.name]);

  return (
    <div className="w-full flex-grow flex flex-col justify-center overflow-y-auto">
      <header className="p-4 text-center border-b border-gray-200 dark:border-gray-700/50">
        <p className="text-gray-600 dark:text-gray-400">Seleccione un palo y ajuste el tempo de su swing.</p>
      </header>
      <main className="p-6 md:p-8 space-y-8">
        <ClubSelector clubs={CLUB_TEMPO_CONFIGS} selectedClubId={selectedClubId} onSelectClub={handleClubChange} />
        <div className="text-center space-y-4">
          <div className="text-7xl lg:text-8xl font-bold text-green-500 dark:text-green-400 tabular-nums">{bpm}</div>
          <TempoSlider
            min={selectedClubConfig.range.min}
            max={selectedClubConfig.range.max}
            value={bpm}
            optimalStart={selectedClubConfig.optimalRange.start}
            optimalEnd={selectedClubConfig.optimalRange.end}
            onChange={handleBpmChange}
          />
        </div>
        <div>
          <Controls isPlaying={isPlaying} isDownloading={isDownloading} onPlayPause={handlePlayPause} onDownload={handleDownload} />
        </div>
      </main>
    </div>
  );
};

export default MetronomePage;
