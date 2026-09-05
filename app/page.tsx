import Link from "next/link";
import { Building2, Sparkles, ArrowRight, ShieldCheck, Layers, Briefcase, Globe, Lock } from "lucide-react";

export default function RootHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 flex items-center justify-center text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl text-white tracking-tight">Whitecarrot</span>
            <span className="text-xs text-slate-400 block font-mono">Careers Builder & ATS</span>
          </div>
        </div>

        <Link
          href="/login"
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Recruiter Login</span>
        </Link>
      </header>

      <main className="max-w-4xl w-full mx-auto text-center space-y-8 my-16 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Multi-Tenant Production Prototype</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Build Branded Careers Pages in Minutes.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Empower recruiters to customize brand themes, reorder sections with drag-and-drop, and deliver responsive, accessible candidate job browsing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Recruiter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/acme-corp/careers"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Explore Demo Candidate Page (Acme Corp)</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 text-left max-w-2xl mx-auto">
          <Link
            href="/acme-corp/careers"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Acme Corp Public Portal
              </span>
              <span className="text-[10px] font-mono text-blue-400">/acme-corp/careers</span>
            </div>
            <p className="text-xs text-slate-400">Royal blue theme, engineering jobs, culture video & perks.</p>
          </Link>

          <Link
            href="/technova/careers"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                TechNova AI Public Portal
              </span>
              <span className="text-[10px] font-mono text-emerald-400">/technova/careers</span>
            </div>
            <p className="text-xs text-slate-400">Emerald green theme, biotech & AI research job requisitions.</p>
          </Link>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 z-10 pt-8 border-t border-slate-900">
        <p>© 2026 Whitecarrot Careers Page Builder • Production Prototype</p>
      </footer>
    </div>
  );
}
