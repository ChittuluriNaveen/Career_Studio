"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  User as UserIcon,
  Sparkles,
  ArrowRight,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-2 px-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#005d52] shadow-md mb-2 text-white hover:opacity-90 transition-opacity"
        >
          <Building2 className="w-8 h-8 text-white" />
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Create Recruiter Account
        </h2>
        <p className="text-xs text-slate-600 font-medium">
          Get started with your company careers portal in seconds.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200 sm:px-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#005d52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Enterprises"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#005d52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#005d52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#005d52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Headquarters Location (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#005d52] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#005d52] hover:bg-[#004a41] text-white font-extrabold rounded-xl shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] mt-2"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Start Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#005d52]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Control in Dashboard</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              After signing up, you can update your company logo, culture video, banner images, story text, and brand colors anytime from your recruiter dashboard under <strong>Company Details</strong>.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Already registered?{" "}
              <Link href="/login" className="font-extrabold text-[#005d52] hover:underline">
                Sign in to your dashboard →
              </Link>
            </p>
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
