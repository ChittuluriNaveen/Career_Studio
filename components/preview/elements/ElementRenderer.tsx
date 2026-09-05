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
      ? "text-center mx-auto items-center"
      : element.alignment === "right"
      ? "text-right ml-auto items-end"
      : "text-left mr-auto items-start";

  const handleElementClick = (e: React.MouseEvent) => {
    if (isPreviewMode && onSelectElement) {
      e.preventDefault();
      e.stopPropagation();
      onSelectElement(element);
    }
  };

  const wrapperClasses = `relative transition-all min-w-0 ${
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

  const galleryItems = element.content.items || [];

  return (
    <div ref={containerRef} onClick={handleElementClick} className={wrapperClasses} style={computedStyles}>
      {isPreviewMode && isSelected && (
        <>
          <span className="absolute -top-3 left-2 z-30 bg-cyan-800 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs uppercase">
            {element.type}
          </span>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white z-30 shadow-md cursor-se-resize" title="Resize Element" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-cyan-500 rounded-sm border border-white z-30 shadow-xs cursor-e-resize" title="Resize Width" />
        </>
      )}

      {isPreviewMode && <div className="absolute inset-0 z-20 cursor-pointer" />}

      {/* 1. HEADING ELEMENT */}
      {element.type === "heading" && (
        <div className={`w-full min-w-0 max-w-full ${alignClass}`}>
          {element.content.level === 1 ? (
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] break-words overflow-wrap-anywhere min-w-0 max-w-full ${
                isDarkMode && !computedStyles.color ? "text-white" : !computedStyles.color ? "text-slate-900" : ""
              }`}
              style={computedStyles}
            >
              {renderText(element.content.text, "Heading Title")}
            </h1>
          ) : element.content.level === 3 ? (
            <h3
              className={`text-xl sm:text-2xl font-extrabold tracking-tight break-words overflow-wrap-anywhere min-w-0 max-w-full ${
                isDarkMode && !computedStyles.color ? "text-slate-200" : !computedStyles.color ? "text-slate-900" : ""
              }`}
              style={computedStyles}
            >
              {renderText(element.content.text, "Section Subtitle")}
            </h3>
          ) : (
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight break-words overflow-wrap-anywhere min-w-0 max-w-full ${
                isDarkMode && !computedStyles.color ? "text-white" : !computedStyles.color ? "text-slate-900" : ""
              }`}
              style={computedStyles}
            >
              {renderText(element.content.text, "Section Heading")}
            </h2>
          )}
        </div>
      )}

      {/* 2. TEXT / PARAGRAPH ELEMENT */}
      {(element.type === "text" || element.type === "richtext") && (
        <div className={`w-full min-w-0 max-w-full ${alignClass}`}>
          <p
            className={`text-sm sm:text-base md:text-lg font-normal leading-relaxed break-words overflow-wrap-anywhere min-w-0 whitespace-pre-line ${
              isDarkMode && !computedStyles.color ? "text-slate-300" : !computedStyles.color ? "text-slate-600" : ""
            }`}
            style={computedStyles}
          >
            {renderText(element.content.text, "Enter narrative text body here...")}
          </p>
        </div>
      )}

      {/* 3. BADGE ELEMENT */}
      {element.type === "badge" && (
        <div className={`w-full flex ${alignClass}`}>
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm break-words"
            style={{
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              borderColor: `${primaryColor}50`,
              ...computedStyles,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{renderText(element.content.text, "Featured Badge")}</span>
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
            style={{ backgroundColor: primaryColor, ...computedStyles }}
          >
            <span>{renderText(element.content.label, "Click Here")}</span>
          </a>
        </div>
      )}

      {/* 5. IMAGE ELEMENT */}
      {element.type === "image" && (
        <div
          className={`w-full overflow-hidden rounded-2xl border shadow-lg ${isDarkMode ? "border-slate-800" : "border-slate-200/80"} ${alignClass}`}
          style={computedStyles}
        >
          {resolveImageUrl(element.content.url) ? (
            <div className="relative w-full h-64 sm:h-80 md:h-96" style={{ height: computedStyles.height || undefined }}>
              <img
                src={resolveImageUrl(element.content.url)}
                alt={renderText(element.content.alt, "Careers visual")}
                className={`w-full h-full ${
                  element.content.fit === "contain" ? "object-contain bg-black/20" : "object-cover"
                } rounded-2xl`}
                style={{ objectFit: computedStyles.objectFit as any }}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-slate-900/40 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-xs font-semibold">No Image Uploaded</p>
            </div>
          )}
        </div>
      )}

      {/* 6. VIDEO ELEMENT */}
      {element.type === "video" && (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 aspect-video relative">
          {resolveVideoUrl(element.content.videoUrl) ? (
            resolveVideoUrl(element.content.videoUrl).endsWith(".mp4") ||
            resolveVideoUrl(element.content.videoUrl).endsWith(".webm") ? (
              <video
                src={resolveVideoUrl(element.content.videoUrl)}
                controls
                className="w-full h-full border-0 rounded-2xl object-cover"
              />
            ) : (
              <iframe
                src={resolveVideoUrl(element.content.videoUrl)}
                title="Culture Video Player"
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
      )}

      {/* 7. STATS ELEMENT */}
      {element.type === "stats" && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
          {(element.content.items || []).map((stat: any) => (
            <div
              key={stat.id || stat.title}
              className={`p-5 rounded-2xl border shadow-sm text-center space-y-1 ${
                isDarkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
                {renderText(stat.value, "100+")}
              </div>
              <div className="text-xs font-extrabold">{renderText(stat.title, "Stat")}</div>
              {stat.description && <div className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{renderText(stat.description, "")}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 8. LIST / BENEFITS ELEMENT */}
      {element.type === "list" && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-2">
          {(element.content.items || []).map((item: any) => (
            <div
              key={item.id || item.title}
              className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-2 text-left ${
                isDarkMode ? "bg-slate-900/60 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold">{renderText(item.title, "Feature")}</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{renderText(item.description, "")}</p>
            </div>
          ))}
        </div>
      )}

      {/* 9. GALLERY ELEMENT WITH LIGHTBOX INTERACTION */}
      {element.type === "gallery" && (
        <>
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
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
              >
                <img
                  src={resolveImageUrl(photo.url)}
                  alt={renderText(photo.title, "Gallery photo")}
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
                  className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
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
