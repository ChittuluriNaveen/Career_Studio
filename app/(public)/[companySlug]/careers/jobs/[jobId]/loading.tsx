import React from "react";

export default function JobDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 animate-pulse font-sans">
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="w-32 h-5 rounded-md bg-slate-200" />
        <div className="w-24 h-8 rounded-xl bg-slate-200" />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="w-24 h-5 rounded-md bg-slate-200" />

        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="space-y-3">
            <div className="w-3/4 h-10 rounded-xl bg-slate-200" />
            <div className="flex gap-4 pt-2">
              <div className="w-28 h-6 rounded-full bg-slate-200" />
              <div className="w-28 h-6 rounded-full bg-slate-200" />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4 pt-2">
            <div className="w-full h-4 rounded-md bg-slate-200" />
            <div className="w-5/6 h-4 rounded-md bg-slate-200" />
            <div className="w-4/5 h-4 rounded-md bg-slate-200" />
          </div>

          <div className="pt-6">
            <div className="w-40 h-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    </div>
  );
}
