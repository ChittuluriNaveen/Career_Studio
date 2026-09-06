"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Eye, Monitor, Tablet, Smartphone, Check, Sparkles, GripVertical } from "lucide-react";
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
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeWidth = customWidth ?? (deviceMode === "mobile" ? 390 : deviceMode === "tablet" ? 768 : 1280);
  const activeDeviceMode: "desktop" | "tablet" | "mobile" = activeWidth < 768 ? "mobile" : activeWidth < 1024 ? "tablet" : "desktop";

  const handlePointerDownResize = (e: React.PointerEvent, side: "right" | "left") => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const initialRect = containerRef.current?.getBoundingClientRect();
    const startW = initialRect?.width || activeWidth;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startX;
      // Container is centered, so expanding 1px right adds 2px to overall width
      const change = side === "right" ? deltaX * 2 : -deltaX * 2;
      const newW = Math.max(320, Math.min(1920, Math.round(startW + change)));

      setCustomWidth(newW);
      setDeviceMode(newW < 768 ? "mobile" : newW < 1024 ? "tablet" : "desktop");
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

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
      <header className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 sticky top-0 z-50 flex items-center justify-between gap-3 shadow-2xs overflow-x-auto whitespace-nowrap scrollbar-none">
        {/* Left: Back & Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/company/${company.slug}/design`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Studio</span>
          </Link>
          <span className="text-slate-300 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#005d52] bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-xl whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 text-[#005d52]" />
            <span>Interactive Preview</span>
          </div>
        </div>

        {/* Center: Device Viewport & Custom Width Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCustomWidth(null);
                setDeviceMode("desktop");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                !customWidth && deviceMode === "desktop"
                  ? "bg-[#005d52] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomWidth(768);
                setDeviceMode("tablet");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                customWidth === 768 || (!customWidth && deviceMode === "tablet")
                  ? "bg-[#005d52] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomWidth(390);
                setDeviceMode("mobile");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                customWidth === 390 || (!customWidth && deviceMode === "mobile")
                  ? "bg-[#005d52] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
              }`}
              title="Mobile (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390)</span>
            </button>
          </div>

          {/* Interactive Custom Width Input & Slider */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shrink-0">
            <span className="text-slate-500 text-[11px]">W:</span>
            <input
              type="number"
              min={320}
              max={1920}
              value={activeWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) {
                  setCustomWidth(val);
                  setDeviceMode(val < 768 ? "mobile" : val < 1024 ? "tablet" : "desktop");
                }
              }}
              className="w-14 px-1 py-0.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#005d52]"
            />
            <span className="font-mono text-slate-400 text-[10px]">px</span>

            <input
              type="range"
              min={320}
              max={1440}
              value={activeWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomWidth(val);
                setDeviceMode(val < 768 ? "mobile" : val < 1024 ? "tablet" : "desktop");
              }}
              className="w-20 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#005d52] hidden xl:inline-block"
            />
          </div>
        </div>

        {/* Right: Publish & Public Page Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#005d52] hover:bg-[#004a41] disabled:opacity-50 px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {publishing ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Publish Changes</span>
          </button>

          <a
            href={`/${company.slug}/careers`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all whitespace-nowrap"
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
      <main className="flex-1 bg-slate-200/80 py-8 px-8 flex justify-center items-start overflow-y-auto relative select-none">
        <div
          ref={containerRef}
          className={`transition-all ${isDragging ? "duration-0" : "duration-300"} bg-white rounded-2xl shadow-2xl overflow-visible border border-slate-300 relative my-2 max-w-full`}
          style={
            customWidth
              ? { width: `${customWidth}px` }
              : activeDeviceMode === "mobile"
              ? { width: "390px" }
              : activeDeviceMode === "tablet"
              ? { width: "768px" }
              : { width: "100%", maxWidth: "1280px" }
          }
        >
          {/* Right Drag Handle (Full Height - Drag at any region) */}
          <div
            onPointerDown={(e) => handlePointerDownResize(e, "right")}
            className="absolute -right-3.5 inset-y-0 z-50 w-7 bg-teal-600/20 hover:bg-[#005d52] text-white rounded-r-2xl border-r-4 border-[#005d52] shadow-xl flex flex-col items-center justify-center cursor-ew-resize group transition-all select-none"
            title="Click and drag anywhere along this right edge to adjust preview width"
          >
            <div className="bg-[#005d52] p-1.5 rounded-lg border border-white shadow-md">
              <GripVertical className="w-4 h-4 text-white" />
            </div>
            <span className="absolute top-8 right-0 bg-slate-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              ↔ {Math.round(activeWidth)}px
            </span>
          </div>

          {/* Left Drag Handle (Full Height - Drag at any region) */}
          <div
            onPointerDown={(e) => handlePointerDownResize(e, "left")}
            className="absolute -left-3.5 inset-y-0 z-50 w-7 bg-teal-600/20 hover:bg-[#005d52] text-white rounded-l-2xl border-l-4 border-[#005d52] shadow-xl flex flex-col items-center justify-center cursor-ew-resize group transition-all select-none"
            title="Click and drag anywhere along this left edge to adjust preview width"
          >
            <div className="bg-[#005d52] p-1.5 rounded-lg border border-white shadow-md">
              <GripVertical className="w-4 h-4 text-white" />
            </div>
            <span className="absolute top-8 left-0 bg-slate-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              ↔ {Math.round(activeWidth)}px
            </span>
          </div>

          {/* Inner Scrollable Canvas Wrapper */}
          <div className="overflow-hidden rounded-2xl w-full h-full">
            <CareersPageRenderer
              company={company}
              sections={sections}
              jobs={jobs}
              departments={departments}
              locations={locations}
              isPreviewMode={true}
              deviceMode={activeDeviceMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
