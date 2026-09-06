import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-[80vh] w-full font-sans">
      {/* Top Progress Line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-[#005d52] animate-pulse" />

      {/* Backdrop Centered Overlay Loader */}
      <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 flex flex-col items-center gap-3 text-center max-w-xs mx-auto animate-in zoom-in-95 duration-150">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#005d52] flex items-center justify-center shadow-inner">
            <Loader2 className="w-6 h-6 animate-spin text-[#005d52]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">Opening Section...</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Fetching recruiter portal page
            </p>
          </div>
        </div>
      </div>

      {/* Background Page Skeleton */}
      <div className="p-8 space-y-8 animate-pulse opacity-40">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-48 h-8 rounded-xl bg-slate-200" />
            <div className="w-64 h-4 rounded-md bg-slate-200" />
          </div>
          <div className="w-36 h-10 rounded-xl bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <div className="w-24 h-4 rounded-md bg-slate-200" />
              <div className="w-16 h-8 rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="h-96 rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="w-40 h-6 rounded-md bg-slate-200" />
          <div className="w-full h-64 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
