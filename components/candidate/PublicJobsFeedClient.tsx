"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  Filter,
  ArrowUpDown,
  X,
  Briefcase,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Check,
} from "lucide-react";
import JobCard from "./JobCard";
import MobileFilterDrawer from "./MobileFilterDrawer";
import { getThemeByCompany } from "@/lib/themes/registry";

interface PublicJobsFeedClientProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string | null;
    tagline?: string | null;
    cornerRadius?: number | null;
  };
  jobs: Array<{
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
  }>;
  totalCount: number;
  filterDimensions: {
    locations: Array<{ name: string; count: number }>;
    departments: Array<{ name: string; count: number }>;
    employmentTypes: Array<{ name: string; count: number }>;
    workModes: Array<{ name: string; count: number }>;
  };
  jobsExperienceConfig?: {
    heading?: string;
    subheading?: string;
    layout?: "sidebar" | "top" | string;
    cardStyle?: "modern-card" | "compact-list" | "minimal-card" | string;
    visibleFilters?: string[];
    showSalary?: boolean;
    defaultSort?: string;
  };
  isPreviewMode?: boolean;
  onNavigatePage?: (page: "careers" | "jobs" | "job-details") => void;
}

export default function PublicJobsFeedClient({
  company,
  jobs,
  totalCount,
  filterDimensions,
  jobsExperienceConfig = {},
  isPreviewMode = false,
  onNavigatePage,
}: PublicJobsFeedClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const theme = getThemeByCompany(company);
  const primaryColor = company.primaryColor || theme.primaryColor;
  const cornerRadius = company.cornerRadius ?? 16;

  // Filter state synced with URL searchParams
  const currentSearch = searchParams.get("search") || "";
  const currentLocation = searchParams.get("location") || "ALL";
  const currentDepartment = searchParams.get("department") || "ALL";
  const currentEmploymentType = searchParams.get("employmentType") || "ALL";
  const currentWorkMode = searchParams.get("workMode") || "ALL";
  const currentSort = searchParams.get("sort") || jobsExperienceConfig.defaultSort || "newest";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize search input text when URL query changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Helper to update URL searchParams cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL" && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearAllFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const visibleFilters = jobsExperienceConfig.visibleFilters || [
    "location",
    "department",
    "employmentType",
    "workMode",
  ];

  const layoutMode = jobsExperienceConfig.layout || "sidebar";
  const cardStyle = jobsExperienceConfig.cardStyle || "modern-card";
  const headingText = jobsExperienceConfig.heading || "Find Your Next Role";
  const subheadingText =
    jobsExperienceConfig.subheading ||
    `Explore ${totalCount} active career opportunities at ${company.name}.`;

  const activeFiltersCount =
    (currentSearch ? 1 : 0) +
    (currentLocation !== "ALL" ? 1 : 0) +
    (currentDepartment !== "ALL" ? 1 : 0) +
    (currentEmploymentType !== "ALL" ? 1 : 0) +
    (currentWorkMode !== "ALL" ? 1 : 0);

  const formatEnumLabel = (str: string) => {
    return str.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isDarkMode = theme.mode === "dark";
  const fontFamily = company.fontFamily || theme.fontFamily || "Inter, sans-serif";

  return (
    <div
      className="min-h-screen font-sans flex flex-col w-full transition-colors"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: fontFamily.includes(",") ? fontFamily : `${fontFamily}, sans-serif`,
      }}
    >
      {/* 1. PUBLIC HEADER NAVBAR */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-xl border-b transition-all ${
          isDarkMode ? "bg-slate-950/85 border-slate-800/80 text-white" : "bg-white/90 border-slate-200/90 text-slate-900"
        } shadow-2xs`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {isPreviewMode ? (
            <button
              type="button"
              onClick={() => onNavigatePage && onNavigatePage("careers")}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-10 h-10 object-contain rounded-xl shadow-xs"
                />
              ) : (
                <div
                  className="w-10 h-10 flex items-center justify-center font-black text-white text-lg shadow-sm"
                  style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
                >
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <span
                  className="font-black text-base tracking-tight block leading-tight transition-colors group-hover:opacity-80"
                  style={{ color: theme.textColor }}
                >
                  {company.name}
                </span>
                <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Careers Marketplace
                </span>
              </div>
            </button>
          ) : (
            <Link href={`/${company.slug}/careers`} className="flex items-center gap-3 group">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-10 h-10 object-contain rounded-xl shadow-xs"
                />
              ) : (
                <div
                  className="w-10 h-10 flex items-center justify-center font-black text-white text-lg shadow-sm"
                  style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
                >
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <span
                  className="font-black text-base tracking-tight block leading-tight transition-colors group-hover:opacity-80"
                  style={{ color: theme.textColor }}
                >
                  {company.name}
                </span>
                <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Careers Marketplace
                </span>
              </div>
            </Link>
          )}

          <nav className="flex items-center gap-4">
            {isPreviewMode ? (
              <button
                type="button"
                onClick={() => onNavigatePage && onNavigatePage("careers")}
                className={`text-xs font-extrabold transition-colors cursor-pointer ${
                  isDarkMode ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Careers Homepage
              </button>
            ) : (
              <Link
                href={`/${company.slug}/careers`}
                className={`text-xs font-extrabold transition-colors ${
                  isDarkMode ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Careers Homepage
              </Link>
            )}
            {isPreviewMode ? (
              <button
                type="button"
                onClick={() => onNavigatePage && onNavigatePage("jobs")}
                className="text-xs font-black text-white px-3 py-1.5 rounded-xl shadow-2xs transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                All Open Roles ({totalCount})
              </button>
            ) : (
              <Link
                href={`/${company.slug}/careers/jobs`}
                className="text-xs font-black text-white px-3 py-1.5 rounded-xl shadow-2xs transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                All Open Roles ({totalCount})
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* 2. FULL DEVICE WIDTH HERO HEADER BANNER */}
      <section
        className="w-full py-12 sm:py-16 px-4 sm:px-8 relative overflow-hidden border-b shadow-xl transition-colors"
        style={{ background: theme.heroBg, borderColor: theme.cardBorder, color: theme.textColor }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-extrabold tracking-wide uppercase ${theme.badgeStyle}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Hiring Portal</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: theme.textColor }}>
            {headingText}
          </h1>
          <p className="text-sm sm:text-base font-medium max-w-2xl mx-auto" style={{ color: theme.subtextColor }}>
            {subheadingText}
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  updateQueryParam("search", e.target.value);
                }}
                placeholder="Search job titles, keywords, or skills..."
                className="w-full pl-12 pr-10 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 transition-all shadow-lg border"
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.textColor,
                  borderRadius: `${cornerRadius}px`,
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQueryParam("search", "");
                  }}
                  className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN MARKETPLACE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full space-y-6">
        {/* Controls Toolbar: Mobile filter button, sort dropdown, result counts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.cardBorder }}>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-black" style={{ color: theme.textColor }}>
              Open Positions ({jobs.length})
            </h2>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden px-4 py-2 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-extrabold hidden sm:inline" style={{ color: theme.subtextColor }}>Sort By:</label>
              <select
                value={currentSort}
                onChange={(e) => updateQueryParam("sort", e.target.value)}
                className="px-3 py-2 border rounded-xl text-xs font-extrabold cursor-pointer shadow-2xs"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  color: theme.textColor,
                }}
              >
                <option value="newest" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" }}>Newest First</option>
                <option value="oldest" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" }}>Oldest First</option>
                <option value="alphabetical" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" }}>Job Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. LAYOUT GRID (SIDEBAR vs TOP FILTERS) */}
        <div className={`grid gap-8 ${layoutMode === "sidebar" ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1"}`}>
          {/* DESKTOP SIDEBAR FILTERS */}
          {layoutMode === "sidebar" && (
            <aside
              className="hidden md:block space-y-6 p-5 border shadow-2xs self-start"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                borderRadius: `${cornerRadius}px`,
                color: theme.textColor,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
                <span className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.textColor }}>
                  <Filter className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  <span>Refine Positions</span>
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Location Filter */}
              {visibleFilters.includes("location") && filterDimensions.locations.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-black" style={{ color: theme.textColor }}>Location</label>
                  <select
                    value={currentLocation}
                    onChange={(e) => updateQueryParam("location", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textColor,
                    }}
                  >
                    <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Locations ({totalCount})</option>
                    {filterDimensions.locations.map((loc, idx) => (
                      <option key={`loc-${loc.name}-${idx}`} value={loc.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                        {loc.name} ({loc.count})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department Filter */}
              {visibleFilters.includes("department") && filterDimensions.departments.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-black" style={{ color: theme.textColor }}>Department</label>
                  <select
                    value={currentDepartment}
                    onChange={(e) => updateQueryParam("department", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textColor,
                    }}
                  >
                    <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Departments ({totalCount})</option>
                    {filterDimensions.departments.map((dept, idx) => (
                      <option key={`dept-${dept.name}-${idx}`} value={dept.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                        {dept.name} ({dept.count})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Employment Type Filter */}
              {visibleFilters.includes("employmentType") && filterDimensions.employmentTypes.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-black" style={{ color: theme.textColor }}>Employment Type</label>
                  <select
                    value={currentEmploymentType}
                    onChange={(e) => updateQueryParam("employmentType", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textColor,
                    }}
                  >
                    <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Types ({totalCount})</option>
                    {filterDimensions.employmentTypes.map((emp, idx) => (
                      <option key={`emp-${emp.name}-${idx}`} value={emp.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                        {formatEnumLabel(emp.name)} ({emp.count})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Work Mode Filter */}
              {visibleFilters.includes("workMode") && filterDimensions.workModes.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-black" style={{ color: theme.textColor }}>Work Mode</label>
                  <select
                    value={currentWorkMode}
                    onChange={(e) => updateQueryParam("workMode", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textColor,
                    }}
                  >
                    <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Work Modes ({totalCount})</option>
                    {filterDimensions.workModes.map((wm, idx) => (
                      <option key={`wm-${wm.name}-${idx}`} value={wm.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                        {formatEnumLabel(wm.name)} ({wm.count})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </aside>
          )}

          {/* DESKTOP TOP HORIZONTAL FILTERS */}
          {layoutMode === "top" && (
            <div
              className="hidden md:flex flex-wrap items-center gap-3 p-4 rounded-2xl border shadow-2xs"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                color: theme.textColor,
              }}
            >
              {visibleFilters.includes("location") && filterDimensions.locations.length > 0 && (
                <select
                  value={currentLocation}
                  onChange={(e) => updateQueryParam("location", e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                  style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textColor,
                  }}
                >
                  <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>Location: All ({totalCount})</option>
                  {filterDimensions.locations.map((loc, idx) => (
                    <option key={`top-loc-${loc.name}-${idx}`} value={loc.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                      {loc.name} ({loc.count})
                    </option>
                  ))}
                </select>
              )}

              {visibleFilters.includes("department") && filterDimensions.departments.length > 0 && (
                <select
                  value={currentDepartment}
                  onChange={(e) => updateQueryParam("department", e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                  style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textColor,
                  }}
                >
                  <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>Department: All ({totalCount})</option>
                  {filterDimensions.departments.map((dept, idx) => (
                    <option key={`top-dept-${dept.name}-${idx}`} value={dept.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                      {dept.name} ({dept.count})
                    </option>
                  ))}
                </select>
              )}

              {visibleFilters.includes("workMode") && filterDimensions.workModes.length > 0 && (
                <select
                  value={currentWorkMode}
                  onChange={(e) => updateQueryParam("workMode", e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                  style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textColor,
                  }}
                >
                  <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>Work Mode: All ({totalCount})</option>
                  {filterDimensions.workModes.map((wm, idx) => (
                    <option key={`top-wm-${wm.name}-${idx}`} value={wm.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                      {formatEnumLabel(wm.name)} ({wm.count})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 5. JOB CARDS FEED LIST */}
          <div className={layoutMode === "sidebar" ? "md:col-span-3" : "w-full"}>
            {jobs.length === 0 ? (
              <div
                className="p-12 rounded-3xl border text-center space-y-4 shadow-2xs"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  color: theme.textColor,
                }}
              >
                <div className="w-12 h-12 bg-teal-50 text-[#005d52] rounded-2xl flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black" style={{ color: theme.textColor }}>No Positions Found</h3>
                  <p className="text-xs max-w-sm mx-auto font-medium" style={{ color: theme.subtextColor || "#94a3b8" }}>
                    No open positions match your current search and filter criteria. Try clearing or broadening your filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-4 py-2 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  cardStyle === "compact-list"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                }`}
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    companySlug={company.slug}
                    cardStyle={cardStyle}
                    primaryColor={primaryColor}
                    cornerRadius={cornerRadius}
                    theme={theme}
                    isPreviewMode={isPreviewMode}
                    onNavigatePage={onNavigatePage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 6. MOBILE FILTER DRAWER */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        onApply={() => setMobileFilterOpen(false)}
        onClear={handleClearAllFilters}
      >
        {visibleFilters.includes("location") && filterDimensions.locations.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-black" style={{ color: theme.textColor }}>Location</label>
            <select
              value={currentLocation}
              onChange={(e) => updateQueryParam("location", e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textColor,
              }}
            >
              <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Locations ({totalCount})</option>
              {filterDimensions.locations.map((loc, idx) => (
                <option key={`mob-loc-${loc.name}-${idx}`} value={loc.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                  {loc.name} ({loc.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {visibleFilters.includes("department") && filterDimensions.departments.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-black" style={{ color: theme.textColor }}>Department</label>
            <select
              value={currentDepartment}
              onChange={(e) => updateQueryParam("department", e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textColor,
              }}
            >
              <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Departments ({totalCount})</option>
              {filterDimensions.departments.map((dept, idx) => (
                <option key={`mob-dept-${dept.name}-${idx}`} value={dept.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                  {dept.name} ({dept.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {visibleFilters.includes("employmentType") && filterDimensions.employmentTypes.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-black" style={{ color: theme.textColor }}>Employment Type</label>
            <select
              value={currentEmploymentType}
              onChange={(e) => updateQueryParam("employmentType", e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textColor,
              }}
            >
              <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Types ({totalCount})</option>
              {filterDimensions.employmentTypes.map((emp, idx) => (
                <option key={`mob-emp-${emp.name}-${idx}`} value={emp.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                  {formatEnumLabel(emp.name)} ({emp.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {visibleFilters.includes("workMode") && filterDimensions.workModes.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-black" style={{ color: theme.textColor }}>Work Mode</label>
            <select
              value={currentWorkMode}
              onChange={(e) => updateQueryParam("workMode", e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textColor,
              }}
            >
              <option value="ALL" style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>All Work Modes ({totalCount})</option>
              {filterDimensions.workModes.map((wm, idx) => (
                <option key={`mob-wm-${wm.name}-${idx}`} value={wm.name} style={{ backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", color: theme.textColor }}>
                  {formatEnumLabel(wm.name)} ({wm.count})
                </option>
              ))}
            </select>
          </div>
        )}
      </MobileFilterDrawer>
    </div>
  );
}
