"use client";

import React from "react";
import Image from "next/image";
import { SectionElement } from "@/lib/templates/registry";
import { Sparkles, CheckCircle2, Play, ExternalLink } from "lucide-react";

interface ElementRendererProps {
  element: SectionElement;
  companyPrimaryColor?: string;
  isPreviewMode?: boolean;
  isSelected?: boolean;
  onSelectElement?: (element: SectionElement) => void;
  // External jobs renderer for OPEN_ROLES element
  jobsComponent?: React.ReactNode;
}

export default function ElementRenderer({
  element,
  companyPrimaryColor = "#005d52",
  isPreviewMode = false,
  isSelected = false,
  onSelectElement,
  jobsComponent,
}: ElementRendererProps) {
  if (!element.enabled) return null;

  const alignClass =
    element.alignment === "center"
      ? "text-center mx-auto items-center"
      : element.alignment === "right"
      ? "text-right ml-auto items-end"
      : "text-left mr-auto items-start";

  const handleElementClick = (e: React.MouseEvent) => {
    if (isPreviewMode && onSelectElement) {
      e.stopPropagation();
      onSelectElement(element);
    }
  };

  const wrapperClasses = `relative transition-all ${
    isPreviewMode ? "cursor-pointer group hover:ring-2 hover:ring-teal-500/50 hover:ring-offset-2 rounded-lg p-1" : ""
  } ${isSelected ? "ring-2 ring-teal-600 ring-offset-2 rounded-lg bg-teal-50/20" : ""}`;

  return (
    <div onClick={handleElementClick} className={wrapperClasses}>
      {/* Visual selection indicator badge in editor preview */}
      {isPreviewMode && isSelected && (
        <span className="absolute -top-3 left-2 z-30 bg-teal-800 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs uppercase">
          {element.type}
        </span>
      )}

      {/* 1. HEADING ELEMENT */}
      {element.type === "heading" && (
        <div className={`w-full ${alignClass}`}>
          {element.content.level === 1 ? (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] break-words min-w-0 max-w-full">
              {element.content.text || "Heading Title"}
            </h1>
          ) : element.content.level === 3 ? (
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words min-w-0 max-w-full">
              {element.content.text || "Section Subtitle"}
            </h3>
          ) : (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight break-words min-w-0 max-w-full">
              {element.content.text || "Section Heading"}
            </h2>
          )}
        </div>
      )}

      {/* 2. TEXT / PARAGRAPH ELEMENT */}
      {(element.type === "text" || element.type === "richtext") && (
        <div className={`w-full max-w-full ${alignClass}`}>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed break-words min-w-0 whitespace-pre-line">
            {element.content.text || "Enter narrative text body here..."}
          </p>
        </div>
      )}

      {/* 3. BADGE ELEMENT */}
      {element.type === "badge" && (
        <div className={`w-full flex ${alignClass}`}>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs"
            style={{
              backgroundColor: `${companyPrimaryColor}15`,
              color: companyPrimaryColor,
              borderColor: `${companyPrimaryColor}40`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{element.content.text || "Featured Badge"}</span>
          </span>
        </div>
      )}

      {/* 4. BUTTON ELEMENT */}
      {element.type === "button" && (
        <div className={`w-full flex ${alignClass}`}>
          <a
            href={element.content.linkUrl || "#"}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: companyPrimaryColor }}
          >
            <span>{element.content.label || "Click Here"}</span>
          </a>
        </div>
      )}

      {/* 5. IMAGE ELEMENT */}
      {element.type === "image" && (
        <div className={`w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-md ${alignClass}`}>
          {element.content.url ? (
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <img
                src={element.content.url}
                alt={element.content.alt || "Careers visual"}
                className={`w-full h-full ${
                  element.content.fit === "contain" ? "object-contain bg-slate-900/5" : "object-cover"
                } rounded-2xl`}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-xs font-semibold">No Image Uploaded</p>
              <p className="text-[11px]">Click to upload or select from media library</p>
            </div>
          )}
        </div>
      )}

      {/* 6. VIDEO ELEMENT */}
      {element.type === "video" && (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-300 shadow-xl bg-slate-950 aspect-video relative">
          {element.content.videoUrl ? (
            <iframe
              src={element.content.videoUrl}
              title="Culture Video Player"
              className="w-full h-full border-0 rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6">
              <Play className="w-12 h-12 text-teal-400 mb-2" />
              <p className="text-xs font-bold text-white">Video Embed Container</p>
              <p className="text-[11px]">Enter YouTube or Vimeo URL in element editor</p>
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
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-1"
            >
              <div className="text-2xl sm:text-3xl font-black text-slate-900" style={{ color: companyPrimaryColor }}>
                {stat.value || "100+"}
              </div>
              <div className="text-xs font-bold text-slate-700">{stat.title}</div>
              {stat.description && <div className="text-[11px] text-slate-500">{stat.description}</div>}
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
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-2 text-left"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: companyPrimaryColor }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 9. GALLERY ELEMENT */}
      {element.type === "gallery" && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
          {(element.content.items || []).map((photo: any) => (
            <div key={photo.id || photo.url} className="group relative rounded-2xl overflow-hidden shadow-md h-48 sm:h-56">
              <img src={photo.url} alt={photo.title || "Gallery photo"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-xs font-bold text-white">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10. DIVIDER / SPACER ELEMENTS */}
      {element.type === "divider" && <hr className="my-6 border-slate-200 w-full" />}
      {element.type === "spacer" && <div className="h-8 w-full" />}
    </div>
  );
}
