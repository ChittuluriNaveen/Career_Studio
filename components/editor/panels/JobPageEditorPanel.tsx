"use client";

import { useState } from "react";
import { Check, Sparkles, Palette, Briefcase, Layout, ShieldCheck } from "lucide-react";
import { THEME_REGISTRY, getThemeByCompany } from "@/lib/themes/registry";
import { updateBrandThemeAction } from "@/lib/actions/brand";

interface JobPageEditorPanelProps {
  company: any;
  job: any;
  onCompanyUpdated: (updated: any) => void;
  onJobUpdated?: (updatedJob: any) => void;
}

export default function JobPageEditorPanel({
  company,
  job,
  onCompanyUpdated,
  onJobUpdated,
}: JobPageEditorPanelProps) {
  const currentTheme = getThemeByCompany(company);

  const [formData, setFormData] = useState({
    name: company?.name || "",
    primaryColor: company?.primaryColor || currentTheme.primaryColor,
    secondaryColor: company?.secondaryColor || currentTheme.id,
    fontFamily: company?.fontFamily || currentTheme.fontFamily,
    cornerRadius: company?.cornerRadius ?? 16,
    sectionSpacing: company?.sectionSpacing || "3.5rem",
    logoUrl: company?.logoUrl || "",
    bannerUrl: company?.bannerUrl || "",
  });

  const [jobData, setJobData] = useState({
    title: job?.title || "Senior Full-Stack Engineer",
    departmentName: job?.departmentName || job?.department?.name || "Engineering & Product",
    locationCity: job?.locationCity || "San Francisco, CA",
    employmentType: job?.employmentType || job?.jobType || "FULL_TIME",
    workMode: job?.workMode || "HYBRID",
    summary: job?.summary || job?.description || "Join our high-performing team to build resilient cloud software.",
  });

  const [saving, setSaving] = useState(false);

  const updateCompanyField = (key: string, value: any) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (onCompanyUpdated) {
      onCompanyUpdated({
        ...company,
        ...updated,
      });
    }
  };

  const updateJobField = (key: string, value: any) => {
    const updated = { ...jobData, [key]: value };
    setJobData(updated);
    if (onJobUpdated) {
      onJobUpdated({
        ...job,
        ...updated,
      });
    }
  };

  const handleSelectTheme = (themeId: string) => {
    const theme = THEME_REGISTRY[themeId];
    if (!theme) return;

    const updated = {
      ...formData,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.id,
      fontFamily: theme.fontFamily,
    };
    setFormData(updated);
    if (onCompanyUpdated) {
      onCompanyUpdated({
        ...company,
        ...updated,
      });
    }
    handleSave(updated);
  };

  const handleSave = async (dataToSave = formData) => {
    setSaving(true);
    const res = await updateBrandThemeAction(dataToSave);
    setSaving(false);
    if (res.success && onCompanyUpdated) {
      onCompanyUpdated(res.company);
    }
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans text-xs">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>Job View Template Editor</span>
          </h2>
          <p className="text-[11px] text-slate-400">Customize elected theme & job detail layout</p>
        </div>
      </div>

      {/* 1. THEME PRESETS SELECTOR */}
      <div className="space-y-3">
        <label className="block font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Elected Portal Theme</span>
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {Object.values(THEME_REGISTRY).map((t) => {
            const isSelected = formData.secondaryColor === t.id || formData.primaryColor === t.primaryColor;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTheme(t.id)}
                className={`p-3 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-50/90 border-teal-600 ring-2 ring-teal-600/30 shadow-2xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border shadow-2xs"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span className="font-extrabold text-slate-900">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        t.mode === "dark" ? "bg-slate-900 text-cyan-300" : "bg-white text-slate-700 border"
                      }`}
                    >
                      {t.mode}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CARD GEOMETRY & STYLING */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <label className="block font-bold text-slate-800 uppercase tracking-wider">
          Card Geometry & Branding
        </label>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Primary Color Accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => updateCompanyField("primaryColor", e.target.value)}
              className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => updateCompanyField("primaryColor", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Card Corner Radius ({formData.cornerRadius}px)</span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            value={formData.cornerRadius}
            onChange={(e) => updateCompanyField("cornerRadius", parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Typography Font</label>
          <select
            value={formData.fontFamily}
            onChange={(e) => updateCompanyField("fontFamily", e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
          >
            <option value="Inter">Inter (Clean Modern Sans)</option>
            <option value="Outfit">Outfit (Tech Bio Biotech)</option>
            <option value="Roboto">Roboto (Enterprise Corporate)</option>
            <option value="Poppins">Poppins (Friendly Geometric)</option>
            <option value="Geist">Geist (Developer Vercel Style)</option>
          </select>
        </div>
      </div>

      {/* 3. SAMPLE JOB CONTENT EDITING */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="block font-bold text-slate-800 uppercase tracking-wider">
          Preview Job Content
        </label>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sample Job Title</label>
          <input
            type="text"
            value={jobData.title}
            onChange={(e) => updateJobField("title", e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department</label>
          <input
            type="text"
            value={jobData.departmentName}
            onChange={(e) => updateJobField("departmentName", e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Employment Type</label>
            <select
              value={jobData.employmentType}
              onChange={(e) => updateJobField("employmentType", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Work Mode</label>
            <select
              value={jobData.workMode}
              onChange={(e) => updateJobField("workMode", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Summary</label>
          <textarea
            rows={3}
            value={jobData.summary}
            onChange={(e) => updateJobField("summary", e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleSave()}
        disabled={saving}
        className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {saving ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Save Job View Template</span>
          </>
        )}
      </button>
    </div>
  );
}
