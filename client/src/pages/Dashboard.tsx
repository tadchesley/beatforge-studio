// BeatForge Studio — Dashboard Page
// Design: Midnight Neon Synthwave — sidebar layout, project cards, quick actions

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { toast } from "sonner";
import {
  Plus, Music2, Clock, MoreHorizontal, Trash2, Copy,
  Play, LogOut, Settings, Home, Zap, ChevronRight, Search
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/logo-icon-YZXS32RxHwjyradERoQpWj.webp";
const WAVE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/waveform-bg-8bVX5J3ifXn8cedBcGSiei.webp";

const GENRES = ["Hip-Hop", "Trap", "EDM", "House", "Techno", "R&B", "Pop", "Drill", "Lo-Fi", "Ambient"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TRACK_COLORS = ['#00D4FF', '#A855F7', '#00FF88', '#FF6B35', '#FFD700', '#FF4488'];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { projects, createProject, deleteProject, duplicateProject, openProject } = useProjects();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [search, setSearch] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) { toast.error("Please enter a project name"); return; }
    const p = createProject(newName.trim(), newGenre || undefined);
    setShowNew(false);
    setNewName("");
    setNewGenre("");
    toast.success(`"${p.name}" created!`);
    navigate(`/studio/${p.id}`);
  };

  const handleOpen = (id: string) => {
    openProject(id);
    navigate(`/studio/${id}`);
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateProject(id);
    toast.success(`Duplicated as "${copy.name}"`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteProject(id);
    toast.success(`"${name}" deleted`);
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.genre ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080B14] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0A0D18] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src={LOGO_IMG} alt="BeatForge" className="w-7 h-7" />
            <span className="font-['Space_Grotesk'] font-bold text-base text-white">
              Beat<span className="text-[#00D4FF]">Forge</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <div className="px-3 py-1.5 text-xs font-['Fira_Code'] text-white/25 uppercase tracking-wider">Studio</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] text-sm font-medium">
            <Music2 className="w-4 h-4" />
            Projects
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-colors no-underline">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={() => toast.info("Templates coming soon!")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => toast.info("Settings coming soon!")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#A855F7] flex items-center justify-center text-xs font-bold text-[#080B14]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate font-medium">{user?.name}</div>
              <div className="text-xs text-white/30 truncate">{user?.plan} plan</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/5 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header banner */}
        <div className="relative h-40 overflow-hidden">
          <img src={WAVE_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080B14]" />
          <div className="absolute inset-0 flex items-end px-8 pb-6">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-2xl text-white">
                Welcome back, <span className="text-[#00D4FF]">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {projects.length} project{projects.length !== 1 ? 's' : ''} in your studio
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Actions row */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => setShowNew(true)}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-9 text-sm"
              />
            </div>
          </div>

          {/* Projects grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Music2 className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-white/40 text-lg mb-2">
                {search ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-white/25 text-sm mb-6">
                {search ? "Try a different search term" : "Create your first beat to get started"}
              </p>
              {!search && (
                <Button
                  onClick={() => setShowNew(true)}
                  className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((project, idx) => (
                <div
                  key={project.id}
                  className="glass-panel rounded-xl overflow-hidden group hover:border-white/15 transition-all duration-300"
                >
                  {/* Color bar */}
                  <div
                    className="h-1.5"
                    style={{ background: `linear-gradient(90deg, ${TRACK_COLORS[idx % TRACK_COLORS.length]}, ${TRACK_COLORS[(idx + 1) % TRACK_COLORS.length]})` }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Space_Grotesk'] font-semibold text-white truncate group-hover:text-[#00D4FF] transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {project.genre && (
                            <Badge className="bg-white/5 text-white/40 border-white/10 text-xs px-2 py-0">
                              {project.genre}
                            </Badge>
                          )}
                          <span className="text-xs font-['Fira_Code'] text-white/30">{project.bpm} BPM</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0F1220] border-white/10 text-white" align="end">
                          <DropdownMenuItem onClick={() => handleOpen(project.id)} className="gap-2 hover:bg-white/5">
                            <Play className="w-4 h-4" /> Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(project.id)} className="gap-2 hover:bg-white/5">
                            <Copy className="w-4 h-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(project.id, project.name)}
                            className="gap-2 text-red-400 hover:bg-red-400/5"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Mini track preview */}
                    <div className="flex gap-0.5 mb-4">
                      {project.tracks.slice(0, 4).map(track => (
                        <div key={track.id} className="flex-1 flex gap-0.5">
                          {track.steps.slice(0, 8).map((step, si) => (
                            <div
                              key={si}
                              className="flex-1 h-1.5 rounded-sm"
                              style={{
                                background: step.active ? track.color : 'rgba(255,255,255,0.06)',
                                boxShadow: step.active ? `0 0 4px ${track.color}80` : 'none',
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-white/25">
                        <Clock className="w-3 h-3" />
                        {timeAgo(project.updatedAt)}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleOpen(project.id)}
                        className="bg-white/5 hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] text-white/60 border border-white/10 hover:border-[#00D4FF]/30 text-xs h-7 gap-1 transition-all"
                      >
                        Open <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Project Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="bg-[#0F1220] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Space_Grotesk'] text-xl">New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Project Name</Label>
              <Input
                placeholder="My Beat, Untitled Project..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00D4FF]/50 h-11"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Genre (optional)</Label>
              <Select value={newGenre} onValueChange={setNewGenre}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                  <SelectValue placeholder="Select genre..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1220] border-white/10 text-white">
                  {GENRES.map(g => (
                    <SelectItem key={g} value={g} className="hover:bg-white/5">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowNew(false)}
                className="flex-1 border-white/10 text-white/60 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold"
              >
                Create & Open
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
