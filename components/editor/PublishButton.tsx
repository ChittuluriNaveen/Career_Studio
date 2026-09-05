"use client";

import { useState } from "react";
import { publishCareersPageAction } from "@/lib/actions/publish";
import { Globe, Check, Sparkles } from "lucide-react";

export default function PublishButton() {
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishedSuccess(false);

    const res = await publishCareersPageAction();

    setPublishing(false);
    if (res.success) {
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 4000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {publishedSuccess && (
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
          <Check className="w-4 h-4" />
          <span>Published live to candidate URL!</span>
        </span>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={publishing}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
        title="Promote draft sections to live published candidate careers page"
      >
        {publishing ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span>Save & Publish Careers Page</span>
          </>
        )}
      </button>
    </div>
  );
}
