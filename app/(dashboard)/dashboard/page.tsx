import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Layers,
  Briefcase,
  Palette,
  ExternalLink,
  Eye,
  Globe,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.companyId) {
    redirect("/login");
  }

  const companyId = session.user.companyId;

  const [company, sectionsCount, jobsCount, careersPage] = await Promise.all([
    db.company.findUnique({ where: { id: companyId } }),
    db.pageSection.count({ where: { companyId } }),
    db.job.count({ where: { companyId, isPublished: true } }),
    db.careersPage.findUnique({ where: { companyId } }),
  ]);

  if (!company) {
    redirect("/login");
  }

  const publicUrl = `/${company.slug}/careers`;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Tenant: {company.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session.user.name || "Recruiter"}!
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Customize your company story, manage active sections, configure brand themes, and publish your branded candidate careers page.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Configured Sections</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{sectionsCount}</div>
          <p className="text-xs text-slate-400">Custom content sections on careers canvas</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Open Roles</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{jobsCount}</div>
          <p className="text-xs text-slate-400">Published job positions searchable by candidates</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Publish Status</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {careersPage?.isPublished ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5" /> Draft Only
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {careersPage?.publishedAt
              ? `Last published: ${new Date(careersPage.publishedAt).toLocaleDateString()}`
              : "Not published to candidates yet"}
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Recruiter Builder Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/editor"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                Section Editor (dnd-kit)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add, remove, and drag-and-drop reorder Hero, About Us, Culture Video, and Perks sections.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Open Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-purple-600/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                Brand Customization
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure primary/secondary brand colors, typography, company logo, banner images, and story text.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Customize Brand</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/jobs"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-3 w-fit rounded-xl bg-emerald-600/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Job Listings Management
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post new roles, assign departments and locations, toggle publish state, and manage candidate listings.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Manage Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Public URL Share Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Public Careers URL for Candidates</h3>
          <p className="text-xs font-mono text-slate-400">{publicUrl}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${company.slug}/careers/preview`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Live Preview</span>
          </Link>

          <Link
            href={publicUrl}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit Public Careers Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
