"use client";

import { useState, useMemo } from "react";
import { JobType } from "@prisma/client";
import { Search, MapPin, Building, Filter, X, Briefcase, ChevronRight, CheckCircle, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ThemeConfig } from "@/lib/themes/registry";

interface JobSearchFilterProps {
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    jobType: JobType;
    department?: { name: string } | null;
    location?: { name: string } | null;
    createdAt: Date | string;
  }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; isRemote?: boolean }>;
  primaryColor: string;
  theme?: ThemeConfig;
}

export default function JobSearchFilter({
  jobs,
  departments,
  locations,
  primaryColor,
  theme,
}: JobSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(false);

  const isDarkMode = theme?.mode === "dark";

  // Instant filtering algorithm
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Boolean(job.description) && job.description!.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation =
        selectedLocation === "ALL" || (job.location && job.location.name === selectedLocation);

      const matchesType = selectedType === "ALL" || job.jobType === selectedType;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, selectedLocation, selectedType]);

  const handleApplyClick = () => {
    setAppliedStatus(true);
    setTimeout(() => {
      setAppliedStatus(false);
      setSelectedJob(null);
    }, 2500);
  };

  return (
    <div id="jobs" className="space-y-6 w-full scroll-mt-24">
      {/* Search & Filter Control Bar */}
      <div
        className={`p-5 rounded-3xl shadow-xl space-y-4 border transition-all ${
          isDarkMode
            ? "bg-slate-900/90 text-white border-slate-800 backdrop-blur-md"
            : "bg-white text-slate-900 border-slate-200 shadow-md"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className={`w-5 h-5 absolute left-4 top-3.5 ${isDarkMode ? "text-slate-400" : "text-slate-400"}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search open roles by title, keyword, or skill..."
              aria-label="Search jobs by title or keyword"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white placeholder-slate-400 focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-teal-500"
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Filter */}
          <div className="hidden md:block md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter jobs by location"
              className={`w-full px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-teal-500"
              }`}
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name} className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="hidden md:block md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter jobs by employment type"
              className={`w-full px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-950/80 border border-slate-700 text-white focus:ring-cyan-500"
                  : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-teal-500"
              }`}
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Full Time</option>
              <option value="PART_TIME" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Part Time</option>
              <option value="CONTRACT" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Contract</option>
              <option value="REMOTE" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Remote</option>
              <option value="HYBRID" className={isDarkMode ? "bg-slate-900 text-white" : ""}>Hybrid</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden flex justify-end">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({selectedLocation !== "ALL" || selectedType !== "ALL" ? "Active" : "All"})</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className={`md:hidden pt-3 border-t space-y-3 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
            <div>
              <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs ${
                  isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Job Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs ${
                  isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter Status Summary */}
      <div className={`flex items-center justify-between text-xs font-medium px-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
        <span>
          Showing <strong className={isDarkMode ? "text-white font-bold" : "text-slate-900 font-bold"}>{filteredJobs.length}</strong> of {jobs.length} open roles
        </span>

        {(searchTerm || selectedLocation !== "ALL" || selectedType !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("ALL");
              setSelectedType("ALL");
            }}
            className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
          >
            Clear Filters
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
          <h3 className="text-base font-extrabold">No matching job positions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your location and job type filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => {
                setSelectedJob(job);
                setAppliedStatus(false);
              }}
              className={`group border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
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
                        <span>{job.department?.name || "General"}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{job.location?.name || "Remote"}</span>
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-2xs flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {job.jobType.replace("_", " ")}
                  </span>
                </div>

                <p className={`text-xs line-clamp-3 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {job.description || "We are looking for a skilled teammate to join our high-growth organization."}
                </p>
              </div>

              <div className={`flex items-center justify-between pt-4 border-t text-xs font-medium ${isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-400"}`}>
                <span suppressHydrationWarning>Posted {formatDate(job.createdAt)}</span>
                <span className="font-bold flex items-center gap-1 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                  View Role & Apply <ChevronRight className="w-4 h-4 text-cyan-400" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className={`flex items-start justify-between gap-4 pb-4 border-b ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
              <div>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white inline-block mb-2 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {selectedJob.jobType.replace("_", " ")}
                </span>
                <h2 className="text-2xl font-black tracking-tight">{selectedJob.title}</h2>
                <div className={`flex items-center gap-3 mt-1.5 text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{selectedJob.department?.name || "General"}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{selectedJob.location?.name || "Remote"}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              <h3 className="text-xs font-extrabold uppercase tracking-wider">Role Description & Context</h3>
              <p>{selectedJob.description || "As a member of our team, you will collaborate across engineering, product, and leadership to design and execute high-impact initiatives."}</p>
            </div>

            <div className={`pt-6 border-t flex items-center justify-between gap-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Close
              </button>

              {appliedStatus ? (
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Application Submitted Successfully!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="px-6 py-3 rounded-2xl text-xs font-extrabold text-white shadow-xl transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now for this Role</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
