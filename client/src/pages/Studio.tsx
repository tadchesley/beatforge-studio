// BeatForge Studio — DAW Studio Page
// Design: Midnight Neon Synthwave — three-panel DAW layout
// Features: Step sequencer, drum pads, mixer, transport controls, Web Audio API

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useProjects, Track } from "@/contexts/ProjectsContext";
import { useAudioEngine, InstrumentType } from "@/hooks/useAudioEngine";
import { toast } from "sonner";
import {
  Play, Square, SkipBack, SkipForward, Save,
  Volume2, VolumeX, ChevronLeft, Plus, Minus,
  Music2, Sliders, Drum, Settings, LayoutGrid
} from "lucide-react";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/logo-icon-YZXS32RxHwjyradERoQpWj.webp";

const PAD_LABELS = ['Kick', 'Snare', 'Hi-Hat', 'Open Hat', 'Clap', 'Bass', 'Synth', 'Perc'];
const PAD_INSTRUMENTS: InstrumentType[] = ['kick', 'snare', 'hihat', 'openhat', 'clap', 'bass', 'synth', 'perc'];
const PAD_COLORS = ['#00D4FF', '#A855F7', '#00FF88', '#FF6B35', '#FFD700', '#FF4488', '#44DDFF', '#88FF44'];

// Waveform visualizer bars
function SpectrumBar({ active, color }: { active: boolean; color: string }) {
  return (
    <div
      className="w-0.5 rounded-full transition-all duration-75"
      style={{
        height: active ? `${8 + Math.random() * 24}px` : '4px',
        background: active ? color : 'rgba(255,255,255,0.1)',
        boxShadow: active ? `0 0 4px ${color}80` : 'none',
      }}
    />
  );
}

export default function Studio() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const { currentProject, openProject, saveProject, createProject } = useProjects();
  const { playSound } = useAudioEngine();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [activeTab, setActiveTab] = useState<'sequencer' | 'pads' | 'mixer'>('sequencer');
  const [activePad, setActivePad] = useState<number | null>(null);
  const [spectrumActive, setSpectrumActive] = useState(false);

  // Project state (local copy for editing)
  const [tracks, setTracks] = useState<Track[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(-1);

  // Load project
  useEffect(() => {
    if (params.id && (!currentProject || currentProject.id !== params.id)) {
      openProject(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (currentProject) {
      setTracks(currentProject.tracks.map(t => ({ ...t, steps: t.steps.map(s => ({ ...s })) })));
      setBpm(currentProject.bpm);
    }
  }, [currentProject?.id]);

  // Keyboard shortcuts for pads
  useEffect(() => {
    const keys: Record<string, number> = { q: 0, w: 1, e: 2, r: 3, a: 4, s: 5, d: 6, f: 7 };
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const idx = keys[e.key.toLowerCase()];
      if (idx !== undefined) handlePad(idx);
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, tracks]);

  // Sequencer playback
  const playStep = useCallback((step: number, trackList: Track[]) => {
    trackList.forEach(track => {
      if (!track.muted && track.steps[step]?.active) {
        playSound(track.instrument as InstrumentType, track.volume / 100);
      }
    });
  }, [playSound]);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm / 4) * 1000; // 16th notes
      intervalRef.current = setInterval(() => {
        stepRef.current = (stepRef.current + 1) % 16;
        setCurrentStep(stepRef.current);
        setSpectrumActive(prev => !prev);
        playStep(stepRef.current, tracks);
      }, interval);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!isPlaying) setCurrentStep(-1);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, bpm, tracks, playStep]);

  const togglePlay = () => {
    if (!isPlaying) stepRef.current = -1;
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    setIsPlaying(false);
    stepRef.current = -1;
    setCurrentStep(-1);
  };

  const toggleStep = (trackIdx: number, stepIdx: number) => {
    setTracks(prev => prev.map((t, ti) =>
      ti === trackIdx
        ? { ...t, steps: t.steps.map((s, si) => si === stepIdx ? { ...s, active: !s.active } : s) }
        : t
    ));
  };

  const toggleMute = (trackIdx: number) => {
    setTracks(prev => prev.map((t, ti) => ti === trackIdx ? { ...t, muted: !t.muted } : t));
  };

  const setVolume = (trackIdx: number, vol: number) => {
    setTracks(prev => prev.map((t, ti) => ti === trackIdx ? { ...t, volume: vol } : t));
  };

  const handlePad = (idx: number) => {
    setActivePad(idx);
    playSound(PAD_INSTRUMENTS[idx], 1);
    setTimeout(() => setActivePad(null), 150);
  };

  const handleSave = () => {
    if (!currentProject) return;
    saveProject({ ...currentProject, tracks, bpm });
    toast.success("Project saved!");
  };

  const handleNewProject = () => {
    const p = createProject("Untitled Beat");
    navigate(`/studio/${p.id}`);
  };

  if (!currentProject && !params.id) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-2">No project open</h2>
          <p className="text-white/40 text-sm mb-6">Create a new project or open one from your dashboard</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleNewProject} className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold gap-2">
              <Plus className="w-4 h-4" /> New Project
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white/10 text-white/60 hover:bg-white/5">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#080B14] flex flex-col overflow-hidden">
      {/* Transport Bar */}
      <header className="h-14 bg-[#0A0D18] border-b border-white/5 flex items-center px-4 gap-4 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors no-underline">
          <ChevronLeft className="w-4 h-4" />
          <img src={LOGO_IMG} alt="BeatForge" className="w-5 h-5" />
        </Link>

        <div className="h-5 w-px bg-white/10" />

        {/* Project name */}
        <div className="text-sm font-['Space_Grotesk'] font-semibold text-white truncate max-w-32">
          {currentProject?.name ?? "Untitled"}
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* Transport controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={stop}
                className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/5"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rewind</TooltipContent>
          </Tooltip>

          <Button
            onClick={togglePlay}
            size="icon"
            className={`w-9 h-9 rounded-full transition-all ${isPlaying
              ? 'bg-[#FF4488] hover:bg-[#FF4488]/90 text-white'
              : 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14]'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast.info("Record coming soon!")}
                className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/5"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skip</TooltipContent>
          </Tooltip>
        </div>

        {/* BPM */}
        <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5">
          <button onClick={() => setBpm(b => Math.max(60, b - 1))} className="text-white/40 hover:text-white transition-colors">
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-['Fira_Code'] text-sm text-white w-8 text-center">{bpm}</span>
          <button onClick={() => setBpm(b => Math.min(200, b + 1))} className="text-white/40 hover:text-white transition-colors">
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-xs text-white/30 ml-1">BPM</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-75"
              style={{
                background: i === currentStep ? '#00D4FF' : i % 4 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                boxShadow: i === currentStep ? '0 0 6px #00D4FF' : 'none',
              }}
            />
          ))}
        </div>

        {/* Spectrum visualizer */}
        <div className="flex items-end gap-0.5 h-6 ml-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full transition-all"
              style={{
                height: isPlaying ? `${4 + Math.random() * 20}px` : '3px',
                background: isPlaying ? `hsl(${180 + i * 5}, 100%, 60%)` : 'rgba(255,255,255,0.1)',
                transitionDuration: `${50 + i * 20}ms`,
              }}
            />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge className={`text-xs font-['Fira_Code'] ${isPlaying ? 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/30' : 'bg-white/5 text-white/30 border-white/10'}`}>
            {isPlaying ? '● PLAYING' : '■ STOPPED'}
          </Badge>
          <Button
            onClick={handleSave}
            size="sm"
            variant="outline"
            className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white gap-1.5 text-xs h-7"
          >
            <Save className="w-3 h-3" /> Save
          </Button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — instrument list */}
        <aside className="w-48 bg-[#0A0D18] border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-white/5">
            <div className="text-xs font-['Fira_Code'] text-white/25 uppercase tracking-wider">Instruments</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tracks.map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center gap-2 px-3 py-2.5 border-b border-white/4 hover:bg-white/3 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: track.color, boxShadow: `0 0 4px ${track.color}80` }}
                />
                <span className="text-xs text-white/70 flex-1 truncate font-medium">{track.name}</span>
                <button
                  onClick={() => toggleMute(idx)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                    track.muted ? 'text-red-400 bg-red-400/10' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — tabs: Sequencer / Pads / Mixer */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-white/5">
            {[
              { id: 'sequencer', label: 'Sequencer', icon: LayoutGrid },
              { id: 'pads', label: 'Drum Pads', icon: Drum },
              { id: 'mixer', label: 'Mixer', icon: Sliders },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-t-lg border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-[#00D4FF] border-[#00D4FF] bg-[#00D4FF]/5'
                    : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/3'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4">

            {/* SEQUENCER TAB */}
            {activeTab === 'sequencer' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  {/* Step numbers header */}
                  <div className="w-24 flex-shrink-0" />
                  <div className="flex gap-0.5 flex-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center text-xs font-['Fira_Code'] transition-colors"
                        style={{ color: i === currentStep ? '#00D4FF' : i % 4 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}
                      >
                        {i % 4 === 0 ? i / 4 + 1 : '·'}
                      </div>
                    ))}
                  </div>
                </div>

                {tracks.map((track, trackIdx) => (
                  <div key={track.id} className="flex items-center gap-2 group">
                    <div className="w-24 flex-shrink-0 flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: track.color }}
                      />
                      <span className="text-xs text-white/60 truncate">{track.name}</span>
                    </div>
                    <div className="flex gap-0.5 flex-1">
                      {track.steps.map((step, stepIdx) => (
                        <button
                          key={stepIdx}
                          onClick={() => toggleStep(trackIdx, stepIdx)}
                          className={`flex-1 h-8 rounded-sm transition-all duration-75 border ${
                            stepIdx % 4 === 0 ? 'border-white/8' : 'border-white/4'
                          } ${step.active ? 'scale-100' : 'hover:scale-105'}`}
                          style={{
                            background: step.active
                              ? track.color
                              : stepIdx === currentStep && isPlaying
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(255,255,255,0.03)',
                            boxShadow: step.active
                              ? `0 0 8px ${track.color}80, 0 0 16px ${track.color}30`
                              : stepIdx === currentStep && isPlaying
                                ? '0 0 4px rgba(0,212,255,0.3)'
                                : 'none',
                            borderColor: stepIdx === currentStep && isPlaying
                              ? 'rgba(0,212,255,0.3)'
                              : step.active
                                ? `${track.color}60`
                                : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PADS TAB */}
            {activeTab === 'pads' && (
              <div className="max-w-lg mx-auto">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {PAD_LABELS.map((label, idx) => (
                    <button
                      key={label}
                      onMouseDown={() => handlePad(idx)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 font-['Space_Grotesk'] font-semibold text-sm transition-all duration-75 border select-none ${
                        activePad === idx ? 'scale-95' : 'hover:scale-102 active:scale-95'
                      }`}
                      style={{
                        background: activePad === idx
                          ? `${PAD_COLORS[idx]}30`
                          : `${PAD_COLORS[idx]}08`,
                        borderColor: activePad === idx
                          ? PAD_COLORS[idx]
                          : `${PAD_COLORS[idx]}30`,
                        color: PAD_COLORS[idx],
                        boxShadow: activePad === idx
                          ? `0 0 20px ${PAD_COLORS[idx]}60, 0 0 40px ${PAD_COLORS[idx]}20, inset 0 0 20px ${PAD_COLORS[idx]}10`
                          : `0 0 0px transparent`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${PAD_COLORS[idx]}20` }}
                      >
                        <Drum className="w-4 h-4" />
                      </div>
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                  <p className="text-white/30 text-sm">Click pads to trigger sounds in real-time</p>
                  <p className="text-white/20 text-xs mt-1 font-['Fira_Code']">Keyboard shortcuts: Q W E R / A S D F</p>
                </div>
              </div>
            )}

            {/* MIXER TAB */}
            {activeTab === 'mixer' && (
              <div className="flex gap-3 overflow-x-auto pb-4">
                {tracks.map((track, idx) => (
                  <div
                    key={track.id}
                    className="flex-shrink-0 w-24 glass-panel rounded-xl p-3 flex flex-col items-center gap-3"
                    style={{ borderColor: `${track.color}20` }}
                  >
                    <div className="text-xs font-['Space_Grotesk'] font-semibold text-white/70 text-center truncate w-full">
                      {track.name}
                    </div>

                    {/* VU meter */}
                    <div className="flex gap-0.5 h-16 items-end">
                      {[0, 1].map(ch => (
                        <div key={ch} className="w-2 bg-white/5 rounded-sm overflow-hidden h-full flex flex-col-reverse">
                          <div
                            className="w-full rounded-sm transition-all duration-150"
                            style={{
                              height: isPlaying && !track.muted ? `${track.volume * 0.8 + Math.random() * 20}%` : `${track.volume * 0.6}%`,
                              background: `linear-gradient(to top, ${track.color}, ${track.color}80)`,
                              boxShadow: isPlaying && !track.muted ? `0 0 4px ${track.color}` : 'none',
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Volume fader */}
                    <div className="w-full">
                      <Slider
                        value={[track.volume]}
                        onValueChange={([v]) => setVolume(idx, v)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="font-['Fira_Code'] text-xs text-white/40">{track.volume}</div>

                    {/* Mute button */}
                    <button
                      onClick={() => toggleMute(idx)}
                      className={`w-full py-1 rounded text-xs font-semibold transition-all ${
                        track.muted
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {track.muted ? 'MUTED' : 'M'}
                    </button>

                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: track.color, boxShadow: `0 0 6px ${track.color}` }}
                    />
                  </div>
                ))}

                {/* Master channel */}
                <div className="flex-shrink-0 w-24 rounded-xl p-3 flex flex-col items-center gap-3 border border-[#00D4FF]/20 bg-[#00D4FF]/5">
                  <div className="text-xs font-['Space_Grotesk'] font-bold text-[#00D4FF]">MASTER</div>
                  <div className="flex gap-0.5 h-16 items-end">
                    {[0, 1].map(ch => (
                      <div key={ch} className="w-2 bg-white/5 rounded-sm overflow-hidden h-full flex flex-col-reverse">
                        <div
                          className="w-full rounded-sm transition-all duration-100"
                          style={{
                            height: isPlaying ? `${60 + Math.random() * 30}%` : '40%',
                            background: 'linear-gradient(to top, #00D4FF, #A855F7)',
                            boxShadow: isPlaying ? '0 0 6px #00D4FF' : 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="font-['Fira_Code'] text-xs text-[#00D4FF]">100</div>
                  <div className="w-3 h-3 rounded-full bg-[#00D4FF]" style={{ boxShadow: '0 0 8px #00D4FF' }} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom status bar */}
      <footer className="h-7 bg-[#0A0D18] border-t border-white/5 flex items-center px-4 gap-4">
        <span className="text-xs font-['Fira_Code'] text-white/25">
          {currentProject?.name} · {bpm} BPM · 4/4 · 16 steps
        </span>
        <div className="ml-auto flex items-center gap-3 text-xs text-white/20 font-['Fira_Code']">
          <span>Web Audio API</span>
          <span>·</span>
          <span>{tracks.filter(t => !t.muted).length}/{tracks.length} tracks active</span>
          <span>·</span>
          <span className={isPlaying ? 'text-[#00FF88]' : 'text-white/20'}>
            {isPlaying ? '● LIVE' : '○ IDLE'}
          </span>
        </div>
      </footer>
    </div>
  );
}
