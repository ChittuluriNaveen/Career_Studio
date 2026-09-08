"use client";

import React from "react";
import { SectionElement, SectionLayoutConfig, SectionCardStyles, getTemplateById } from "@/lib/templates/registry";
import ElementRenderer from "./elements/ElementRenderer";

interface TemplateRendererProps {
  templateId: string;
  elements: SectionElement[];
  layout?: SectionLayoutConfig;
  cardStyles?: SectionCardStyles;
  company?: any;
  jobsCount?: number;
  companyPrimaryColor?: string;
  isPreviewMode?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (element: SectionElement) => void;
  jobsComponent?: React.ReactNode;
  deviceMode?: "desktop" | "tablet" | "mobile";
  onNavigatePage?: (page: "careers" | "jobs" | "job-details", jobId?: string) => void;
}

export default function TemplateRenderer({
  templateId,
  elements,
  layout,
  cardStyles,
  company,
  jobsCount = 0,
  companyPrimaryColor = "#005d52",
  isPreviewMode = false,
  selectedElementId,
  onSelectElement,
  jobsComponent,
  deviceMode = "desktop",
  onNavigatePage,
}: TemplateRendererProps) {
  const template = getTemplateById(templateId);
  const layoutConfig = layout || template.layout;

  const horizAlign = cardStyles?.horizontalAlignment || layoutConfig.alignment || "left";
  const vertAlign = cardStyles?.verticalAlignment || "top";

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
      : cardStyles?.containerWidth === "narrow" || layoutConfig.container === "narrow"
      ? "max-w-3xl px-6"
      : cardStyles?.containerWidth === "full" || layoutConfig.container === "full"
      ? "w-full max-w-none px-0"
      : "max-w-7xl px-4 sm:px-6 lg:px-8";

  // Padding Y: disable default pyClass if explicit paddingTop/paddingBottom is set on cardStyles
  const hasExplicitPadding = Boolean(cardStyles?.paddingTop || cardStyles?.paddingBottom);
  const pyClass = hasExplicitPadding
    ? ""
    : vertAlign !== "top"
    ? "py-4 sm:py-6"
    : deviceMode === "mobile"
    ? "py-4 sm:py-6"
    : deviceMode === "tablet"
    ? "py-6 sm:py-8"
    : layoutConfig.paddingY === "sm"
    ? "py-4 sm:py-6"
    : layoutConfig.paddingY === "lg"
    ? "py-8 sm:py-12"
    : "py-6 sm:py-8";

  const horizAlignClass =
    horizAlign === "center"
      ? "items-center text-center mx-auto"
      : horizAlign === "right"
      ? "items-end text-right ml-auto"
      : "items-start text-left mr-auto";

  const vertAlignClass =
    vertAlign === "center"
      ? "justify-center"
      : vertAlign === "bottom"
      ? "justify-end"
      : "justify-start";

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

  const isLeftImage = leftElements.some((e) => e.type === "image" || e.type === "video");
  const leftColOrderClass = isLeftImage ? "order-2 md:order-1" : "order-1 md:order-1";
  const rightColOrderClass = isLeftImage ? "order-1 md:order-2" : "order-2 md:order-2";

  if (isSplitLayout && leftElements.length > 0 && rightElements.length > 0) {
    return (
      <div className={`w-full flex-1 flex flex-col ${vertAlignClass} mx-auto ${containerWidthClass} ${pyClass}`}>
        <div className={`grid ${splitGridClass} items-center min-w-0 w-full`}>
          {/* Left Column */}
          <div className={`space-y-4 min-w-0 ${leftColOrderClass}`}>
            {leftElements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                containerAlignment={horizAlign}
                company={company}
                jobsCount={jobsCount}
                companyPrimaryColor={companyPrimaryColor}
                isPreviewMode={isPreviewMode}
                isSelected={selectedElementId === element.id}
                onSelectElement={onSelectElement}
                deviceMode={deviceMode}
                onNavigatePage={onNavigatePage}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className={`space-y-4 min-w-0 ${rightColOrderClass}`}>
            {rightElements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                containerAlignment={horizAlign}
                company={company}
                jobsCount={jobsCount}
                companyPrimaryColor={companyPrimaryColor}
                isPreviewMode={isPreviewMode}
                isSelected={selectedElementId === element.id}
                onSelectElement={onSelectElement}
                deviceMode={deviceMode}
                onNavigatePage={onNavigatePage}
              />
            ))}
          </div>
        </div>

        {/* External Jobs Grid Component if needed */}
        {jobsComponent && <div className="mt-8 w-full">{jobsComponent}</div>}
      </div>
    );
  }

  // Standard Stacked Layout (Centered / Default)
  return (
    <div className={`w-full flex-1 flex flex-col ${vertAlignClass} ${horizAlignClass} mx-auto px-4 sm:px-6 md:px-8 ${containerWidthClass} ${pyClass} space-y-6`}>
      {activeElements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          containerAlignment={horizAlign}
          company={company}
          jobsCount={jobsCount}
          companyPrimaryColor={companyPrimaryColor}
          isPreviewMode={isPreviewMode}
          isSelected={selectedElementId === element.id}
          onSelectElement={onSelectElement}
          deviceMode={deviceMode}
          onNavigatePage={onNavigatePage}
        />
      ))}

      {/* External Jobs Grid Component if needed */}
      {jobsComponent && <div className="mt-8 w-full">{jobsComponent}</div>}
    </div>
  );
}
