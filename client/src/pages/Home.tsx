// BeatForge Studio — Home Landing Page
// Design: Midnight Neon Synthwave — deep navy, neon cyan, electric violet
// Layout: Asymmetric hero, feature grid, CTA section

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Music2, Zap, Layers, Sliders, Play, ChevronRight,
  Drum, Piano, Mic2, Activity, Star, Users, ArrowRight
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/hero-banner-Yyeut2A8B2yc8ogRU9ygmd.webp";
const STUDIO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/studio-workspace-G4wCGtpZCnd96vT6w3hRYd.webp";
const PADS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/beat-pads-SbqDQm6FZLvB9CQUzMYea4.webp";
const WAVE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/waveform-bg-8bVX5J3ifXn8cedBcGSiei.webp";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/logo-icon-YZXS32RxHwjyradERoQpWj.webp";

const FEATURES = [
  { icon: Drum, title: "Step Sequencer", desc: "16-step drum sequencer with per-step velocity, swing, and pattern chaining — inspired by FL Studio's Beat+Bassline.", color: "#00D4FF" },
  { icon: Piano, title: "Instrument Pads", desc: "Velocity-sensitive drum pads with 8 built-in instruments: kicks, snares, hi-hats, synths, bass, and more.", color: "#A855F7" },
  { icon: Sliders, title: "Mixer & FX", desc: "Per-track volume, mute/solo controls, and real-time audio routing powered by the Web Audio API.", color: "#00FF88" },
  { icon: Layers, title: "Multi-Track Arrange", desc: "Stack unlimited tracks in the arrangement view — similar to Ableton Live's session and arrangement workflow.", color: "#FF6B35" },
  { icon: Activity, title: "Live Waveform", desc: "Real-time spectrum analyzer and waveform visualizer that reacts to your beat as it plays.", color: "#FFD700" },
  { icon: Mic2, title: "Sound Library", desc: "Curated library of professionally crafted drum kits, synth presets, and bass patches ready to use.", color: "#FF4488" },
];

const PLANS = [
  { name: "Free", price: "$0", features: ["3 projects", "8 instruments", "16-step sequencer", "Basic export"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "$9/mo", features: ["Unlimited projects", "32 instruments", "32-step sequencer", "WAV export", "Custom samples"], cta: "Go Pro", highlight: true },
  { name: "Studio", price: "$19/mo", features: ["Everything in Pro", "Collaboration", "Cloud sync", "Plugin support", "Priority support"], cta: "Go Studio", highlight: false },
];

function WaveformBars() {
  const bars = Array.from({ length: 32 }, (_, i) => i);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-[#00D4FF]"
          style={{
            height: `${20 + Math.sin(i * 0.8) * 12 + Math.random() * 8}px`,
            opacity: 0.4 + Math.random() * 0.6,
            animation: `waveform-pulse ${0.8 + Math.random() * 0.8}s ease-in-out ${i * 0.05}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B14] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080B14]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <img src={LOGO_IMG} alt="BeatForge" className="w-8 h-8" />
            <span className="font-['Space_Grotesk'] font-bold text-xl text-white">
              Beat<span className="text-[#00D4FF]">Forge</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#sounds" className="hover:text-white transition-colors">Sounds</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-semibold text-sm px-5">
                  Open Studio
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-semibold text-sm px-5">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B14] via-[#080B14]/80 to-[#080B14]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-[#080B14]/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 text-xs font-['Fira_Code'] px-3 py-1">
              ⚡ Browser-based DAW — No Download Required
            </Badge>
            <h1 className="font-['Space_Grotesk'] font-bold text-5xl md:text-7xl leading-[1.05] mb-6">
              Create Beats.
              <br />
              <span className="text-[#00D4FF]" style={{ textShadow: '0 0 40px #00D4FF60' }}>
                Forge Music.
              </span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl font-['DM_Sans']">
              A professional-grade beat creation studio in your browser. Inspired by FL Studio, Ableton Live, and Logic Pro — with real instruments, a step sequencer, and a full mixer.
            </p>
            <div className="flex items-center gap-4 mb-12">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold text-base px-8 h-12 gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  Start Creating
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-base px-8 h-12 gap-2">
                  See Features
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>12,000+ producers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <WaveformBars />
            </div>
          </div>
        </div>

        {/* Floating studio preview */}
        <div className="absolute right-0 bottom-0 top-16 w-1/2 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080B14] z-10" />
          <img
            src={STUDIO_IMG}
            alt="Studio"
            className="w-full h-full object-cover object-left opacity-60"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B14] via-[#0A0D1A] to-[#080B14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <Badge className="mb-4 bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30 text-xs font-['Fira_Code']">
              FEATURES
            </Badge>
            <h2 className="font-['Space_Grotesk'] font-bold text-4xl md:text-5xl mb-4">
              Everything you need to
              <br />
              <span className="text-[#A855F7]">produce professional beats</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl">
              Built with the Web Audio API for zero-latency playback and real instrument synthesis directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="glass-panel rounded-xl p-6 hover:border-white/15 transition-all duration-300 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-lg mb-2 text-white group-hover:text-[#00D4FF] transition-colors">
                  {f.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sounds showcase */}
      <section id="sounds" className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${WAVE_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B14] via-transparent to-[#080B14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 text-xs font-['Fira_Code']">
                SOUND LIBRARY
              </Badge>
              <h2 className="font-['Space_Grotesk'] font-bold text-4xl md:text-5xl mb-6">
                Studio-quality
                <br />
                <span className="text-[#00FF88]">sounds built in</span>
              </h2>
              <p className="text-white/50 text-lg mb-8 leading-relaxed">
                Every sound is synthesized in real-time using the Web Audio API — no samples to download. Kicks, snares, hi-hats, synth leads, bass, and more.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['808 Kick', 'Trap Snare', 'Hi-Hat', 'Open Hat', 'Clap', 'Sub Bass', 'Synth Lead', 'Percussion'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                    {s}
                  </div>
                ))}
              </div>
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button className="bg-[#00FF88] hover:bg-[#00FF88]/90 text-[#080B14] font-bold gap-2">
                  Try the Studio <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.1)' }}>
                <img src={PADS_IMG} alt="Beat Pads" className="w-full" />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-panel rounded-xl p-4 border border-[#00D4FF]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs font-['Fira_Code'] text-[#00D4FF]">LIVE</span>
                </div>
                <div className="text-xs text-white/50">Web Audio API</div>
                <div className="text-xs text-white/50">Zero latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 text-xs font-['Fira_Code']">
              PRICING
            </Badge>
            <h2 className="font-['Space_Grotesk'] font-bold text-4xl md:text-5xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-white/50 text-lg">Start free, upgrade when you're ready</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 relative ${plan.highlight
                  ? 'bg-gradient-to-b from-[#00D4FF]/10 to-[#A855F7]/10 border border-[#00D4FF]/30'
                  : 'glass-panel'
                }`}
                style={plan.highlight ? { boxShadow: '0 0 40px rgba(0,212,255,0.1)' } : {}}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#00D4FF] text-[#080B14] font-bold text-xs px-3">MOST POPULAR</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-sm text-white/50 mb-1 font-['Fira_Code']">{plan.name.toUpperCase()}</div>
                  <div className="font-['Space_Grotesk'] font-bold text-3xl text-white">{plan.price}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className={`w-full font-semibold ${plan.highlight
                      ? 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 via-[#A855F7]/5 to-[#00D4FF]/5" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-['Space_Grotesk'] font-bold text-4xl md:text-6xl mb-6">
            Ready to forge
            <br />
            <span className="text-[#00D4FF]">your sound?</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Join thousands of producers making music in their browser. No download, no setup — just create.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold text-lg px-10 h-14 gap-2">
              <Play className="w-5 h-5 fill-current" />
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_IMG} alt="BeatForge" className="w-6 h-6" />
            <span className="font-['Space_Grotesk'] font-bold text-white">
              Beat<span className="text-[#00D4FF]">Forge</span>
            </span>
          </div>
          <p className="text-white/30 text-sm">© 2026 BeatForge Studio. Built with Web Audio API.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
