// BeatForge Studio — Register Page
// Design: Midnight Neon Synthwave

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/logo-icon-YZXS32RxHwjyradERoQpWj.webp";
const PADS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663706144603/YyyPaUeUb7PywapTaqGYtw/beat-pads-SbqDQm6FZLvB9CQUzMYea4.webp";

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const ok = await register(name, email, password);
    setLoading(false);
    if (ok) {
      toast.success("Account created! Welcome to BeatForge.");
      navigate("/dashboard");
    } else {
      toast.error("Email already in use");
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex">
      {/* Left visual */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img src={PADS_IMG} alt="Beat Pads" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080B14]" />
        <div className="absolute top-12 left-12 right-12">
          <div className="glass-panel rounded-2xl p-6 border border-[#A855F7]/20">
            <div className="text-xs font-['Fira_Code'] text-[#A855F7] mb-2">FREE PLAN INCLUDES</div>
            {['3 projects', '8 instruments', '16-step sequencer', 'WAV export'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/60 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
        <Link href="/" className="flex items-center gap-2 mb-12 no-underline w-fit">
          <img src={LOGO_IMG} alt="BeatForge" className="w-8 h-8" />
          <span className="font-['Space_Grotesk'] font-bold text-xl text-white">
            Beat<span className="text-[#00D4FF]">Forge</span>
          </span>
        </Link>

        <div className="max-w-sm w-full">
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl text-white mb-2">Create your studio</h1>
          <p className="text-white/40 text-sm mb-8">Free forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Producer Name</Label>
              <Input
                placeholder="Your name or alias"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00D4FF]/50 h-11"
              />
            </div>
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
                  placeholder="Min. 6 characters"
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
              {loading ? "Creating account..." : "Create Free Account"}
            </Button>
          </form>

          <p className="text-center text-xs text-white/25 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
