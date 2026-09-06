"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  Send,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { submitApplicationAction } from "@/lib/actions/applications";
import { getThemeByCompany } from "@/lib/themes/registry";

interface JobDetailsClientProps {
  companySlug: string;
  job: any;
  sections?: any[];
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  isPreviewMode?: boolean;
  onBackToCareers?: () => void;
  deviceMode?: "desktop" | "tablet" | "mobile";
}

export default function JobDetailsClient({
  companySlug,
  job,
  sections,
  selectedSectionId,
  onSelectSection,
  isPreviewMode = false,
  onBackToCareers,
  deviceMode = "desktop",
}: JobDetailsClientProps) {
  const company = job.company || job.companyOverride || {};
  const theme = getThemeByCompany(company);
  const primaryColor = company.primaryColor || theme.primaryColor;
  const cornerRadius = company.cornerRadius ?? 16;
  const fontFamily = company.fontFamily || theme.fontFamily;
  const isDarkMode = theme.mode === "dark";

  // Section visibility checks
  const heroSec = sections?.find((s) => s.id === "job-sec-hero" || s.type === "HERO");
  const aboutSec = sections?.find((s) => s.id === "job-sec-about" || s.type === "ABOUT_US");
  const respSec = sections?.find((s) => s.id === "job-sec-responsibilities" || (s.title && s.title.includes("Responsibilities")));
  const reqSec = sections?.find((s) => s.id === "job-sec-requirements" || (s.title && s.title.includes("Requirements")));
  const benefitsSec = sections?.find((s) => s.id === "job-sec-benefits" || s.type === "PERKS_BENEFITS");
  const snapshotSec = sections?.find((s) => s.id === "job-sec-snapshot" || (s.title && s.title.includes("Snapshot")));
  const appSec = sections?.find((s) => s.id === "job-sec-application" || s.type === "CTA");

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatSalary = () => {
    if (!job.salaryVisible && job.salaryVisible !== undefined) return null;
    if (!job.salaryMin && !job.salaryMax) return null;
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
    if (isPreviewMode) {
      setSubmitted(true);
      return;
    }
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

  const cardStyle = {
    backgroundColor: theme.cardBg,
    borderColor: theme.cardBorder,
    borderRadius: `${cornerRadius}px`,
    color: theme.textColor,
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: fontFamily.includes(",") ? fontFamily : `${fontFamily}, sans-serif`,
      }}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-xl border-b transition-all ${
          isDarkMode ? "bg-slate-950/80 border-slate-800/80 text-white" : "bg-white/85 border-slate-200 text-slate-900"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {isPreviewMode && onBackToCareers ? (
            <button
              type="button"
              onClick={onBackToCareers}
              className={`flex items-center gap-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                isDarkMode ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Open Roles</span>
            </button>
          ) : (
            <Link
              href={`/${companySlug}/careers`}
              className={`flex items-center gap-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                isDarkMode ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Open Roles</span>
            </Link>
          )}

          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name || "Company"} Logo`}
                className="w-8 h-8 object-cover border border-slate-200/50 rounded-lg shadow-2xs"
              />
            ) : (
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-white text-sm rounded-lg shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                {(company.name || "C").charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-sm">{company.name || "Company Portal"}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`flex-1 w-full mx-auto transition-all ${
          deviceMode === "mobile"
            ? "max-w-[390px] px-3 py-4 space-y-6"
            : deviceMode === "tablet"
            ? "max-w-3xl px-4 py-8 space-y-8"
            : "max-w-5xl px-4 sm:px-6 py-8 md:py-12 space-y-10"
        }`}
      >
        {/* HERO JOB TITLE BANNER (Theme-based Hero Background) */}
        {heroSec?.enabled !== false && (
          <div
            className="p-5 sm:p-8 md:p-10 border shadow-2xl relative overflow-hidden space-y-6 backdrop-blur-md transition-all"
            style={{
              background: theme.heroBg,
              borderColor: theme.cardBorder,
              borderRadius: `${cornerRadius + 4}px`,
            }}
          >
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {job.departmentName || job.department?.name || "General"}
                </span>

                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badgeStyle}`}
                >
                  {(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}
                </span>

                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badgeStyle}`}
                >
                  {(job.workMode || "HYBRID").replace("_", " ")}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {job.title || "Senior Software Engineer"}
              </h1>

              <div
                className="flex items-center gap-3 sm:gap-4 text-xs font-semibold flex-wrap pt-2"
                style={{ color: theme.subtextColor }}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>
                    {job.locationCity
                      ? `${job.locationCity}${job.locationCountry ? `, ${job.locationCountry}` : ""}`
                      : job.location?.name || "Remote"}
                  </span>
                </span>

                {formatSalary() && (
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatSalary()}</span>
                  </span>
                )}

                <span className="flex items-center gap-1.5 opacity-80" suppressHydrationWarning>
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(job.datePosted || job.createdAt || new Date())}</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/30 flex items-center justify-between gap-4 flex-wrap relative z-10">
              <button
                type="button"
                onClick={scrollToApply}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold text-white shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
                <span>{heroSec?.content?.ctaText || "Apply Now for this Role"}</span>
              </button>

              <span className="text-xs font-medium" style={{ color: theme.subtextColor }}>
                Join {company.name || "Our Team"} in {job.locationCity || "Remote"}
              </span>
            </div>
          </div>
        )}

        {/* JOB DETAILS CONTENT GRID */}
        <div
          className={`grid ${
            deviceMode === "mobile"
              ? "grid-cols-1 gap-6"
              : deviceMode === "tablet"
              ? "grid-cols-1 md:grid-cols-3 gap-6"
              : "grid-cols-1 lg:grid-cols-3 gap-8"
          }`}
        >
          {/* Main Column */}
          <div className={`${deviceMode === "mobile" ? "col-span-1" : "lg:col-span-2"} space-y-8`}>
            {/* ABOUT THE ROLE */}
            {aboutSec?.enabled !== false && (
              <section className="space-y-3">
                <h2 className="text-base font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  {aboutSec?.title || "About the Role"}
                </h2>
                <div className="p-5 sm:p-6 border shadow-sm" style={cardStyle}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {job.summary || job.description || "We are seeking a talented professional to join our team and make a high-impact contribution to our company mission."}
                  </p>
                </div>
              </section>
            )}

            {/* RESPONSIBILITIES */}
            {respSec?.enabled !== false && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  {respSec?.title || "Key Responsibilities"}
                </h2>
                <div className="p-5 sm:p-6 border shadow-sm space-y-3" style={cardStyle}>
                  {job.responsibilities.map((resp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* REQUIREMENTS */}
            {reqSec?.enabled !== false && Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  {reqSec?.title || "Qualifications & Requirements"}
                </h2>
                <div className="p-5 sm:p-6 border shadow-sm space-y-3" style={cardStyle}>
                  {job.requirements.map((req: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PREFERRED SKILLS */}
            {Array.isArray(job.preferredSkills) && job.preferredSkills.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  Nice-to-Have Skills
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {job.preferredSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${theme.badgeStyle}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* BENEFITS */}
            {benefitsSec?.enabled !== false && Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                  {benefitsSec?.title || "Perks & Benefits"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="p-4 border flex items-start gap-3 shadow-2xs" style={cardStyle}>
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-bold leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          {snapshotSec?.enabled !== false && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 border shadow-md space-y-4 sticky top-24" style={cardStyle}>
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  {snapshotSec?.title || "Job Snapshot"}
                </h3>

                <div className="space-y-3 text-xs font-medium border-t border-slate-700/30 pt-4">
                  <div className="flex justify-between py-1">
                    <span style={{ color: theme.subtextColor }}>Department</span>
                    <span className="font-bold">{job.departmentName || job.department?.name || "General"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span style={{ color: theme.subtextColor }}>Work Mode</span>
                    <span className="font-bold">{(job.workMode || "HYBRID").replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span style={{ color: theme.subtextColor }}>Employment</span>
                    <span className="font-bold">{(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span style={{ color: theme.subtextColor }}>Location</span>
                    <span className="font-bold">{job.locationCity || "Remote"}</span>
                  </div>
                  {formatSalary() && (
                    <div className="flex justify-between py-1">
                      <span style={{ color: theme.subtextColor }}>Compensation</span>
                      <span className="font-bold text-amber-400">{formatSalary()}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={scrollToApply}
                  className="w-full py-3 rounded-xl text-xs font-extrabold text-white shadow-md text-center transition-transform hover:scale-105 cursor-pointer block"
                  style={{ backgroundColor: primaryColor }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CANDIDATE APPLICATION FORM SECTION */}
        {appSec?.enabled !== false && (
          <section id="apply-form" className="scroll-mt-28">
            <div className="p-6 sm:p-10 border shadow-2xl space-y-6" style={cardStyle}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: primaryColor }}>
                  Application Form
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{appSec?.title || `Apply for ${job.title || "this Position"}`}</h2>
                <p className="text-xs mt-1" style={{ color: theme.subtextColor }}>
                  {appSec?.content?.subtitle || "Submit your details below to start your application process."}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-center space-y-3 animate-in fade-in">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Application Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-200 max-w-md mx-auto">
                    Thank you for applying to {company.name || "our company"}. Our recruiting team will review your application and follow up via email.
                  </p>
                  {isPreviewMode && (
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-cyan-400 underline mt-2 cursor-pointer"
                    >
                      Reset Form (Preview Mode)
                    </button>
                  )}
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
                        className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 border transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.inputBorder,
                          color: theme.textColor,
                        }}
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
                        className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 border transition-colors"
                        style={{
                          backgroundColor: theme.inputBg,
                          borderColor: theme.inputBorder,
                          color: theme.textColor,
                        }}
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
                      className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 border transition-colors"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                        color: theme.textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Cover Letter / Note to Recruiter</label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Share why you are excited about this opportunity..."
                      className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 border transition-colors"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                        color: theme.textColor,
                      }}
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
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-8 px-6 text-center text-xs ${
          isDarkMode ? "border-slate-800/80 text-slate-500" : "border-slate-200 text-slate-400"
        }`}
      >
        <p>© {new Date().getFullYear()} {company.name || "Company"}. All rights reserved.</p>
      </footer>
    </div>
  );
}
