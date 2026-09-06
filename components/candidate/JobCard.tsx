"use client";

import Link from "next/link";
import { Briefcase, MapPin, Building2, Clock, ArrowRight, DollarSign, Sparkles } from "lucide-react";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    slug: string;
    departmentName: string;
    employmentType: string;
    workMode: string;
    locationCity: string;
    locationCountry: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: string | null;
    salaryVisible?: boolean | null;
    summary?: string | null;
    createdAt: Date | string;
  };
  companySlug: string;
  cardStyle?: "modern-card" | "compact-list" | "minimal-card" | string;
  primaryColor?: string;
  cornerRadius?: number;
  theme?: any;
  isPreviewMode?: boolean;
  onNavigatePage?: (page: "careers" | "jobs" | "job-details", jobId?: string) => void;
}

export default function JobCard({
  job,
  companySlug,
  cardStyle = "modern-card",
  primaryColor = "#005d52",
  cornerRadius = 16,
  theme,
  isPreviewMode = false,
  onNavigatePage,
}: JobCardProps) {
  const isDarkMode = theme?.mode === "dark";
  const activePrimary = theme?.primaryColor || primaryColor;
  const bgStyle = theme?.cardBg || (isDarkMode ? "rgba(15, 23, 42, 0.85)" : "#ffffff");
  const borderStyle = theme?.cardBorder || (isDarkMode ? "rgba(56, 189, 248, 0.2)" : "#e2e8f0");
  const textColor = theme?.textColor || (isDarkMode ? "#f8fafc" : "#0f172a");
  const subtextColor = theme?.subtextColor || (isDarkMode ? "#94a3b8" : "#64748b");

  const formatEmploymentType = (type: string) => {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatWorkMode = (mode: string) => {
    return mode.replace("_", "-").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const locationText =
    job.locationCity && job.locationCountry && job.locationCity !== "Remote"
      ? `${job.locationCity}, ${job.locationCountry}`
      : job.locationCity || "Remote";

  const showSalary = Boolean(
    job.salaryVisible && (job.salaryMin || job.salaryMax)
  );

  const formattedSalary = showSalary
    ? job.salaryMin && job.salaryMax
      ? `${job.currency || "$"} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
      : `${job.currency || "$"}${ (job.salaryMin || job.salaryMax)?.toLocaleString() }`
    : null;

  const jobUrl = `/${companySlug}/careers/jobs/${job.id}`;

  const handleJobClick = (e: React.MouseEvent) => {
    if (isPreviewMode) {
      e.preventDefault();
      if (onNavigatePage) {
        onNavigatePage("job-details", job.id);
      }
    }
  };

  // 1. COMPACT LIST LAYOUT
  if (cardStyle === "compact-list") {
    return (
      <div
        className="p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs hover:shadow-lg"
        style={{
          backgroundColor: bgStyle,
          borderColor: borderStyle,
          borderRadius: `${cornerRadius}px`,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md border"
              style={{
                backgroundColor: `${activePrimary}18`,
                color: activePrimary,
                borderColor: `${activePrimary}35`,
              }}
            >
              {job.departmentName}
            </span>
            <span className="text-[11px] font-extrabold flex items-center gap-1" style={{ color: subtextColor }}>
              <MapPin className="w-3 h-3" />
              {locationText}
            </span>
            <span className="text-[11px] font-bold" style={{ color: subtextColor }}>· {formatWorkMode(job.workMode)}</span>
          </div>
          <h3 className="font-extrabold text-base transition-colors truncate" style={{ color: textColor }}>
            {isPreviewMode ? (
              <button type="button" onClick={handleJobClick} className="hover:opacity-85 text-left cursor-pointer font-extrabold">
                {job.title}
              </button>
            ) : (
              <Link href={jobUrl} className="hover:opacity-85">
                {job.title}
              </Link>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {showSalary && formattedSalary && (
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/80">
              {formattedSalary}
            </span>
          )}
          {isPreviewMode ? (
            <button
              type="button"
              onClick={handleJobClick}
              className="px-4 py-2 text-white text-xs font-extrabold transition-all flex items-center gap-1 shadow-xs group-hover:translate-x-0.5 cursor-pointer"
              style={{ backgroundColor: activePrimary, borderRadius: `${cornerRadius - 4}px` }}
            >
              <span>View Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={jobUrl}
              className="px-4 py-2 text-white text-xs font-extrabold transition-all flex items-center gap-1 shadow-xs group-hover:translate-x-0.5"
              style={{ backgroundColor: activePrimary, borderRadius: `${cornerRadius - 4}px` }}
            >
              <span>View Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // 2. MINIMAL CARD LAYOUT
  if (cardStyle === "minimal-card") {
    return (
      <div
        className="p-5 transition-all space-y-3 group flex flex-col justify-between shadow-xs hover:shadow-lg"
        style={{
          backgroundColor: bgStyle,
          borderColor: borderStyle,
          borderRadius: `${cornerRadius}px`,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold" style={{ color: subtextColor }}>
            <span>{job.departmentName}</span>
            <span>{formatEmploymentType(job.employmentType)}</span>
          </div>
          <h3 className="font-extrabold text-lg leading-snug transition-colors" style={{ color: textColor }}>
            {isPreviewMode ? (
              <button type="button" onClick={handleJobClick} className="hover:opacity-85 text-left cursor-pointer font-extrabold">
                {job.title}
              </button>
            ) : (
              <Link href={jobUrl} className="hover:opacity-85">
                {job.title}
              </Link>
            )}
          </h3>
          <p className="text-xs font-medium line-clamp-2" style={{ color: subtextColor }}>
            {job.summary || "Join our team to solve challenging technical problems and drive impact."}
          </p>
        </div>

        <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: borderStyle }}>
          <span className="text-xs font-bold flex items-center gap-1" style={{ color: subtextColor }}>
            <MapPin className="w-3.5 h-3.5" style={{ color: activePrimary }} />
            {locationText}
          </span>
          {isPreviewMode ? (
            <button
              type="button"
              onClick={handleJobClick}
              className="text-xs font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
              style={{ color: activePrimary }}
            >
              <span>View Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={jobUrl}
              className="text-xs font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              style={{ color: activePrimary }}
            >
              <span>View Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // 3. MODERN CARD LAYOUT (DEFAULT)
  return (
    <div
      className="p-6 transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden shadow-sm hover:shadow-2xl"
      style={{
        backgroundColor: bgStyle,
        borderColor: borderStyle,
        borderRadius: `${cornerRadius}px`,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className="text-xs font-black uppercase px-3 py-1 rounded-xl border tracking-wide"
            style={{
              backgroundColor: `${activePrimary}18`,
              color: activePrimary,
              borderColor: `${activePrimary}35`,
            }}
          >
            {job.departmentName}
          </span>
          <span
            className="text-xs font-extrabold px-2.5 py-1 rounded-xl border"
            style={{
              backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
              borderColor: borderStyle,
              color: subtextColor,
            }}
          >
            {formatWorkMode(job.workMode)}
          </span>
        </div>

        <div>
          <h3 className="font-black text-xl leading-snug transition-colors" style={{ color: textColor }}>
            {isPreviewMode ? (
              <button type="button" onClick={handleJobClick} className="hover:opacity-85 text-left cursor-pointer font-black">
                {job.title}
              </button>
            ) : (
              <Link href={jobUrl} className="hover:opacity-85">
                {job.title}
              </Link>
            )}
          </h3>
          <p className="text-xs font-medium mt-2 line-clamp-2 leading-relaxed" style={{ color: subtextColor }}>
            {job.summary || "Exciting opportunity to collaborate with industry experts and build next-generation features."}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: borderStyle }}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: subtextColor }}>
            <MapPin className="w-3.5 h-3.5" style={{ color: activePrimary }} />
            <span>{locationText}</span>
          </div>
          {showSalary && formattedSalary && (
            <div className="text-xs font-extrabold font-mono text-emerald-400">
              {formattedSalary}
            </div>
          )}
        </div>

        {isPreviewMode ? (
          <button
            type="button"
            onClick={handleJobClick}
            className="px-4 py-2.5 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group-hover:scale-105"
            style={{ backgroundColor: activePrimary, borderRadius: `${cornerRadius - 4}px` }}
          >
            <span>View Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href={jobUrl}
            className="px-4 py-2.5 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group-hover:scale-105"
            style={{ backgroundColor: activePrimary, borderRadius: `${cornerRadius - 4}px` }}
          >
            <span>View Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
