import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import {
  Briefcase,
  Palette,
  Building2,
  Eye,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await auth();

  if (!session?.user?.companyId) {
    redirect("/login");
  }

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
  });

  if (!company) {
    redirect("/login");
  }

  const [jobs, sections, careersPage] = await Promise.all([
    db.job.findMany({
      where: { companyId: company.id },
      include: { department: true, location: true },
      orderBy: { createdAt: "desc" },
    }),
    db.pageSection.findMany({
      where: { companyId: company.id },
    }),
    db.careersPage.findUnique({
      where: { companyId: company.id },
    }),
  ]);

  const activeJobsCount = jobs.filter((j) => j.isPublished).length;
  const draftJobsCount = jobs.filter((j) => !j.isPublished).length;
  const totalJobsCount = jobs.length;
  const isPagePublished = careersPage?.isPublished ?? false;

  // Calculate Company Profile Completion %
  const fields = [
    company.name,
    company.website,
    company.industry,
    company.companySize,
    company.location,
    company.description,
    company.logoUrl,
    company.bannerUrl,
  ];
  const filledFields = fields.filter((f) => Boolean(f)).length;
  const profileCompletionPercent = Math.round((filledFields / fields.length) * 100);

  const quickLinks = [
    {
      title: "Design Careers Page",
      description: "Customize your responsive section templates, brand elements, images, and layout.",
      href: `/company/${company.slug}/design`,
      icon: Palette,
      badge: isPagePublished ? "Published" : "Draft Mode",
      badgeColor: isPagePublished ? "bg-emerald-950 text-emerald-300 border-emerald-700" : "bg-amber-950 text-amber-300 border-amber-700",
      cta: "Open Designer",
    },
    {
      title: "Manage Job Postings",
      description: "Post new requisitions, edit job specifications, filter by department & status.",
      href: `/company/${company.slug}/jobs`,
      icon: Briefcase,
      badge: `${totalJobsCount} Requisitions`,
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-700",
      cta: "Manage Jobs",
    },
    {
      title: "Company Profile & Details",
      description: "Update company logo, hero cover banner, culture video, website & branding.",
      href: `/company/${company.slug}/details`,
      icon: Building2,
      badge: `${profileCompletionPercent}% Complete`,
      badgeColor: "bg-blue-950 text-blue-300 border-blue-700",
      cta: "Edit Details",
    },
    {
      title: "Preview Saved Configuration",
      description: "Test responsive candidate view of your published and draft section layouts.",
      href: `/company/${company.slug}/preview`,
      icon: Eye,
      badge: "Recruiter Preview",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-700",
      cta: "Launch Preview",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-800 p-6 sm:p-8 rounded-2xl border border-indigo-700/40 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recruiter Portal Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {session.user?.name || "Recruiter"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Managing careers portal and talent acquisition for <strong className="text-white">{company.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/company/${company.slug}/jobs/new`}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>

            <a
              href={`/${company.slug}/careers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Public Page</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
              <p className="text-3xl font-black text-white">{activeJobsCount}</p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live on Careers Portal
              </p>
            </div>
            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/50 text-emerald-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Draft Positions</p>
              <p className="text-3xl font-black text-white">{draftJobsCount}</p>
              <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending Publication
              </p>
            </div>
            <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-800/50 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Careers Page</p>
              <p className="text-2xl font-black text-white">
                {isPagePublished ? "Published" : "Draft Mode"}
              </p>
              <p className="text-[11px] text-indigo-400 font-semibold">
                {sections.length} Active Layout Sections
              </p>
            </div>
            <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/50 text-indigo-400">
              <Palette className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Score</p>
              <p className="text-3xl font-black text-white">{profileCompletionPercent}%</p>
              <div className="w-24 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${profileCompletionPercent}%` }}
                />
              </div>
            </div>
            <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/50 text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Links Action Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Functional Modules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group bg-slate-800 hover:bg-slate-750 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/60 transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-slate-900 rounded-xl text-indigo-400 border border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${link.badgeColor}`}>
                        {link.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 pt-2 border-t border-slate-700/60">
                    <span>{link.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs Preview Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div>
              <h2 className="text-base font-black text-white">Recent Job Requisitions</h2>
              <p className="text-xs text-slate-400">Latest jobs created for your company</p>
            </div>
            <Link
              href={`/company/${company.slug}/jobs`}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              View All Jobs →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No job postings created yet. Click "Post New Job" to get started.
            </div>
          ) : (
            <div className="divide-y divide-slate-700/60">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <Link
                      href={`/company/${company.slug}/jobs/${job.id}`}
                      className="font-bold text-white hover:text-indigo-400 transition-colors text-sm"
                    >
                      {job.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">
                      {job.department?.name || "General"} • {job.location?.name || "Remote"} • {job.jobType.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        job.isPublished
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                          : "bg-amber-950 text-amber-300 border-amber-700"
                      }`}
                    >
                      {job.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                    <Link
                      href={`/company/${company.slug}/jobs/${job.id}`}
                      className="text-slate-400 hover:text-white font-semibold underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
