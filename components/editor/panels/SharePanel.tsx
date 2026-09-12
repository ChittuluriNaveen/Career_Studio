"use client";

import { useState } from "react";
import { Share2, Copy, Check, ExternalLink, QrCode, Globe, Download, Printer, Smartphone } from "lucide-react";

interface SharePanelProps {
  companySlug: string;
}

export default function SharePanel({ companySlug }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${baseUrl}/${companySlug}/careers`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${companySlug}-careers-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(qrCodeUrl, "_blank");
    }
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-[#005d52]" />
          <span>Share Careers Portal</span>
        </h2>
        <p className="text-[11px] text-slate-400">Public candidate access, QR codes & link sharing</p>
      </div>

      {/* Public URL Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Live Careers Portal URL</label>
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-900 break-all font-bold">
            <Globe className="w-4 h-4 text-[#005d52] flex-shrink-0" />
            <span>{publicUrl}</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-800 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#005d52]" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-[#005d52] hover:bg-[#004a41] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
              title="Open public page"
            >
              <span>Visit Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Social Distribution</label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out our open career opportunities: ${publicUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("We are hiring! Explore open roles on our careers page:")}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-center hover:bg-sky-100 transition-colors shadow-2xs"
          >
            Twitter / X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-center hover:bg-blue-100 transition-colors shadow-2xs"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* REAL SCANNABLE QR CODE CARD */}
      <div className="p-4 bg-white border border-slate-300 rounded-2xl text-center space-y-3.5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            <QrCode className="w-4 h-4 text-[#005d52]" />
            <span>Candidate QR Access</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#005d52] border border-teal-200">
            Live Scannable
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block mx-auto shadow-inner">
          <img
            src={qrCodeUrl}
            alt="Candidate Careers Page QR Code"
            className="w-44 h-44 object-contain mx-auto rounded-lg shadow-xs bg-white p-1"
          />
        </div>

        <div>
          <span className="text-xs font-extrabold text-slate-900 block">Scan with Mobile Camera</span>
          <span className="text-[11px] text-slate-500 font-medium block max-w-xs mx-auto">
            Candidates can scan this QR code at hiring events, posters, or flyers to instantly view open roles.
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="flex-1 py-2.5 px-3 bg-[#005d52] hover:bg-[#004a41] text-white font-extrabold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl text-xs transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-600" />
            <span>Test Mobile</span>
          </a>
        </div>
      </div>
    </div>
  );
}
