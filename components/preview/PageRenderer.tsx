"use client";

import { SectionType } from "@prisma/client";
import { Sparkles, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import JobSearchFilter from "@/components/candidate/JobSearchFilter";
import { useState } from "react";
import TemplateRenderer from "./TemplateRenderer";
import { SectionElement, getDefaultElementsForSectionType, getTemplateById } from "@/lib/templates/registry";

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
  selectedElementId?: string | null;
  onSelectSection?: (section: any) => void;
  onSelectElement?: (element: SectionElement) => void;
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
  selectedElementId,
  onSelectSection,
  onSelectElement,
  onMoveUp,
  onMoveDown,
  onDuplicateSection,
  onToggleHideSection,
  onDeleteSection,
}: PageRendererProps) {
  const primaryColor = company.primaryColor || "#005d52";
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
            const isSelected = selectedSectionId === section.id;
            const isHovered = hoveredSectionId === section.id;
            const isEnabled = section.enabled !== false;

            // Extract elements and templateId from section configuration
            const templateId = section.content?.templateId || `${section.type.toLowerCase()}-centered`;
            const elements: SectionElement[] =
              Array.isArray(section.content?.elements) && section.content.elements.length > 0
                ? section.content.elements
                : getDefaultElementsForSectionType(section.type);

            const renderJobsGrid =
              section.type === SectionType.OPEN_ROLES ? (
                <div id="open-positions" className="scroll-mt-20">
                  <JobSearchFilter
                    jobs={jobs}
                    departments={departments}
                    locations={locations}
                    primaryColor={primaryColor}
                  />
                </div>
              ) : null;

            const renderSectionBody = () => (
              <div
                className="bg-white border border-slate-200/80 shadow-2xs overflow-hidden transition-all"
                style={{ borderRadius: `${cornerRadius * 1.2}px` }}
              >
                <TemplateRenderer
                  templateId={templateId}
                  elements={elements}
                  layout={section.content?.layout}
                  companyPrimaryColor={primaryColor}
                  isPreviewMode={isPreviewMode}
                  selectedElementId={selectedElementId}
                  onSelectElement={onSelectElement}
                  jobsComponent={renderJobsGrid}
                />
              </div>
            );

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
