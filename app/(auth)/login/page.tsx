"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#005d52] shadow-sm mb-4 text-white">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Recruiter Portal Login
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          WhiteCarrot Careers Page Builder & ATS Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recruiter@acme.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005d52] font-semibold text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005d52] font-semibold text-xs transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#005d52] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In to Recruiter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Cards */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#005d52]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1-Click Demo Accounts
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoUser("recruiter@acme.com")}
                className="text-left px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 transition-all text-xs flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Acme Corp Recruiter</span>
                  <span className="text-slate-500 font-mono text-[11px]">recruiter@acme.com</span>
                </div>
                <span className="text-[#005d52] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  Auto-fill →
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoUser("recruiter@technova.com")}
                className="text-left px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 transition-all text-xs flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-900 block">TechNova AI Recruiter</span>
                  <span className="text-slate-500 font-mono text-[11px]">recruiter@technova.com</span>
                </div>
                <span className="text-[#005d52] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  Auto-fill →
                </span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Multi-tenant data isolation active per company boundary</span>
        </p>
      </div>
    </div>
  );
}
