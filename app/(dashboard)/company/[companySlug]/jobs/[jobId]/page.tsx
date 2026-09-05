import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Building, MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{
    companySlug: string;
    jobId: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { companySlug, jobId } = await params;
  const { session, company } = await verifyCompanyAccess(companySlug);

  const job = await db.job.findFirst({
    where: {
      id: jobId,
      companyId: company.id, // Strict tenant isolation check
    },
    include: { department: true, location: true },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/company/${company.slug}/jobs`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          <Link
            href={`/company/${company.slug}/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Position</span>
          </Link>
        </div>

        {/* Job Detail Card */}
        <div className="bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-700 space-y-6 shadow-sm">
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{job.title}</h1>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  job.isPublished
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                    : "bg-amber-950/80 text-amber-300 border-amber-700/60"
                }`}
              >
                {job.isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
              {job.department && (
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <Building className="w-4 h-4 text-indigo-400" />
                  {job.department.name}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {job.location.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60 uppercase font-bold text-indigo-300">
                {job.jobType.replace("_", " ")}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400" suppressHydrationWarning>
                <Calendar className="w-4 h-4 text-slate-500" />
                Created {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
              Job Description & Requirements
            </h3>
            <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700/80 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {job.description || "No description provided."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
