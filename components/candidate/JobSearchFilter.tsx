"use client";

import { useState, useMemo } from "react";
import { JobType } from "@prisma/client";
import { Search, MapPin, Building, Filter, X, Briefcase, ChevronRight, Check } from "lucide-react";

interface JobSearchFilterProps {
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    jobType: JobType;
    department: { name: string };
    location: { name: string };
    createdAt: Date | string;
  }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; isRemote: boolean }>;
  primaryColor: string;
}

export default function JobSearchFilter({
  jobs,
  departments,
  locations,
  primaryColor,
}: JobSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Client-side instant filtering algorithm
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Location Filter
      const matchesLocation =
        selectedLocation === "ALL" || job.location.name === selectedLocation;

      // 3. Job Type Filter
      const matchesType = selectedType === "ALL" || job.jobType === selectedType;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, selectedLocation, selectedType]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Control Bar */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title or keyword..."
              aria-label="Search jobs by title or keyword"
              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
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
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
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
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME" className="bg-slate-900 text-white">Full Time</option>
              <option value="PART_TIME" className="bg-slate-900 text-white">Part Time</option>
              <option value="CONTRACT" className="bg-slate-900 text-white">Contract</option>
              <option value="REMOTE" className="bg-slate-900 text-white">Remote</option>
              <option value="HYBRID" className="bg-slate-900 text-white">Hybrid</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden flex justify-end">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({selectedLocation !== "ALL" || selectedType !== "ALL" ? "Active" : "All"})</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden pt-3 border-t border-white/10 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
              >
                <option value="ALL">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Job Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
              >
                <option value="ALL">All Job Types</option>
                <option value="FULL_TIME" className="bg-slate-900">Full Time</option>
                <option value="PART_TIME" className="bg-slate-900">Part Time</option>
                <option value="CONTRACT" className="bg-slate-900">Contract</option>
                <option value="REMOTE" className="bg-slate-900">Remote</option>
                <option value="HYBRID" className="bg-slate-900">Hybrid</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter Status Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>
          Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length} open roles
        </span>

        {(searchTerm || selectedLocation !== "ALL" || selectedType !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("ALL");
              setSelectedType("ALL");
            }}
            className="text-xs text-blue-400 hover:underline font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Filtered Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching job positions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your location and job type filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-6 rounded-3xl transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>{job.department?.name}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{job.location?.name}</span>
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {job.jobType.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Details & Apply <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span
                  className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full text-white inline-block mb-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {selectedJob.jobType.replace("_", " ")}
                </span>
                <h2 className="text-2xl font-black text-white">{selectedJob.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>{selectedJob.department?.name}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{selectedJob.location?.name}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role Description & Responsibilities</h3>
              <p>{selectedJob.description}</p>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => alert("Application process simulation: Thank you for demonstrating interest in this role!")}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-xl transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Apply Now for this Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
