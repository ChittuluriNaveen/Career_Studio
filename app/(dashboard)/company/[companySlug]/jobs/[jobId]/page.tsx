import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  UserCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

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
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const currentStatus = job.status || (job.isPublished ? "ACTIVE" : "DRAFT");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Navigation & Actions Bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/company/${company.slug}/jobs`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/${company.slug}/careers/jobs/${job.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all"
            >
              <span>Public View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/company/${company.slug}/jobs/${job.id}/edit`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Position</span>
            </Link>
          </div>
        </div>

        {/* Job Detail Specification Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-8 shadow-xs">
          {/* Header */}
          <div className="space-y-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{job.title}</h1>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  currentStatus === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : currentStatus === "ARCHIVED"
                    ? "bg-slate-100 text-slate-600 border-slate-300"
                    : "bg-amber-50 text-amber-700 border-amber-300"
                }`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 flex-wrap">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Building className="w-4 h-4 text-indigo-600" />
                {job.departmentName || "General"}
              </span>

              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {job.locationCity
                  ? `${job.locationCity}${job.locationCountry ? `, ${job.locationCountry}` : ""}`
                  : "Remote"}
              </span>

              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 uppercase font-bold text-slate-800">
                {(job.employmentType || "FULL_TIME").replace("_", " ")}
              </span>

              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 uppercase font-bold text-slate-800">
                {(job.workMode || "HYBRID").replace("_", " ")}
              </span>

              {job.salaryMin && job.salaryMax && (
                <span className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-bold">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency || "USD"}
                  {job.salaryVisible ? " (Public)" : " (Hidden)"}
                </span>
              )}

              <span className="flex items-center gap-1.5 text-slate-500" suppressHydrationWarning>
                <Calendar className="w-4 h-4 text-slate-400" />
                Created {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Summary Overview</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {job.summary || job.description || "No summary provided."}
            </p>
          </div>

          {/* Responsibilities */}
          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Responsibilities</h3>
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                {job.responsibilities.map((resp: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Requirements</h3>
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                {job.requirements.map((req: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Received Applications Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Received Candidate Applications ({job.applications.length})</span>
            </div>

            {job.applications.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500 font-semibold">No applications submitted for this role yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {job.applications.map((app: any) => (
                  <div key={app.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{app.candidateName}</span>
                      <span className="text-[11px] text-slate-400" suppressHydrationWarning>
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-mono">{app.candidateEmail}</p>
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Resume / Profile Link</span>
                      </a>
                    )}
                    {app.coverLetter && (
                      <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
