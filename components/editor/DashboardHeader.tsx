"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Undo2,
  Redo2,
  Check,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";
import PublishModal from "./PublishModal";

interface DashboardHeaderProps {
  company: {
    id: string;
    name: string;
    slug: string;
    primaryColor: string;
  };
  deviceMode: "mobile" | "tablet" | "desktop";
  setDeviceMode: (mode: "mobile" | "tablet" | "desktop") => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  saveStatus?: "saved" | "saving" | "unsaved";
}

export default function DashboardHeader({
  company,
  deviceMode,
  setDeviceMode,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  saveStatus = "saved",
}: DashboardHeaderProps) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4 z-30 shadow-2xs">
        {/* Left Branding & Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center font-black text-white text-xs shadow-xs">
              CS
            </span>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight hidden sm:inline">
              Career Studio
            </span>
          </Link>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-800">{company.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500 font-mono">Careers</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Draft
            </span>
          </div>
        </div>

        {/* Center Device Viewport Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "mobile"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "tablet"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "desktop"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Desktop Canvas (1440px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Right Actions: Undo/Redo, Save status, Preview, Publish */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center gap-1 pr-2 border-r border-slate-200">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg border transition-all ${
                canUndo
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              title="Undo last change (⌘Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg border transition-all ${
                canRedo
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              title="Redo change (⌘⇧Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Save Status */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500 pr-2">
            {saveStatus === "saving" ? (
              <span className="text-teal-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-spin" />
                Saving...
              </span>
            ) : saveStatus === "unsaved" ? (
              <span className="text-amber-600 font-bold">Unsaved changes</span>
            ) : (
              <span className="text-slate-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600" />
                Saved ✓
              </span>
            )}
          </div>

          {/* Preview Trigger */}
          <Link
            href={`/${company.slug}/careers/preview`}
            target="_blank"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            title="Open Live Draft Preview"
          >
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">Preview</span>
          </Link>

          {/* Primary Publish CTA */}
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-1.5 bg-[#005d52] hover:bg-[#004a41] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Publish Deployment Status Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        companySlug={company.slug}
      />
    </>
  );
}
