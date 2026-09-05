"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Send,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { submitApplicationAction } from "@/lib/actions/applications";
import { getThemeByCompany } from "@/lib/themes/registry";

interface JobDetailsClientProps {
  companySlug: string;
  job: any;
}

export default function JobDetailsClient({ companySlug, job }: JobDetailsClientProps) {
  const company = job.company;
  const theme = getThemeByCompany(company);
  const primaryColor = company.primaryColor || theme.primaryColor;
  const isDarkMode = theme.mode === "dark";

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatSalary = () => {
    if (!job.salaryVisible || (!job.salaryMin && !job.salaryMax)) return null;
    const curr = job.currency || "USD";
    const symbol = curr === "INR" ? "₹" : curr === "EUR" ? "€" : curr === "GBP" ? "£" : "$";

    if (job.salaryMin && job.salaryMax) {
      return `${symbol}${Number(job.salaryMin).toLocaleString()} – ${symbol}${Number(job.salaryMax).toLocaleString()} ${curr}`;
    }
    if (job.salaryMin) return `${symbol}${Number(job.salaryMin).toLocaleString()} ${curr}+`;
    return `${symbol}${Number(job.salaryMax).toLocaleString()} ${curr}`;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await submitApplicationAction({
      jobId: job.id,
      companyId: company.id,
      candidateName: applicantName,
      candidateEmail: applicantEmail,
      resumeUrl: resumeUrl || undefined,
      coverLetter: coverLetter || undefined,
    });

    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit application.");
    }
  };

  const scrollToApply = () => {
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-xl border-b transition-all ${
          isDarkMode ? "bg-slate-950/80 border-slate-800 text-white" : "bg-white/85 border-slate-200 text-slate-900"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href={`/${companySlug}/careers`}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
              isDarkMode ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Open Roles</span>
          </Link>

          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} Logo`}
                className="w-8 h-8 object-cover border border-slate-200 rounded-lg"
              />
            ) : (
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-white text-sm rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-sm">{company.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        {/* HERO JOB TITLE BANNER */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border shadow-xl relative overflow-hidden space-y-6 backdrop-blur-md ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                {job.departmentName || job.department?.name || "General"}
              </span>

              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDarkMode ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                {(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}
              </span>

              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDarkMode ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                {(job.workMode || "HYBRID").replace("_", " ")}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {job.title}
            </h1>

            <div className={`flex items-center gap-4 text-xs font-semibold flex-wrap pt-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>
                  {job.locationCity
                    ? `${job.locationCity}${job.locationCountry ? `, ${job.locationCountry}` : ""}`
                    : job.location?.name || "Remote"}
                </span>
              </span>

              {formatSalary() && (
                <span className="flex items-center gap-1.5 font-bold text-amber-500">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary()}</span>
                </span>
              )}

              <span className="flex items-center gap-1.5 opacity-80" suppressHydrationWarning>
                <Calendar className="w-4 h-4" />
                <span>Posted {formatDate(job.datePosted || job.createdAt)}</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={scrollToApply}
              className="px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white shadow-xl transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" />
              <span>Apply Now for this Role</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Join {company.name} in {job.locationCity || "Remote"}
            </span>
          </div>
        </div>

        {/* JOB DETAILS CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* ABOUT THE ROLE */}
            <section className="space-y-3">
              <h2 className="text-lg font-black uppercase tracking-wider text-cyan-400">About the Role</h2>
              <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {job.summary || job.description || "We are seeking a talented professional to join our team and make a high-impact contribution to our company mission."}
                </p>
              </div>
            </section>

            {/* RESPONSIBILITIES */}
            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-wider text-cyan-400">Key Responsibilities</h2>
                <div className={`p-6 rounded-3xl border shadow-sm space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
                  {job.responsibilities.map((resp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* REQUIREMENTS */}
            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-wider text-cyan-400">Qualifications & Requirements</h2>
                <div className={`p-6 rounded-3xl border shadow-sm space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
                  {job.requirements.map((req: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PREFERRED SKILLS */}
            {Array.isArray(job.preferredSkills) && job.preferredSkills.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-wider text-cyan-400">Nice-to-Have Skills</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {job.preferredSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-cyan-300" : "bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* BENEFITS */}
            {Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-wider text-cyan-400">Perks & Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex items-start gap-3 shadow-2xs ${
                        isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-bold leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border shadow-md space-y-4 sticky top-24 ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Job Snapshot</h3>
              
              <div className="space-y-3 text-xs font-medium border-t border-slate-700/40 pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Department</span>
                  <span className="font-bold">{job.departmentName || job.department?.name || "General"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Work Mode</span>
                  <span className="font-bold">{(job.workMode || "HYBRID").replace("_", " ")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Employment</span>
                  <span className="font-bold">{(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Location</span>
                  <span className="font-bold">{job.locationCity || "Remote"}</span>
                </div>
                {formatSalary() && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Compensation</span>
                    <span className="font-bold text-amber-500">{formatSalary()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={scrollToApply}
                className="w-full py-3 rounded-xl text-xs font-extrabold text-white shadow-md text-center transition-transform hover:scale-105 cursor-pointer block"
                style={{ backgroundColor: primaryColor }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* CANDIDATE APPLICATION FORM SECTION */}
        <section id="apply-form" className="scroll-mt-28">
          <div className={`p-8 sm:p-10 rounded-3xl border shadow-2xl space-y-6 ${isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"}`}>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Application Form</span>
              <h2 className="text-2xl font-black tracking-tight">Apply for {job.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Submit your details below to start your application process.</p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-center space-y-3 animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Application Submitted Successfully!</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  Thank you for applying to {company.name}. Our recruiting team will review your application and follow up via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 text-xs font-bold text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 ${
                        isDarkMode ? "bg-slate-950 border border-slate-700 text-white focus:ring-cyan-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:ring-teal-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="jane.doe@example.com"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 ${
                        isDarkMode ? "bg-slate-950 border border-slate-700 text-white focus:ring-cyan-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:ring-teal-500"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Resume / LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/janedoe or https://drive.google.com/..."
                    className={`w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 ${
                      isDarkMode ? "bg-slate-950 border border-slate-700 text-white focus:ring-cyan-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:ring-teal-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Cover Letter / Note to Recruiter</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Share why you are excited about this opportunity..."
                    className={`w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 ${
                      isDarkMode ? "bg-slate-950 border border-slate-700 text-white focus:ring-cyan-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:ring-teal-500"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs font-extrabold text-white shadow-xl transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 text-center text-xs ${isDarkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
