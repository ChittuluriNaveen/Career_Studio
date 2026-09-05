"use client";

import { useState, useEffect } from "react";
import { SectionType } from "@prisma/client";
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  X,
  Layers,
  Save,
  Trash2,
  Edit3,
  Check,
  Layout,
  Settings as ConfigIcon,
  Sliders,
  Sparkles,
} from "lucide-react";
import SectionFormModal from "@/components/editor/SectionFormModal";
import SectionList from "@/components/editor/SectionList";
import PageRenderer from "@/components/preview/PageRenderer";
import { getSectionsAction, deleteSectionAction, updateSectionContentAction } from "@/lib/actions/sections";
import { getBrandThemeAction } from "@/lib/actions/brand";
import { getJobsAction, getDepartmentsAndLocationsAction } from "@/lib/actions/jobs";

const LAYOUT_VARIANTS = [
  { id: "01", name: "Default Split", isDefault: true },
  { id: "02", name: "Stacked Center", isDefault: false },
  { id: "03", name: "Image Right", isDefault: false },
  { id: "04", name: "Image Left", isDefault: false },
  { id: "05", name: "Hero Color Solid", isDefault: false },
  { id: "06", name: "Minimal Text", isDefault: false },
  { id: "07", name: "Cards Grid 2-Col", isDefault: false },
  { id: "08", name: "Cards Grid 3-Col", isDefault: false },
];

export default function StudioEditorPage() {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState<"content" | "layout" | "config">("content");
  const [inspectorMode, setInspectorMode] = useState<"form" | "json">("form");

  const [company, setCompany] = useState<any | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected section for right Inspector editing
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [inspectorForm, setInspectorForm] = useState<any>({});
  const [inspectorJson, setInspectorJson] = useState<string>("");
  const [savingInspector, setSavingInspector] = useState(false);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSectionForModal, setEditingSectionForModal] = useState<any | null>(null);

  const fetchStudioData = async () => {
    try {
      const [compData, secData, jobsData, metaData] = await Promise.all([
        getBrandThemeAction(),
        getSectionsAction(),
        getJobsAction(),
        getDepartmentsAndLocationsAction(),
      ]);

      setCompany(compData);
      setSections(secData);
      setJobs(jobsData);
      setDepartments(metaData.departments);
      setLocations(metaData.locations);

      if (secData.length > 0 && !selectedSectionId) {
        setSelectedSectionId(secData[0].id);
        populateInspector(secData[0]);
      }
    } catch (err) {
      console.error("Failed to load studio data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudioData();
  }, []);

  const populateInspector = (section: any) => {
    if (!section) return;
    setInspectorForm({
      title: section.title || "",
      subtitle: section.content?.subtitle || "",
      body: section.content?.body || "",
      videoUrl: section.content?.videoUrl || "",
      imageUrl: section.content?.imageUrl || section.content?.backgroundImage || "",
      ctaText: section.content?.ctaText || "Explore Open Roles",
      primaryCtaLink: section.content?.primaryCtaLink || section.content?.ctaLink || "",
      layoutVariant: section.layoutVariant || "01",
    });
    setInspectorJson(JSON.stringify(section.content || {}, null, 2));
  };

  const handleSelectSection = (section: any) => {
    setSelectedSectionId(section.id);
    populateInspector(section);
  };

  const handleSelectLayoutVariant = async (variantId: string) => {
    if (!selectedSectionId) return;

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === selectedSectionId ? { ...sec, layoutVariant: variantId } : sec
      )
    );
    setInspectorForm((prev: any) => ({ ...prev, layoutVariant: variantId }));

    await updateSectionContentAction({
      id: selectedSectionId,
      title: inspectorForm.title,
      content: selectedSection?.content || {},
      layoutVariant: variantId,
    });
  };

  const handleSaveInspector = async () => {
    if (!selectedSectionId) return;
    setSavingInspector(true);

    let updatedContent: any = {};
    if (inspectorMode === "json") {
      try {
        updatedContent = JSON.parse(inspectorJson);
      } catch (e) {
        alert("Invalid JSON format");
        setSavingInspector(false);
        return;
      }
    } else {
      updatedContent = {
        ...(selectedSection?.content || {}),
        subtitle: inspectorForm.subtitle,
        body: inspectorForm.body,
        videoUrl: inspectorForm.videoUrl,
        imageUrl: inspectorForm.imageUrl,
        backgroundImage: inspectorForm.imageUrl,
        ctaText: inspectorForm.ctaText,
        ctaLink: inspectorForm.primaryCtaLink,
        primaryCtaLink: inspectorForm.primaryCtaLink,
      };
    }

    await updateSectionContentAction({
      id: selectedSectionId,
      title: inspectorForm.title,
      content: updatedContent,
      layoutVariant: inspectorForm.layoutVariant,
    });

    setSavingInspector(false);
    fetchStudioData();
  };

  const handleDeleteSection = async (id: string) => {
    if (confirm("Delete section from careers page canvas?")) {
      await deleteSectionAction(id);
      fetchStudioData();
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-3">
      {/* Top Viewport Switcher Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 px-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>Careers Canvas Studio</span>
          </div>
          {company && (
            <a
              href={`/${company.slug}/careers/preview`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview draft</span>
            </a>
          )}
        </div>

        {/* Device Mode Buttons */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "mobile"
                ? "bg-teal-800 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "tablet"
                ? "bg-teal-800 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === "desktop"
                ? "bg-teal-800 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          {deviceMode === "mobile" ? "Mobile Viewport" : deviceMode === "tablet" ? "Tablet Frame" : "Desktop Browser"}
        </div>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Column 1: Sections Canvas — dnd-kit drag-to-reorder */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto shadow-2xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Sections</h2>
                <p className="text-[11px] text-slate-400">Drag to reorder</p>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {sections.length}
              </span>
            </div>

            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">Loading sections...</div>
            ) : (
              <SectionList
                initialSections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={handleSelectSection}
                onEditSection={(sec) => {
                  setEditingSectionForModal(sec);
                  setIsAddModalOpen(true);
                }}
                onDeleteSection={handleDeleteSection}
                onSectionsUpdated={fetchStudioData}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingSectionForModal(null);
              setIsAddModalOpen(true);
            }}
            className="w-full mt-4 py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Section</span>
          </button>
        </div>

        {/* Column 2: Center Interactive Live Device Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start overflow-y-auto pr-1">
          {deviceMode === "desktop" && (
            <div className="device-frame-desktop w-full">
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-0.5 text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
                  <span>🔒</span>
                  <span>{company?.slug}.whitecarrot.careers/careers</span>
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                  />
                )}
              </div>
            </div>
          )}

          {deviceMode === "tablet" && (
            <div className="device-frame-tablet w-[768px] max-w-full">
              <div className="max-h-[600px] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                  />
                )}
              </div>
            </div>
          )}

          {deviceMode === "mobile" && (
            <div className="device-frame-mobile w-[375px] max-w-full">
              <div className="pt-5 max-h-[600px] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Right Inspector Panel (Content / Layout / Config) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto shadow-2xs">
          <div className="space-y-4">
            {/* Inspector Tabs (Content | Layout | Config) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "content"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("layout")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "layout"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Layout
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("config")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "config"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Config
                </button>
              </div>

              {activeTab === "content" && (
                <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setInspectorMode("form")}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      inspectorMode === "form" ? "bg-teal-800 text-white" : "text-slate-500"
                    }`}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorMode("json")}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      inspectorMode === "json" ? "bg-teal-800 text-white" : "text-slate-500"
                    }`}
                  >
                    JSON
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: CONTENT FORM EDITING */}
            {activeTab === "content" && (
              <>
                {selectedSection && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{selectedSection.title || selectedSection.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">Section ID: {selectedSection.id}</span>
                    </div>
                  </div>
                )}

                {inspectorMode === "form" ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Headline</label>
                      <input
                        type="text"
                        value={inspectorForm.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectorForm({ ...inspectorForm, title: val });
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSectionId ? { ...s, title: val } : s))
                          );
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Supporting text</label>
                      <textarea
                        rows={3}
                        value={inspectorForm.subtitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectorForm({ ...inspectorForm, subtitle: val });
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSectionId
                                ? { ...s, content: { ...s.content, subtitle: val } }
                                : s
                            )
                          );
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Main Body Narrative</label>
                      <textarea
                        rows={4}
                        value={inspectorForm.body}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectorForm({ ...inspectorForm, body: val });
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSectionId
                                ? { ...s, content: { ...s.content, body: val } }
                                : s
                            )
                          );
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">CTA Text</label>
                      <input
                        type="text"
                        value={inspectorForm.ctaText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectorForm({ ...inspectorForm, ctaText: val });
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSectionId
                                ? { ...s, content: { ...s.content, ctaText: val } }
                                : s
                            )
                          );
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Raw JSON Payload Editor</label>
                    <textarea
                      rows={12}
                      value={inspectorJson}
                      onChange={(e) => setInspectorJson(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 text-teal-400 font-mono text-[11px] rounded-xl border border-slate-800 focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                )}
              </>
            )}

            {/* TAB 2: LAYOUT VARIANTS */}
            {activeTab === "layout" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Wireframe Variant Options</span>
                <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {LAYOUT_VARIANTS.map((variant) => {
                    const isSelected = (inspectorForm.layoutVariant || "01") === variant.id;
                    return (
                      <div
                        key={variant.id}
                        onClick={() => handleSelectLayoutVariant(variant.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-teal-50 border-teal-600 text-teal-900 shadow-2xs font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono uppercase">Variant {variant.id}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{variant.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CONFIGURATION */}
            {activeTab === "config" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Section Identifier</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSectionId || ""}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Anchor Link ID</label>
                  <input
                    type="text"
                    placeholder="e.g. open-positions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveInspector}
            disabled={savingInspector}
            className="w-full mt-4 py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs"
          >
            {savingInspector ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Section Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add / Edit Section Modal */}
      <SectionFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchStudioData();
        }}
        sectionToEdit={editingSectionForModal}
      />
    </div>
  );
}
