"use client";

import { useState } from "react";
import { X, Check, Globe, Sparkles, ExternalLink } from "lucide-react";
import { publishCareersPageAction } from "@/lib/actions/publish";
import OperationLoader from "@/components/ui/OperationLoader";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  companySlug: string;
  onPublishSuccess?: () => void;
}

export default function PublishModal({ isOpen, onClose, companySlug, onPublishSuccess }: PublishModalProps) {
  const [publishing, setPublishing] = useState(false);
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${baseUrl}/${companySlug}/careers`;

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);

    const res = await publishCareersPageAction();

    setPublishing(false);
    if (res.success) {
      setPublishedAt(new Date());
      if (onPublishSuccess) onPublishSuccess();
    } else {
      setError(res.error || "Failed to publish careers page");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <OperationLoader
        isVisible={publishing}
        title="Publishing Careers Page..."
        subtitle="Promoting draft sections & revalidating candidate portal cache..."
      />
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <h2 className="text-base font-bold text-slate-900">
              {publishedAt ? "Careers Page Published Live!" : "Publish Careers Page"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {publishedAt ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Your latest draft is now live!</h3>
              <p className="text-xs text-slate-500">
                Candidates visiting your careers portal will see your updated sections and brand theme.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
              <span className="truncate text-slate-700">{publicUrl}</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-sans font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                <span>View Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Publishing will promote your latest draft sections to the candidate-facing portal. Unpublished changes will become instantly visible to job applicants.
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Pending Changes Checklist</span>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Section layout & ordering configuration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Custom headline & narrative copy edits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Brand colors & geometry settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Uploaded media assets & galleries</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs text-teal-900 font-medium">
              <span>Target URL:</span>
              <span className="font-mono text-[11px] font-bold text-teal-800">{publicUrl}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
              >
                {publishing ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Confirm & Publish Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
