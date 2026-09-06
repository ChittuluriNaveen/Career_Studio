"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Building, Filter, X, Briefcase, ChevronRight, CheckCircle, Send, ExternalLink, DollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ThemeConfig } from "@/lib/themes/registry";

interface JobSearchFilterProps {
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    summary?: string | null;
    description?: string | null;
    departmentName?: string | null;
    employmentType?: any;
    workMode?: any;
    locationCity?: string | null;
    locationCountry?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: string | null;
    salaryVisible?: boolean;
    jobType?: any;
    department?: { name: string } | null;
    location?: { name: string } | null;
    createdAt: Date | string;
    companySlug?: string;
  }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; isRemote?: boolean }>;
  primaryColor: string;
  theme?: ThemeConfig;
  companySlug?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
  isPreviewMode?: boolean;
  onNavigatePage?: (page: "careers" | "jobs" | "job-details", jobId?: string) => void;
}

export default function JobSearchFilter({
  jobs,
  departments,
  locations,
  primaryColor,
  theme,
  companySlug,
  deviceMode = "desktop",
  isPreviewMode = false,
  onNavigatePage,
}: JobSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const isDarkMode = theme?.mode === "dark";
  const isMobileView = deviceMode === "mobile";

  // Instant filtering algorithm with robust substring & case normalization
  const filteredJobs = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    const selectedTypeNorm = selectedType.toUpperCase().replace(/[^A-Z]/g, "_");

    return jobs.filter((job) => {
      const deptName = job.departmentName || job.department?.name || "";
      const locCity = job.locationCity || "";
      const locCountry = job.locationCountry || "";
      const locRelName = job.location?.name || "";
      const locName = locCity ? (locCountry ? `${locCity}, ${locCountry}` : locCity) : locRelName;

      // 1. Search Keyword Match (title, department, location, summary, description)
      const matchesSearch =
        searchLower === "" ||
        job.title.toLowerCase().includes(searchLower) ||
        deptName.toLowerCase().includes(searchLower) ||
        locName.toLowerCase().includes(searchLower) ||
        locCountry.toLowerCase().includes(searchLower) ||
        (job.summary && job.summary.toLowerCase().includes(searchLower)) ||
        (job.description && job.description.toLowerCase().includes(searchLower));

      // 2. Department Match
      const matchesDepartment =
        selectedDepartment === "ALL" ||
        deptName.toLowerCase().includes(selectedDepartment.toLowerCase()) ||
        selectedDepartment.toLowerCase().includes(deptName.toLowerCase());

      // 3. Location Match (bidirectional substring match + city/country fallback)
      const matchesLocation =
        selectedLocation === "ALL" ||
        locName.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        selectedLocation.toLowerCase().includes(locName.toLowerCase()) ||
        (locCity && selectedLocation.toLowerCase().includes(locCity.toLowerCase())) ||
        (locCountry && selectedLocation.toLowerCase().includes(locCountry.toLowerCase()));

      // 4. Employment Type Match (normalized e.g. FULL_TIME vs Full Time)
      const rawType = String(job.employmentType || job.jobType || "").toUpperCase().replace(/[^A-Z]/g, "_");
      const matchesType =
        selectedType === "ALL" ||
        rawType.includes(selectedTypeNorm) ||
        selectedTypeNorm.includes(rawType);

      return matchesSearch && matchesDepartment && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, selectedDepartment, selectedLocation, selectedType]);

  const formatSalary = (job: any) => {
    if (!job.salaryVisible || (!job.salaryMin && !job.salaryMax)) return null;
    const curr = job.currency || "USD";
    const symbol = curr === "INR" ? "₹" : curr === "EUR" ? "€" : curr === "GBP" ? "£" : "$";

    if (job.salaryMin && job.salaryMax) {
      return `${symbol}${Number(job.salaryMin).toLocaleString()} – ${symbol}${Number(job.salaryMax).toLocaleString()} ${curr}`;
    }
    if (job.salaryMin) return `${symbol}${Number(job.salaryMin).toLocaleString()} ${curr}+`;
    return `${symbol}${Number(job.salaryMax).toLocaleString()} ${curr}`;
  };

  const filterRowClass = isMobileView
    ? "grid grid-cols-1 gap-3 items-center"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center";

  const searchColClass = isMobileView ? "w-full relative" : "lg:col-span-3 relative";
  const dropdownColClass = isMobileView ? "block w-full" : "block w-full lg:col-span-3";
  const jobsGridClass = isMobileView
    ? "grid grid-cols-1 gap-4 w-full"
    : deviceMode === "tablet"
    ? "grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full";

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDepartment !== "ALL" ||
    selectedLocation !== "ALL" ||
    selectedType !== "ALL";

  return (
    <div id="jobs" className="space-y-6 w-full scroll-mt-24 font-sans">
      {/* Search & Filter Control Bar */}
      <div
        className="p-5 rounded-3xl shadow-xl space-y-4 border transition-all"
        style={{
          backgroundColor: theme?.cardBg || (isDarkMode ? "rgba(15, 23, 42, 0.85)" : "#ffffff"),
          borderColor: theme?.cardBorder || (isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0"),
          color: theme?.textColor || (isDarkMode ? "#f8fafc" : "#0f172a"),
        }}
      >
        <div className={filterRowClass}>
          {/* Search Input */}
          <div className={searchColClass}>
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 opacity-60" style={{ color: theme?.subtextColor || "#94a3b8" }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search open positions..."
              aria-label="Search jobs by title or keyword"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 border transition-colors"
              style={{
                backgroundColor: theme?.inputBg || (isDarkMode ? "rgba(2, 6, 23, 0.6)" : "#f8fafc"),
                borderColor: theme?.inputBorder || (isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1"),
                color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 opacity-70 hover:opacity-100 cursor-pointer"
                style={{ color: theme?.subtextColor || "#94a3b8" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className={dropdownColClass}>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="Filter jobs by department"
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 border cursor-pointer transition-colors"
              style={{
                backgroundColor: theme?.inputBg || (isDarkMode ? "rgba(2, 6, 23, 0.6)" : "#f8fafc"),
                borderColor: theme?.inputBorder || (isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1"),
                color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
              }}
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept, idx) => {
                const deptId = typeof dept === "string" ? `dept-${idx}` : dept.id;
                const deptName = typeof dept === "string" ? dept : dept.name;
                return (
                  <option key={deptId} value={deptName} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>
                    {deptName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Location Filter */}
          <div className={dropdownColClass}>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter jobs by location"
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 border cursor-pointer transition-colors"
              style={{
                backgroundColor: theme?.inputBg || (isDarkMode ? "rgba(2, 6, 23, 0.6)" : "#f8fafc"),
                borderColor: theme?.inputBorder || (isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1"),
                color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
              }}
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc, idx) => {
                const locId = typeof loc === "string" ? `loc-${idx}` : loc.id;
                const locName = typeof loc === "string" ? loc : loc.name;
                return (
                  <option key={locId} value={locName} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>
                    {locName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Job Type Filter */}
          <div className={dropdownColClass}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter jobs by employment type"
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 border cursor-pointer transition-colors"
              style={{
                backgroundColor: theme?.inputBg || (isDarkMode ? "rgba(2, 6, 23, 0.6)" : "#f8fafc"),
                borderColor: theme?.inputBorder || (isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1"),
                color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
              }}
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>Full Time</option>
              <option value="PART_TIME" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>Part Time</option>
              <option value="CONTRACT" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>Contract</option>
              <option value="INTERNSHIP" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0f172a" }}>Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Status Summary */}
      <div className="flex items-center justify-between text-xs font-medium px-2" style={{ color: theme?.subtextColor || (isDarkMode ? "#94a3b8" : "#475569") }}>
        <span>
          Showing <strong className="font-bold" style={{ color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a") }}>{filteredJobs.length}</strong> of {jobs.length} open roles
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("ALL");
              setSelectedLocation("ALL");
              setSelectedType("ALL");
            }}
            className="text-xs hover:underline font-bold cursor-pointer"
            style={{ color: primaryColor }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filtered Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div
          className="text-center py-16 border rounded-3xl p-8 space-y-3 shadow-sm transition-all"
          style={{
            backgroundColor: theme?.cardBg || (isDarkMode ? "rgba(15, 23, 42, 0.6)" : "#ffffff"),
            borderColor: theme?.cardBorder || (isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0"),
            color: theme?.textColor || (isDarkMode ? "#f8fafc" : "#0f172a"),
          }}
        >
          <Briefcase className="w-10 h-10 mx-auto opacity-80" style={{ color: primaryColor }} />
          <h3 className="text-base font-extrabold">No open positions at this time</h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: theme?.subtextColor || "#94a3b8" }}>
            Try adjusting your search terms or clearing your filters.
          </p>
        </div>
      ) : (
        <div className={jobsGridClass}>
          {filteredJobs.map((job) => {
            const targetCompanySlug = companySlug || job.companySlug || (job as any).company?.slug;
            const jobUrl = targetCompanySlug ? `/${targetCompanySlug}/careers/jobs/${job.id}` : "#";

            const handleCardClick = (e: React.MouseEvent) => {
              if (isPreviewMode) {
                e.preventDefault();
                if (onNavigatePage) {
                  onNavigatePage("job-details", job.id);
                }
              }
            };

            const cardContent = (
              <>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold transition-colors leading-snug group-hover:opacity-90">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-medium" style={{ color: theme?.subtextColor || (isDarkMode ? "#94a3b8" : "#64748b") }}>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 opacity-70" />
                          <span>{job.departmentName || job.department?.name || "General"}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 opacity-70" />
                          <span>
                            {job.locationCity
                              ? `${job.locationCity}${job.locationCountry ? `, ${job.locationCountry}` : ""}`
                              : job.location?.name || "Remote"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-2xs flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: theme?.subtextColor || (isDarkMode ? "#cbd5e1" : "#475569") }}>
                    {job.summary || job.description || "Click to view complete position details, requirements, and candidate application form."}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between pt-4 border-t text-xs font-medium transition-colors"
                  style={{
                    borderColor: theme?.cardBorder || (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#f1f5f9"),
                    color: theme?.subtextColor || (isDarkMode ? "#94a3b8" : "#64748b"),
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span suppressHydrationWarning>Posted {formatDate(job.createdAt)}</span>
                    {formatSalary(job) && (
                      <span className="font-bold flex items-center gap-1" style={{ color: primaryColor }}>
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatSalary(job)}</span>
                      </span>
                    )}
                  </div>
                  <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: primaryColor }}>
                    View Role & Apply <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </>
            );

            if (isPreviewMode) {
              return (
                <div
                  key={job.id}
                  onClick={handleCardClick}
                  className="group border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between block hover:-translate-y-0.5 text-left"
                  style={{
                    backgroundColor: theme?.cardBg || (isDarkMode ? "rgba(15, 23, 42, 0.7)" : "#ffffff"),
                    borderColor: theme?.cardBorder || (isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0"),
                    color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
                  }}
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={job.id}
                href={jobUrl}
                className="group border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between block hover:-translate-y-0.5"
                style={{
                  backgroundColor: theme?.cardBg || (isDarkMode ? "rgba(15, 23, 42, 0.7)" : "#ffffff"),
                  borderColor: theme?.cardBorder || (isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0"),
                  color: theme?.textColor || (isDarkMode ? "#ffffff" : "#0f172a"),
                }}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
