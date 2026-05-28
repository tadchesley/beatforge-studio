// BeatForge Studio — Web Audio Engine
// Synthesizes drum kit sounds using the Web Audio API (no samples needed)

import { useRef, useCallback, useEffect } from 'react';

export type InstrumentType = 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'bass' | 'synth' | 'perc';

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
