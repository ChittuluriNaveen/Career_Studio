"use client";

import { useState } from "react";
import { SectionCardStyles } from "@/lib/templates/registry";
import MediaPickerModal from "@/components/editor/MediaPickerModal";
import {
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Image as ImageIcon,
  Sliders,
  Layout,
  Palette,
  Maximize2,
  Sparkles,
  Layers,
  Sun,
  X,
} from "lucide-react";

interface SectionStylePanelProps {
  section: any;
  onUpdateSectionCardStyles: (updatedStyles: SectionCardStyles) => void;
  activeDeviceMode?: "desktop" | "tablet" | "mobile";
}

export default function SectionStylePanel({
  section,
  onUpdateSectionCardStyles,
  activeDeviceMode = "desktop",
}: SectionStylePanelProps) {
  const [deviceContext, setDeviceContext] = useState<"desktop" | "tablet" | "mobile">(activeDeviceMode);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const rawCardStyles: SectionCardStyles = section.content?.cardStyles || {};

  // Resolve active properties for selected device context
  const getActiveProp = (key: keyof SectionCardStyles, fallback: any = "") => {
    if (deviceContext === "desktop") {
      return rawCardStyles[key] !== undefined ? rawCardStyles[key] : fallback;
    }
    const devOverride = rawCardStyles.responsive?.[deviceContext];
    if (devOverride && (devOverride as any)[key] !== undefined) {
      return (devOverride as any)[key];
    }
    return rawCardStyles[key] !== undefined ? rawCardStyles[key] : fallback;
  };

  const updateProp = (key: keyof SectionCardStyles, value: any) => {
    const updated: SectionCardStyles = JSON.parse(JSON.stringify(rawCardStyles));

    if (deviceContext === "desktop") {
      (updated as any)[key] = value;
    } else {
      if (!updated.responsive) updated.responsive = {};
      if (!updated.responsive[deviceContext]) updated.responsive[deviceContext] = {};
      (updated.responsive[deviceContext] as any)[key] = value;
    }

    onUpdateSectionCardStyles(updated);
  };

  return (
    <div className="space-y-5 text-xs text-slate-800 font-sans">
      {/* Target Device Mode Switcher */}
      <div className="bg-slate-950 p-2 rounded-2xl flex items-center justify-between border border-slate-800 shadow-md text-white">
        <span className="text-[10px] font-black uppercase tracking-wider pl-2 text-teal-400">
          Target Device:
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDeviceContext("desktop")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "desktop"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceContext("tablet")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "tablet"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceContext("mobile")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "mobile"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* 1. SECTION SPACING, MARGIN & PADDING INSPECTOR */}
      <div className="bg-gradient-to-br from-teal-50/90 to-slate-50 p-4 rounded-2xl border border-teal-200 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-teal-200/80">
          <div className="flex items-center gap-2 text-[#005d52] font-black text-xs uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#005d52]" />
            <span>Section Spacing, Margin & Padding</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white text-[#005d52] px-2 py-0.5 rounded-md border border-teal-200 capitalize">
            {deviceContext}
          </span>
        </div>

        {/* Quick Preset Spacing Controls */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Quick Spacing Presets</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "Tight", top: "12px", bottom: "12px", mt: "0px", mb: "0px" },
              { label: "Balanced", top: "24px", bottom: "24px", mt: "12px", mb: "12px" },
              { label: "Comfort", top: "48px", bottom: "48px", mt: "24px", mb: "24px" },
              { label: "Zero", top: "0px", bottom: "0px", mt: "0px", mb: "0px" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  updateProp("paddingTop", p.top);
                  updateProp("paddingBottom", p.bottom);
                  updateProp("marginTop", p.mt);
                  updateProp("marginBottom", p.mb);
                }}
                className="py-1.5 px-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl font-extrabold text-[10px] text-slate-700 hover:text-[#005d52] transition-all cursor-pointer shadow-2xs text-center"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Visual CSS Box Model Diagram */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider text-center">
            Section Box Model Spacing ({deviceContext})
          </span>

          {/* Margin Box (Outer) */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-center relative">
            <span className="text-[9px] font-black uppercase text-amber-700 block">MARGIN (Outer Offset)</span>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Top Margin</label>
                <input
                  type="text"
                  value={getActiveProp("marginTop", "")}
                  onChange={(e) => updateProp("marginTop", e.target.value)}
                  placeholder="0px"
                  className="w-full p-1 bg-white border border-amber-200 rounded-lg text-xs font-mono font-bold text-center"
                />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Bottom Margin</label>
                <input
                  type="text"
                  value={getActiveProp("marginBottom", "")}
                  onChange={(e) => updateProp("marginBottom", e.target.value)}
                  placeholder="0px"
                  className="w-full p-1 bg-white border border-amber-200 rounded-lg text-xs font-mono font-bold text-center"
                />
              </div>
            </div>

            {/* Padding Box (Inner) */}
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-center mt-2">
              <span className="text-[9px] font-black uppercase text-teal-800 block">PADDING (Inner Card Space)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Top Padding</label>
                  <input
                    type="text"
                    value={getActiveProp("paddingTop", "")}
                    onChange={(e) => updateProp("paddingTop", e.target.value)}
                    placeholder="24px"
                    className="w-full p-1 bg-white border border-teal-200 rounded-lg text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Bottom Padding</label>
                  <input
                    type="text"
                    value={getActiveProp("paddingBottom", "")}
                    onChange={(e) => updateProp("paddingBottom", e.target.value)}
                    placeholder="24px"
                    className="w-full p-1 bg-white border border-teal-200 rounded-lg text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Left Padding</label>
                  <input
                    type="text"
                    value={getActiveProp("paddingLeft", "")}
                    onChange={(e) => updateProp("paddingLeft", e.target.value)}
                    placeholder="16px"
                    className="w-full p-1 bg-white border border-teal-200 rounded-lg text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Right Padding</label>
                  <input
                    type="text"
                    value={getActiveProp("paddingRight", "")}
                    onChange={(e) => updateProp("paddingRight", e.target.value)}
                    placeholder="16px"
                    className="w-full p-1 bg-white border border-teal-200 rounded-lg text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BACKGROUND & IMAGE SETTINGS */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-800 font-extrabold">
            <Palette className="w-4 h-4 text-teal-700" />
            <span>Container Background & Media</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 capitalize">{deviceContext}</span>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Background Type</label>
          <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border border-slate-200 font-bold text-[11px]">
            {[
              { id: "default", label: "Theme" },
              { id: "solid-white", label: "Solid" },
              { id: "dark-glass", label: "Dark" },
              { id: "transparent", label: "Clear" },
            ].map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => updateProp("background", bg.id)}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  getActiveProp("background", "default") === bg.id
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Solid Color */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Custom Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={getActiveProp("backgroundColor", "#ffffff")}
              onChange={(e) => updateProp("backgroundColor", e.target.value)}
              className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={getActiveProp("backgroundColor", "")}
              onChange={(e) => updateProp("backgroundColor", e.target.value)}
              placeholder="#ffffff or rgba(...)"
              className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
          </div>
        </div>

        {/* Background Image Upload */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Background Banner Image</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={getActiveProp("backgroundImageUrl", "")}
              onChange={(e) => updateProp("backgroundImageUrl", e.target.value)}
              placeholder="https://... or upload image"
              className="flex-1 min-w-0 p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="px-3 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs flex-shrink-0 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse</span>
            </button>
            {getActiveProp("backgroundImageUrl", "") && (
              <button
                type="button"
                onClick={() => updateProp("backgroundImageUrl", "")}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer flex-shrink-0"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                updateProp("background", "image");
                updateProp("backgroundImageUrl", "@company_banner");
              }}
              className="px-2 py-1 bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
            >
              + Use DB Banner (@company_banner)
            </button>
            <button
              type="button"
              onClick={() => {
                updateProp("background", "image");
                updateProp("backgroundImageUrl", "@company_logo");
              }}
              className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
            >
              + Use DB Logo (@company_logo)
            </button>
          </div>
        </div>

        {/* Background Position & Fit */}
        {getActiveProp("backgroundImageUrl", "") && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Image Position</label>
              <select
                value={getActiveProp("bgPosition", "center center")}
                onChange={(e) => updateProp("bgPosition", e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <option value="center center">Center</option>
                <option value="center top">Top Center</option>
                <option value="center bottom">Bottom Center</option>
                <option value="left center">Left Center</option>
                <option value="right center">Right Center</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Image Fit</label>
              <select
                value={getActiveProp("bgSize", "cover")}
                onChange={(e) => updateProp("bgSize", e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <option value="cover">Cover (Full Bleed)</option>
                <option value="contain">Contain (Fit Aspect)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. OVERLAY LAYER CONTROLS */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-800 font-extrabold">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>Overlay Mask (Text Contrast)</span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(getActiveProp("overlayEnabled", false))}
              onChange={(e) => updateProp("overlayEnabled", e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <span className="text-[11px] font-bold text-slate-700">Enable</span>
          </label>
        </div>

        {getActiveProp("overlayEnabled", false) && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Overlay Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={getActiveProp("overlayColor", "#000000")}
                    onChange={(e) => updateProp("overlayColor", e.target.value)}
                    className="w-8 h-8 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={getActiveProp("overlayColor", "#000000")}
                    onChange={(e) => updateProp("overlayColor", e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Opacity: {Math.round(getActiveProp("overlayOpacity", 0.4) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={getActiveProp("overlayOpacity", 0.4)}
                  onChange={(e) => updateProp("overlayOpacity", parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 mt-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. LAYOUT, HEIGHT & ALIGNMENT */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-800 font-extrabold">
            <Layout className="w-4 h-4 text-teal-700" />
            <span>Container Layout & Height</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Horizontal Align</label>
            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200 font-bold text-xs">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateProp("horizontalAlignment", a)}
                  className={`py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    getActiveProp("horizontalAlignment", "left") === a
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Vertical Align</label>
            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200 font-bold text-xs">
              {(["top", "center", "bottom"] as const).map((va) => (
                <button
                  key={va}
                  type="button"
                  onClick={() => updateProp("verticalAlignment", va)}
                  className={`py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    getActiveProp("verticalAlignment", "top") === va
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {va}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Section Minimum Height</label>
          <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-xl border border-slate-200 font-bold text-[10px]">
            {[
              { id: "auto", label: "Auto" },
              { id: "sm", label: "360px" },
              { id: "md", label: "500px" },
              { id: "lg", label: "680px" },
              { id: "full", label: "100vh" },
            ].map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => updateProp("minHeight", h.id)}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  getActiveProp("minHeight", "auto") === h.id
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Content Max-Width</label>
          <input
            type="text"
            value={getActiveProp("contentMaxWidth", "")}
            onChange={(e) => updateProp("contentMaxWidth", e.target.value)}
            placeholder="e.g. 800px, 1200px, 100%"
            className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
          />
        </div>
      </div>

      {/* 4. MANUAL PADDING & MARGIN CONTROL */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-800 font-extrabold">
            <Sliders className="w-4 h-4 text-teal-700" />
            <span>Manual Padding & Margin Spacing</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 capitalize">{deviceContext}</span>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Top Padding (Inner Space Above)</label>
          <div className="flex items-center gap-1.5">
            <div className="grid grid-cols-4 gap-1 flex-1">
              {["0px", "16px", "24px", "40px"].map((val) => (
                <button
                  key={`pt-${val}`}
                  type="button"
                  onClick={() => updateProp("paddingTop", val)}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    getActiveProp("paddingTop", "") === val
                      ? "bg-teal-800 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={getActiveProp("paddingTop", "")}
              onChange={(e) => updateProp("paddingTop", e.target.value)}
              placeholder="Custom"
              className="w-20 p-1.5 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-center"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Bottom Padding (Inner Space Below)</label>
          <div className="flex items-center gap-1.5">
            <div className="grid grid-cols-4 gap-1 flex-1">
              {["0px", "16px", "24px", "40px"].map((val) => (
                <button
                  key={`pb-${val}`}
                  type="button"
                  onClick={() => updateProp("paddingBottom", val)}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    getActiveProp("paddingBottom", "") === val
                      ? "bg-teal-800 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={getActiveProp("paddingBottom", "")}
              onChange={(e) => updateProp("paddingBottom", e.target.value)}
              placeholder="Custom"
              className="w-20 p-1.5 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-center"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Top Margin (Outer Offset)</label>
            <input
              type="text"
              value={getActiveProp("marginTop", "")}
              onChange={(e) => updateProp("marginTop", e.target.value)}
              placeholder="e.g. 0px, 12px, 24px"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Bottom Margin (Outer Offset)</label>
            <input
              type="text"
              value={getActiveProp("marginBottom", "")}
              onChange={(e) => updateProp("marginBottom", e.target.value)}
              placeholder="e.g. 0px, 12px, 24px"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* 4. GLASSMORPHISM & SHADOW */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-800 font-extrabold">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Glassmorphism & Box Shadow</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Glassmorphism Effect</label>
            <select
              value={getActiveProp("glass", "none")}
              onChange={(e) => updateProp("glass", e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <option value="none">None (Standard)</option>
              <option value="light">Light Glass (12px Blur)</option>
              <option value="medium">Medium Glass (18px Blur)</option>
              <option value="strong">Strong Glass (24px Blur)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Box Shadow</label>
            <select
              value={getActiveProp("shadow", "lg")}
              onChange={(e) => updateProp("shadow", e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <option value="none">None</option>
              <option value="sm">Small Shadow</option>
              <option value="md">Medium Shadow</option>
              <option value="lg">Large Elevated Shadow</option>
              <option value="xl">Extra Large Banner Shadow</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Width</label>
            <input
              type="text"
              value={getActiveProp("borderWidth", "")}
              onChange={(e) => updateProp("borderWidth", e.target.value)}
              placeholder="e.g. 1px, 2px"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Radius</label>
            <input
              type="text"
              value={getActiveProp("borderRadius", "")}
              onChange={(e) => updateProp("borderRadius", e.target.value)}
              placeholder="e.g. 16px, 24px"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectMedia={(url) => {
          updateProp("backgroundImageUrl", url);
          updateProp("background", "image");
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
