"use client";

import React from "react";
import { SectionElement, SectionLayoutConfig, getTemplateById } from "@/lib/templates/registry";
import ElementRenderer from "./elements/ElementRenderer";

interface TemplateRendererProps {
  templateId: string;
  elements: SectionElement[];
  layout?: SectionLayoutConfig;
  company?: any;
  jobsCount?: number;
  companyPrimaryColor?: string;
  isPreviewMode?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (element: SectionElement) => void;
  jobsComponent?: React.ReactNode;
  deviceMode?: "desktop" | "tablet" | "mobile";
}

export default function TemplateRenderer({
  templateId,
  elements,
  layout,
  company,
  jobsCount = 0,
  companyPrimaryColor = "#005d52",
  isPreviewMode = false,
  selectedElementId,
  onSelectElement,
  jobsComponent,
  deviceMode = "desktop",
}: TemplateRendererProps) {
  const template = getTemplateById(templateId);
  const layoutConfig = layout || template.layout;

  // Filter & sort enabled elements by position
  const activeElements = [...elements]
    .filter((e) => e.enabled !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  // Determine container width class
  const containerWidthClass =
    deviceMode === "mobile"
      ? "w-full max-w-full px-3"
      : deviceMode === "tablet"
      ? "max-w-3xl px-4"
      : layoutConfig.container === "narrow"
      ? "max-w-3xl px-6"
      : layoutConfig.container === "full"
      ? "w-full max-w-none px-0"
      : "max-w-7xl px-4 sm:px-6 lg:px-8";

  // Padding Y
  const pyClass =
    deviceMode === "mobile"
      ? "py-6"
      : deviceMode === "tablet"
      ? "py-10"
      : layoutConfig.paddingY === "sm"
      ? "py-8"
      : layoutConfig.paddingY === "lg"
      ? "py-16 sm:py-24"
      : "py-12 sm:py-16";

  // Split layouts check (e.g. side-by-side split for hero-split, about-image-left, culture-split)
  const isSplitLayout =
    templateId.includes("split") ||
    templateId.includes("image-left") ||
    templateId.includes("image-right");

  const leftElements = isSplitLayout
    ? activeElements.filter((e) => e.width === "half" && (e.position < 2 || templateId.includes("image-left") ? e.type === "image" : e.type !== "image"))
    : [];

  const rightElements = isSplitLayout
    ? activeElements.filter((e) => !leftElements.includes(e))
    : [];

  const splitGridClass =
    deviceMode === "mobile"
      ? "grid-cols-1 gap-4"
      : deviceMode === "tablet"
      ? "grid-cols-1 md:grid-cols-2 gap-6"
      : "grid-cols-1 md:grid-cols-2 gap-8 md:gap-12";

  if (isSplitLayout && leftElements.length > 0 && rightElements.length > 0) {
    return (
      <div className={`w-full mx-auto ${containerWidthClass} ${pyClass}`}>
        <div className={`grid ${splitGridClass} items-center min-w-0`}>
          {/* Left Column */}
          <div className="space-y-4 min-w-0">
            {leftElements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                company={company}
                jobsCount={jobsCount}
                companyPrimaryColor={companyPrimaryColor}
                isPreviewMode={isPreviewMode}
                isSelected={selectedElementId === element.id}
                onSelectElement={onSelectElement}
                deviceMode={deviceMode}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4 min-w-0">
            {rightElements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                company={company}
                jobsCount={jobsCount}
                companyPrimaryColor={companyPrimaryColor}
                isPreviewMode={isPreviewMode}
                isSelected={selectedElementId === element.id}
                onSelectElement={onSelectElement}
                deviceMode={deviceMode}
              />
            ))}
          </div>
        </div>

        {/* External Jobs Grid Component if needed */}
        {jobsComponent && <div className="mt-8">{jobsComponent}</div>}
      </div>
    );
  }

  // Standard Stacked Layout (Centered / Default)
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 md:px-8 ${containerWidthClass} ${pyClass} space-y-6`}>
      {activeElements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          company={company}
          jobsCount={jobsCount}
          companyPrimaryColor={companyPrimaryColor}
          isPreviewMode={isPreviewMode}
          isSelected={selectedElementId === element.id}
          onSelectElement={onSelectElement}
          deviceMode={deviceMode}
        />
      ))}

      {/* External Jobs Grid Component if needed */}
      {jobsComponent && <div className="mt-8">{jobsComponent}</div>}
    </div>
  );
}
