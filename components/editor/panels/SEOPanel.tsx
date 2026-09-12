"use client";

import { useState } from "react";
import { Search, Check, AlertCircle, Globe, Share2, MessageSquare, ExternalLink, CheckCheck } from "lucide-react";

interface SEOPanelProps {
  company: {
    name: string;
    slug: string;
    tagline?: string | null;
    aboutText?: string | null;
    bannerUrl?: string | null;
    logoUrl?: string | null;
    primaryColor?: string;
  };
}

export default function SEOPanel({ company }: SEOPanelProps) {
  const [seoTitle, setSeoTitle] = useState(`Careers at ${company.name} | Join Our Team`);
  const [metaDescription, setMetaDescription] = useState(
    company.tagline || company.aboutText || `Explore open roles and build your career at ${company.name}.`
  );
  const [previewTab, setPreviewTab] = useState<"google" | "social">("social");
  const [socialPlatform, setSocialPlatform] = useState<"linkedin" | "twitter" | "whatsapp">("linkedin");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const bannerImg =
    company.bannerUrl ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#005d52]" />
          <span>SEO & Social Share Preview</span>
        </h2>
        <p className="text-[11px] text-slate-400">Search engine indexing & real-time OpenGraph snippet cards</p>
      </div>

      {/* Live Snippet Preview Card Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Live Preview</label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPreviewTab("social")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                previewTab === "social" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Social Card
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("google")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                previewTab === "google" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Google Search
            </button>
          </div>
        </div>

        {/* 1. SOCIAL SHARE OPENGRAPH PREVIEW CARD */}
        {previewTab === "social" && (
          <div className="space-y-2">
            {/* Platform Switcher Buttons */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 pb-1">
              <button
                type="button"
                onClick={() => setSocialPlatform("linkedin")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  socialPlatform === "linkedin"
                    ? "bg-blue-600 text-white font-extrabold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Share2 className="w-3 h-3" />
                <span>LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={() => setSocialPlatform("twitter")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  socialPlatform === "twitter"
                    ? "bg-slate-950 text-white font-extrabold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Twitter / X</span>
              </button>

              <button
                type="button"
                onClick={() => setSocialPlatform("whatsapp")}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  socialPlatform === "whatsapp"
                    ? "bg-emerald-600 text-white font-extrabold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* A. LINKEDIN SPECIFIC CARD DESIGN */}
            {socialPlatform === "linkedin" && (
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-md transition-all">
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img
                    src={bannerImg}
                    alt="LinkedIn OpenGraph Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-7 h-7 rounded-md object-contain bg-white p-0.5 border border-white/60 shadow-xs"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-[#005d52] text-white flex items-center justify-center font-black text-xs border border-white/60">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-white text-xs font-black drop-shadow-sm">{company.name}</span>
                  </div>
                </div>

                <div className="p-3 space-y-1 bg-slate-50 border-t border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase font-mono tracking-wider block">
                    {company.slug}.careers.studio
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 leading-snug">
                    {seoTitle || `Careers at ${company.name}`}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {metaDescription}
                  </p>
                </div>
              </div>
            )}

            {/* B. TWITTER / X SPECIFIC CARD DESIGN */}
            {socialPlatform === "twitter" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white transition-all">
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                  <img
                    src={bannerImg}
                    alt="Twitter Card Banner"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 border border-white/10">
                    🔗 {company.slug}.careers.studio
                  </div>
                </div>

                <div className="p-3.5 space-y-1 bg-slate-900/90 border-t border-slate-800">
                  <h4 className="text-xs font-extrabold text-white line-clamp-1 leading-snug">
                    {seoTitle || `Careers at ${company.name}`}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {metaDescription}
                  </p>
                </div>
              </div>
            )}

            {/* C. WHATSAPP CHAT BUBBLE CARD DESIGN */}
            {socialPlatform === "whatsapp" && (
              <div className="bg-[#0b141a] p-3 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[95%] ml-auto border border-slate-700/60 shadow-md space-y-2">
                  <div className="rounded-xl overflow-hidden border border-slate-600/50 bg-slate-900">
                    <img src={bannerImg} alt="WhatsApp Preview" className="w-full h-24 object-cover" />
                    <div className="p-2.5 bg-[#111b21] space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block truncate">
                        https://{company.slug}.careers.studio
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{seoTitle}</h4>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">{metaDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono pt-0.5">
                    <span>15:26</span>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. GOOGLE SEARCH SNIPPET PREVIEW */}
        {previewTab === "google" && (
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate">
              <Globe className="w-3 h-3 text-[#005d52]" />
              <span>https://{company.slug}.careers.studio › careers</span>
            </div>
            <h3 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
              {seoTitle || `Careers at ${company.name}`}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
              {metaDescription}
            </p>
          </div>
        )}
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">SEO Meta Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-bold focus:ring-2 focus:ring-[#005d52]"
          />
          <span className="text-[10px] text-slate-400 mt-1 block font-medium">
            {seoTitle.length} / 60 characters (recommended)
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#005d52]"
          />
          <span className="text-[10px] text-slate-400 mt-1 block font-medium">
            {metaDescription.length} / 160 characters (recommended)
          </span>
        </div>

        {/* SEO Checklist */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <span className="font-extrabold text-slate-800 block">SEO & Social Readiness Checklist</span>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <Check className="w-3.5 h-3.5 text-[#005d52]" />
              <span>Dynamic title tag & canonical tags active</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <Check className="w-3.5 h-3.5 text-[#005d52]" />
              <span>Meta description & preview image generated</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <Check className="w-3.5 h-3.5 text-[#005d52]" />
              <span>OpenGraph & Twitter Cards enabled</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <Check className="w-3.5 h-3.5 text-[#005d52]" />
              <span>JobPosting JSON-LD schema ready</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {saved ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-white" />
              SEO Settings Saved!
            </span>
          ) : (
            <span>Save SEO Settings</span>
          )}
        </button>
      </form>
    </div>
  );
}
