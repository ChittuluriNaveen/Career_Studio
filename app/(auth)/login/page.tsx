"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  Palette,
  Smartphone,
  Users,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const router = router_or_hook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function router_or_hook() {
    return useRouter();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Try using one of the demo recruiter credentials below.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      {/* Background Decorative Ambient Soft Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDE: BRANDED DESIGN & FEATURE HIGHLIGHTS (LIGHT THEME) */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative z-10 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200/80">
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#005d52] border border-teal-600/20 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                WhiteCarrot Studio
              </span>
              <span className="text-xs font-bold text-[#005d52]">Careers Builder & ATS Console</span>
            </div>
          </Link>

          {/* Hero Pitch Headline */}
          <div className="space-y-3 pt-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#005d52] text-xs font-extrabold tracking-wider uppercase inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Welcome Back Recruiter</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Command Your <span className="bg-gradient-to-r from-[#005d52] via-teal-600 to-amber-600 bg-clip-text text-transparent">Employer Brand</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
              Sign in to manage your company careers portal, design mobile-responsive pages, and track active candidate applications in real time.
            </p>
          </div>

          {/* Key Feature Value Points */}
          <div className="space-y-3.5 pt-2">
            {[
              {
                icon: Palette,
                title: "Visual Career Studio Editor",
                desc: "14+ section templates, custom colors, typography, glassmorphism, and live previews.",
              },
              {
                icon: Smartphone,
                title: "Target Device Viewports",
                desc: "Instant desktop, tablet, and mobile responsiveness with automated scaling.",
              },
              {
                icon: Users,
                title: "Applicant Management ATS",
                desc: "Streamlined job requisitions, candidate pipelines, and location/department filtering.",
              },
              {
                icon: ShieldCheck,
                title: "Multi-Tenant Data Isolation",
                desc: "Encrypted company tenant isolation, role access, and 1-click live publishing.",
              },
            ].map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm backdrop-blur-md hover:border-emerald-300 transition-all">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#005d52] border border-emerald-100 flex-shrink-0 mt-0.5">
                  <pt.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">{pt.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5 font-medium">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Platform Trust Badges */}
        <div className="pt-8 border-t border-slate-200/80 mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800 font-bold">99.9% Portal Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>Multi-Tenant Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM & DEMO CREDENTIALS (LIGHT THEME) */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center relative z-10 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recruiter Sign In
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Enter your credentials to access your company dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 leading-relaxed animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@acme.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs font-semibold text-slate-600">
                Don't have a company account yet?{" "}
                <Link
                  href="/register"
                  className="text-[#005d52] font-extrabold hover:underline transition-colors inline-flex items-center gap-1 underline-offset-4"
                >
                  <span>Create Recruiter Account</span>
                  <UserPlus className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </form>

          {/* Quick Demo Credentials Autofill Cards */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Instant Demo Access (1-Click)
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoUser("recruiter@acme.com")}
                className="text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all text-xs flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Acme Corp Recruiter</span>
                  <span className="text-slate-500 font-mono text-[11px]">recruiter@acme.com</span>
                </div>
                <span className="text-[#005d52] font-extrabold text-[11px] group-hover:translate-x-1 transition-transform">
                  Auto-fill →
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoUser("recruiter@technova.com")}
                className="text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all text-xs flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-900 block">TechNova AI Recruiter</span>
                  <span className="text-slate-500 font-mono text-[11px]">recruiter@technova.com</span>
                </div>
                <span className="text-[#005d52] font-extrabold text-[11px] group-hover:translate-x-1 transition-transform">
                  Auto-fill →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

