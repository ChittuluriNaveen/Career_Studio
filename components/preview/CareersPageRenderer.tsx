"use client";

import { useState } from "react";
import { SectionType } from "@prisma/client";
import { Sparkles, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Trash2, Menu, X, Briefcase, ExternalLink, Globe } from "lucide-react";
import JobSearchFilter from "@/components/candidate/JobSearchFilter";
import TemplateRenderer from "./TemplateRenderer";
import { SectionElement, getDefaultElementsForSectionType } from "@/lib/templates/registry";
import { getThemeByCompany } from "@/lib/themes/registry";

interface CareersPageRendererProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string | null;
    tagline?: string | null;
    aboutText?: string | null;
    cornerRadius?: number | null;
    sectionSpacing?: string | null;
    website?: string | null;
    description?: string | null;
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
  locations: Array<{ id: string; name: string; isRemote?: boolean }>;
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    jobType: any;
    department?: { name: string } | null;
    location?: { name: string } | null;
    createdAt: Date | string;
  }>;
  isPreviewMode?: boolean;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;
  onSelectSection?: (section: any) => void;
  onSelectElement?: (element: SectionElement, sectionId?: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicateSection?: (id: string) => void;
  onToggleHideSection?: (id: string, currentEnabled: boolean) => void;
  onDeleteSection?: (id: string) => void;
}

export default function CareersPageRenderer({
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
}: CareersPageRendererProps) {
  // Resolve Theme styling parameters dynamically
  const theme = getThemeByCompany(company);
  const primaryColor = company.primaryColor || theme.primaryColor;
  const cornerRadius = company.cornerRadius ?? 16;
  const sectionSpacing = company.sectionSpacing || "3.5rem";
  const fontFamily = company.fontFamily || theme.fontFamily;

  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter sections based on mode
  const activeSections = [...sections]
    .filter((sec) => (isPreviewMode ? true : sec.isPublished && sec.enabled !== false))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Helper for generating section anchor IDs
  const getSectionAnchorId = (type: SectionType, title?: string | null) => {
    switch (type) {
      case SectionType.HERO:
        return "hero";
      case SectionType.ABOUT_US:
        return "about";
      case SectionType.CULTURE_VIDEO:
        return "culture";
      case SectionType.PERKS_BENEFITS:
        return "benefits";
      case SectionType.GALLERY:
        return "gallery";
      case SectionType.OPEN_ROLES:
        return "jobs";
      case SectionType.CTA:
        return "cta";
      default:
        return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "section";
    }
  };

  const scrollToAnchor = (anchorId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Build dynamic navigation items
  const navItems = activeSections
    .filter((sec) => sec.enabled !== false)
    .map((sec) => ({
      id: getSectionAnchorId(sec.type, sec.title),
      label: sec.title || sec.type.replace("_", " "),
      type: sec.type,
    }));

  const isDarkMode = theme.mode === "dark";

  return (
    <div
      className="min-h-screen transition-colors flex flex-col font-sans w-full"
      style={{
        fontFamily,
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* 1. BRANDED HEADER NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-xl transition-all border-b ${
          isDarkMode
            ? "bg-slate-950/80 border-slate-800/80 text-white"
            : "bg-white/85 border-slate-200/80 text-slate-900"
        } shadow-sm`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToAnchor("hero")}>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} Logo`}
                className="w-10 h-10 object-cover border border-slate-200/50 shadow-md group-hover:scale-105 transition-transform"
                style={{ borderRadius: `${cornerRadius}px` }}
              />
            ) : (
              <div
                className="w-10 h-10 flex items-center justify-center font-black text-white text-lg shadow-md group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${cornerRadius}px`,
                }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-tight group-hover:text-cyan-400 transition-colors">
                {company.name}
              </span>
              <span className={`text-[11px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Careers Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToAnchor(item.id)}
                className={`text-xs font-bold transition-all cursor-pointer capitalize hover:scale-105 ${
                  isDarkMode
                    ? "text-slate-300 hover:text-cyan-400"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Header Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollToAnchor("jobs")}
              className="px-4 py-2 text-xs font-extrabold shadow-md transition-transform hover:scale-105 text-white flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                borderRadius: `${cornerRadius}px`,
              }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Roles ({jobs.length})</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden pt-4 pb-3 border-t mt-3 space-y-2 animate-in slide-in-from-top-2 duration-150 ${
              isDarkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToAnchor(item.id)}
                className={`block w-full text-left px-3 py-2 text-sm font-bold rounded-lg capitalize ${
                  isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-700/50">
              <button
                onClick={() => scrollToAnchor("jobs")}
                className="w-full py-2.5 px-4 text-xs font-bold text-white shadow-sm text-center rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                View Open Positions ({jobs.length})
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO MESH / BANNER BACKGROUND DECORATION */}
      {company.bannerUrl ? (
        <div className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden">
          <img src={company.bannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? "linear-gradient(180deg, rgba(3,7,18,0.2) 0%, rgba(3,7,18,0.95) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(248,250,252,0.95) 100%)",
            }}
          />
        </div>
      ) : (
        <div
          className="w-full h-24 sm:h-32 transition-all opacity-90"
          style={{ background: theme.heroBg }}
        />
      )}

      {/* 3. MAIN SCROLLABLE SECTIONS BODY */}
      <main
        className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12"
        style={{ paddingTop: sectionSpacing, paddingBottom: sectionSpacing }}
      >
        {activeSections.length === 0 ? (
          <div
            className={`text-center py-20 border rounded-3xl p-8 space-y-3 shadow-xl ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
            <h2 className="text-xl font-extrabold">Your Careers Website is Empty</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add section templates from the Careers Studio editor to build your company careers page.
            </p>
          </div>
        ) : (
          activeSections.map((section) => {
            const isSelected = selectedSectionId === section.id;
            const isHovered = hoveredSectionId === section.id;
            const isEnabled = section.enabled !== false;
            const anchorId = getSectionAnchorId(section.type, section.title);

            // Extract elements and templateId from section configuration
            const templateId = section.content?.templateId || `${section.type.toLowerCase()}-centered`;
            const elements: SectionElement[] =
              Array.isArray(section.content?.elements) && section.content.elements.length > 0
                ? section.content.elements
                : getDefaultElementsForSectionType(section.type);

            const renderJobsGrid =
              section.type === SectionType.OPEN_ROLES ? (
                <div id="open-positions" className="scroll-mt-24 pt-2">
                  <JobSearchFilter
                    jobs={jobs}
                    departments={departments}
                    locations={locations}
                    primaryColor={primaryColor}
                    theme={theme}
                    companySlug={company.slug}
                  />
                </div>
              ) : null;

            const renderSectionBody = () => (
              <div
                className="transition-all overflow-hidden shadow-lg border backdrop-blur-md"
                style={{
                  borderRadius: `${cornerRadius * 1.2}px`,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <TemplateRenderer
                  templateId={templateId}
                  elements={elements}
                  layout={section.content?.layout}
                  company={company}
                  jobsCount={jobs?.length || 0}
                  companyPrimaryColor={primaryColor}
                  isPreviewMode={isPreviewMode}
                  selectedElementId={selectedElementId}
                  onSelectElement={(elem) => {
                    if (onSelectSection) onSelectSection(section);
                    if (onSelectElement) onSelectElement(elem, section.id);
                  }}
                  jobsComponent={renderJobsGrid}
                />
              </div>
            );

            // Candidate Public Mode: Clean section rendering
            if (!isPreviewMode) {
              return (
                <section key={section.id} id={anchorId} className="scroll-mt-24">
                  {renderSectionBody()}
                </section>
              );
            }

            // Recruiter Design Canvas Mode: Section with selection ring & toolbar
            return (
              <section
                key={section.id}
                id={anchorId}
                onMouseEnter={() => setHoveredSectionId(section.id)}
                onMouseLeave={() => setHoveredSectionId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectSection) onSelectSection(section);
                }}
                className={`relative transition-all cursor-pointer rounded-2xl scroll-mt-24 ${
                  isSelected
                    ? "ring-2 ring-cyan-500 shadow-xl"
                    : isHovered
                    ? "ring-2 ring-cyan-400/70 shadow-2xs"
                    : !isEnabled
                    ? "opacity-50 grayscale"
                    : ""
                }`}
              >
                {/* Floating Editor Section Toolbar */}
                {(isHovered || isSelected) && (
                  <div className="absolute -top-4 left-4 z-50 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                    <span className="truncate max-w-[150px] text-cyan-300">
                      {section.title || section.type}
                    </span>

                    <span className="text-slate-600">|</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMoveUp) onMoveUp(section.id);
                      }}
                      className="p-1 hover:text-cyan-300 transition-colors"
                      title="Move section up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMoveDown) onMoveDown(section.id);
                      }}
                      className="p-1 hover:text-cyan-300 transition-colors"
                      title="Move section down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDuplicateSection) onDuplicateSection(section.id);
                      }}
                      className="p-1 hover:text-cyan-300 transition-colors"
                      title="Duplicate section"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleHideSection) onToggleHideSection(section.id, isEnabled);
                      }}
                      className="p-1 hover:text-cyan-300 transition-colors"
                      title={isEnabled ? "Hide section" : "Show section"}
                    >
                      {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
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
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {renderSectionBody()}
              </section>
            );
          })
        )}
      </main>

      {/* 4. BRANDED FOOTER */}
      <footer
        className={`border-t py-12 px-6 mt-16 transition-colors ${
          isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} Logo`}
                  className="w-8 h-8 object-cover border border-slate-700 shadow-sm"
                  style={{ borderRadius: `${cornerRadius}px` }}
                />
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
                >
                  {company.name.charAt(0)}
                </div>
              )}
              <span className="font-black text-base">{company.name}</span>
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {company.tagline || company.description || `Join ${company.name} and help build the future of our industry.`}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3">Careers Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToAnchor(item.id)}
                    className="hover:text-cyan-400 transition-colors capitalize cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-xs font-semibold">
              {company.website && (
                <li>
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                  >
                    <span>Main Website</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </li>
              )}
              <li>
                <button onClick={() => scrollToAnchor("jobs")} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  All Job Vacancies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`max-w-6xl mx-auto pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
            isDarkMode ? "border-slate-800/80 text-slate-500" : "border-slate-200 text-slate-400"
          }`}
        >
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="text-[11px]">Powered by WhiteCarrot Careers Studio</p>
        </div>
      </footer>
    </div>
  );
}
