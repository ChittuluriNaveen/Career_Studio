"use client";

import { useState } from "react";
import { Check, Sparkles, Sliders, Upload, Palette, Eye, Layout } from "lucide-react";
import { updateBrandThemeAction } from "@/lib/actions/brand";
import MediaPickerModal from "@/components/editor/MediaPickerModal";
import { THEME_REGISTRY, getThemeByCompany } from "@/lib/themes/registry";

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
  onUpdate?: () => void;
}

export default function DesignPanel({ company, onCompanyUpdated, onUpdate }: DesignPanelProps) {
  const currentTheme = getThemeByCompany(company);

  const [formData, setFormData] = useState({
    name: company.name || "",
    primaryColor: company.primaryColor || currentTheme.primaryColor,
    secondaryColor: company.secondaryColor || currentTheme.id,
    fontFamily: (company.fontFamily || currentTheme.fontFamily) as any,
    cornerRadius: company.cornerRadius ?? 16,
    sectionSpacing: company.sectionSpacing || "3.5rem",
    logoUrl: company.logoUrl || "",
    bannerUrl: company.bannerUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<"logo" | "banner" | null>(null);

  const updateField = (key: string, value: any) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (onCompanyUpdated) {
      onCompanyUpdated({
        ...company,
        ...updated,
      });
    }
  };

  const handleSelectTheme = (themeId: string) => {
    const theme = THEME_REGISTRY[themeId];
    if (!theme) return;

    const updated = {
      ...formData,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.id, // Store theme key in secondary color for persistence
      fontFamily: theme.fontFamily as any,
    };
    setFormData(updated);
    if (onCompanyUpdated) {
      onCompanyUpdated({
        ...company,
        ...updated,
      });
    }
    handleSave(updated);
  };

  const handleSave = async (dataToSave = formData) => {
    setSaving(true);
    const res = await updateBrandThemeAction(dataToSave);
    setSaving(false);
    if (res.success) {
      if (onCompanyUpdated) onCompanyUpdated(res.company);
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span>Theme Studio & Branding</span>
          </h2>
          <p className="text-[11px] text-slate-400">Select portal themes, colors & glassmorphism</p>
        </div>
      </div>

      {/* 1. PORTAL THEMES SELECTION */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Select Portal Theme</span>
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {Object.values(THEME_REGISTRY).map((t) => {
            const isSelected = formData.secondaryColor === t.id || formData.primaryColor === t.primaryColor;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTheme(t.id)}
                className={`p-3 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/30 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border shadow-2xs"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span className="text-xs font-extrabold text-slate-900">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        t.mode === "dark" ? "bg-slate-900 text-teal-300" : "bg-white text-slate-700 border"
                      }`}
                    >
                      {t.mode}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COLOR PALETTE ADJUSTMENTS */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Custom Brand Colors
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Background Theme</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TYPOGRAPHY */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Typography Font
        </label>
        <select
          value={formData.fontFamily}
          onChange={(e) => updateField("fontFamily", e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold cursor-pointer"
        >
          <option value="Inter">Inter (Clean Modern Sans)</option>
          <option value="Outfit">Outfit (Tech Bio Biotech)</option>
          <option value="Roboto">Roboto (Enterprise Corporate)</option>
          <option value="Poppins">Poppins (Friendly Geometric)</option>
          <option value="Geist">Geist (Developer Vercel Style)</option>
        </select>
      </div>

      {/* 4. GEOMETRY & SPACING */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Card Geometry & Spacing
        </label>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Card Corner Radius ({formData.cornerRadius}px)</span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            value={formData.cornerRadius}
            onChange={(e) => updateField("cornerRadius", parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section Padding Spacing</label>
          <select
            value={formData.sectionSpacing}
            onChange={(e) => updateField("sectionSpacing", e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs cursor-pointer"
          >
            <option value="2rem">Compact (32px)</option>
            <option value="3.5rem">Comfortable (56px)</option>
            <option value="5rem">Spacious Premium (80px)</option>
          </select>
        </div>
      </div>

      {/* 5. BRAND ASSETS */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Brand Assets
        </label>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-600">Company Logo</label>
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
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-600">Hero Banner Background Image</label>
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
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold whitespace-nowrap cursor-pointer"
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
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {saving ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Apply Theme & Save Branding</span>
          </>
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
