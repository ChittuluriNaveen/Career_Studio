"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { updateJobAction } from "@/lib/actions/jobs";

interface EditJobFormProps {
  companySlug: string;
  job: any;
  departments: any[];
  locations: any[];
}

export default function EditJobForm({
  companySlug,
  job,
  departments,
  locations,
}: EditJobFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(job.title || "");
  const [jobType, setJobType] = useState(job.jobType || "FULL_TIME");
  const [departmentId, setDepartmentId] = useState(job.departmentId || "");
  const [locationId, setLocationId] = useState(job.locationId || "");
  const [isPublished, setIsPublished] = useState(job.isPublished ?? true);
  const [description, setDescription] = useState(job.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Job title is required");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await updateJobAction(job.id, {
      title: title.trim(),
      description: description.trim(),
      jobType: jobType as any,
      departmentId: departmentId || undefined,
      locationId: locationId || undefined,
      isPublished,
    });

    setLoading(false);

    if (res.success) {
      router.push(`/company/${companySlug}/jobs/${job.id}`);
      router.refresh();
    } else {
      setError(res.error || "Failed to update job");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/company/${companySlug}/jobs/${job.id}`}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Edit Position: {job.title}</h1>
            <p className="text-xs text-slate-400">Update position information and publication state</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-700 space-y-6">
        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-lg text-xs font-bold text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              Job Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          {/* Job Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Select Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">Location</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Select Location...</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Toggle */}
          <div className="space-y-1.5 flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Position is published and visible candidates</span>
            </label>
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              Job Description & Requirements
            </label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
          <Link
            href={`/company/${companySlug}/jobs/${job.id}`}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
