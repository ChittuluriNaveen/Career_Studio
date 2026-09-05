"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Building, MapPin, DollarSign, FileText } from "lucide-react";
import { EmploymentType, WorkMode, JobStatus } from "@prisma/client";
import { createJobAction } from "@/lib/actions/jobs";
import BulletListEditor from "@/components/editor/BulletListEditor";

interface CreateJobFormProps {
  companySlug: string;
}

export default function CreateJobForm({ companySlug }: CreateJobFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    departmentName: "Engineering",
    employmentType: EmploymentType.FULL_TIME as EmploymentType,
    workMode: WorkMode.HYBRID as WorkMode,
    locationCity: "",
    locationCountry: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    salaryVisible: false,
    summary: "",
    responsibilities: [""],
    requirements: [""],
    preferredSkills: [""],
    benefits: [""],
    expiryDate: "",
    status: JobStatus.DRAFT as JobStatus,
  });

  const handleSubmit = async (targetStatus: JobStatus) => {
    setSubmitting(true);
    setError(null);

    // Filter out empty bullet items
    const cleanedResponsibilities = formData.responsibilities.filter((r) => r.trim().length > 0);
    const cleanedRequirements = formData.requirements.filter((r) => r.trim().length > 0);
    const cleanedSkills = formData.preferredSkills.filter((s) => s.trim().length > 0);
    const cleanedBenefits = formData.benefits.filter((b) => b.trim().length > 0);

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

    const res = await createJobAction(payload as any);
    setSubmitting(false);

    if (res.success) {
      router.push(`/company/${companySlug}/jobs`);
    } else {
      setError(res.error || "Failed to create job requisition.");
    }
  };

  return (
    <form className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/company/${companySlug}/jobs`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Job Requisition</h1>
            <p className="text-xs text-slate-500">Post a new job position to your company careers portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(JobStatus.DRAFT)}
            disabled={submitting}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(JobStatus.ACTIVE)}
            disabled={submitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Activate & Publish</span>
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
              placeholder="e.g. Senior Full Stack Engineer (Next.js)"
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
              placeholder="e.g. Engineering, Product, Marketing"
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
              placeholder="e.g. San Francisco or Remote"
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
              placeholder="e.g. United States or Worldwide"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPENSATION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <DollarSign className="w-4 h-4" />
          <span>Compensation Range (Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Minimum Salary</label>
            <input
              type="number"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              placeholder="e.g. 120000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Maximum Salary</label>
            <input
              type="number"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              placeholder="e.g. 160000"
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
              placeholder="USD, INR, EUR, GBP"
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
            Display salary publicly on careers portal (e.g. $120,000 – $160,000 USD)
          </label>
        </div>
      </div>

      {/* SECTION 4: JOB CONTENT & BULLET LISTS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Job Description & Requirements</span>
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
            placeholder="Provide a 2-3 sentence overview of the role, key objectives, and team mission..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-6 pt-4 border-t border-slate-100">
          <BulletListEditor
            label="Responsibilities"
            required={true}
            items={formData.responsibilities}
            onChange={(items) => setFormData({ ...formData, responsibilities: items })}
            placeholder="e.g. Build and scale Next.js server components..."
          />

          <BulletListEditor
            label="Requirements"
            required={true}
            items={formData.requirements}
            onChange={(items) => setFormData({ ...formData, requirements: items })}
            placeholder="e.g. 5+ years experience with React & TypeScript..."
          />

          <BulletListEditor
            label="Preferred Skills (Optional)"
            items={formData.preferredSkills}
            onChange={(items) => setFormData({ ...formData, preferredSkills: items })}
            placeholder="e.g. Experience with AWS & Docker..."
          />

          <BulletListEditor
            label="Perks & Benefits (Optional)"
            items={formData.benefits}
            onChange={(items) => setFormData({ ...formData, benefits: items })}
            placeholder="e.g. 100% remote work flexibility..."
          />
        </div>
      </div>

      {/* SECTION 5: ADMINISTRATIVE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 mb-1">Expiry Date (Optional)</label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
        />
        <p className="text-[11px] text-slate-400">After this date, the job will automatically close and stop accepting candidate applications.</p>
      </div>
    </form>
  );
}
