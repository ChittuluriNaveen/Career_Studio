"use client";

import { useState } from "react";
import {
  Briefcase,
  Layout,
  Sliders,
  Eye,
  ArrowUpDown,
  Check,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";
import { updateJobsExperienceConfigAction } from "@/lib/actions/sections";

interface JobsExperiencePanelProps {
  company: any;
  initialConfig?: {
    heading?: string;
    subheading?: string;
    layout?: string;
    cardStyle?: string;
    visibleFilters?: string[];
    showSalary?: boolean;
    defaultSort?: string;
  };
  onConfigUpdated?: (newConfig: any) => void;
}

export default function JobsExperiencePanel({
  company,
  initialConfig = {},
  onConfigUpdated,
}: JobsExperiencePanelProps) {
  const [config, setConfig] = useState({
    heading: initialConfig.heading || "Find Your Next Role",
    subheading: initialConfig.subheading || `Explore open positions across our global teams.`,
    layout: initialConfig.layout || "sidebar",
    cardStyle: initialConfig.cardStyle || "modern-card",
    visibleFilters: initialConfig.visibleFilters || ["location", "department", "employmentType", "workMode"],
    showSalary: initialConfig.showSalary ?? true,
    defaultSort: initialConfig.defaultSort || "newest",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleFilterDimension = (dim: string) => {
    const current = config.visibleFilters || [];
    const updated = current.includes(dim)
      ? current.filter((f) => f !== dim)
      : [...current, dim];
    const newConfig = { ...config, visibleFilters: updated };
    setConfig(newConfig);
    if (onConfigUpdated) onConfigUpdated(newConfig);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    const res = await updateJobsExperienceConfigAction(config);
    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      if (onConfigUpdated) onConfigUpdated(config);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header Info */}
      <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200/80 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#005d52]">
          <Briefcase className="w-4 h-4 font-black" />
          <span className="font-black text-xs uppercase tracking-wider">Jobs Experience Configuration</span>
        </div>
        <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
          Control how candidates discover, filter, and view open positions on your dedicated jobs marketplace (<code className="font-mono text-[#005d52]">/{company.slug}/careers/jobs</code>).
        </p>
      </div>

      {/* 1. Page Heading & Subtitle */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="font-extrabold text-slate-900">Hero Messaging</span>
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">Jobs Page Heading</label>
          <input
            type="text"
            value={config.heading}
            onChange={(e) => {
              const updated = { ...config, heading: e.target.value };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            placeholder="e.g. Build the Future With Us"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#005d52]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">Jobs Subheading Description</label>
          <textarea
            value={config.subheading}
            onChange={(e) => {
              const updated = { ...config, subheading: e.target.value };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            rows={2}
            placeholder="e.g. Explore open opportunities across engineering, product, and sales."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#005d52]"
          />
        </div>
      </div>

      {/* 2. Page Layout Style */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="font-extrabold text-slate-900">Marketplace Filter Layout</span>
          <Layout className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const updated = { ...config, layout: "sidebar" };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              config.layout === "sidebar"
                ? "bg-white border-[#005d52] ring-2 ring-[#005d52]/20 shadow-xs"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-xs text-slate-900">Sidebar Filters</span>
              {config.layout === "sidebar" && <Check className="w-3.5 h-3.5 text-[#005d52]" />}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Left filter sidebar with right job feed.</p>
          </button>

          <button
            type="button"
            onClick={() => {
              const updated = { ...config, layout: "top" };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              config.layout === "top"
                ? "bg-white border-[#005d52] ring-2 ring-[#005d52]/20 shadow-xs"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-xs text-slate-900">Top Filters Bar</span>
              {config.layout === "top" && <Check className="w-3.5 h-3.5 text-[#005d52]" />}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Horizontal dropdown filter row on top.</p>
          </button>
        </div>
      </div>

      {/* 3. Job Card Design Style */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="font-extrabold text-slate-900">Job Card Presentation Style</span>
          <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <select
          value={config.cardStyle}
          onChange={(e) => {
            const updated = { ...config, cardStyle: e.target.value };
            setConfig(updated);
            if (onConfigUpdated) onConfigUpdated(updated);
          }}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#005d52] cursor-pointer"
        >
          <option value="modern-card">Modern Elevated Cards (2-Column Grid)</option>
          <option value="compact-list">Compact Full-Width List Items</option>
          <option value="minimal-card">Minimal Bordered Cards</option>
        </select>
      </div>

      {/* 4. Filter Dimension Toggles */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="font-extrabold text-slate-900">Visible Filter Dimensions</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="space-y-2">
          {[
            { id: "location", label: "Location Filter (City / Remote)" },
            { id: "department", label: "Department Filter (Engineering, Product...)" },
            { id: "employmentType", label: "Employment Type (Full-time, Part-time...)" },
            { id: "workMode", label: "Work Mode (Remote, Hybrid, On-site)" },
          ].map((dim) => {
            const isChecked = (config.visibleFilters || []).includes(dim.id);
            return (
              <label
                key={dim.id}
                className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-teal-300 transition-colors"
              >
                <span className="font-bold text-xs text-slate-800">{dim.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFilterDimension(dim.id)}
                  className="w-4 h-4 text-[#005d52] rounded border-slate-300 focus:ring-[#005d52] cursor-pointer accent-[#005d52]"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Salary & Sorting Settings */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="font-extrabold text-slate-900">Display & Sorting Rules</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
          <div>
            <span className="font-bold text-xs text-slate-800 block">Show Public Salary Tags</span>
            <span className="text-[10px] text-slate-500 font-medium">Only displays salary if marked visible on the job.</span>
          </div>
          <input
            type="checkbox"
            checked={config.showSalary}
            onChange={(e) => {
              const updated = { ...config, showSalary: e.target.checked };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            className="w-4 h-4 text-[#005d52] rounded border-slate-300 focus:ring-[#005d52] cursor-pointer accent-[#005d52]"
          />
        </label>

        <div>
          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">Default Job Feed Sorting</label>
          <select
            value={config.defaultSort}
            onChange={(e) => {
              const updated = { ...config, defaultSort: e.target.value };
              setConfig(updated);
              if (onConfigUpdated) onConfigUpdated(updated);
            }}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#005d52] cursor-pointer"
          >
            <option value="newest">Newest Posted First</option>
            <option value="oldest">Oldest Posted First</option>
            <option value="alphabetical">Job Title (Alphabetical A-Z)</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-black rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {saving ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : savedSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Jobs Experience Saved!</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Save Jobs Experience Presentation</span>
          </>
        )}
      </button>
    </div>
  );
}
