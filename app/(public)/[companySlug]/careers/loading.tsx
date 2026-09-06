import React from "react";

export default function CareersPortalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 animate-pulse font-sans">
      {/* Header Skeleton */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
          <div className="w-32 h-5 rounded-md bg-slate-200" />
        </div>
        <div className="flex gap-4">
          <div className="w-20 h-4 rounded-md bg-slate-200" />
          <div className="w-20 h-4 rounded-md bg-slate-200" />
        </div>
      </header>

      {/* Hero Skeleton */}
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-24 h-6 rounded-full bg-slate-200 mx-auto" />
          <div className="w-3/4 h-12 rounded-xl bg-slate-200 mx-auto" />
          <div className="w-1/2 h-6 rounded-lg bg-slate-200 mx-auto" />
          <div className="w-40 h-10 rounded-xl bg-slate-200 mx-auto pt-4" />
        </div>

        {/* Culture Gallery Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
        </div>

        {/* Jobs Search & Requisitions Skeleton */}
        <div className="space-y-6 pt-8">
          <div className="w-48 h-8 rounded-lg bg-slate-200" />
          <div className="h-14 rounded-2xl bg-slate-200" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div className="w-48 h-6 rounded-md bg-slate-200" />
                  <div className="w-24 h-6 rounded-full bg-slate-200" />
                </div>
                <div className="flex gap-3">
                  <div className="w-20 h-4 rounded-md bg-slate-200" />
                  <div className="w-24 h-4 rounded-md bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
