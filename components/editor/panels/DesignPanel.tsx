"use client";

import { useState } from "react";
import { Palette, Check, Sparkles, Sliders, Upload, Image as ImageIcon } from "lucide-react";
import { updateBrandThemeAction } from "@/lib/actions/brand";
import MediaPickerModal from "@/components/editor/MediaPickerModal";

interface DesignPanelProps {
  company: {
    id: string;
    name: string;
    slug: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    cornerRadius?: number;
    sectionSpacing?: string;
  };
  onCompanyUpdated?: (updated: any) => void;
}

const PRESET_THEMES = [
  { name: "Modern Clinical", primary: "#0d9488", secondary: "#0f172a", font: "Inter", radius: 12 },
  { name: "Royal Tech", primary: "#2563eb", secondary: "#1e293b", font: "Roboto", radius: 16 },
  { name: "Emerald Bio", primary: "#059669", secondary: "#064e3b", font: "Outfit", radius: 20 },
  { name: "Purple Future", primary: "#7c3aed", secondary: "#4c1d95", font: "Poppins", radius: 14 },
  { name: "Slate Minimal", primary: "#475569", secondary: "#0f172a", font: "Geist", radius: 8 },
];

export default function DesignPanel({ company, onCompanyUpdated }: DesignPanelProps) {
  const [formData, setFormData] = useState({
    name: company.name || "",
    primaryColor: company.primaryColor || "#0d9488",
    secondaryColor: company.secondaryColor || "#0f172a",
    fontFamily: (company.fontFamily || "Inter") as "Inter" | "Roboto" | "Outfit" | "Poppins" | "Geist",
    cornerRadius: company.cornerRadius ?? 12,
    sectionSpacing: company.sectionSpacing || "3.5rem",
    logoUrl: company.logoUrl || "",
    bannerUrl: company.bannerUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<"logo" | "banner" | null>(null);

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    const updated = {
      ...formData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      fontFamily: preset.font as any,
      cornerRadius: preset.radius,
    };
    setFormData(updated);
    handleSave(updated);
  };

  const handleSave = async (dataToSave = formData) => {
    setSaving(true);
    const res = await updateBrandThemeAction(dataToSave);
    setSaving(false);
    if (res.success && onCompanyUpdated) {
      onCompanyUpdated(res.company);
    }
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Design & Visual Identity</h2>
        <p className="text-[11px] text-slate-400">Site-wide branding, colors & typography</p>
      </div>

      {/* Theme Presets */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">Theme Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_THEMES.map((p) => {
            const isSelected = formData.primaryColor === p.primary;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-2.5 rounded-xl border text-left space-y-1.5 transition-all ${
                  isSelected ? "bg-teal-50 border-teal-600 ring-2 ring-teal-600/20" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: p.primary }} />
                  <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: p.secondary }} />
                  <span className="text-[9px] font-mono text-slate-400 ml-1">{p.font}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700">Color Palette</label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700">Typography Family</label>
        <select
          value={formData.fontFamily}
          onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value as any })}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold"
        >
          <option value="Inter">Inter (Clean Modern Sans)</option>
          <option value="Roboto">Roboto (Enterprise Formal)</option>
          <option value="Outfit">Outfit (Tech Biotech Sans)</option>
          <option value="Poppins">Poppins (Friendly Geometric)</option>
          <option value="Geist">Geist (Developer Vercel Style)</option>
        </select>
      </div>

      {/* Geometry Sliders */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700">Geometry & Spacing</label>
        
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Corner Radius ({formData.cornerRadius}px)</span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            value={formData.cornerRadius}
            onChange={(e) => setFormData({ ...formData, cornerRadius: parseInt(e.target.value) })}
            className="w-full accent-teal-700 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section Spacing</label>
          <select
            value={formData.sectionSpacing}
            onChange={(e) => setFormData({ ...formData, sectionSpacing: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs"
          >
            <option value="2rem">Compact (32px)</option>
            <option value="3.5rem">Default Comfortable (56px)</option>
            <option value="5rem">Spacious Premium (80px)</option>
          </select>
        </div>
      </div>

      {/* Brand Assets */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700">Brand Assets</label>
        
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-500">Company Logo</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => setActiveMediaTarget("logo")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold whitespace-nowrap"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-500">Hero Banner Image</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.bannerUrl}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => setActiveMediaTarget("banner")}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold whitespace-nowrap"
            >
              Browse
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleSave()}
        disabled={saving}
        className="w-full py-2.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {saving ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <span>Save Design Settings</span>
        )}
      </button>

      <MediaPickerModal
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        onSelectMedia={(url) => {
          if (activeMediaTarget === "logo") setFormData((prev) => ({ ...prev, logoUrl: url }));
          if (activeMediaTarget === "banner") setFormData((prev) => ({ ...prev, bannerUrl: url }));
          setActiveMediaTarget(null);
        }}
      />
    </div>
  );
}
