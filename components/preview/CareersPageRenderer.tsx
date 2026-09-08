"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SectionType } from "@prisma/client";
import { Sparkles, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Trash2, Menu, X, Briefcase, ExternalLink, Globe } from "lucide-react";
import JobSearchFilter from "@/components/candidate/JobSearchFilter";
import TemplateRenderer from "./TemplateRenderer";
import { SectionElement, getDefaultElementsForSectionType } from "@/lib/templates/registry";
import { getThemeByCompany } from "@/lib/themes/registry";
import { resolveSectionContainerStyles } from "@/lib/templates/stylesResolver";
import LazySectionReveal from "@/components/ui/LazySectionReveal";
import CandidateFooter from "@/components/candidate/CandidateFooter";

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
  deviceMode?: "desktop" | "tablet" | "mobile";
  onNavigatePage?: (page: "careers" | "jobs" | "job-details") => void;
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
  deviceMode = "desktop",
  onNavigatePage,
}: CareersPageRendererProps) {
  const [effectiveDeviceMode, setEffectiveDeviceMode] = useState<"desktop" | "tablet" | "mobile">(deviceMode);

  useEffect(() => {
    if (isPreviewMode) {
      setEffectiveDeviceMode(deviceMode);
      return;
    }

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setEffectiveDeviceMode("mobile");
      else if (w < 1024) setEffectiveDeviceMode("tablet");
      else setEffectiveDeviceMode("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPreviewMode, deviceMode]);

  // Resolve Theme styling parameters dynamically
  const theme = getThemeByCompany(company);
  const primaryColor = company.primaryColor || theme.primaryColor;
  const cornerRadius = company.cornerRadius ?? 16;
  const sectionSpacing = company.sectionSpacing || "3.5rem";
  const fontFamily = company.fontFamily || theme.fontFamily;

  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-scroll center canvas container to selected section without scrolling browser window
  useEffect(() => {
    if (isPreviewMode && selectedSectionId) {
      const targetElement = document.getElementById(`section-${selectedSectionId}`);
      if (targetElement) {
        const container = targetElement.closest(".overflow-y-auto");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = targetElement.getBoundingClientRect();
          const offset = elementRect.top - containerRect.top + container.scrollTop - 24;
          container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
        }
      }
    }
  }, [selectedSectionId, isPreviewMode]);

  // Filter sections based on mode
  const activeSections = [...sections]
    .filter((sec) => (isPreviewMode ? true : sec.enabled !== false))
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
    const element =
      document.getElementById(anchorId) ||
      document.querySelector(`[data-anchor="${anchorId}"]`) ||
      document.getElementById("open-positions");

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatNavLabel = (sec: any) => {
    if (sec.content?.navLabel) return sec.content.navLabel;
    if (!sec.title) return sec.type.replace("_", " ");
    const cleaned = sec.title
      .replace(/Full Banner Background|Side-by-Side|Cards Grid|Grid 3-Column|Embed|Spotlight|Timeline|Showcase|Banner|Grid/gi, "")
      .replace(/ - /g, " ")
      .trim();
    return cleaned || sec.title;
  };

  // Build dynamic navigation items with unique keys
  const navItems = activeSections
    .filter((sec) => sec.enabled !== false && sec.content?.showInNav !== false)
    .map((sec, idx) => ({
      key: sec.id ? `nav-${sec.id}` : `nav-${sec.type}-${idx}`,
      id: getSectionAnchorId(sec.type, sec.title),
      label: formatNavLabel(sec),
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
          <nav className={effectiveDeviceMode === "mobile" ? "hidden" : "hidden md:flex items-center gap-6"}>
            {navItems.map((item) => {
              const isJobsNav = item.type === SectionType.OPEN_ROLES || item.id === "jobs" || item.id === "open-positions";
              return isJobsNav && !isPreviewMode ? (
                <Link
                  key={item.key}
                  href={`/${company.slug}/careers/jobs`}
                  className={`text-xs font-bold transition-all cursor-pointer capitalize hover:scale-105 ${
                    isDarkMode
                      ? "text-slate-300 hover:text-cyan-400"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => scrollToAnchor(item.id)}
                  className={`text-xs font-bold transition-all cursor-pointer capitalize hover:scale-105 ${
                    isDarkMode
                      ? "text-slate-300 hover:text-cyan-400"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Action Button */}
          <div className={effectiveDeviceMode === "mobile" ? "hidden" : "hidden sm:flex items-center gap-3"}>
            {isPreviewMode ? (
              <button
                type="button"
                onClick={() => (onNavigatePage ? onNavigatePage("jobs") : scrollToAnchor("jobs"))}
                className="px-4 py-2 text-xs font-extrabold shadow-md transition-transform hover:scale-105 text-white flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${cornerRadius}px`,
                }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore Open Roles ({jobs.length})</span>
              </button>
            ) : (
              <Link
                href={`/${company.slug}/careers/jobs`}
                className="px-4 py-2 text-xs font-extrabold shadow-md transition-transform hover:scale-105 text-white flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${cornerRadius}px`,
                }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore Open Roles ({jobs.length})</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${effectiveDeviceMode === "mobile" ? "block" : "md:hidden"} p-2 rounded-lg transition-colors ${
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
            className={`${effectiveDeviceMode === "mobile" ? "block" : "md:hidden"} pt-4 pb-3 border-t mt-3 space-y-2 animate-in slide-in-from-top-2 duration-150 ${
              isDarkMode ? "border-slate-800 text-white" : "border-slate-200 text-slate-900"
            }`}
          >
            {navItems.map((item) => {
              const isJobsNav = item.type === SectionType.OPEN_ROLES || item.id === "jobs" || item.id === "open-positions";
              return isJobsNav && !isPreviewMode ? (
                <Link
                  key={`mobile-${item.key}`}
                  href={`/${company.slug}/careers/jobs`}
                  className={`block w-full text-left px-3 py-2 text-sm font-bold rounded-lg capitalize ${
                    isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={`mobile-${item.key}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isJobsNav && onNavigatePage) {
                      onNavigatePage("jobs");
                    } else {
                      scrollToAnchor(item.id);
                    }
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm font-bold rounded-lg capitalize ${
                    isDarkMode ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-700/50">
              {isPreviewMode ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigatePage) onNavigatePage("jobs");
                  }}
                  className="block w-full py-2.5 px-4 text-xs font-bold text-white shadow-sm text-center rounded-lg cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  View Open Positions ({jobs.length})
                </button>
              ) : (
                <Link
                  href={`/${company.slug}/careers/jobs`}
                  className="block w-full py-2.5 px-4 text-xs font-bold text-white shadow-sm text-center rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  View Open Positions ({jobs.length})
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN SCROLLABLE SECTIONS BODY */}
      <main
        className="flex-1 w-full space-y-6 sm:space-y-8"
        style={{ paddingTop: sectionSpacing || "1.5rem", paddingBottom: sectionSpacing || "1.5rem" }}
      >
        {activeSections.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
          </div>
        ) : (
          activeSections.map((section) => {
            const isSelected = selectedSectionId === section.id;
            const isHovered = hoveredSectionId === section.id;
            const isEnabled = section.enabled !== false;
            const isHeroSection = section.type === SectionType.HERO;
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
                    deviceMode={effectiveDeviceMode}
                    isPreviewMode={isPreviewMode}
                    onNavigatePage={onNavigatePage}
                  />
                </div>
              ) : null;

            const renderSectionBody = () => {
              const cardStyles = section.content?.cardStyles || {};
              const { containerStyle, overlayStyle, contentStyle } = resolveSectionContainerStyles(
                cardStyles,
                effectiveDeviceMode,
                { ...theme, bannerUrl: company.bannerUrl, logoUrl: company.logoUrl }
              );

              return (
                <div className="transition-all w-full relative overflow-hidden group" style={containerStyle}>
                  {overlayStyle && <div style={overlayStyle} />}
                  <div style={contentStyle}>
                    <TemplateRenderer
                      templateId={templateId}
                      elements={elements}
                      layout={section.content?.layout}
                      cardStyles={cardStyles}
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
                      deviceMode={effectiveDeviceMode}
                      onNavigatePage={onNavigatePage}
                    />
                  </div>
                </div>
              );
            };

            const sectionWrapperClass = isHeroSection
              ? "w-full"
              : "max-w-7xl mx-auto px-4 sm:px-6";

            // Candidate Public Mode: Clean section rendering with smooth lazy reveal
            if (!isPreviewMode) {
              return (
                <section key={section.id} id={anchorId} className={`scroll-mt-24 ${sectionWrapperClass}`}>
                  <LazySectionReveal direction="up" threshold={0.08}>
                    {renderSectionBody()}
                  </LazySectionReveal>
                </section>
              );
            }

            // Recruiter Design Canvas Mode: Section with selection ring & toolbar
            return (
              <div key={section.id} className={sectionWrapperClass}>
                <section
                  id={`section-${section.id}`}
                  data-anchor={anchorId}
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
            </div>
          );
        })
      )}
    </main>

      {/* 4. BRANDED FOOTER WITH CONTACT INFO AND SOCIAL LOGOS */}
      <CandidateFooter
        company={company}
        theme={theme}
        jobsCount={jobs.length}
        locations={locations}
        isPreviewMode={isPreviewMode}
        onNavigatePage={onNavigatePage}
        navItems={navItems}
        onScrollToAnchor={scrollToAnchor}
      />
    </div>
  );
}
