"use client";

import { useState, useEffect } from "react";
import { SectionType } from "@prisma/client";
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Save,
  Check,
} from "lucide-react";

import DashboardHeader from "@/components/editor/DashboardHeader";
import LeftIconRail, { LeftNavTab } from "@/components/editor/LeftIconRail";
import PagesPanel from "@/components/editor/panels/PagesPanel";
import SectionList from "@/components/editor/SectionList";
import DesignPanel from "@/components/editor/panels/DesignPanel";
import SharePanel from "@/components/editor/panels/SharePanel";
import SEOPanel from "@/components/editor/panels/SEOPanel";
import ElementEditorPanel from "@/components/editor/panels/ElementEditorPanel";
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
import { SectionElement, ElementType, getDefaultElementsForSectionType, createDefaultElement } from "@/lib/templates/registry";

export default function CareerStudioPage() {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeNavTab, setActiveNavTab] = useState<LeftNavTab>("sections");
  const [inspectorTab, setInspectorTab] = useState<"content" | "element" | "config">("content");

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

  // Selected section and selected element for right Inspector editing
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
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

  const handleSelectSection = (section: any) => {
    setSelectedSectionId(section.id);
    setSelectedElementId(null);
    setInspectorTab("content");
  };

  const handleSelectElement = (element: SectionElement) => {
    setSelectedElementId(element.id);
    setInspectorTab("element");
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const currentElements: SectionElement[] =
    selectedSection && Array.isArray(selectedSection.content?.elements) && selectedSection.content.elements.length > 0
      ? selectedSection.content.elements
      : selectedSection
      ? getDefaultElementsForSectionType(selectedSection.type)
      : [];

  const selectedElement = currentElements.find((e) => e.id === selectedElementId);

  const handleAddElementToSection = (type: ElementType) => {
    if (!selectedSection || !type) return;
    const newElem = createDefaultElement(type, currentElements.length);
    const newElements = [...currentElements, newElem];
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
    setSelectedElementId(newElem.id);
    setInspectorTab("element");
  };

  const handleDeleteElementFromSection = (elemId: string) => {
    if (!selectedSection) return;
    const newElements = currentElements.filter((e) => e.id !== elemId);
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
    if (selectedElementId === elemId) setSelectedElementId(null);
  };

  const handleDuplicateElement = (elemId: string) => {
    if (!selectedSection) return;
    const target = currentElements.find((e) => e.id === elemId);
    if (!target) return;
    const copy: SectionElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      position: currentElements.length,
    };
    const newElements = [...currentElements, copy];
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
    setSelectedElementId(copy.id);
    setInspectorTab("element");
  };

  const handleMoveElement = (elemId: string, direction: "up" | "down") => {
    if (!selectedSection) return;
    const idx = currentElements.findIndex((e) => e.id === elemId);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === currentElements.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const newElements = [...currentElements];
    const temp = newElements[idx];
    newElements[idx] = newElements[targetIdx];
    newElements[targetIdx] = temp;

    const reordered = newElements.map((e, index) => ({ ...e, position: index }));
    const newContent = { ...(selectedSection.content || {}), elements: reordered };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
  };

  const handleUpdateElement = async (updatedElem: SectionElement) => {
    if (!selectedSection) return;

    const newElements = currentElements.map((e) => (e.id === updatedElem.id ? updatedElem : e));
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
    setSaveStatus("saving");

    await updateSectionContentAction({
      id: selectedSection.id,
      title: selectedSection.title || undefined,
      content: newContent,
    });

    setSaveStatus("saved");
  };

  const handleSaveInspector = async () => {
    if (!selectedSection) return;
    setSavingInspector(true);
    setSaveStatus("saving");

    await updateSectionContentAction({
      id: selectedSection.id,
      title: selectedSection.title || undefined,
      content: selectedSection.content || {},
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
                className="w-full mt-4 py-2.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
                    selectedElementId={selectedElementId}
                    onSelectSection={handleSelectSection}
                    onSelectElement={handleSelectElement}
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
                    selectedElementId={selectedElementId}
                    onSelectSection={handleSelectSection}
                    onSelectElement={handleSelectElement}
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
                    selectedElementId={selectedElementId}
                    onSelectSection={handleSelectSection}
                    onSelectElement={handleSelectElement}
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

        {/* Column 4: Contextual Right Inspector */}
        <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col justify-between flex-shrink-0 z-10 shadow-2xs overflow-y-auto">
          <div className="space-y-4">
            {/* Inspector Navigation Tabs */}
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
                  Section
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab("element")}
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all ${
                    inspectorTab === "element"
                      ? "border-teal-700 text-teal-800"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Element {selectedElement ? `(${selectedElement.type})` : ""}
                </button>
              </div>
            </div>

            {/* TAB 1: SECTION TEMPLATE & ELEMENTS TREE */}
            {inspectorTab === "content" && selectedSection && (
              <div className="space-y-4 text-xs">
                <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                  <span className="font-extrabold uppercase text-teal-900 block">{selectedSection.title || selectedSection.type}</span>
                  <span className="text-[11px] text-teal-700 font-mono">
                    Template: {selectedSection.content?.templateId || "default"}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Display Title</label>
                  <input
                    type="text"
                    value={selectedSection.title || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSections((prev) =>
                        prev.map((s) => (s.id === selectedSectionId ? { ...s, title: val } : s))
                      );
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSectionForModal(selectedSection);
                      setIsAddModalOpen(true);
                    }}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Change Section Template</span>
                  </button>
                </div>

                {/* Section Elements Manager & Tree */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px]">
                      Elements in Section ({currentElements.length})
                    </span>
                  </div>

                  {/* Add Element Select */}
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddElementToSection(e.target.value as ElementType);
                        e.target.value = "";
                      }
                    }}
                    className="w-full p-2 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">+ Add Element to Section...</option>
                    <option value="heading">Heading (H1 / H2 / H3)</option>
                    <option value="text">Text / Paragraph</option>
                    <option value="image">Image</option>
                    <option value="video">Video Embed</option>
                    <option value="button">CTA Button</option>
                    <option value="badge">Badge Pill</option>
                    <option value="stats">Stats Grid</option>
                    <option value="list">Benefits List</option>
                    <option value="gallery">Photo Gallery</option>
                    <option value="divider">Divider Line</option>
                    <option value="spacer">Vertical Spacer</option>
                  </select>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {currentElements.map((elem, idx) => {
                      const isElemSelected = selectedElementId === elem.id;
                      return (
                        <div
                          key={elem.id}
                          onClick={() => handleSelectElement(elem)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isElemSelected
                              ? "bg-teal-50 border-teal-600 ring-1 ring-teal-600 font-bold"
                              : "bg-slate-50/80 border-slate-200 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[9px] font-mono uppercase font-bold">
                              {elem.type}
                            </span>
                            <span className="truncate text-xs font-semibold text-slate-800">
                              {elem.content?.text || elem.content?.label || elem.content?.alt || `${elem.type} #${idx + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveElement(elem.id, "up");
                              }}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveElement(elem.id, "down");
                              }}
                              disabled={idx === currentElements.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElementFromSection(elem.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Delete Element"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ELEMENT LEVEL INSPECTOR */}
            {inspectorTab === "element" && (
              <>
                {selectedElement ? (
                  <ElementEditorPanel
                    element={selectedElement}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElementFromSection}
                    onDuplicateElement={handleDuplicateElement}
                  />
                ) : (
                  <div className="text-center py-8 space-y-2 text-slate-400">
                    <span className="text-2xl">👆</span>
                    <p className="text-xs font-semibold text-slate-600">No element selected</p>
                    <p className="text-[11px] text-slate-400">Click any heading, text, image, video, or button on the live canvas to edit its properties.</p>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveInspector}
            disabled={savingInspector}
            className="w-full mt-4 py-2.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            {savingInspector ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Bottom Left Floating Issue Badge */}
      <div className="fixed bottom-3 left-3 z-50 flex items-center gap-1.5 bg-[#dc2626] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-700/50">
        <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black">
          N
        </span>
        <span>1 Issue</span>
        <button
          type="button"
          onClick={(e) => {
            const pill = e.currentTarget.parentElement;
            if (pill) pill.style.display = "none";
          }}
          className="ml-1 text-white/80 hover:text-white font-bold text-xs"
        >
          ×
        </button>
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
