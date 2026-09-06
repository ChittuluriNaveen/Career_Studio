"use client";

import React, { useState, useRef } from "react";
import { SectionElement } from "@/lib/templates/registry";
import { Sparkles, CheckCircle2, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { interpolateCompanyVariables } from "@/lib/templates/variables";
import { getThemeByCompany } from "@/lib/themes/registry";
import { getElementStyles } from "@/lib/templates/stylesResolver";

interface ElementRendererProps {
  element: SectionElement;
  company?: any;
  jobsCount?: number;
  companyPrimaryColor?: string;
  isPreviewMode?: boolean;
  isSelected?: boolean;
  onSelectElement?: (element: SectionElement) => void;
  jobsComponent?: React.ReactNode;
  deviceMode?: "desktop" | "tablet" | "mobile";
}

export default function ElementRenderer({
  element,
  company,
  jobsCount = 0,
  companyPrimaryColor = "#005d52",
  isPreviewMode = false,
  isSelected = false,
  onSelectElement,
  jobsComponent,
  deviceMode = "desktop",
}: ElementRendererProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!element.enabled) return null;

  const theme = getThemeByCompany(company);
  const primaryColor = company?.primaryColor || companyPrimaryColor;
  const isDarkMode = theme.mode === "dark";

  const computedStyles = getElementStyles(element, deviceMode);

  const alignClass =
    element.alignment === "center"
      ? "text-center mx-auto items-center justify-center"
      : element.alignment === "right"
      ? "text-right ml-auto items-end justify-end"
      : "text-left mr-auto items-start justify-start";

  const handleElementClick = (e: React.MouseEvent) => {
    if (isPreviewMode && onSelectElement) {
      e.preventDefault();
      e.stopPropagation();
      onSelectElement(element);
    }
  };

  const wrapperClasses = `relative transition-all w-full min-w-0 max-w-full ${
    isPreviewMode ? "cursor-pointer group hover:ring-2 hover:ring-cyan-400/50 hover:ring-offset-2 rounded-lg p-1" : ""
  } ${isSelected ? "ring-2 ring-cyan-500 ring-offset-2 rounded-lg bg-cyan-500/10" : ""}`;

  const renderText = (rawText?: string | null, fallback: string = "") => {
    const txt = rawText || fallback;
    return interpolateCompanyVariables(txt, company, jobsCount);
  };

  const resolveImageUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return "";
    if (rawUrl === "@company_logo") return company?.logoUrl || "";
    if (rawUrl === "@company_banner") return company?.bannerUrl || "";
    return interpolateCompanyVariables(rawUrl, company, jobsCount);
  };

  const resolveVideoUrl = (rawUrl?: string | null) => {
    let url = rawUrl;
    if (!url || url === "@culture_video" || url === "@company_video") {
      url = company?.cultureVideoUrl || "";
    }
    if (!url) return "";

    const interpolated = interpolateCompanyVariables(url, company, jobsCount);

    if (interpolated.includes("youtube.com/watch")) {
      const match = interpolated.match(/v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }
    if (interpolated.includes("youtu.be/")) {
      const id = interpolated.split("youtu.be/")[1]?.split("?")[0];
      if (id) {
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
    }
    if (interpolated.includes("vimeo.com/")) {
      const id = interpolated.split("vimeo.com/")[1]?.split("?")[0];
      if (id && !isNaN(Number(id))) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }

    return interpolated;
  };

  const [resizingWidth, setResizingWidth] = useState<number | null>(null);
  const [resizingHeight, setResizingHeight] = useState<number | null>(null);

  const handlePointerDownResize = (e: React.PointerEvent, axis: "width" | "both") => {
    if (!isPreviewMode) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialRect = containerRef.current?.getBoundingClientRect();
    const startW = initialRect?.width || 300;
    const startH = initialRect?.height || 100;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      const newW = Math.max(120, Math.round(startW + deltaX));
      setResizingWidth(newW);

      if (axis === "both") {
        const newH = Math.max(40, Math.round(startH + deltaY));
        setResizingHeight(newH);
      }
    };

    const onPointerUp = (upEvt: PointerEvent) => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      const finalDeltaX = upEvt.clientX - startX;
      const finalDeltaY = upEvt.clientY - startY;
      const finalW = Math.max(120, Math.round(startW + finalDeltaX));
      const finalH = Math.max(40, Math.round(startH + finalDeltaY));

      setResizingWidth(null);
      setResizingHeight(null);

      if (onSelectElement) {
        const currentStyles = element.styles || {};
        const updatedStyles: any = {
          ...currentStyles,
          layout: {
            ...(currentStyles.layout || {}),
            maxWidth: `${finalW}px`,
            width: `${finalW}px`,
            ...(axis === "both" ? { height: `${finalH}px` } : {}),
          },
        };
        onSelectElement({
          ...element,
          styles: updatedStyles,
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const activeStyles = {
    ...computedStyles,
    ...(resizingWidth ? { maxWidth: `${resizingWidth}px`, width: `${resizingWidth}px` } : {}),
    ...(resizingHeight ? { height: `${resizingHeight}px` } : {}),
  };

  const galleryItems = element.content.items || [];

  return (
    <div ref={containerRef} onClick={handleElementClick} className={wrapperClasses}>
      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-left { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.92); } 100% { transform: scale(1); } }
      `}</style>

      {isPreviewMode && isSelected && (
        <>
          <div className="absolute -top-4 left-2 z-30 bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-slate-700">
            <span className="uppercase font-bold text-cyan-400">{element.type}</span>
            {resizingWidth && <span>· {resizingWidth}px</span>}
          </div>

          {/* Interactive Resize Handles */}
          <div
            onPointerDown={(e) => handlePointerDownResize(e, "both")}
            className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white z-40 shadow-lg cursor-nwse-resize hover:scale-125 transition-transform"
            title="Drag to resize width & height"
          />
          <div
            onPointerDown={(e) => handlePointerDownResize(e, "width")}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-6 bg-cyan-500 rounded-sm border border-white z-40 shadow-md cursor-ew-resize hover:scale-125 transition-transform"
            title="Drag to resize width"
          />
        </>
      )}

      {isPreviewMode && <div className="absolute inset-0 z-20 cursor-pointer" />}

      {/* 1. HEADING ELEMENT */}
      {element.type === "heading" && (
        <div className={`w-full min-w-0 max-w-full flex flex-col ${alignClass}`}>
          {element.content.level === 1 ? (
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] break-words overflow-wrap-anywhere min-w-0 max-w-full ${alignClass} ${
                isDarkMode && !activeStyles.color ? "text-white" : !activeStyles.color ? "text-slate-900" : ""
              }`}
              style={activeStyles}
            >
              {renderText(element.content.text, "Heading Title")}
            </h1>
          ) : element.content.level === 3 ? (
            <h3
              className={`text-xl sm:text-2xl font-extrabold tracking-tight break-words overflow-wrap-anywhere min-w-0 max-w-full ${alignClass} ${
                isDarkMode && !activeStyles.color ? "text-slate-200" : !activeStyles.color ? "text-slate-900" : ""
              }`}
              style={activeStyles}
            >
              {renderText(element.content.text, "Section Subtitle")}
            </h3>
          ) : (
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight break-words overflow-wrap-anywhere min-w-0 max-w-full ${alignClass} ${
                isDarkMode && !activeStyles.color ? "text-white" : !activeStyles.color ? "text-slate-900" : ""
              }`}
              style={activeStyles}
            >
              {renderText(element.content.text, "Section Heading")}
            </h2>
          )}
        </div>
      )}

      {/* 2. TEXT / PARAGRAPH ELEMENT */}
      {(element.type === "text" || element.type === "richtext") && (
        <div className={`w-full min-w-0 max-w-full flex flex-col ${alignClass}`}>
          <p
            className={`text-sm sm:text-base md:text-lg font-normal leading-relaxed break-words overflow-wrap-anywhere min-w-0 whitespace-pre-line ${alignClass} ${
              isDarkMode && !activeStyles.color ? "text-slate-300" : !activeStyles.color ? "text-slate-600" : ""
            }`}
            style={activeStyles}
          >
            {renderText(element.content.text, "Enter narrative text body here...")}
          </p>
        </div>
      )}

      {/* 3. BADGE ELEMENT */}
      {element.type === "badge" && (
        <div className={`w-full flex ${alignClass}`}>
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm break-words max-w-full"
            style={{
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              borderColor: `${primaryColor}50`,
              ...activeStyles,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{renderText(element.content.text, "Featured Badge")}</span>
          </span>
        </div>
      )}

      {/* 4. BUTTON ELEMENT */}
      {element.type === "button" && (
        <div className={`w-full flex ${alignClass}`}>
          <a
            href={renderText(element.content.linkUrl, "#jobs")}
            onClick={(e) => {
              if (isPreviewMode) return;
              const href = renderText(element.content.linkUrl, "#jobs");
              if (href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElem =
                  document.getElementById(targetId) ||
                  document.querySelector(`[id*="${targetId}"]`) ||
                  document.getElementById("open-positions");
                if (targetElem) {
                  targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center break-words max-w-full cursor-pointer"
            style={{ backgroundColor: primaryColor, ...activeStyles }}
          >
            <span>{renderText(element.content.label, "Click Here")}</span>
          </a>
        </div>
      )}

      {/* 5. IMAGE ELEMENT */}
      {element.type === "image" && (
        <div className={`w-full flex ${alignClass}`}>
          <div
            className={`overflow-hidden rounded-2xl border shadow-lg max-w-full ${isDarkMode ? "border-slate-800" : "border-slate-200/80"} ${
              deviceMode === "mobile"
                ? "w-full"
                : element.width === "half"
                ? "w-full md:w-1/2"
                : element.width === "third"
                ? "w-full md:w-1/3"
                : "w-full"
            }`}
            style={activeStyles}
          >
            {resolveImageUrl(element.content.url) ? (
              <div
                className={`relative w-full ${
                  deviceMode === "mobile" ? "h-48 sm:h-56" : "h-48 sm:h-64 md:h-96"
                }`}
                style={{ height: activeStyles.height || undefined }}
              >
                <img
                  src={resolveImageUrl(element.content.url)}
                  alt={renderText(element.content.alt, "Careers visual")}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full ${
                    element.content.fit === "contain" ? "object-contain bg-black/20" : "object-cover"
                  } rounded-2xl transition-opacity duration-300`}
                  style={{ objectFit: activeStyles.objectFit as any }}
                />
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-slate-900/40 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <span className="text-3xl mb-2">📷</span>
                <p className="text-xs font-semibold">No Image Uploaded</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. VIDEO ELEMENT */}
      {element.type === "video" && (
        <div className={`w-full flex ${alignClass}`}>
          <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 aspect-video relative" style={activeStyles}>
            {resolveVideoUrl(element.content.videoUrl) ? (
              resolveVideoUrl(element.content.videoUrl).endsWith(".mp4") ||
              resolveVideoUrl(element.content.videoUrl).endsWith(".webm") ? (
                <video
                  src={resolveVideoUrl(element.content.videoUrl)}
                  controls
                  preload="metadata"
                  className="w-full h-full border-0 rounded-2xl object-cover"
                />
              ) : (
                <iframe
                  src={resolveVideoUrl(element.content.videoUrl)}
                  title="Culture Video Player"
                  loading="lazy"
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6">
                <Play className="w-12 h-12 text-cyan-400 mb-2" />
                <p className="text-xs font-bold text-white">Culture Video Player</p>
                <p className="text-[11px]">Add YouTube or Vimeo URL in element editor</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. STATS ELEMENT */}
      {element.type === "stats" && (
        <div
          className={`w-full grid gap-4 my-2 ${
            deviceMode === "mobile"
              ? "grid-cols-1"
              : deviceMode === "tablet"
              ? "grid-cols-2"
              : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {(element.content.items || []).map((stat: any) => (
            <div
              key={stat.id || stat.title}
              className="p-5 rounded-2xl border shadow-sm text-center space-y-1 transition-all"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                color: theme.textColor,
                ...activeStyles,
              }}
            >
              <div className="text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
                {renderText(stat.value, "100+")}
              </div>
              <div className="text-xs font-extrabold">{renderText(stat.title, "Stat")}</div>
              {stat.description && <div className="text-[11px]" style={{ color: theme.subtextColor }}>{renderText(stat.description, "")}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 8. LIST / BENEFITS ELEMENT */}
      {element.type === "list" && (
        <div
          className={`w-full grid gap-4 my-2 ${
            deviceMode === "mobile"
              ? "grid-cols-1"
              : deviceMode === "tablet"
              ? "grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          }`}
        >
          {(element.content.items || []).map((item: any) => (
            <div
              key={item.id || item.title}
              className="p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-2 text-left"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                color: theme.textColor,
                ...activeStyles,
              }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold">{renderText(item.title, "Feature")}</h4>
              <p className="text-xs leading-relaxed" style={{ color: theme.subtextColor }}>{renderText(item.description, "")}</p>
            </div>
          ))}
        </div>
      )}

      {/* 9. GALLERY ELEMENT WITH LIGHTBOX INTERACTION */}
      {element.type === "gallery" && (
        <>
          <div
            className={`w-full grid gap-4 my-2 ${
              deviceMode === "mobile"
                ? "grid-cols-1"
                : deviceMode === "tablet"
                ? "grid-cols-2"
                : "grid-cols-1 sm:grid-cols-3"
            }`}
          >
            {galleryItems.map((photo: any, index: number) => (
              <div
                key={photo.id || photo.url || index}
                onClick={(e) => {
                  if (!isPreviewMode) {
                    e.stopPropagation();
                    setLightboxIndex(index);
                  }
                }}
                className="group relative rounded-2xl overflow-hidden shadow-md h-48 sm:h-56 cursor-pointer"
                style={activeStyles}
              >
                <img
                  src={resolveImageUrl(photo.url)}
                  alt={renderText(photo.title, "Gallery photo")}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white">{renderText(photo.title, "")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* LIGHTBOX MODAL */}
          {lightboxIndex !== null && galleryItems[lightboxIndex] && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)
                    }
                    className="absolute left-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)}
                    className="absolute right-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    aria-label="Next Photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="max-w-4xl w-full flex flex-col items-center space-y-3">
                <img
                  src={resolveImageUrl(galleryItems[lightboxIndex].url)}
                  alt={renderText(galleryItems[lightboxIndex].title, "Gallery Photo")}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
                />
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white">
                    {renderText(galleryItems[lightboxIndex].title, "Gallery Image")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {lightboxIndex + 1} of {galleryItems.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 10. DIVIDER / SPACER ELEMENTS */}
      {element.type === "divider" && <hr className={`my-6 w-full ${isDarkMode ? "border-slate-800" : "border-slate-200"}`} />}
      {element.type === "spacer" && <div className="h-8 w-full" />}
    </div>
  );
}
