"use client";

import { useState, useEffect } from "react";
import { TEMPLATE_REGISTRY, SectionTemplate } from "@/lib/templates/registry";
import { Sparkles, Check, Search, Plus, RefreshCw, Filter } from "lucide-react";

import TemplateVisualPreview from "./TemplateVisualPreview";

interface TemplatePickerPanelProps {
  selectedSection?: any | null;
  onApplyTemplateToSection: (templateId: string) => void;
  onAddNewSectionFromTemplate: (templateId: string) => void;
}

export default function TemplatePickerPanel({
  selectedSection,
  onApplyTemplateToSection,
  onAddNewSectionFromTemplate,
}: TemplatePickerPanelProps) {
  const [mode, setMode] = useState<"apply" | "new">("apply");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterBySelectedType, setFilterBySelectedType] = useState<boolean>(true);

  // Sync category filter with selected section type when section changes
  useEffect(() => {
    if (mode === "apply" && selectedSection?.type) {
      setActiveCategory(selectedSection.type);
    }
  }, [selectedSection?.id, selectedSection?.type, mode]);

  const categories = [
    { id: "ALL", label: "All" },
    { id: "HERO", label: "Hero" },
    { id: "ABOUT_US", label: "About" },
    { id: "CULTURE_VIDEO", label: "Culture" },
    { id: "PERKS_BENEFITS", label: "Perks" },
    { id: "GALLERY", label: "Gallery" },
    { id: "OPEN_ROLES", label: "Jobs" },
    { id: "CTA", label: "CTA" },
    { id: "CUSTOM_TEXT", label: "Custom" },
  ];

  const currentTemplateId = selectedSection?.content?.templateId;

  // Filter templates list: when applying to an active section and filterBySelectedType is true, restrict strictly to selected section's type
  const templatesList = Object.values(TEMPLATE_REGISTRY).filter((tmpl) => {
    if (mode === "apply" && selectedSection?.type && filterBySelectedType) {
      if (tmpl.sectionType !== selectedSection.type) return false;
    } else if (activeCategory !== "ALL") {
      if (tmpl.sectionType !== activeCategory) return false;
    }

    const matchesSearch = searchQuery
      ? tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });

  const handleSelectTemplate = (tmpl: SectionTemplate) => {
    if (mode === "apply" && selectedSection) {
      onApplyTemplateToSection(tmpl.templateId);
    } else {
      onAddNewSectionFromTemplate(tmpl.templateId);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Mode Switcher: Apply to Selected vs Add New Section */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setMode("apply")}
          disabled={!selectedSection}
          className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
            mode === "apply"
              ? "bg-white text-teal-800 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800 disabled:opacity-40"
          }`}
        >
          <RefreshCw className="w-3 h-3" />
          <span>Apply to Selected</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("new");
            setActiveCategory("ALL");
          }}
          className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
            mode === "new"
              ? "bg-teal-800 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plus className="w-3 h-3" />
          <span>+ Add as New</span>
        </button>
      </div>

      {/* Target & Filtering Banner */}
      <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-950 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="truncate pr-2 font-bold text-xs">
            {mode === "apply" && selectedSection ? (
              <>Section: <span className="text-teal-700">{selectedSection.title || selectedSection.type}</span></>
            ) : (
              <>Create & Append New Section</>
            )}
          </span>
          <span className="font-mono text-[9px] bg-teal-200/80 px-2 py-0.5 rounded-full text-teal-900 font-extrabold uppercase shrink-0">
            {mode === "apply" ? selectedSection?.type || "ACTIVE" : "NEW"}
          </span>
        </div>

        {mode === "apply" && selectedSection?.type && (
          <div className="flex items-center justify-between pt-1 border-t border-teal-200/60 text-[10px]">
            <span className="text-slate-600 font-medium">Showing templates for {selectedSection.type}</span>
            <button
              type="button"
              onClick={() => setFilterBySelectedType(!filterBySelectedType)}
              className="text-teal-800 hover:text-teal-950 font-bold underline cursor-pointer"
            >
              {filterBySelectedType ? "Show All Types" : "Only Relevant"}
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${selectedSection && filterBySelectedType && mode === "apply" ? selectedSection.type : ""} templates...`}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Category Pills (Visible when in 'new' mode or when 'Show All Types' is toggled) */}
      {(mode === "new" || !filterBySelectedType) && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Filtered Template Cards List */}
      <div className="space-y-2 max-h-[calc(100vh-23rem)] overflow-y-auto pr-1">
        {templatesList.length === 0 ? (
          <div className="text-center py-8 space-y-2 bg-slate-50 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-600">No matching templates found</p>
            {filterBySelectedType && (
              <button
                type="button"
                onClick={() => setFilterBySelectedType(false)}
                className="text-[11px] text-teal-700 font-bold underline"
              >
                Click to view templates from all categories
              </button>
            )}
          </div>
        ) : (
          templatesList.map((tmpl) => {
            const isCurrent = mode === "apply" && currentTemplateId === tmpl.templateId;
            return (
              <div
                key={tmpl.templateId}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`group p-3.5 rounded-2xl border transition-all cursor-pointer space-y-3 hover:border-[#005d52] hover:shadow-md ${
                  isCurrent
                    ? "bg-teal-50/90 border-[#005d52] ring-2 ring-[#005d52]/40 shadow-xs font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {/* Visual Thumbnail Mockup */}
                <TemplateVisualPreview templateId={tmpl.templateId} sectionType={tmpl.sectionType} />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-[#005d52] transition-colors">{tmpl.name}</span>
                    {isCurrent && <Check className="w-4 h-4 text-[#005d52] font-black" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{tmpl.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#005d52] border border-teal-200 uppercase font-black">
                    {tmpl.sectionType}
                  </span>
                  <span className="capitalize font-bold text-slate-600">{tmpl.layout.container} width</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
