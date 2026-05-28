// BeatForge Studio — Drum Kit Presets
// Switchable sound presets for different genres

import { InstrumentType } from './useAudioEngine';

export type KitPreset = 'trap-808' | 'lofi' | 'house' | 'techno' | 'classic';

export interface DrumKitPresetConfig {
  name: string;
  description: string;
  sounds: Record<InstrumentType, SoundConfig>;
}

export interface SoundConfig {
  // Synthesis parameters for each sound
  type: 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'bass' | 'synth' | 'perc' | 'guitar' | 'piano';
  parameters: Record<string, number>;
}

// Drum Kit Presets - each preset defines unique synthesis parameters
export const DRUM_KIT_PRESETS: Record<KitPreset, DrumKitPresetConfig> = {
  'trap-808': {
    name: '808 Trap',
    description: 'Deep sub bass kicks, crisp snares, tight hi-hats. Perfect for trap and hip-hop.',
    sounds: {
      kick: {
        type: 'kick',
        parameters: {
          startFreq: 200,
          endFreq: 0.001,
          duration: 0.6,
          distortion: 1.2,
          punch: 1.0,
        },
      },
      snare: {
        type: 'snare',
        parameters: {
          noiseFreq: 1200,
          tonalFreq: 250,
          duration: 0.15,
          crispness: 0.9,
        },
      },
      hihat: {
        type: 'hihat',
        parameters: {
          frequency: 8000,
          duration: 0.04,
          brightness: 0.8,
        },
      },
      openhat: {
        type: 'openhat',
        parameters: {
          frequency: 7500,
          duration: 0.35,
          brightness: 0.85,
        },
      },
      clap: {
        type: 'clap',
        parameters: {
          frequency: 1400,
          duration: 0.06,
          bursts: 3,
        },
      },
      bass: {
        type: 'bass',
        parameters: {
          startFreq: 60,
          endFreq: 0.001,
          duration: 0.45,
          filterFreq: 350,
          resonance: 2.5,
        },
      },
      synth: {
        type: 'synth',
        parameters: {
          baseFreq: 440,
          filterStart: 3200,
          filterEnd: 900,
          duration: 0.4,
        },
      },
      perc: {
        type: 'perc',
        parameters: {
          startFreq: 900,
          endFreq: 220,
          duration: 0.12,
        },
      },
      guitar: {
        type: 'guitar',
        parameters: {
          baseFreq: 164.81,
          duration: 1.2,
          brightness: 0.8,
        },
      },
      piano: {
        type: 'piano',
        parameters: {
          baseFreq: 261.63,
          duration: 2.5,
          brightness: 0.9,
        },
      },
    },
  },

  lofi: {
    name: 'Lo-Fi',
    description: 'Warm, mellow drums with vinyl crackle vibes. Great for chill beats and lo-fi hip-hop.',
    sounds: {
      kick: {
        type: 'kick',
        parameters: {
          startFreq: 140,
          endFreq: 0.001,
          duration: 0.55,
          distortion: 0.7,
          punch: 0.8,
        },
      },
      snare: {
        type: 'snare',
        parameters: {
          noiseFreq: 900,
          tonalFreq: 180,
          duration: 0.18,
          crispness: 0.6,
        },
      },
      hihat: {
        type: 'hihat',
        parameters: {
          frequency: 6500,
          duration: 0.06,
          brightness: 0.65,
        },
      },
      openhat: {
        type: 'openhat',
        parameters: {
          frequency: 6000,
          duration: 0.4,
          brightness: 0.7,
        },
      },
      clap: {
        type: 'clap',
        parameters: {
          frequency: 1100,
          duration: 0.08,
          bursts: 2,
        },
      },
      bass: {
        type: 'bass',
        parameters: {
          startFreq: 50,
          endFreq: 0.001,
          duration: 0.5,
          filterFreq: 300,
          resonance: 1.8,
        },
      },
      synth: {
        type: 'synth',
        parameters: {
          baseFreq: 380,
          filterStart: 2800,
          filterEnd: 700,
          duration: 0.45,
        },
      },
      perc: {
        type: 'perc',
        parameters: {
          startFreq: 700,
          endFreq: 180,
          duration: 0.14,
        },
      },
      guitar: {
        type: 'guitar',
        parameters: {
          baseFreq: 164.81,
          duration: 1.2,
          brightness: 0.7,
        },
      },
      piano: {
        type: 'piano',
        parameters: {
          baseFreq: 261.63,
          duration: 2.5,
          brightness: 0.85,
        },
      },
    },
  },

  house: {
    name: 'House',
    description: 'Punchy kicks, tight drums, and bright hi-hats. Built for dancefloor energy.',
    sounds: {
      kick: {
        type: 'kick',
        parameters: {
          startFreq: 180,
          endFreq: 0.001,
          duration: 0.5,
          distortion: 1.1,
          punch: 1.3,
        },
      },
      snare: {
        type: 'snare',
        parameters: {
          noiseFreq: 1400,
          tonalFreq: 280,
          duration: 0.12,
          crispness: 1.0,
        },
      },
      hihat: {
        type: 'hihat',
        parameters: {
          frequency: 9000,
          duration: 0.035,
          brightness: 1.0,
        },
      },
      openhat: {
        type: 'openhat',
        parameters: {
          frequency: 8500,
          duration: 0.3,
          brightness: 0.95,
        },
      },
      clap: {
        type: 'clap',
        parameters: {
          frequency: 1600,
          duration: 0.05,
          bursts: 4,
        },
      },
      bass: {
        type: 'bass',
        parameters: {
          startFreq: 70,
          endFreq: 0.001,
          duration: 0.4,
          filterFreq: 400,
          resonance: 3.0,
        },
      },
      synth: {
        type: 'synth',
        parameters: {
          baseFreq: 480,
          filterStart: 3400,
          filterEnd: 1000,
          duration: 0.35,
        },
      },
      perc: {
        type: 'perc',
        parameters: {
          startFreq: 1000,
          endFreq: 250,
          duration: 0.1,
        },
      },
      guitar: {
        type: 'guitar',
        parameters: {
          baseFreq: 164.81,
          duration: 1.2,
          brightness: 0.85,
        },
      },
      piano: {
        type: 'piano',
        parameters: {
          baseFreq: 261.63,
          duration: 2.5,
          brightness: 0.95,
        },
      },
    },
  },

  techno: {
    name: 'Techno',
    description: 'Industrial, aggressive drums with heavy distortion. For dark, hypnotic techno.',
    sounds: {
      kick: {
        type: 'kick',
        parameters: {
          startFreq: 220,
          endFreq: 0.001,
          duration: 0.65,
          distortion: 1.5,
          punch: 1.1,
        },
      },
      snare: {
        type: 'snare',
        parameters: {
          noiseFreq: 1600,
          tonalFreq: 320,
          duration: 0.14,
          crispness: 0.95,
        },
      },
      hihat: {
        type: 'hihat',
        parameters: {
          frequency: 9500,
          duration: 0.03,
          brightness: 0.9,
        },
      },
      openhat: {
        type: 'openhat',
        parameters: {
          frequency: 9000,
          duration: 0.32,
          brightness: 0.88,
        },
      },
      clap: {
        type: 'clap',
        parameters: {
          frequency: 1800,
          duration: 0.07,
          bursts: 3,
        },
      },
      bass: {
        type: 'bass',
        parameters: {
          startFreq: 80,
          endFreq: 0.001,
          duration: 0.5,
          filterFreq: 450,
          resonance: 3.5,
        },
      },
      synth: {
        type: 'synth',
        parameters: {
          baseFreq: 520,
          filterStart: 3600,
          filterEnd: 1100,
          duration: 0.4,
        },
      },
      perc: {
        type: 'perc',
        parameters: {
          startFreq: 1100,
          endFreq: 280,
          duration: 0.11,
        },
      },
      guitar: {
        type: 'guitar',
        parameters: {
          baseFreq: 164.81,
          duration: 1.2,
          brightness: 0.75,
        },
      },
      piano: {
        type: 'piano',
        parameters: {
          baseFreq: 261.63,
          duration: 2.5,
          brightness: 0.88,
        },
      },
    },
  },

  classic: {
    name: 'Classic',
    description: 'Balanced, versatile drum kit. A solid foundation for any beat.',
    sounds: {
      kick: {
        type: 'kick',
        parameters: {
          startFreq: 160,
          endFreq: 0.001,
          duration: 0.5,
          distortion: 1.0,
          punch: 1.0,
        },
      },
      snare: {
        type: 'snare',
        parameters: {
          noiseFreq: 1000,
          tonalFreq: 200,
          duration: 0.2,
          crispness: 0.85,
        },
      },
      hihat: {
        type: 'hihat',
        parameters: {
          frequency: 7000,
          duration: 0.05,
          brightness: 0.8,
        },
      },
      openhat: {
        type: 'openhat',
        parameters: {
          frequency: 7500,
          duration: 0.4,
          brightness: 0.85,
        },
      },
      clap: {
        type: 'clap',
        parameters: {
          frequency: 1200,
          duration: 0.05,
          bursts: 3,
        },
      },
      bass: {
        type: 'bass',
        parameters: {
          startFreq: 55,
          endFreq: 0.001,
          duration: 0.4,
          filterFreq: 400,
          resonance: 2.0,
        },
      },
      synth: {
        type: 'synth',
        parameters: {
          baseFreq: 440,
          filterStart: 3000,
          filterEnd: 800,
          duration: 0.5,
        },
      },
      perc: {
        type: 'perc',
        parameters: {
          startFreq: 800,
          endFreq: 200,
          duration: 0.15,
        },
      },
      guitar: {
        type: 'guitar',
        parameters: {
          baseFreq: 164.81,
          duration: 1.2,
          brightness: 0.8,
        },
      },
      piano: {
        type: 'piano',
        parameters: {
          baseFreq: 261.63,
          duration: 2.5,
          brightness: 0.9,
        },
      },
    },
  },
};

export const PRESET_LIST: Array<{ id: KitPreset; name: string; description: string }> = [
  { id: 'trap-808', name: '808 Trap', description: 'Deep subs, crisp snares' },
  { id: 'lofi', name: 'Lo-Fi', description: 'Warm, mellow vibes' },
  { id: 'house', name: 'House', description: 'Punchy, dancefloor energy' },
  { id: 'techno', name: 'Techno', description: 'Industrial, aggressive' },
  { id: 'classic', name: 'Classic', description: 'Balanced, versatile' },
];

export function useCurrentPreset(preset: KitPreset) {
  return DRUM_KIT_PRESETS[preset];
}
