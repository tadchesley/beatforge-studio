// BeatForge Studio — Web Audio Engine
// Synthesizes drum kit sounds using the Web Audio API (no samples needed)

import { useRef, useCallback, useEffect } from 'react';

export type InstrumentType = 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'bass' | 'synth' | 'perc' | 'guitar' | 'piano';

export interface AudioEngine {
  playSound: (instrument: InstrumentType, velocity?: number) => void;
  isReady: boolean;
}

function createKick(ctx: AudioContext, velocity = 1) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const distortion = ctx.createWaveShaper();

  // Waveshaper for punch
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x));
  }
  distortion.curve = curve;

  osc.connect(distortion);
  distortion.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);
  gain.gain.setValueAtTime(velocity * 1.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.start(now);
  osc.stop(now + 0.5);
}

function createSnare(ctx: AudioContext, velocity = 1) {
  // Noise component
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;

  const noiseGain = ctx.createGain();
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // Tonal component
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  const now = ctx.currentTime;
  noiseGain.gain.setValueAtTime(velocity * 0.8, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.1);
  oscGain.gain.setValueAtTime(velocity * 0.7, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  noise.start(now);
  osc.start(now);
  noise.stop(now + 0.2);
  osc.stop(now + 0.1);
}

function createHihat(ctx: AudioContext, velocity = 1, open = false) {
  const bufferSize = ctx.sampleRate * (open ? 0.4 : 0.05);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;

  const gain = ctx.createGain();
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  const duration = open ? 0.4 : 0.05;
  gain.gain.setValueAtTime(velocity * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.start(now);
  noise.stop(now + duration);
}

function createClap(ctx: AudioContext, velocity = 1) {
  const now = ctx.currentTime;
  // Multiple noise bursts for clap texture
  [0, 0.01, 0.02].forEach(offset => {
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(velocity * 0.9, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
    noise.start(now + offset);
    noise.stop(now + offset + 0.05);
  });
}

function createBass(ctx: AudioContext, velocity = 1) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  filter.Q.value = 2;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(55, now); // A1
  gain.gain.setValueAtTime(velocity * 0.9, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.start(now);
  osc.stop(now + 0.4);
}

function createSynth(ctx: AudioContext, velocity = 1) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'square';
  osc2.type = 'sawtooth';
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  filter.Q.value = 5;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  const freq = 440; // A4
  osc1.frequency.setValueAtTime(freq, now);
  osc2.frequency.setValueAtTime(freq * 1.005, now); // slight detune

  filter.frequency.setValueAtTime(3000, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.3);

  gain.gain.setValueAtTime(velocity * 0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.5);
  osc2.stop(now + 0.5);
}

function createPerc(ctx: AudioContext, velocity = 1) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
  gain.gain.setValueAtTime(velocity * 0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.start(now);
  osc.stop(now + 0.15);
}

function createGuitar(ctx: AudioContext, velocity = 1) {
  // Simulate guitar string pluck with multiple harmonics
  const now = ctx.currentTime;
  const duration = 1.2;
  
  // Create multiple oscillators for rich harmonic content
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();
  
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const gain3 = ctx.createGain();
  const masterGain = ctx.createGain();
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3500, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
  filter.Q.value = 1.5;
  
  // Fundamental frequency (E3 = 164.81 Hz)
  const baseFreq = 164.81;
  
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(baseFreq, now);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.98, now + duration);
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(baseFreq * 2, now);
  osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.98, now + duration);
  
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(baseFreq * 3, now);
  osc3.frequency.exponentialRampToValueAtTime(baseFreq * 2.98, now + duration);
  
  // Connect oscillators
  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);
  
  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);
  
  // Envelope: fast attack, slow decay
  const attackTime = 0.01;
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(velocity * 0.6, now + attackTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(velocity * 0.3, now + attackTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  gain3.gain.setValueAtTime(0, now);
  gain3.gain.linearRampToValueAtTime(velocity * 0.15, now + attackTime);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  masterGain.gain.setValueAtTime(velocity * 0.7, now);
  
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  
  osc1.stop(now + duration);
  osc2.stop(now + duration);
  osc3.stop(now + duration);
}

function createPiano(ctx: AudioContext, velocity = 1) {
  // Simulate piano with multiple harmonics and complex envelope
  const now = ctx.currentTime;
  const duration = 2.5;
  
  // Create multiple sine waves for harmonic richness
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  const harmonics = [1, 2, 3, 4, 5, 7, 9]; // Harmonic series
  const baseFreq = 261.63; // Middle C
  
  const masterGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(8000, now);
  filter.frequency.exponentialRampToValueAtTime(2000, now + duration);
  filter.Q.value = 2;
  
  // Create harmonics
  harmonics.forEach((harmonic: number, idx: number) => {
    const osc: OscillatorNode = ctx.createOscillator();
    const gain: GainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * harmonic, now);
    
    // Slight frequency modulation for realism
    osc.frequency.exponentialRampToValueAtTime(baseFreq * harmonic * 0.995, now + duration);
    
    osc.connect(gain);
    gain.connect(filter);
    
    // Amplitude decreases for higher harmonics
    const amplitude = velocity * (1 / (idx + 1)) * 0.4;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amplitude, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    oscs.push(osc);
    gains.push(gain);
  });
  
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(velocity * 0.8, now);
  
  // Start all oscillators
  oscs.forEach((osc: OscillatorNode) => osc.start(now));
  
  // Stop all oscillators
  oscs.forEach((osc: OscillatorNode) => osc.stop(now + duration));
}

export function useAudioEngine(): AudioEngine {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback((instrument: InstrumentType, velocity = 1) => {
    const ctx = getCtx();
    const v = Math.max(0, Math.min(1, velocity));
    try {
      switch (instrument) {
        case 'kick': createKick(ctx, v); break;
        case 'snare': createSnare(ctx, v); break;
        case 'hihat': createHihat(ctx, v, false); break;
        case 'openhat': createHihat(ctx, v, true); break;
        case 'clap': createClap(ctx, v); break;
        case 'bass': createBass(ctx, v); break;
        case 'synth': createSynth(ctx, v); break;
        case 'perc': createPerc(ctx, v); break;
        case 'guitar': createGuitar(ctx, v); break;
        case 'piano': createPiano(ctx, v); break;
      }
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }, [getCtx]);

  useEffect(() => {
    return () => { ctxRef.current?.close(); };
  }, []);

  return { playSound, isReady: true };
}
