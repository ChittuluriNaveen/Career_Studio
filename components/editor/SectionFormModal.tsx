"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SectionType } from "@prisma/client";
import {
  X,
  Save,
  Sparkles,
  Info,
  Image as ImageIcon,
  Tv,
  Heart,
  Grid,
  Type,
  Briefcase,
  Megaphone,
  Sliders,
  Check,
} from "lucide-react";
import { addSectionAction, updateSectionContentAction } from "@/lib/actions/sections";
import {
  TEMPLATE_REGISTRY,
  SectionTemplate,
  preserveElementsOnTemplateSwitch,
} from "@/lib/templates/registry";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionToEdit?: any | null;
}

export default function SectionFormModal({
  isOpen,
  onClose,
  sectionToEdit,
}: SectionFormModalProps) {
  const isEditing = !!sectionToEdit;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [type, setType] = useState<SectionType>(sectionToEdit?.type || SectionType.HERO);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("hero-centered");
  const [title, setTitle] = useState(sectionToEdit?.title || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  useEffect(() => {
    if (sectionToEdit) {
      setType(sectionToEdit.type);
      setSelectedTemplateId(sectionToEdit.content?.templateId || "hero-centered");
      setTitle(sectionToEdit.title || "");
    } else {
      setType(SectionType.HERO);
      setSelectedTemplateId("hero-centered");
      setTitle("Hero Banner");
    }
  }, [sectionToEdit, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSelectTemplate = (template: SectionTemplate) => {
    setType(template.sectionType);
    setSelectedTemplateId(template.templateId);
    setTitle(template.name);
  };

  const categories = [
    { id: "ALL", label: "All Templates" },
    { id: "HERO", label: "Hero Banner" },
    { id: "PEOPLE", label: "Team & Leadership Pillars" },
    { id: "DEPARTMENTS", label: "Company Departments" },
    { id: "TECH_STACK", label: "Tech Stack & Tools" },
    { id: "PROCESS", label: "Hiring Process Journey" },
    { id: "TESTIMONIALS", label: "Employee Testimonials" },
    { id: "ABOUT_US", label: "About Us" },
    { id: "CULTURE_VIDEO", label: "Culture & Video" },
    { id: "PERKS_BENEFITS", label: "Perks & Benefits" },
    { id: "GALLERY", label: "Photo Gallery" },
    { id: "OPEN_ROLES", label: "Open Roles" },
    { id: "CTA", label: "Call To Action" },
    { id: "CUSTOM_TEXT", label: "Custom Section" },
  ];

  const templatesList = Object.values(TEMPLATE_REGISTRY).filter((tmpl) =>
    activeCategory === "ALL" ? true : tmpl.sectionType === activeCategory
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const templateConfig = TEMPLATE_REGISTRY[selectedTemplateId] || TEMPLATE_REGISTRY["hero-centered"];

    const elementsToSave =
      isEditing && Array.isArray(sectionToEdit?.content?.elements) && sectionToEdit.content.elements.length > 0
        ? preserveElementsOnTemplateSwitch(sectionToEdit.content.elements, selectedTemplateId)
        : templateConfig.defaultElements;

    const contentPayload: any = {
      ...(sectionToEdit?.content || {}),
      templateId: selectedTemplateId,
      layout: templateConfig.layout,
      elements: elementsToSave,
    };

    let res;
    if (isEditing) {
      res = await updateSectionContentAction({
        id: sectionToEdit.id,
        title: title || templateConfig.name,
        content: contentPayload,
      });
    } else {
      res = await addSectionAction({
        type,
        title: title || templateConfig.name,
        content: contentPayload,
      });
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to save section");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? `Switch Template / Edit: ${title || type}` : "Select Section Template & Responsive Layout"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-teal-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Selection Cards Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Predefined Responsive Section Templates ({templatesList.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {templatesList.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.templateId;
                return (
                  <div
                    key={tmpl.templateId}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "bg-teal-50/90 border-teal-600 ring-2 ring-teal-600/30 shadow-sm font-bold"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{tmpl.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-700" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{tmpl.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-800 uppercase font-extrabold">
                        {tmpl.sectionType}
                      </span>
                      <span className="capitalize">{tmpl.layout.container} width</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section Heading"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#005d52] hover:bg-[#004a41] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? "Apply Template Changes" : "Add Section to Canvas"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
