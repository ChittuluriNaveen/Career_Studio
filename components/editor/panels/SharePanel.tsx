"use client";

import { useState } from "react";
import { Share2, Copy, Check, ExternalLink, QrCode, Globe } from "lucide-react";

interface SharePanelProps {
  companySlug: string;
}

export default function SharePanel({ companySlug }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `http://localhost:3000/${companySlug}/careers`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Share Careers Page</h2>
        <p className="text-[11px] text-slate-400">Public distribution & candidate link sharing</p>
      </div>

      {/* Public URL Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">Live Careers URL</label>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-800 break-all">
            <Globe className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span>{publicUrl}</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700">Quick Social Sharing</label>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out open career opportunities: ${publicUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs text-center hover:bg-emerald-100 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("We are hiring!")}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-bold text-xs text-center hover:bg-sky-100 transition-colors"
          >
            X / Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs text-center hover:bg-blue-100 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* QR Code Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-800 block">Candidate QR Access</span>
          <span className="text-[10px] text-slate-500">Scan to open mobile careers site instantly</span>
        </div>
      </div>
    </div>
  );
}
