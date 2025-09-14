import { useRef, useEffect } from 'react';

// Frequencies for C4, E4, G4 (C Major chord)
const NOTE_FREQUENCIES = [261.63, 329.63, 392.00];

const createTick = (audioContext: AudioContext, time: number, frequency: number) => {
  // Master gain for the overall sound envelope
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);

  // Envelope: Quick attack, then decay for a "plink" sound
  const attackTime = 0.005;
  const decayTime = 0.3;
  const peakVolume = 0.4;
  
  masterGain.gain.setValueAtTime(0, time);
  masterGain.gain.linearRampToValueAtTime(peakVolume, time + attackTime);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, time + attackTime + decayTime);

  // --- Oscillators for a more complex, pleasant tone ---

  // Fundamental tone (sine wave)
  const fundamental = audioContext.createOscillator();
  fundamental.type = 'sine';
  fundamental.frequency.setValueAtTime(frequency, time);
  fundamental.connect(masterGain);

  // First harmonic (triangle wave for softer overtone)
  const harmonic = audioContext.createOscillator();
  harmonic.type = 'triangle';
  harmonic.frequency.setValueAtTime(frequency * 2, time);

  // Gain for the harmonic to make it quieter than the fundamental
  const harmonicGain = audioContext.createGain();
  harmonicGain.gain.value = 0.3;
  harmonic.connect(harmonicGain);
  harmonicGain.connect(masterGain);

  const stopTime = time + attackTime + decayTime + 0.1;
  fundamental.start(time);
  fundamental.stop(stopTime);
  harmonic.start(time);
  harmonic.stop(stopTime);
};


export const useMetronome = (bpm: number, isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef<number>(0);

  useEffect(() => {
    if (!audioContextRef.current) {
        // Handle browser differences for AudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioContextRef.current = new AudioContext();
        } else {
            console.error("Web Audio API is not supported in this browser.");
            return;
        }
    }
    const audioContext = audioContextRef.current;
    
    const scheduler = () => {
      const interval = 60.0 / bpm;
      const currentBeatInCycle = beatCountRef.current % 8;

      let frequency: number | null = null;
      
      switch (currentBeatInCycle) {
        case 0: // Beat 1
          frequency = NOTE_FREQUENCIES[0];
          break;
        case 2: // Beat 3
          frequency = NOTE_FREQUENCIES[1];
          break;
        case 3: // Beat 4
          frequency = NOTE_FREQUENCIES[2];
          break;
        default:
          // Silence for beats 2, 5, 6, 7, 8
          break;
      }

      if (frequency) {
        createTick(audioContext, audioContext.currentTime, frequency);
      }
      
      beatCountRef.current = beatCountRef.current + 1;
      timerRef.current = window.setTimeout(scheduler, interval * 1000);
    };

    const startPlayback = () => {
        // Clear any existing timer before starting a new one
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        beatCountRef.current = 0; // Reset beat count on start
        scheduler();
    };

    if (isPlaying) {
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(startPlayback);
      } else {
        startPlayback();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm]);
};