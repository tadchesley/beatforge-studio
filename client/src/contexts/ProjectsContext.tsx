// BeatForge Studio — Projects Context
// Manages beat projects in localStorage

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface TrackStep {
  active: boolean;
  velocity: number; // 0-127
}

export interface Track {
  id: string;
  name: string;
  instrument: string;
  color: string;
  volume: number; // 0-100
  muted: boolean;
  steps: TrackStep[]; // 16 steps
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  bpm: number;
  swing: number;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
  genre?: string;
  description?: string;
}

interface ProjectsContextType {
  projects: Project[];
  currentProject: Project | null;
  createProject: (name: string, genre?: string) => Project;
  openProject: (id: string) => void;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project;
  closeProject: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

// Default beat patterns (classic trap/hip-hop groove)
const KICK_PATTERN =    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0];
const SNARE_PATTERN =   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
const HIHAT_PATTERN =   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0];
const OPENHAT_PATTERN = [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0];
const CLAP_PATTERN =    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
const BASS_PATTERN =    [1,0,0,1, 0,0,0,0, 1,0,0,0, 0,1,0,0];
const SYNTH_PATTERN =   [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,1];
const PERC_PATTERN =    [0,0,1,0, 0,0,0,1, 0,0,1,0, 0,0,0,0];

function makeSteps(pattern: number[]): TrackStep[] {
  return pattern.map(v => ({ active: v === 1, velocity: 100 }));
}

const DEFAULT_TRACKS: Omit<Track, 'id'>[] = [
  { name: 'Kick', instrument: 'kick', color: '#00D4FF', volume: 90, muted: false, steps: makeSteps(KICK_PATTERN) },
  { name: 'Snare', instrument: 'snare', color: '#A855F7', volume: 85, muted: false, steps: makeSteps(SNARE_PATTERN) },
  { name: 'Hi-Hat', instrument: 'hihat', color: '#00FF88', volume: 75, muted: false, steps: makeSteps(HIHAT_PATTERN) },
  { name: 'Open Hat', instrument: 'openhat', color: '#FF6B35', volume: 70, muted: false, steps: makeSteps(OPENHAT_PATTERN) },
  { name: 'Clap', instrument: 'clap', color: '#FFD700', volume: 80, muted: false, steps: makeSteps(CLAP_PATTERN) },
  { name: 'Bass', instrument: 'bass', color: '#FF4488', volume: 85, muted: false, steps: makeSteps(BASS_PATTERN) },
  { name: 'Synth Lead', instrument: 'synth', color: '#44DDFF', volume: 75, muted: false, steps: makeSteps(SYNTH_PATTERN) },
  { name: 'Perc', instrument: 'perc', color: '#88FF44', volume: 65, muted: false, steps: makeSteps(PERC_PATTERN) },
];

function makeTracks(): Track[] {
  return DEFAULT_TRACKS.map(t => ({ ...t, id: crypto.randomUUID(), steps: t.steps.map(s => ({ ...s })) }));
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`bf_projects_${user.id}`);
      if (stored) {
        try { setProjects(JSON.parse(stored)); } catch {}
      }
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const persist = (updated: Project[]) => {
    if (!user) return;
    localStorage.setItem(`bf_projects_${user.id}`, JSON.stringify(updated));
    setProjects(updated);
  };

  const createProject = (name: string, genre?: string): Project => {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      userId: user?.id ?? 'guest',
      bpm: 120,
      swing: 0,
      tracks: makeTracks(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      genre,
    };
    const updated = [project, ...projects];
    persist(updated);
    setCurrentProject(project);
    return project;
  };

  const openProject = (id: string) => {
    const found = projects.find(p => p.id === id);
    if (found) setCurrentProject({ ...found });
  };

  const saveProject = (project: Project) => {
    project.updatedAt = new Date().toISOString();
    const updated = projects.map(p => p.id === project.id ? project : p);
    persist(updated);
    setCurrentProject(project);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    persist(updated);
    if (currentProject?.id === id) setCurrentProject(null);
  };

  const duplicateProject = (id: string): Project => {
    const source = projects.find(p => p.id === id);
    if (!source) throw new Error('Project not found');
    const copy: Project = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: source.tracks.map(t => ({ ...t, id: crypto.randomUUID(), steps: t.steps.map(s => ({ ...s })) })),
    };
    const updated = [copy, ...projects];
    persist(updated);
    return copy;
  };

  const closeProject = () => setCurrentProject(null);

  return (
    <ProjectsContext.Provider value={{ projects, currentProject, createProject, openProject, saveProject, deleteProject, duplicateProject, closeProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}
