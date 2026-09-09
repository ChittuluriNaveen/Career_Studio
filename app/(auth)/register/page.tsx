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
  CheckCircle2,
  Palette,
  Smartphone,
  Users,
  Zap,
  Globe,
  Lock,
  Rocket,
  Sliders,
  LogIn,
  Check,
} from "lucide-react";
import { registerRecruiterAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !companyName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all required fields marked with * (Name, Company Name, Email, Password).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await registerRecruiterAction({
      name: name.trim(),
      email: email.trim(),
      password,
      companyName: companyName.trim(),
      location: location.trim() || undefined,
    });

    if (!res.success) {
      setError(res.error || "Failed to create recruiter account.");
      setLoading(false);
      return;
    }

    // Auto sign in recruiter
    const loginRes = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (loginRes?.error) {
      router.push(`/login?registered=true&email=${encodeURIComponent(email)}`);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row overflow-hidden font-sans relative">
      {/* Background Decorative Ambient Soft Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDE: REGISTRATION FORM (VICE VERSA LAYOUT - LIGHT THEME) */}
      <div className="lg:w-1/2 p-8 lg:p-14 flex items-center justify-center relative z-10 bg-white order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-slate-200">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#005d52] text-xs font-extrabold tracking-wider uppercase inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Get Started Free</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Recruiter Account
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Setup your company tenant & launch your branded careers portal in seconds.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 leading-relaxed animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Enterprises"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Headquarters Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (or Remote)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005d52] focus:border-[#005d52] text-xs font-semibold transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Create Account & Launch Portal</span>
                </>
              )}
            </button>

            <div className="pt-3 text-center">
              <p className="text-xs font-semibold text-slate-600">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="text-[#005d52] font-extrabold hover:underline transition-colors inline-flex items-center gap-1 underline-offset-4"
                >
                  <span>Sign in to your dashboard</span>
                  <LogIn className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-tenant data isolation active per company boundary</span>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDED DESIGN & FEATURE HIGHLIGHTS (VICE VERSA LAYOUT - LIGHT THEME) */}
      <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-between relative z-10 bg-gradient-to-bl from-teal-50/90 via-emerald-50/50 to-slate-100 order-1 lg:order-2 border-b lg:border-b-0 border-slate-200/80">
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
          <div className="space-y-3 pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Launch Your <span className="bg-gradient-to-r from-[#005d52] via-teal-600 to-amber-600 bg-clip-text text-transparent">Branded Careers Portal</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
              Join leading recruiters who build high-converting careers pages with visual section blocks, custom branding, device viewports, and instant ATS candidate tracking.
            </p>
          </div>

          {/* Key Registration Points & Feature Badges */}
          <div className="space-y-3.5 pt-2">
            {[
              {
                icon: Rocket,
                title: "Instant 1-Click Publishing",
                desc: "Go live in under 2 minutes with pre-seeded company sections and public shareable portal link.",
              },
              {
                icon: Palette,
                title: "Full Design Customization",
                desc: "Tailor primary colors, fonts, corner radius, glassmorphism overlay, and background banner media.",
              },
              {
                icon: Smartphone,
                title: "Target Device Viewports",
                desc: "Inspect desktop, tablet, and mobile responsiveness directly inside your inspector console.",
              },
              {
                icon: Users,
                title: "Candidate Requisition Pipeline",
                desc: "Filter applicants by job role, department, employment type, and location with multi-tenant data privacy.",
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

          {/* Onboarding Steps Timeline Indicator */}
          <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-sm space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#005d52] block">
              3-Step Setup Process
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-5 h-5 rounded-full bg-[#005d52] text-white font-black text-[10px] inline-flex items-center justify-center mb-1">1</span>
                <span className="text-[10px] font-bold text-[#005d52] block">Create Account</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] inline-flex items-center justify-center mb-1">2</span>
                <span className="text-[10px] font-bold text-slate-600 block">Style Portal</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] inline-flex items-center justify-center mb-1">3</span>
                <span className="text-[10px] font-bold text-slate-600 block">Publish Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Trust Badges */}
        <div className="pt-6 border-t border-slate-200/80 mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800 font-bold">Zero Code Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>Instant Live URL</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Isolated Tenant Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}


