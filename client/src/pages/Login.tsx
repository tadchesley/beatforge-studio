// BeatForge Studio — Login Page
// Design: Midnight Neon Synthwave — glass panel centered on deep navy

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Music2 } from "lucide-react";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/logo-icon-YZXS32RxHwjyradERoQpWj.webp";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/hero-banner-Yyeut2A8B2yc8ogRU9ygmd.webp";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    await register("Demo Producer", "demo@beatforge.io", "demo123");
    const ok = await login("demo@beatforge.io", "demo123");
    setLoading(false);
    if (ok) { toast.success("Logged in as Demo Producer"); navigate("/dashboard"); }
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex">
      {/* Left panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
        <Link href="/" className="flex items-center gap-2 mb-12 no-underline w-fit">
          <img src={LOGO_IMG} alt="BeatForge" className="w-8 h-8" />
          <span className="font-['Space_Grotesk'] font-bold text-xl text-white">
            Beat<span className="text-[#00D4FF]">Forge</span>
          </span>
        </Link>

        <div className="max-w-sm w-full">
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to your studio</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00D4FF]/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00D4FF]/50 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#080B14] font-bold h-11"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#080B14] px-3 text-white/30">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={demoLogin}
            disabled={loading}
            className="w-full border-white/10 text-white/60 hover:bg-white/5 hover:text-white h-11 gap-2"
          >
            <Music2 className="w-4 h-4" />
            Try Demo Account
          </Button>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — visual */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img src={HERO_BG} alt="Studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B14] to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="glass-panel rounded-2xl p-6 border border-[#00D4FF]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              <span className="text-xs font-['Fira_Code'] text-[#00FF88]">LIVE SESSION</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              "BeatForge is the closest thing to FL Studio I've used in a browser. The step sequencer is incredibly intuitive."
            </p>
            <div className="mt-3 text-xs text-white/30">— Verified Producer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
