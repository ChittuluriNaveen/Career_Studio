"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Building,
} from "lucide-react";
import { toggleJobPublishAction, deleteJobAction } from "@/lib/actions/jobs";
import { formatDate } from "@/lib/utils";

interface JobsListClientProps {
  companySlug: string;
  initialJobs: any[];
  departments: any[];
  locations: any[];
}

export default function JobsListClient({
  companySlug,
  initialJobs,
  departments,
  locations,
}: JobsListClientProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [locationFilter, setLocationFilter] = useState<string>("ALL");
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleTogglePublish = async (jobId: string, currentStatus: boolean) => {
    setLoadingJobId(jobId);
    const res = await toggleJobPublishAction(jobId, !currentStatus);
    setLoadingJobId(null);
    if (res.success) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isPublished: !currentStatus } : j))
      );
      router.refresh();
    } else {
      alert(res.error || "Failed to update publish status");
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (confirm(`Are you sure you want to delete "${jobTitle}"? This cannot be undone.`)) {
      setLoadingJobId(jobId);
      const res = await deleteJobAction(jobId);
      setLoadingJobId(null);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        router.refresh();
      } else {
        alert(res.error || "Failed to delete job");
      }
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && job.isPublished) ||
      (statusFilter === "DRAFT" && !job.isPublished);

    const matchesType = typeFilter === "ALL" || job.jobType === typeFilter;
    const matchesLocation = locationFilter === "ALL" || job.locationId === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold text-white">Job Postings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your open requisitions, update details, and control publication on your candidate careers portal.
          </p>
        </div>

        <Link
          href={`/company/${companySlug}/jobs/new`}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden lg:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Job Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs List / Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No jobs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {jobs.length === 0
                ? "You haven't posted any jobs yet. Click 'Create New Job' above to add your first job opening."
                : "No jobs match your current search or filter criteria. Try clearing filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-750 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/company/${companySlug}/jobs/${job.id}`}
                      className="font-extrabold text-base text-white hover:text-indigo-400 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        job.isPublished
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                          : "bg-amber-950/80 text-amber-300 border-amber-700/60"
                      }`}
                    >
                      {job.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    {job.department && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {job.department.name}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location.name}
                      </span>
                    )}
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
                      {job.jobType.replace("_", " ")}
                    </span>
                    <span className="text-slate-500 text-[11px]" suppressHydrationWarning>
                      Created {formatDate(job.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Job Card Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/company/${companySlug}/jobs/${job.id}`}
                    className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    title="View Job Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden md:inline">View</span>
                  </Link>

                  <Link
                    href={`/company/${companySlug}/jobs/${job.id}/edit`}
                    className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Edit Job"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden md:inline">Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(job.id, job.isPublished)}
                    disabled={loadingJobId === job.id}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      job.isPublished
                        ? "bg-amber-950/40 border border-amber-800/40 text-amber-300 hover:bg-amber-900/50"
                        : "bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/50"
                    }`}
                    title={job.isPublished ? "Unpublish Job" : "Publish Job"}
                  >
                    {job.isPublished ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="hidden md:inline">
                      {job.isPublished ? "Unpublish" : "Publish"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    disabled={loadingJobId === job.id}
                    className="p-2 bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:bg-rose-900/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
