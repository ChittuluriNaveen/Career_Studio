import React from "react";

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8 animate-pulse font-sans">
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
  );
}
