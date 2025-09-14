// A function to write a string to a DataView
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// A function to convert an AudioBuffer to a WAV file (as a Blob)
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  writeString(view, pos, 'RIFF'); pos += 4;
  view.setUint32(pos, length - 8, true); pos += 4;
  writeString(view, pos, 'WAVE'); pos += 4;
  
  // write 'fmt ' chunk
  writeString(view, pos, 'fmt '); pos += 4;
  view.setUint32(pos, 16, true); pos += 4;
  view.setUint16(pos, 1, true); pos += 2;
  view.setUint16(pos, numOfChan, true); pos += 2;
  view.setUint32(pos, buffer.sampleRate, true); pos += 4;
  view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true); pos += 4;
  view.setUint16(pos, numOfChan * 2, true); pos += 2;
  view.setUint16(pos, 16, true); pos += 2;

  // write 'data' chunk
  writeString(view, pos, 'data'); pos += 4;
  view.setUint32(pos, length - pos - 4, true); pos += 4;

  // write the PCM samples
  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([view], { type: 'audio/wav' });
};

// Frequencies for C4, E4, G4 (C Major chord)
const NOTE_FREQUENCIES = [261.63, 329.63, 392.00];

const createOfflineTick = (context: OfflineAudioContext, time: number, frequency: number) => {
    // Master gain for the overall sound envelope
    const masterGain = context.createGain();
    masterGain.connect(context.destination);

    // Envelope: Quick attack, then decay for a "plink" sound
    const attackTime = 0.005;
    const decayTime = 0.3;
    const peakVolume = 0.4;
    
    masterGain.gain.setValueAtTime(0, time);
    masterGain.gain.linearRampToValueAtTime(peakVolume, time + attackTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, time + attackTime + decayTime);

    // --- Oscillators for a more complex, pleasant tone ---

    // Fundamental tone (sine wave)
    const fundamental = context.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, time);
    fundamental.connect(masterGain);

    // First harmonic (triangle wave for softer overtone)
    const harmonic = context.createOscillator();
    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(frequency * 2, time);

    // Gain for the harmonic to make it quieter than the fundamental
    const harmonicGain = context.createGain();
    harmonicGain.gain.value = 0.3;
    harmonic.connect(harmonicGain);
    harmonicGain.connect(masterGain);

    const stopTime = time + attackTime + decayTime + 0.1;
    fundamental.start(time);
    fundamental.stop(stopTime);
    harmonic.start(time);
    harmonic.stop(stopTime);
};


export const generateWavBlob = async (bpm: number, durationInSeconds: number): Promise<Blob> => {
  const sampleRate = 44100;
  const OfflineAudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  
  if(!OfflineAudioContext) {
    throw new Error("Offline Audio Context is not supported in this browser.");
  }

  const offlineCtx = new OfflineAudioContext(1, sampleRate * durationInSeconds, sampleRate);

  const interval = 60.0 / bpm;
  let beatCount = 0;
  for (let time = 0; time < durationInSeconds; time += interval) {
    const currentBeatInCycle = beatCount % 8;

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
        // Silence
        break;
    }

    if (frequency) {
      createOfflineTick(offlineCtx, time, frequency);
    }
    beatCount++;
  }

  const audioBuffer = await offlineCtx.startRendering();
  return audioBufferToWav(audioBuffer);
};