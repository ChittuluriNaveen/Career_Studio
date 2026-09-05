"use client";

import { useState } from "react";
import { updateBrandThemeAction } from "@/lib/actions/brand";
import { Palette, Type, Image as ImageIcon, Save, Check, Sparkles, Building2 } from "lucide-react";

interface BrandThemeEditorProps {
  initialCompany: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    tagline: string | null;
    aboutText: string | null;
  };
}

const PRESET_PALETTES = [
  { name: "Royal Blue & Dark Slate", primary: "#2563eb", secondary: "#0f172a" },
  { name: "Emerald & Dark Forest", primary: "#059669", secondary: "#064e3b" },
  { name: "Purple Dream & Midnight", primary: "#7c3aed", secondary: "#1e1b4b" },
  { name: "Coral Sunset & Charcoal", primary: "#f97316", secondary: "#18181b" },
  { name: "Modern Teal & Navy", primary: "#0d9488", secondary: "#0f172a" },
];

export default function BrandThemeEditor({ initialCompany }: BrandThemeEditorProps) {
  const [formData, setFormData] = useState({
    name: initialCompany.name || "",
    tagline: initialCompany.tagline || "",
    aboutText: initialCompany.aboutText || "",
    primaryColor: initialCompany.primaryColor || "#2563eb",
    secondaryColor: initialCompany.secondaryColor || "#0f172a",
    fontFamily: (initialCompany.fontFamily || "Inter") as "Inter" | "Roboto" | "Outfit" | "Poppins" | "Geist",
    logoUrl: initialCompany.logoUrl || "",
    bannerUrl: initialCompany.bannerUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await updateBrandThemeAction(formData);

    setSaving(false);
    if (res.success) {
      setMessage({ type: "success", text: "Brand theme saved successfully! Live preview updated." });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update brand theme." });
    }
  };

  const applyPalette = (primary: string, secondary: string) => {
    setFormData((prev) => ({ ...prev, primaryColor: primary, secondaryColor: secondary }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" && <Check className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Live Brand Theme Preview Header */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Live Brand Card Preview</span>
          </div>
          <span className="text-xs font-mono text-slate-500">Font: {formData.fontFamily}</span>
        </div>

        <div
          className="p-6 rounded-2xl transition-all space-y-4 text-white border border-white/10 shadow-xl"
          style={{
            backgroundColor: formData.secondaryColor,
            fontFamily: formData.fontFamily,
          }}
        >
          <div className="flex items-center gap-4">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Logo"
                className="w-12 h-12 rounded-xl object-cover border border-white/20"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg text-white shadow-md"
                style={{ backgroundColor: formData.primaryColor }}
              >
                {formData.name.charAt(0) || "C"}
              </div>
            )}
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">{formData.name || "Company Name"}</h3>
              <p className="text-xs opacity-80">{formData.tagline || "Your company tagline preview"}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: formData.primaryColor }}
            >
              Explore Open Roles
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
              About Our Culture
            </button>
          </div>
        </div>
      </div>

      {/* 1. Identity & Copy */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">Company Identity & Story</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Hero Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Building the future of enterprise cloud automation"
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            About Us Overview Story
          </label>
          <textarea
            rows={4}
            value={formData.aboutText}
            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
            placeholder="Share your company mission, values, funding milestones, and culture with candidates..."
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2. Color Palette Customization */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Brand Color Palette</h2>
          </div>
        </div>

        {/* Curated Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Curated Palettes
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_PALETTES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPalette(preset.primary, preset.secondary)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all text-xs text-slate-300"
              >
                <span>{preset.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Hex Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Brand Color (CTA & Accents)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-12 h-12 rounded-xl bg-transparent border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Secondary / Dark Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-xl bg-transparent border border-slate-800 cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography & Assets */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Type className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Typography & Visual Assets</h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Font Family
          </label>
          <select
            value={formData.fontFamily}
            onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value as any })}
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Inter">Inter (Clean Modern Sans)</option>
            <option value="Roboto">Roboto (Google Standard)</option>
            <option value="Outfit">Outfit (Tech Bold Display)</option>
            <option value="Poppins">Poppins (Friendly Geometric)</option>
            <option value="Geist">Geist (Minimalist Tech)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Logo Image URL
            </label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Banner Image URL
            </label>
            <input
              type="url"
              value={formData.bannerUrl}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Save Toolbar */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          {saving ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Brand Theme</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
