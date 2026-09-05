"use client";

import { SectionType } from "@prisma/client";
import { Sparkles, MapPin, Building, ChevronRight, Play, ArrowRight, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import JobSearchFilter from "@/components/candidate/JobSearchFilter";
import { useState } from "react";

interface PageRendererProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    tagline?: string | null;
    aboutText?: string | null;
    cornerRadius?: number;
    sectionSpacing?: string;
  };
  sections: Array<{
    id: string;
    type: SectionType;
    title: string | null;
    content: any;
    layoutVariant?: string;
    orderIndex: number;
    enabled?: boolean;
    isDraft?: boolean;
    isPublished?: boolean;
  }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; isRemote: boolean }>;
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    jobType: any;
    department: { name: string };
    location: { name: string };
    createdAt: Date | string;
  }>;
  isPreviewMode?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (section: any) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicateSection?: (id: string) => void;
  onToggleHideSection?: (id: string, currentEnabled: boolean) => void;
  onDeleteSection?: (id: string) => void;
}

export default function PageRenderer({
  company,
  sections,
  departments,
  locations,
  jobs,
  isPreviewMode = false,
  selectedSectionId,
  onSelectSection,
  onMoveUp,
  onMoveDown,
  onDuplicateSection,
  onToggleHideSection,
  onDeleteSection,
}: PageRendererProps) {
  const primaryColor = company.primaryColor || "#2563eb";
  const secondaryColor = company.secondaryColor || "#1e293b";
  const cornerRadius = company.cornerRadius ?? 12;
  const sectionSpacing = company.sectionSpacing || "3.5rem";
  const fontFamily = company.fontFamily || "Inter";

  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Filter sections: in preview mode render enabled sections (or all); in candidate public mode render only published & enabled sections
  const activeSections = sections
    .filter((sec) => (isPreviewMode ? true : sec.isPublished && sec.enabled !== false))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 transition-colors"
      style={{ fontFamily }}
    >
      {/* Dynamic Branded Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} Logo`}
                className="w-10 h-10 object-cover border border-slate-200"
                style={{ borderRadius: `${cornerRadius}px` }}
              />
            ) : (
              <div
                className="w-10 h-10 flex items-center justify-center font-black text-white text-lg shadow-xs"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${cornerRadius}px`,
                }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block leading-tight">{company.name}</span>
              <span className="text-[11px] text-slate-500 font-medium">Careers Portal</span>
            </div>
          </div>

          <a
            href="#open-positions"
            className="px-4 py-2 text-xs font-bold shadow-xs transition-transform hover:scale-105 text-white"
            style={{
              backgroundColor: primaryColor,
              borderRadius: `${cornerRadius}px`,
            }}
          >
            Open Positions ({jobs.length})
          </a>
        </div>
      </header>

      {/* Dynamic Section Loop */}
      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12"
        style={{ paddingTop: sectionSpacing, paddingBottom: sectionSpacing }}
      >
        {activeSections.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Your Careers Page is Empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start building your page by adding your first section from the left panel.
            </p>
          </div>
        ) : (
          activeSections.map((section) => {
            const variant = section.layoutVariant || "01";
            const isSelected = selectedSectionId === section.id;
            const isHovered = hoveredSectionId === section.id;
            const isEnabled = section.enabled !== false;

            const renderSectionBody = () => {
              switch (section.type) {
                /* 1. HERO SECTION */
                case SectionType.HERO:
                  return (
                    <div
                      className="relative overflow-hidden border border-slate-200/80 shadow-xs transition-all p-8 sm:p-14"
                      style={{
                        borderRadius: `${cornerRadius * 1.5}px`,
                        backgroundColor: variant === "05" ? primaryColor : "#ffffff",
                        color: variant === "05" ? "#ffffff" : "#0f172a",
                        backgroundImage: section.content?.backgroundImage || section.content?.imageUrl
                          ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url('${section.content.backgroundImage || section.content.imageUrl}')`
                          : undefined,
                        backgroundSize: "cover",
                      }}
                    >
                      {(variant === "01" || variant === "02") && (
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            {section.title || company.name}
                          </h1>
                          <p className="text-sm sm:text-base opacity-85 leading-relaxed font-normal max-w-2xl mx-auto">
                            {section.content?.subtitle || company.tagline}
                          </p>
                          <div className="pt-2 flex items-center justify-center gap-3">
                            <a
                              href={section.content?.ctaLink || "#open-positions"}
                              className="px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                              style={{
                                backgroundColor: primaryColor,
                                borderRadius: `${cornerRadius}px`,
                              }}
                            >
                              {section.content?.ctaText || "Explore Open Roles"}
                            </a>
                          </div>
                        </div>
                      )}

                      {(variant !== "01" && variant !== "02") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                              {section.title || company.name}
                            </h1>
                            <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                              {section.content?.subtitle || company.tagline}
                            </p>
                            <div className="pt-2 flex items-center gap-3">
                              <a
                                href={section.content?.ctaLink || "#open-positions"}
                                className="px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:scale-105"
                                style={{
                                  backgroundColor: primaryColor,
                                  borderRadius: `${cornerRadius}px`,
                                }}
                              >
                                {section.content?.ctaText || "Explore Open Roles"}
                              </a>
                            </div>
                          </div>

                          {section.content?.imageUrl ? (
                            <div className="h-64 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                              <img src={section.content.imageUrl} alt="Hero feature" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div
                              className="h-64 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2"
                              style={{ borderRadius: `${cornerRadius}px` }}
                            >
                              <Sparkles className="w-8 h-8 opacity-40" />
                              <span className="text-xs font-bold">Hero Media Visual</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );

                /* 2. ABOUT US SECTION */
                case SectionType.ABOUT_US:
                  return (
                    <div
                      className="bg-white border border-slate-200/80 p-8 sm:p-10 space-y-6 shadow-2xs"
                      style={{ borderRadius: `${cornerRadius * 1.2}px` }}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-extrabold uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                          ABOUT US
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "About Our Mission"}</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {section.content?.body || company.aboutText}
                        </p>
                      </div>

                      {(section.content?.stat1Number || section.content?.stat2Number) && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                          {section.content?.stat1Number && (
                            <div>
                              <span className="block text-xl font-black text-slate-900" style={{ color: primaryColor }}>{section.content.stat1Number}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{section.content.stat1Label}</span>
                            </div>
                          )}
                          {section.content?.stat2Number && (
                            <div>
                              <span className="block text-xl font-black text-slate-900" style={{ color: primaryColor }}>{section.content.stat2Number}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{section.content.stat2Label}</span>
                            </div>
                          )}
                          {section.content?.stat3Number && (
                            <div>
                              <span className="block text-xl font-black text-slate-900" style={{ color: primaryColor }}>{section.content.stat3Number}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{section.content.stat3Label}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );

                /* 3. IMAGE + TEXT FEATURE SECTION */
                case SectionType.IMAGE_TEXT:
                  const isImageLeft = section.content?.imagePosition === "left";
                  return (
                    <div
                      className="bg-white border border-slate-200/80 p-8 sm:p-10 shadow-2xs"
                      style={{ borderRadius: `${cornerRadius * 1.2}px` }}
                    >
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isImageLeft ? "md:flex-row-reverse" : ""}`}>
                        {isImageLeft && (
                          <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                            <img src={section.content?.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"} alt="Feature" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="space-y-4">
                          <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                            FEATURE
                          </span>
                          <h2 className="text-2xl font-black text-slate-900">{section.title || "Our Innovation"}</h2>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {section.content?.body || section.content?.subtitle || "Learn about our culture and technology."}
                          </p>
                          {section.content?.ctaText && (
                            <a
                              href={section.content?.ctaLink || "#open-positions"}
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105"
                              style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
                            >
                              <span>{section.content.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {!isImageLeft && (
                          <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                            <img src={section.content?.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"} alt="Feature" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  );

                /* 4. CULTURE VIDEO SECTION */
                case SectionType.CULTURE_VIDEO:
                  return (
                    <div
                      className="bg-white border border-slate-200/80 p-8 sm:p-10 space-y-6 shadow-2xs"
                      style={{ borderRadius: `${cornerRadius * 1.2}px` }}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                          CULTURE & MEDIA
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "Life & Culture"}</h2>
                        {section.content?.description && (
                          <p className="text-xs text-slate-500">{section.content.description}</p>
                        )}
                      </div>

                      {section.content?.videoUrl ? (
                        <div
                          className="relative aspect-video overflow-hidden border border-slate-200 shadow-md bg-black"
                          style={{ borderRadius: `${cornerRadius}px` }}
                        >
                          <iframe
                            src={section.content.videoUrl}
                            title="Culture Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center p-6 space-y-3">
                          <Play className="w-12 h-12 text-teal-400 opacity-80" />
                          <span className="text-xs font-bold">Add video URL in Section Inspector</span>
                        </div>
                      )}
                    </div>
                  );

                /* 5. VALUES SECTION */
                case SectionType.VALUES:
                  return (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          VALUES
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "Our Principles"}</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(section.content?.values || []).map((val: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 p-6 space-y-2 shadow-2xs"
                            style={{ borderRadius: `${cornerRadius}px` }}
                          >
                            <div
                              className="w-7 h-7 flex items-center justify-center font-black text-xs text-white shadow-xs"
                              style={{
                                backgroundColor: primaryColor,
                                borderRadius: `${cornerRadius / 2}px`,
                              }}
                            >
                              0{idx + 1}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{val.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                /* 6. PERKS & BENEFITS SECTION */
                case SectionType.PERKS_BENEFITS:
                  return (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-200">
                          BENEFITS
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "Perks & Benefits"}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {(section.content?.perks || []).map((perk: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 p-5 space-y-2 shadow-2xs"
                            style={{ borderRadius: `${cornerRadius}px` }}
                          >
                            <h3 className="text-xs font-bold text-slate-900">{perk.title}</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{perk.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                /* 7. IMAGE GALLERY SECTION */
                case SectionType.GALLERY:
                  return (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                          GALLERY
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "Life at Our Offices"}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(section.content?.images || []).map((img: any, idx: number) => (
                          <div
                            key={idx}
                            className="group relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100"
                            style={{ borderRadius: `${cornerRadius}px` }}
                          >
                            <img src={img.url} alt={img.caption || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {img.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-[11px] font-semibold">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                /* 8. CUSTOM TEXT SECTION */
                case SectionType.CUSTOM_TEXT:
                  return (
                    <div
                      className="bg-white border border-slate-200/80 p-8 space-y-4 shadow-2xs"
                      style={{ borderRadius: `${cornerRadius * 1.2}px` }}
                    >
                      <div className="space-y-2">
                        {section.title && (
                          <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
                        )}
                        <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                          {section.content?.body || "Custom text content block."}
                        </div>
                      </div>
                    </div>
                  );

                /* 9. OPEN ROLES / JOBS SECTION */
                case SectionType.OPEN_ROLES:
                  return (
                    <div id="open-positions" className="space-y-6 pt-4 scroll-mt-20">
                      <div className="text-center space-y-1">
                        <h2 className="text-2xl font-black text-slate-900">{section.title || "Open Positions"}</h2>
                        <p className="text-xs text-slate-500">{section.content?.subtitle || "Join our world-class team."}</p>
                      </div>

                      <JobSearchFilter
                        jobs={jobs}
                        departments={departments}
                        locations={locations}
                        primaryColor={primaryColor}
                      />
                    </div>
                  );

                /* 10. CALL TO ACTION (CTA) SECTION */
                case SectionType.CTA:
                  return (
                    <div
                      className="p-8 sm:p-12 text-center text-white shadow-md relative overflow-hidden space-y-4"
                      style={{
                        backgroundColor: primaryColor,
                        borderRadius: `${cornerRadius * 1.5}px`,
                      }}
                    >
                      <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{section.title || "Ready to Join Us?"}</h2>
                      <p className="text-xs sm:text-sm opacity-90 max-w-xl mx-auto leading-relaxed">
                        {section.content?.subtitle || section.content?.body || "Take the next step in your career journey."}
                      </p>
                      <div className="pt-2">
                        <a
                          href={section.content?.ctaLink || "#open-positions"}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-extrabold text-xs shadow-lg transition-transform hover:scale-105"
                          style={{ borderRadius: `${cornerRadius}px` }}
                        >
                          <span>{section.content?.ctaText || "Apply Now"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            };

            if (!isPreviewMode) {
              return <section key={section.id}>{renderSectionBody()}</section>;
            }

            // Preview Mode Container with Hover Outline & Floating Action Toolbar
            return (
              <section
                key={section.id}
                onMouseEnter={() => setHoveredSectionId(section.id)}
                onMouseLeave={() => setHoveredSectionId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectSection) onSelectSection(section);
                }}
                className={`relative transition-all cursor-pointer rounded-2xl ${
                  isSelected
                    ? "ring-2 ring-teal-600 shadow-md"
                    : isHovered
                    ? "ring-2 ring-teal-400/80 shadow-2xs"
                    : !isEnabled
                    ? "opacity-50 grayscale"
                    : ""
                }`}
              >
                {/* Floating Hover & Selection Action Toolbar */}
                {(isHovered || isSelected) && (
                  <div className="absolute -top-4 left-4 z-50 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                    <span className="truncate max-w-[150px] text-teal-300">
                      {section.title || section.type}
                    </span>

                    <span className="text-slate-600">|</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMoveUp) onMoveUp(section.id);
                      }}
                      className="p-1 hover:text-teal-300 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMoveDown) onMoveDown(section.id);
                      }}
                      className="p-1 hover:text-teal-300 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDuplicateSection) onDuplicateSection(section.id);
                      }}
                      className="p-1 hover:text-teal-300 transition-colors"
                      title="Duplicate section"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleHideSection) onToggleHideSection(section.id, isEnabled);
                      }}
                      className="p-1 hover:text-teal-300 transition-colors"
                      title={isEnabled ? "Hide section" : "Show section"}
                    >
                      {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteSection) onDeleteSection(section.id);
                      }}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Delete section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {renderSectionBody()}
              </section>
            );
          })
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
