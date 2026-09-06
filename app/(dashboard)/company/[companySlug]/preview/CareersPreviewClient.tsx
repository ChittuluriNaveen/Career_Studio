"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Eye, Monitor, Tablet, Smartphone, Check, Sparkles } from "lucide-react";
import CareersPageRenderer from "@/components/preview/CareersPageRenderer";
import { publishCareersPageAction } from "@/lib/actions/sections";

interface CareersPreviewClientProps {
  company: any;
  sections: any[];
  jobs: any[];
  departments: any[];
  locations: any[];
}

export default function CareersPreviewClient({
  company,
  sections,
  jobs,
  departments,
  locations,
}: CareersPreviewClientProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setToast(null);

    const res = await publishCareersPageAction();
    setPublishing(false);

    if (res.success) {
      setToast({ message: "Careers page published successfully! Changes are live for candidates.", type: "success" });
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast({ message: res.error || "Failed to publish careers page.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Recruiter Preview Top Toolbar */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Back & Status Indicator */}
        <div className="flex items-center gap-3">
          <Link
            href={`/company/${company.slug}/design`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Design Studio</span>
          </Link>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#005d52] bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
            <Eye className="w-3.5 h-3.5 text-[#005d52]" />
            <span>Interactive Website Preview</span>
          </div>
        </div>

        {/* Center: Device Viewport Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-[#005d52] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "tablet"
                ? "bg-[#005d52] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-[#005d52] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Publish & Public Page Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#005d52] hover:bg-[#004a41] disabled:opacity-50 px-4 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {publishing ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Publish Changes</span>
          </button>

          <a
            href={`/${company.slug}/careers`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-300 transition-all"
          >
            <span>Live Candidate Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </header>

      {/* Toast Alert Banner */}
      {toast && (
        <div
          className={`px-4 py-2 text-center text-xs font-bold text-white transition-all flex items-center justify-center gap-2 ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" && <Check className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Real Full-Length Scrollable Website Canvas */}
      <main className="flex-1 bg-slate-200/80 py-8 px-4 sm:px-6 flex justify-center items-start overflow-y-auto">
        <div
          className={`transition-all duration-300 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 relative ${
            deviceMode === "mobile"
              ? "w-[375px] ring-8 ring-slate-400/40 my-4"
              : deviceMode === "tablet"
              ? "w-[768px] ring-8 ring-slate-400/40 my-4"
              : "w-full max-w-7xl my-2"
          }`}
        >
          <CareersPageRenderer
            company={company}
            sections={sections}
            jobs={jobs}
            departments={departments}
            locations={locations}
            isPreviewMode={true}
            deviceMode={deviceMode}
          />
        </div>
      </main>
    </div>
  );
}
