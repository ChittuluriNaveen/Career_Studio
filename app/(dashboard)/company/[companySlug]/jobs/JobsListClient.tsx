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
  Archive,
  MapPin,
  Building,
  DollarSign,
} from "lucide-react";
import { updateJobStatusAction, deleteJobAction } from "@/lib/actions/jobs";
import { formatDate } from "@/lib/utils";
import { JobStatus } from "@prisma/client";

interface JobsListClientProps {
  companySlug: string;
  initialJobs: any[];
  departments?: any[];
  locations?: any[];
}

export default function JobsListClient({
  companySlug,
  initialJobs,
}: JobsListClientProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "ACTIVE" | "ARCHIVED">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleUpdateStatus = async (jobId: string, newStatus: JobStatus) => {
    setLoadingJobId(jobId);
    const res = await updateJobStatusAction(jobId, newStatus);
    setLoadingJobId(null);
    if (res.success) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus, isPublished: newStatus === "ACTIVE" } : j))
      );
      router.refresh();
    } else {
      alert(res.error || "Failed to update job status");
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
      (job.departmentName && job.departmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.locationCity && job.locationCity.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentStatus = job.status || (job.isPublished ? "ACTIVE" : "DRAFT");
    const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter;
    const matchesType = typeFilter === "ALL" || job.employmentType === typeFilter || job.jobType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg text-white">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight">Job Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your open requisitions, review candidate applications, and control publication on your candidate careers portal.
          </p>
        </div>

        <Link
          href={`/company/${companySlug}/jobs/new`}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title, department, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden lg:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Public</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Employment Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">No jobs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {jobs.length === 0
                ? "You haven't created any job requisitions yet. Click 'Create New Job' above to add your first position."
                : "No jobs match your current search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => {
              const currentStatus = job.status || (job.isPublished ? "ACTIVE" : "DRAFT");
              return (
                <div
                  key={job.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/80 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link
                        href={`/company/${companySlug}/jobs/${job.id}`}
                        className="font-extrabold text-base text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
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

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {job.departmentName || job.department?.name || "General"}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {job.locationCity
                          ? `${job.locationCity}${job.locationCountry ? `, ${job.locationCountry}` : ""}`
                          : job.location?.name || "Remote"}
                      </span>

                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold">
                        {(job.employmentType || job.jobType || "FULL_TIME").replace("_", " ")}
                      </span>

                      {job.salaryVisible && job.salaryMin && job.salaryMax && (
                        <span className="flex items-center gap-1 text-slate-700 font-bold">
                          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency || "USD"}
                          </span>
                        </span>
                      )}

                      <span className="text-slate-400 text-[11px]" suppressHydrationWarning>
                        Posted {formatDate(job.datePosted || job.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Job Card Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/company/${companySlug}/jobs/${job.id}`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      title="View Requisition Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">View</span>
                    </Link>

                    <Link
                      href={`/company/${companySlug}/jobs/${job.id}/edit`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      title="Edit Job"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden md:inline">Edit</span>
                    </Link>

                    {currentStatus !== "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job.id, JobStatus.ACTIVE)}
                        disabled={loadingJobId === job.id}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                        title="Activate Job for Candidate Careers Portal"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Activate</span>
                      </button>
                    )}

                    {currentStatus === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job.id, JobStatus.ARCHIVED)}
                        disabled={loadingJobId === job.id}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Archive Job Position"
                      >
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      disabled={loadingJobId === job.id}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Delete Job Requisition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
