"use client";

import React from "react";
import {
  Sparkles,
  Play,
  Image as ImageIcon,
  Briefcase,
  Layers,
  Heart,
  Grid,
  Type,
  Megaphone,
} from "lucide-react";

interface TemplateVisualPreviewProps {
  templateId: string;
  sectionType: string;
}

export default function TemplateVisualPreview({
  templateId,
  sectionType,
}: TemplateVisualPreviewProps) {
  // Render high-contrast visual thumbnail mockups for every template
  switch (templateId) {
    case "hero-split":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex items-center justify-between gap-2 overflow-hidden relative group-hover:border-[#005d52] transition-colors">
          {/* Left Text Column */}
          <div className="flex-1 space-y-1.5">
            <div className="w-12 h-1.5 rounded-full bg-teal-400/80" />
            <div className="w-24 h-2.5 rounded-full bg-white" />
            <div className="w-20 h-1.5 rounded-full bg-slate-400" />
            <div className="w-10 h-3 rounded-md bg-[#005d52] mt-1" />
          </div>
          {/* Right Image Card */}
          <div className="w-20 h-16 rounded-lg bg-gradient-to-tr from-teal-900 via-indigo-900 to-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-teal-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
        </div>
      );

    case "hero-centered":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex flex-col items-center justify-center space-y-1.5 overflow-hidden relative group-hover:border-[#005d52] transition-colors">
          <div className="w-12 h-1.5 rounded-full bg-teal-400/80" />
          <div className="w-32 h-3 rounded-full bg-white" />
          <div className="w-24 h-1.5 rounded-full bg-slate-400" />
          <div className="w-14 h-3.5 rounded-md bg-[#005d52] flex items-center justify-center text-[8px] font-bold text-white mt-0.5">
            Apply Now
          </div>
        </div>
      );

    case "hero-image-bg":
      return (
        <div className="h-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 rounded-xl p-2.5 border border-slate-700 flex flex-col items-center justify-center space-y-1.5 overflow-hidden relative group-hover:border-[#005d52] transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="w-28 h-3 rounded-full bg-white z-10" />
          <div className="w-20 h-1.5 rounded-full bg-slate-300 z-10" />
          <div className="w-12 h-3 rounded-md bg-teal-500 z-10" />
        </div>
      );

    case "about-image-left":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex items-center gap-2 overflow-hidden group-hover:border-[#005d52] transition-colors">
          <div className="w-18 h-16 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="w-16 h-2 rounded-full bg-white" />
            <div className="w-24 h-1.5 rounded-full bg-slate-400" />
            <div className="w-20 h-1.5 rounded-full bg-slate-500" />
          </div>
        </div>
      );

    case "about-image-right":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex items-center gap-2 overflow-hidden group-hover:border-[#005d52] transition-colors">
          <div className="flex-1 space-y-1.5">
            <div className="w-16 h-2 rounded-full bg-white" />
            <div className="w-24 h-1.5 rounded-full bg-slate-400" />
            <div className="w-20 h-1.5 rounded-full bg-slate-500" />
          </div>
          <div className="w-18 h-16 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      );

    case "about-centered":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex flex-col items-center justify-center space-y-1.5 overflow-hidden group-hover:border-[#005d52] transition-colors">
          <div className="w-20 h-2 rounded-full bg-teal-400" />
          <div className="w-32 h-1.5 rounded-full bg-slate-300" />
          <div className="w-28 h-1.5 rounded-full bg-slate-500" />
        </div>
      );

    case "culture-video-embed":
    case "culture-split-video":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#005d52] transition-colors">
          <div className="w-full h-full bg-gradient-to-tr from-slate-950 to-slate-800 rounded-lg border border-slate-700 flex items-center justify-center relative">
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">2:45</span>
          </div>
        </div>
      );

    case "benefits-grid-cards":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2 border border-slate-700 flex items-center gap-1.5 overflow-hidden group-hover:border-[#005d52] transition-colors">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-18 bg-slate-800 rounded-lg p-1.5 border border-slate-700 flex flex-col justify-between">
              <div className="w-3 h-3 rounded-full bg-teal-400/80" />
              <div className="space-y-1">
                <div className="w-full h-1 rounded-full bg-white" />
                <div className="w-2/3 h-1 rounded-full bg-slate-400" />
              </div>
            </div>
          ))}
        </div>
      );

    case "gallery-grid-3col":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2 border border-slate-700 flex items-center gap-1.5 overflow-hidden group-hover:border-[#005d52] transition-colors">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-18 bg-gradient-to-br from-indigo-900 to-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />
            </div>
          ))}
        </div>
      );

    case "jobs-grid-cards":
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2 border border-slate-700 flex flex-col gap-1.5 justify-center overflow-hidden group-hover:border-[#005d52] transition-colors">
          {[1, 2].map((i) => (
            <div key={i} className="h-7 bg-slate-800 rounded-lg px-2 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-teal-400" />
                <div className="w-16 h-1.5 rounded-full bg-white" />
              </div>
              <div className="w-8 h-2 rounded bg-[#005d52]" />
            </div>
          ))}
        </div>
      );

    case "cta-banner-centered":
      return (
        <div className="h-24 bg-gradient-to-r from-[#005d52] via-teal-900 to-slate-900 rounded-xl p-2.5 border border-teal-500/40 flex flex-col items-center justify-center space-y-1.5 overflow-hidden group-hover:border-teal-400 transition-colors">
          <Megaphone className="w-4 h-4 text-teal-300" />
          <div className="w-24 h-2 rounded-full bg-white" />
          <div className="w-12 h-3.5 bg-white text-[#005d52] rounded-md font-bold text-[8px] flex items-center justify-center">
            Join Us
          </div>
        </div>
      );

    default:
      return (
        <div className="h-24 bg-slate-900 rounded-xl p-2.5 border border-slate-700 flex flex-col items-center justify-center space-y-1.5 overflow-hidden group-hover:border-[#005d52] transition-colors">
          <Type className="w-4 h-4 text-slate-400" />
          <div className="w-24 h-2 rounded-full bg-white" />
          <div className="w-16 h-1.5 rounded-full bg-slate-400" />
        </div>
      );
  }
}
