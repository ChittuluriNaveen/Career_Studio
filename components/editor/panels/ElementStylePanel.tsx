"use client";

import { useState } from "react";
import { SectionElement, ElementStyles } from "@/lib/templates/registry";
import { getResponsiveStyles } from "@/lib/templates/stylesResolver";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Sparkles,
  Type,
  Layout,
  Palette,
  Maximize2,
  Sliders,
  Sun,
  Layers,
} from "lucide-react";

interface ElementStylePanelProps {
  element: SectionElement;
  onUpdateElementStyles: (updatedStyles: ElementStyles) => void;
  onResetElementStyles: () => void;
  activeDeviceMode?: "desktop" | "tablet" | "mobile";
}

export default function ElementStylePanel({
  element,
  onUpdateElementStyles,
  onResetElementStyles,
  activeDeviceMode = "desktop",
}: ElementStylePanelProps) {
  const [deviceContext, setDeviceContext] = useState<"desktop" | "tablet" | "mobile">(activeDeviceMode);

  const rawStyles: ElementStyles = element.styles || {};
  const currentStyles = getResponsiveStyles(rawStyles, deviceContext);

  const updateTargetStyle = (category: keyof ElementStyles, key: string, value: any) => {
    const updatedRaw: ElementStyles = JSON.parse(JSON.stringify(rawStyles));

    if (deviceContext === "desktop") {
      if (!updatedRaw[category]) {
        (updatedRaw as any)[category] = {};
      }
      (updatedRaw as any)[category][key] = value;
    } else {
      if (!updatedRaw.responsive) updatedRaw.responsive = {};
      if (!updatedRaw.responsive[deviceContext]) updatedRaw.responsive[deviceContext] = {};
      if (!(updatedRaw.responsive[deviceContext] as any)[category]) {
        (updatedRaw.responsive[deviceContext] as any)[category] = {};
      }
      (updatedRaw.responsive[deviceContext] as any)[category][key] = value;
    }

    onUpdateElementStyles(updatedRaw);
  };

  const getNumericPx = (val?: string | number, fallback: number = 0): number => {
    if (typeof val === "number") return val;
    if (!val) return fallback;
    const match = String(val).match(/^(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : fallback;
  };

  return (
    <div className="space-y-5 text-xs text-slate-800 font-sans">
      {/* Device Overrides Switcher */}
      <div className="bg-slate-900 p-1.5 rounded-xl flex items-center justify-between border border-slate-800 shadow-sm text-white">
        <span className="text-[10px] font-extrabold uppercase tracking-wider pl-2 text-cyan-400">Target Device:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDeviceContext("desktop")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "desktop"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceContext("tablet")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "tablet"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Tablet className="w-3 h-3" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceContext("mobile")}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
              deviceContext === "mobile"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* 1. TYPOGRAPHY */}
      {["heading", "text", "richtext", "button", "badge", "list"].includes(element.type) && (
        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              <span>Typography & Size</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 font-bold">
              {currentStyles.typography?.fontSize || "default"}
            </span>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
              <span>Font Size Slider</span>
              <span>{getNumericPx(currentStyles.typography?.fontSize, 16)}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="1"
              value={getNumericPx(currentStyles.typography?.fontSize, 16)}
              onChange={(e) => updateTargetStyle("typography", "fontSize", `${e.target.value}px`)}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Font Weight</label>
              <select
                value={currentStyles.typography?.fontWeight || "400"}
                onChange={(e) => updateTargetStyle("typography", "fontWeight", e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Text Align</label>
              <select
                value={currentStyles.typography?.textAlign || "left"}
                onChange={(e) => updateTargetStyle("typography", "textAlign", e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 2. COLORS */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
          <Palette className="w-3.5 h-3.5 text-emerald-600" />
          <span>Colors</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Text Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentStyles.colors?.color || "#0f172a"}
                onChange={(e) => updateTargetStyle("colors", "color", e.target.value)}
                className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                placeholder="#0f172a"
                value={currentStyles.colors?.color || ""}
                onChange={(e) => updateTargetStyle("colors", "color", e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Background Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentStyles.colors?.backgroundColor || "#ffffff"}
                onChange={(e) => updateTargetStyle("colors", "backgroundColor", e.target.value)}
                className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                placeholder="transparent"
                value={currentStyles.colors?.backgroundColor || ""}
                onChange={(e) => updateTargetStyle("colors", "backgroundColor", e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. BORDERS (WIDTH SLIDER, RADIUS SLIDER, COLOR, STYLE) */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
            <Layout className="w-3.5 h-3.5 text-amber-600" />
            <span>Border & Corner Radius Sliders</span>
          </div>
          <span className="text-[10px] font-mono text-amber-700 font-bold">
            {getNumericPx(currentStyles.border?.width, 0)}px / {getNumericPx(currentStyles.border?.radius, 0)}px
          </span>
        </div>

        {/* Border Width Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Border Width</span>
            <span>{getNumericPx(currentStyles.border?.width, 0)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            step="1"
            value={getNumericPx(currentStyles.border?.width, 0)}
            onChange={(e) => {
              const w = e.target.value;
              updateTargetStyle("border", "width", `${w}px`);
              if (w !== "0" && (!currentStyles.border?.style || currentStyles.border.style === "none")) {
                updateTargetStyle("border", "style", "solid");
              }
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Border Radius Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Border Radius</span>
            <span>{getNumericPx(currentStyles.border?.radius, 0)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={Math.min(50, getNumericPx(currentStyles.border?.radius, 0))}
            onChange={(e) => updateTargetStyle("border", "radius", `${e.target.value}px`)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Radius Quick Presets */}
        <div className="flex items-center gap-1 pt-1">
          {[
            { label: "Square", val: "0px" },
            { label: "SM", val: "6px" },
            { label: "MD", val: "12px" },
            { label: "LG", val: "20px" },
            { label: "Pill", val: "9999px" },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => updateTargetStyle("border", "radius", preset.val)}
              className="flex-1 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700 transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Style</label>
            <select
              value={currentStyles.border?.style || "none"}
              onChange={(e) => updateTargetStyle("border", "style", e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentStyles.border?.color || "#e2e8f0"}
                onChange={(e) => updateTargetStyle("border", "color", e.target.value)}
                className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                placeholder="#e2e8f0"
                value={currentStyles.border?.color || ""}
                onChange={(e) => updateTargetStyle("border", "color", e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHADOW SLIDER & PRESETS */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Box Shadow Slider</span>
          </div>
          <span className="text-[10px] font-mono text-blue-600 font-bold">
            {(currentStyles.shadow as any)?.blurRadius !== undefined
              ? `${(currentStyles.shadow as any).blurRadius}px blur`
              : currentStyles.shadow?.preset || "none"}
          </span>
        </div>

        {/* Shadow Blur Radius Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Blur Radius</span>
            <span>{getNumericPx((currentStyles.shadow as any)?.blurRadius, 0)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={getNumericPx((currentStyles.shadow as any)?.blurRadius, 0)}
            onChange={(e) => updateTargetStyle("shadow", "blurRadius", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Shadow Preset</label>
          <select
            value={currentStyles.shadow?.preset || "none"}
            onChange={(e) => updateTargetStyle("shadow", "preset", e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="sm">Small Shadow</option>
            <option value="md">Medium Shadow</option>
            <option value="lg">Large Shadow</option>
            <option value="xl">Extra Large Shadow</option>
          </select>
        </div>
      </div>

      {/* 5. LAYOUT, WIDTH, HEIGHT & PADDING SLIDERS */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
          <Maximize2 className="w-3.5 h-3.5 text-cyan-600" />
          <span>Layout & Padding Sliders</span>
        </div>

        {/* Padding Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Top/Bottom Padding</span>
            <span>{getNumericPx(currentStyles.spacing?.paddingTop, 0)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="64"
            step="2"
            value={getNumericPx(currentStyles.spacing?.paddingTop, 0)}
            onChange={(e) => {
              const p = `${e.target.value}px`;
              updateTargetStyle("spacing", "paddingTop", p);
              updateTargetStyle("spacing", "paddingBottom", p);
            }}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Width</label>
            <input
              type="text"
              placeholder="e.g. 100%, 320px"
              value={currentStyles.layout?.width || ""}
              onChange={(e) => updateTargetStyle("layout", "width", e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Height</label>
            <input
              type="text"
              placeholder="e.g. auto, 240px"
              value={currentStyles.layout?.height || ""}
              onChange={(e) => updateTargetStyle("layout", "height", e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. GLASSMORPHISM & OPACITY */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Glassmorphism & Opacity</span>
          </div>
          <span className="text-[10px] font-mono text-purple-600 font-bold">
            {Math.round((currentStyles.effects?.opacity ?? 1) * 100)}%
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Opacity Slider</span>
            <span>{Math.round((currentStyles.effects?.opacity ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={currentStyles.effects?.opacity ?? 1}
            onChange={(e) => updateTargetStyle("effects", "opacity", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Glass Effect Preset</label>
          <select
            value={currentStyles.effects?.glass || "none"}
            onChange={(e) => updateTargetStyle("effects", "glass", e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="none">Disabled</option>
            <option value="light">Light Glass (12px blur)</option>
            <option value="medium">Medium Glass (18px blur)</option>
            <option value="strong">Strong Glass (24px blur)</option>
          </select>
        </div>
      </div>

      {/* 7. ENTRANCE ANIMATIONS */}
      <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Entrance Animations</span>
          </div>
          <span className="text-[10px] font-mono text-amber-600 font-bold">
            {currentStyles.animation?.type || "none"}
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">Animation Preset</label>
          <select
            value={currentStyles.animation?.type || "none"}
            onChange={(e) => updateTargetStyle("animation", "type", e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="none">None (Static)</option>
            <option value="fade-in">Fade In</option>
            <option value="fade-out">Fade Out</option>
            <option value="slide-up">Slide Up</option>
            <option value="slide-down">Slide Down</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
            <option value="zoom-in">Zoom In</option>
            <option value="bounce-in">Bounce In</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Duration</label>
            <select
              value={currentStyles.animation?.duration || "0.6s"}
              onChange={(e) => updateTargetStyle("animation", "duration", e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            >
              <option value="0.3s">Fast (0.3s)</option>
              <option value="0.6s">Normal (0.6s)</option>
              <option value="0.9s">Slow (0.9s)</option>
              <option value="1.2s">Extra Slow (1.2s)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Delay</label>
            <select
              value={currentStyles.animation?.delay || "0s"}
              onChange={(e) => updateTargetStyle("animation", "delay", e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
            >
              <option value="0s">No Delay (0s)</option>
              <option value="0.2s">0.2s Delay</option>
              <option value="0.4s">0.4s Delay</option>
              <option value="0.6s">0.6s Delay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reset Style Button */}
      <button
        type="button"
        onClick={onResetElementStyles}
        className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Template Defaults</span>
      </button>
    </div>
  );
}
