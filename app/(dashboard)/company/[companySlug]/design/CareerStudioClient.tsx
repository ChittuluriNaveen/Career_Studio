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
import {
  SectionElement,
  ElementType,
  getDefaultElementsForSectionType,
  createDefaultElement,
  TEMPLATE_REGISTRY,
  preserveElementsOnTemplateSwitch,
} from "@/lib/templates/registry";
import TemplatePickerPanel from "@/components/editor/panels/TemplatePickerPanel";
import { addSectionAction } from "@/lib/actions/sections";

interface CareerStudioClientProps {
  companySlug: string;
}

export default function CareerStudioClient({ companySlug }: CareerStudioClientProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeNavTab, setActiveNavTab] = useState<LeftNavTab>("sections");
  const [inspectorTab, setInspectorTab] = useState<"content" | "templates" | "element">("content");

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const handleSelectSection = (section: any) => {
    setSelectedSectionId(section.id);
    setSelectedElementId(null);
    setInspectorTab("content");
  };

  const handleSelectElement = (element: SectionElement, sectionId?: string) => {
    if (sectionId && sectionId !== selectedSectionId) {
      setSelectedSectionId(sectionId);
    }
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

  const handleApplyTemplateInline = async (templateId: string) => {
    if (!selectedSection) return;

    const templateConfig = TEMPLATE_REGISTRY[templateId];
    if (!templateConfig) return;

    const elementsToSave =
      Array.isArray(selectedSection.content?.elements) && selectedSection.content.elements.length > 0
        ? preserveElementsOnTemplateSwitch(selectedSection.content.elements, templateId)
        : templateConfig.defaultElements;

    const newContent = {
      ...(selectedSection.content || {}),
      templateId,
      layout: templateConfig.layout,
      elements: elementsToSave,
    };

    const updatedSections = sections.map((s) =>
      s.id === selectedSection.id
        ? { ...s, type: templateConfig.sectionType, title: templateConfig.name, content: newContent }
        : s
    );

    setSections(updatedSections);
    pushHistory(updatedSections);
    setSaveStatus("saving");

    await updateSectionContentAction({
      id: selectedSection.id,
      title: templateConfig.name,
      content: newContent,
    });

    setSaveStatus("saved");
  };

  const handleAddNewSectionFromTemplateInline = async (templateId: string) => {
    const templateConfig = TEMPLATE_REGISTRY[templateId];
    if (!templateConfig) return;

    const contentPayload = {
      templateId,
      layout: templateConfig.layout,
      elements: templateConfig.defaultElements,
    };

    setSaveStatus("saving");
    const res = await addSectionAction({
      type: templateConfig.sectionType,
      title: templateConfig.name,
      content: contentPayload,
    });

    if (res.success && res.section) {
      setSaveStatus("saved");
      await fetchStudioData();
      setSelectedSectionId(res.section.id);
      setInspectorTab("content");
    }
  };

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
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden font-sans text-slate-900">
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
                    <h2 className="font-bold text-sm text-slate-900">Sections Architecture</h2>
                    <p className="text-[11px] text-slate-500">Reorder, select & manage sections</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("templates")}
                    className="flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-2 py-1 rounded-md transition-all cursor-pointer border border-indigo-200"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <SectionList
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={handleSelectSection}
                  onDeleteSection={handleDeleteSection}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onDuplicateSection={handleDuplicateSection}
                  onToggleHideSection={handleToggleHideSection}
                />
              </div>
            </div>
          )}

          {activeNavTab === "design" && company && <DesignPanel company={company} onUpdate={fetchStudioData} />}
          {activeNavTab === "share" && company && <SharePanel companySlug={company.slug} />}
          {activeNavTab === "seo" && company && <SEOPanel company={company} />}
        </div>

        {/* Column 3: Center Responsive Preview Canvas */}
        <div className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] border border-slate-300 relative ${
              deviceMode === "mobile"
                ? "w-[375px]"
                : deviceMode === "tablet"
                ? "w-[768px]"
                : "w-full max-w-5xl"
            }`}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                <p className="text-xs text-slate-500 font-medium">Loading Careers Studio...</p>
              </div>
            ) : company ? (
              <PageRenderer
                company={company}
                sections={sections}
                jobs={jobs}
                departments={departments}
                locations={locations}
                selectedSectionId={selectedSectionId}
                selectedElementId={selectedElementId}
                onSelectSection={handleSelectSection}
                onSelectElement={handleSelectElement}
                isPreviewMode={true}
                deviceMode={deviceMode}
              />
            ) : null}
          </div>
        </div>

        {/* Column 4: Right Inspector Side Box */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between flex-shrink-0 p-4 z-10 overflow-y-auto shadow-2xs">
          <div className="space-y-4">
            {/* Inspector Navigation Tabs */}
            <div className="flex border-b border-slate-200 pb-2 gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInspectorTab("content")}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                  inspectorTab === "content"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Section
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("templates")}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                  inspectorTab === "templates"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Templates
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("element")}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer relative ${
                  inspectorTab === "element"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Element
                {selectedElement && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
                )}
              </button>
            </div>

            {/* TAB 1: SECTION CONTENT & ELEMENTS TREE */}
            {inspectorTab === "content" && selectedSection && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {selectedSection.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectorTab("templates")}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Switch Template →
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={selectedSection.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, title: newTitle } : s));
                        setSections(updated);
                      }}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Elements Tree Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Elements Tree</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddElementToSection(e.target.value as ElementType);
                          e.target.value = "";
                        }
                      }}
                      className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-2 py-1 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>+ Add Element</option>
                      <option value="heading">Heading</option>
                      <option value="text">Text Paragraph</option>
                      <option value="richtext">Rich Text</option>
                      <option value="button">Button CTA</option>
                      <option value="image">Image</option>
                      <option value="video">Video Embed</option>
                      <option value="badge">Badge</option>
                      <option value="icon">Icon Feature</option>
                      <option value="stats">Stat Metric</option>
                      <option value="gallery">Gallery Grid</option>
                      <option value="list">Feature List</option>
                      <option value="divider">Divider</option>
                      <option value="spacer">Spacer</option>
                    </select>
                  </div>

                  {/* List of Section Elements */}
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                    {currentElements.map((elem, idx) => {
                      const isSelected = selectedElementId === elem.id;
                      return (
                        <div
                          key={elem.id}
                          onClick={() => handleSelectElement(elem, selectedSection.id)}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                            <span className="font-semibold capitalize text-slate-800 truncate">
                              {elem.type}: {elem.content?.text || elem.content?.heading || elem.content?.url || elem.id}
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
                              className="p-1 text-slate-400 hover:text-red-600 font-bold"
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

            {/* TAB 2: INLINE TEMPLATE PICKER PANEL */}
            {inspectorTab === "templates" && (
              <TemplatePickerPanel
                selectedSection={selectedSection}
                onApplyTemplateToSection={handleApplyTemplateInline}
                onAddNewSectionFromTemplate={handleAddNewSectionFromTemplateInline}
              />
            )}

            {/* TAB 3: ELEMENT LEVEL INSPECTOR */}
            {inspectorTab === "element" && (
              <>
                {selectedElement ? (
                  <ElementEditorPanel
                    element={selectedElement}
                    company={company}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElementFromSection}
                    onDuplicateElement={handleDuplicateElement}
                    activeDeviceMode={deviceMode}
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
    </div>
  );
}
