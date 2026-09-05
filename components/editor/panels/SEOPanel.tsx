"use client";

import { useState } from "react";
import { Search, Check, AlertCircle, Globe } from "lucide-react";

interface SEOPanelProps {
  company: {
    name: string;
    slug: string;
    tagline?: string | null;
    aboutText?: string | null;
  };
}

export default function SEOPanel({ company }: SEOPanelProps) {
  const [seoTitle, setSeoTitle] = useState(`Careers at ${company.name} | Join Our Team`);
  const [metaDescription, setMetaDescription] = useState(
    company.tagline || company.aboutText || `Explore open roles and build your career at ${company.name}.`
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">SEO & Metadata</h2>
        <p className="text-[11px] text-slate-400">Search engine optimization & social snippet previews</p>
      </div>

      {/* Google Search Snippet Live Preview */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">Google Search Preview</label>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate">
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>https://{company.slug}.example.com › careers</span>
          </div>
          <h3 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
            {seoTitle || `Careers at ${company.name}`}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {metaDescription}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-600"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">{seoTitle.length} / 60 characters (recommended)</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-600"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">{metaDescription.length} / 160 characters (recommended)</span>
        </div>

        {/* SEO Checklist */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <span className="font-bold text-slate-800 block">SEO Readiness Checklist</span>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>Dynamic title tag configured</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>Meta description present</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>OpenGraph social cards enabled</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>JobPosting JSON-LD schema active</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          {saved ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-white" />
              SEO Settings Saved!
            </span>
          ) : (
            <span>Save SEO Settings</span>
          )}
        </button>
      </form>
    </div>
  );
}
