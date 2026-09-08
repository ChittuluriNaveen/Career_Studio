"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Building, MapPin, DollarSign, FileText } from "lucide-react";
import { EmploymentType, WorkMode, JobStatus } from "@prisma/client";
import { updateJobAction } from "@/lib/actions/jobs";
import BulletListEditor from "@/components/editor/BulletListEditor";

interface EditJobFormProps {
  companySlug: string;
  job: any;
}

export default function EditJobForm({ companySlug, job }: EditJobFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: job.title || "",
    departmentName: job.departmentName || job.department?.name || "Engineering",
    employmentType: (job.employmentType || "FULL_TIME") as EmploymentType,
    workMode: (job.workMode || "HYBRID") as WorkMode,
    locationCity: job.locationCity || job.location?.name || "",
    locationCountry: job.locationCountry || "United States",
    salaryMin: job.salaryMin !== null && job.salaryMin !== undefined ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax !== null && job.salaryMax !== undefined ? String(job.salaryMax) : "",
    currency: job.currency || "USD",
    salaryVisible: Boolean(job.salaryVisible),
    summary: job.summary || job.description || "",
    responsibilities: Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? job.responsibilities : [""],
    requirements: Array.isArray(job.requirements) && job.requirements.length > 0 ? job.requirements : [""],
    preferredSkills: Array.isArray(job.preferredSkills) && job.preferredSkills.length > 0 ? job.preferredSkills : [""],
    benefits: Array.isArray(job.benefits) && job.benefits.length > 0 ? job.benefits : [""],
    expiryDate: job.expiryDate ? new Date(job.expiryDate).toISOString().split("T")[0] : "",
    status: (job.status || (job.isPublished ? "ACTIVE" : "DRAFT")) as JobStatus,
  });

  const handleSubmit = async (targetStatus: JobStatus) => {
    setSubmitting(true);
    setError(null);

    const cleanedResponsibilities = formData.responsibilities.filter((r: string) => r.trim().length > 0);
    const cleanedRequirements = formData.requirements.filter((r: string) => r.trim().length > 0);
    const cleanedSkills = formData.preferredSkills.filter((s: string) => s.trim().length > 0);
    const cleanedBenefits = formData.benefits.filter((b: string) => b.trim().length > 0);

    const payload = {
      title: formData.title,
      departmentName: formData.departmentName,
      employmentType: formData.employmentType,
      workMode: formData.workMode,
      locationCity: formData.locationCity,
      locationCountry: formData.locationCountry,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      currency: formData.currency,
      salaryVisible: formData.salaryVisible,
      summary: formData.summary,
      responsibilities: cleanedResponsibilities,
      requirements: cleanedRequirements,
      preferredSkills: cleanedSkills,
      benefits: cleanedBenefits,
      expiryDate: formData.expiryDate || null,
      status: targetStatus,
    };

    const res = await updateJobAction(job.id, payload as any);
    setSubmitting(false);

    if (res.success) {
      router.push(`/company/${companySlug}/jobs`);
    } else {
      setError(res.error || "Failed to update job requisition.");
    }
  };

  return (
    <form className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/company/${companySlug}/jobs`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Job Requisition</h1>
            <p className="text-xs text-slate-500">Update position details, requirements & status</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSubmit(JobStatus.DRAFT)}
            disabled={submitting}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(JobStatus.ACTIVE)}
            disabled={submitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save & Activate</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
          {error}
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <Building className="w-4 h-4" />
          <span>Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.departmentName}
              onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Employment Type *</label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 cursor-pointer"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Work Mode *</label>
            <select
              value={formData.workMode}
              onChange={(e) => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 cursor-pointer"
            >
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
              <option value="ON_SITE">On-Site</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: LOCATION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Location</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.locationCity}
              onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.locationCountry}
              onChange={(e) => setFormData({ ...formData, locationCountry: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPENSATION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <DollarSign className="w-4 h-4" />
          <span>Compensation Range</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Minimum Salary</label>
            <input
              type="number"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Maximum Salary</label>
            <input
              type="number"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Currency Code (3 Letters)</label>
            <input
              type="text"
              maxLength={3}
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="checkbox"
            id="salaryVisible"
            checked={formData.salaryVisible}
            onChange={(e) => setFormData({ ...formData, salaryVisible: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
          />
          <label htmlFor="salaryVisible" className="text-xs font-bold text-slate-800 cursor-pointer">
            Display salary publicly on careers portal
          </label>
        </div>
      </div>

      {/* SECTION 4: CONTENT & BULLET LISTS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Job Content & Requirements</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Summary Overview <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-6 pt-4 border-t border-slate-100">
          <BulletListEditor
            label="Responsibilities"
            required={true}
            items={formData.responsibilities}
            onChange={(items) => setFormData({ ...formData, responsibilities: items })}
          />

          <BulletListEditor
            label="Requirements"
            required={true}
            items={formData.requirements}
            onChange={(items) => setFormData({ ...formData, requirements: items })}
          />

          <BulletListEditor
            label="Preferred Skills"
            items={formData.preferredSkills}
            onChange={(items) => setFormData({ ...formData, preferredSkills: items })}
          />

          <BulletListEditor
            label="Perks & Benefits"
            items={formData.benefits}
            onChange={(items) => setFormData({ ...formData, benefits: items })}
          />
        </div>
      </div>

      {/* SECTION 5: ADMINISTRATIVE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 mb-1">Expiry Date</label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
        />
      </div>
    </form>
  );
}
