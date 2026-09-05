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
}

export default function JobSearchFilter({
  jobs,
  departments,
  locations,
  primaryColor,
  theme,
  companySlug,
  deviceMode = "desktop",
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
    : "grid grid-cols-1 md:grid-cols-2 gap-5 w-full";

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDepartment !== "ALL" ||
    selectedLocation !== "ALL" ||
    selectedType !== "ALL";

  return (
    <div id="jobs" className="space-y-6 w-full scroll-mt-24 font-sans">
      {/* Search & Filter Control Bar */}
      <div
        className={`p-5 rounded-3xl shadow-xl space-y-4 border transition-all ${
          isDarkMode
            ? "bg-slate-900/90 text-white border-slate-800 backdrop-blur-md"
            : "bg-white text-slate-900 border-slate-200 shadow-md"
        }`}
      >
        <div className={filterRowClass}>
          {/* Search Input */}
          <div className={searchColClass}>
            <Search className={`w-4 h-4 absolute left-3.5 top-3.5 ${isDarkMode ? "text-slate-400" : "text-slate-400"}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search open positions..."
              aria-label="Search jobs by title or keyword"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-teal-500"
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
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
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-teal-500"
              }`}
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept, idx) => {
                const deptId = typeof dept === "string" ? `dept-${idx}` : dept.id;
                const deptName = typeof dept === "string" ? dept : dept.name;
                return (
                  <option key={deptId} value={deptName} className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
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
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-teal-500"
              }`}
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc, idx) => {
                const locId = typeof loc === "string" ? `loc-${idx}` : loc.id;
                const locName = typeof loc === "string" ? loc : loc.name;
                return (
                  <option key={locId} value={locName} className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
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
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-teal-500"
              }`}
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Full Time</option>
              <option value="PART_TIME" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Part Time</option>
              <option value="CONTRACT" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Contract</option>
              <option value="INTERNSHIP" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Status Summary */}
      <div className={`flex items-center justify-between text-xs font-medium px-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
        <span>
          Showing <strong className={isDarkMode ? "text-white font-bold" : "text-slate-900 font-bold"}>{filteredJobs.length}</strong> of {jobs.length} open roles
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
            className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filtered Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div
          className={`text-center py-16 border rounded-3xl p-8 space-y-3 shadow-sm ${
            isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <Briefcase className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-base font-extrabold">No open positions at this time</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your filters.
          </p>
        </div>
      ) : (
        <div className={jobsGridClass}>
          {filteredJobs.map((job) => {
            const targetCompanySlug = companySlug || job.companySlug || (job as any).company?.slug;
            const jobUrl = targetCompanySlug ? `/${targetCompanySlug}/careers/jobs/${job.id}` : "#";

            return (
              <Link
                key={job.id}
                href={jobUrl}
                className={`group border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between block ${
                  isDarkMode
                    ? "bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-white"
                    : "bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 text-slate-900"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold group-hover:text-cyan-400 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      <div className={`flex items-center gap-2 mt-1.5 text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.departmentName || job.department?.name || "General"}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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

                  <p className={`text-xs line-clamp-3 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {job.summary || job.description || "Click to view complete position details, requirements, and candidate application form."}
                  </p>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t text-xs font-medium ${isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-400"}`}>
                  <div className="flex items-center gap-3">
                    <span suppressHydrationWarning>Posted {formatDate(job.createdAt)}</span>
                    {formatSalary(job) && (
                      <span className="font-bold text-amber-500 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatSalary(job)}</span>
                      </span>
                    )}
                  </div>
                  <span className="font-bold flex items-center gap-1 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                    View Role & Apply <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
