"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionType } from "@prisma/client";
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
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

import DashboardHeader from "@/components/editor/DashboardHeader";
import LeftIconRail, { LeftNavTab } from "@/components/editor/LeftIconRail";
import PagesPanel from "@/components/editor/panels/PagesPanel";
import SectionList from "@/components/editor/SectionList";
import DesignPanel from "@/components/editor/panels/DesignPanel";
import SharePanel from "@/components/editor/panels/SharePanel";
import SEOPanel from "@/components/editor/panels/SEOPanel";
import SectionFormModal from "@/components/editor/SectionFormModal";
import PageRenderer from "@/components/preview/PageRenderer";

import {
  getSectionsAction,
  deleteSectionAction,
  updateSectionContentAction,
  updateSectionOrderAction,
  toggleSectionVisibilityAction,
  duplicateSectionAction,
} from "@/lib/actions/sections";
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

export default function CareerStudioPage() {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeNavTab, setActiveNavTab] = useState<LeftNavTab>("sections");
  const [inspectorTab, setInspectorTab] = useState<"content" | "layout" | "config">("content");
  const [inspectorMode, setInspectorMode] = useState<"form" | "json">("form");

  const [company, setCompany] = useState<any | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // Undo / Redo Stack History
  const [history, setHistory] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Selected section for right Inspector editing
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [inspectorForm, setInspectorForm] = useState<any>({});
  const [inspectorJson, setInspectorJson] = useState<string>("");
  const [savingInspector, setSavingInspector] = useState(false);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSectionForModal, setEditingSectionForModal] = useState<any | null>(null);

  const pushHistory = (newSections: any[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, newSections]);
    setHistoryIndex(updatedHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSections(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSections(next);
    }
  };

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

      if (historyIndex === -1) {
        setHistory([secData]);
        setHistoryIndex(0);
      }

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

    setSaveStatus("saving");
    const updated = sections.map((sec) =>
      sec.id === selectedSectionId ? { ...sec, layoutVariant: variantId } : sec
    );

    setSections(updated);
    pushHistory(updated);
    setInspectorForm((prev: any) => ({ ...prev, layoutVariant: variantId }));

    await updateSectionContentAction({
      id: selectedSectionId,
      title: inspectorForm.title,
      content: selectedSection?.content || {},
      layoutVariant: variantId,
    });

    setSaveStatus("saved");
  };

  const handleSaveInspector = async () => {
    if (!selectedSectionId) return;
    setSavingInspector(true);
    setSaveStatus("saving");

    let updatedContent: any = {};
    if (inspectorMode === "json") {
      try {
        updatedContent = JSON.parse(inspectorJson);
      } catch (e) {
        alert("Invalid JSON format");
        setSavingInspector(false);
        setSaveStatus("unsaved");
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
    setSaveStatus("saved");
    fetchStudioData();
  };

  const handleDeleteSection = async (id: string) => {
    if (confirm("Delete section from careers page canvas?")) {
      setSaveStatus("saving");
      await deleteSectionAction(id);
      setSaveStatus("saved");
      fetchStudioData();
    }
  };

  const handleMoveUp = async (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const reordered = [...sections];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;

    const updated = reordered.map((s, index) => ({ ...s, orderIndex: index }));
    setSections(updated);
    pushHistory(updated);

    await updateSectionOrderAction({
      sections: updated.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
    });
  };

  const handleMoveDown = async (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;

    const updated = reordered.map((s, index) => ({ ...s, orderIndex: index }));
    setSections(updated);
    pushHistory(updated);

    await updateSectionOrderAction({
      sections: updated.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
    });
  };

  const handleDuplicateSection = async (id: string) => {
    setSaveStatus("saving");
    await duplicateSectionAction(id);
    setSaveStatus("saved");
    fetchStudioData();
  };

  const handleToggleHideSection = async (id: string, currentEnabled: boolean) => {
    setSaveStatus("saving");
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !currentEnabled } : sec
    );
    setSections(updated);
    pushHistory(updated);

    await toggleSectionVisibilityAction({ id, enabled: !currentEnabled });
    setSaveStatus("saved");
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Top Bar */}
      {company && (
        <DashboardHeader
          company={company}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          saveStatus={saveStatus}
        />
      )}

      {/* 4-Column Career Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Narrow Vertical Icon Rail */}
        <LeftIconRail activeTab={activeNavTab} setActiveTab={setActiveNavTab} />

        {/* Column 2: Switchable Secondary Panel */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-10 shadow-2xs">
          {activeNavTab === "pages" && company && <PagesPanel companySlug={company.slug} />}
          
          {activeNavTab === "sections" && (
            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Sections</h2>
                    <p className="text-[11px] text-slate-400">Draggable page outline ({sections.length})</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Saved
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
                className="w-full mt-4 py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Section</span>
              </button>
            </div>
          )}

          {activeNavTab === "design" && company && (
            <DesignPanel company={company} onCompanyUpdated={(c) => setCompany(c)} />
          )}

          {activeNavTab === "share" && company && <SharePanel companySlug={company.slug} />}

          {activeNavTab === "seo" && company && <SEOPanel company={company} />}
        </div>

        {/* Column 3: Large Central Live Website Preview */}
        <div className="flex-1 bg-slate-200/60 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start">
          {deviceMode === "desktop" && (
            <div className="device-frame-desktop w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-300">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-[11px] font-mono text-slate-600 flex items-center justify-center gap-1.5 shadow-2xs">
                  <span>🔒</span>
                  <span>https://{company?.slug || "acme"}.example.com/careers</span>
                </div>
              </div>
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={handleSelectSection}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDuplicateSection={handleDuplicateSection}
                    onToggleHideSection={handleToggleHideSection}
                    onDeleteSection={handleDeleteSection}
                  />
                )}
              </div>
            </div>
          )}

          {deviceMode === "tablet" && (
            <div className="device-frame-tablet w-[768px] max-w-full shadow-2xl rounded-3xl overflow-hidden bg-white border-8 border-slate-800">
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={handleSelectSection}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDuplicateSection={handleDuplicateSection}
                    onToggleHideSection={handleToggleHideSection}
                    onDeleteSection={handleDeleteSection}
                  />
                )}
              </div>
            </div>
          )}

          {deviceMode === "mobile" && (
            <div className="device-frame-mobile w-[375px] max-w-full shadow-2xl rounded-[40px] overflow-hidden bg-white border-[10px] border-slate-900 relative">
              <div className="w-32 h-4 bg-slate-900 mx-auto rounded-b-xl absolute top-0 inset-x-0 z-50 flex items-center justify-center">
                <span className="w-10 h-1 rounded-full bg-slate-700" />
              </div>
              <div className="pt-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {company && (
                  <PageRenderer
                    company={company}
                    sections={sections}
                    departments={departments}
                    locations={locations}
                    jobs={jobs}
                    isPreviewMode={true}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={handleSelectSection}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDuplicateSection={handleDuplicateSection}
                    onToggleHideSection={handleToggleHideSection}
                    onDeleteSection={handleDeleteSection}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Column 4: Contextual Right Inspector (Content / Layout / Config) */}
        <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col justify-between flex-shrink-0 z-10 shadow-2xs overflow-y-auto">
          <div className="space-y-4">
            {/* Inspector Tabs (Content | Layout | Config) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setInspectorTab("content")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    inspectorTab === "content"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab("layout")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    inspectorTab === "layout"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Layout
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab("config")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    inspectorTab === "config"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Config
                </button>
              </div>

              {inspectorTab === "content" && (
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
            {inspectorTab === "content" && (
              <>
                {selectedSection && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{selectedSection.title || selectedSection.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {selectedSection.id}</span>
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
                      <label className="block font-semibold text-slate-600 mb-1">Supporting Subtitle</label>
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
                      <label className="block font-semibold text-slate-600 mb-1">Primary Button Text</label>
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
            {inspectorTab === "layout" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Wireframe Layout Options</span>
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
            {inspectorTab === "config" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Section ID</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSectionId || ""}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Anchor ID</label>
                  <input
                    type="text"
                    placeholder="e.g. open-positions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Visibility Status</label>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200 uppercase">
                    Visible
                  </span>
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
