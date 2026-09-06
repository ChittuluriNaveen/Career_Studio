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
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
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

  const handleElementDrop = (e: React.DragEvent, targetElemId: string) => {
    e.preventDefault();
    if (!selectedSection || !draggedElementId || draggedElementId === targetElemId) return;

    const oldIdx = currentElements.findIndex((elem) => elem.id === draggedElementId);
    const newIdx = currentElements.findIndex((elem) => elem.id === targetElemId);
    if (oldIdx < 0 || newIdx < 0) return;

    const newElements = [...currentElements];
    const [moved] = newElements.splice(oldIdx, 1);
    newElements.splice(newIdx, 0, moved);

    const reordered = newElements.map((elem, index) => ({ ...elem, position: index }));
    const newContent = { ...(selectedSection.content || {}), elements: reordered };

    const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
    setSections(updatedSections);
    pushHistory(updatedSections);
    setDraggedElementId(null);
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

  const handleReorderSections = async (newSections: any[]) => {
    setSections(newSections);
    pushHistory(newSections);
    setSaveStatus("saving");

    await updateSectionOrderAction({
      sections: newSections.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
    });

    setSaveStatus("saved");
  };

  const handleMoveUp = async (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const reordered = [...sections];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;

    const updated = reordered.map((s, index) => ({ ...s, orderIndex: index }));
    handleReorderSections(updated);
  };

  const handleMoveDown = async (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;

    const updated = reordered.map((s, index) => ({ ...s, orderIndex: index }));
    handleReorderSections(updated);
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
        <div className="w-88 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-10 shadow-2xs">
          {activeNavTab === "pages" && company && <PagesPanel companySlug={company.slug} />}
          
          {activeNavTab === "sections" && (
            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-black text-base text-slate-900 tracking-tight">Sections Architecture</h2>
                    <p className="text-xs text-slate-500 font-medium">Reorder, select & customize sections</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("templates")}
                    className="flex items-center gap-1.5 text-xs bg-teal-50 text-[#005d52] hover:bg-teal-100 font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-teal-200 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
                  onReorderSections={handleReorderSections}
                />
              </div>
            </div>
          )}

          {activeNavTab === "design" && company && (
            <DesignPanel
              company={company}
              onCompanyUpdated={(updated) => setCompany(updated)}
              onUpdate={fetchStudioData}
            />
          )}
          {activeNavTab === "share" && company && <SharePanel companySlug={company.slug} />}
          {activeNavTab === "seo" && company && <SEOPanel company={company} />}
        </div>

        {/* Column 3: Center Responsive Preview Canvas */}
        <div className="flex-1 bg-slate-200/80 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] border border-slate-300 relative ${
              deviceMode === "mobile"
                ? "w-[375px] ring-8 ring-slate-400/40 my-4"
                : deviceMode === "tablet"
                ? "w-[768px] ring-8 ring-slate-400/40 my-4"
                : "w-full max-w-5xl my-2"
            }`}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005d52]" />
                <p className="text-xs text-slate-500 font-bold">Loading Careers Studio...</p>
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
        <div className="w-88 bg-white border-l border-slate-200 flex flex-col justify-between flex-shrink-0 p-4 z-10 overflow-y-auto shadow-2xs">
          <div className="space-y-4">
            {/* Inspector Navigation Tabs */}
            <div className="flex border-b border-slate-200 pb-2 gap-1.5 text-xs font-black">
              <button
                type="button"
                onClick={() => setInspectorTab("content")}
                className={`flex-1 py-2 px-3 rounded-xl text-center transition-all cursor-pointer ${
                  inspectorTab === "content"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Section
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("templates")}
                className={`flex-1 py-2 px-3 rounded-xl text-center transition-all cursor-pointer ${
                  inspectorTab === "templates"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Templates
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("element")}
                className={`flex-1 py-2 px-3 rounded-xl text-center transition-all cursor-pointer relative ${
                  inspectorTab === "element"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Element
                {selectedElement && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#005d52] ring-2 ring-white"></span>
                )}
              </button>
            </div>

            {/* TAB 1: SECTION CONTENT & ELEMENTS TREE */}
            {inspectorTab === "content" && selectedSection && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {selectedSection.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectorTab("templates")}
                      className="text-xs font-bold text-[#005d52] hover:underline"
                    >
                      Switch Template →
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Section Title</label>
                    <input
                      type="text"
                      value={selectedSection.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, title: newTitle } : s));
                        setSections(updated);
                      }}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005d52] text-slate-900"
                    />
                  </div>

                  {/* Show link in Navbar Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-extrabold text-slate-900 block">Show Link in Header Navbar</label>
                      <span className="text-[11px] text-slate-500 block font-medium">Toggle header link visibility</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedSection.content?.showInNav !== false}
                      onChange={(e) => {
                        const showInNav = e.target.checked;
                        const updatedContent = { ...(selectedSection.content || {}), showInNav };
                        const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s));
                        setSections(updated);
                      }}
                      className="w-4.5 h-4.5 text-[#005d52] rounded border-slate-300 focus:ring-[#005d52] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Section Card Container Aesthetics Controls */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-900">Card Container Appearance</span>
                    <span className="text-[11px] text-slate-500 font-semibold">Frame & Shadow</span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Card Background Mode</label>
                    <select
                      value={selectedSection.content?.cardStyles?.background || "default"}
                      onChange={(e) => {
                        const bg = e.target.value;
                        const currentStyles = selectedSection.content?.cardStyles || {};
                        const updatedContent = {
                          ...(selectedSection.content || {}),
                          cardStyles: { ...currentStyles, background: bg },
                        };
                        setSections(sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s)));
                      }}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005d52] text-slate-900 cursor-pointer"
                    >
                      <option value="default">Default Theme Card</option>
                      <option value="solid-white">Solid White Card</option>
                      <option value="dark-glass">Dark Glassmorphism</option>
                      <option value="transparent">Transparent (Seamless)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Card Shadow Preset</label>
                    <select
                      value={selectedSection.content?.cardStyles?.shadow || "lg"}
                      onChange={(e) => {
                        const shadow = e.target.value;
                        const currentStyles = selectedSection.content?.cardStyles || {};
                        const updatedContent = {
                          ...(selectedSection.content || {}),
                          cardStyles: { ...currentStyles, shadow },
                        };
                        setSections(sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s)));
                      }}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005d52] text-slate-900 cursor-pointer"
                    >
                      <option value="none">No Shadow (Flat)</option>
                      <option value="sm">Small Soft Shadow</option>
                      <option value="md">Medium Shadow</option>
                      <option value="lg">Large Elevated Shadow (Default)</option>
                      <option value="xl">Extra Large Floating Shadow</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-extrabold text-slate-800">Card Corner Radius</label>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {selectedSection.content?.cardStyles?.borderRadius ?? 16}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={selectedSection.content?.cardStyles?.borderRadius ?? 16}
                      onChange={(e) => {
                        const borderRadius = Number(e.target.value);
                        const currentStyles = selectedSection.content?.cardStyles || {};
                        const updatedContent = {
                          ...(selectedSection.content || {}),
                          cardStyles: { ...currentStyles, borderRadius },
                        };
                        setSections(sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s)));
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005d52]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-extrabold text-slate-800">Card Border Width</label>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {selectedSection.content?.cardStyles?.borderWidth ?? 1}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={selectedSection.content?.cardStyles?.borderWidth ?? 1}
                      onChange={(e) => {
                        const borderWidth = Number(e.target.value);
                        const currentStyles = selectedSection.content?.cardStyles || {};
                        const updatedContent = {
                          ...(selectedSection.content || {}),
                          cardStyles: { ...currentStyles, borderWidth },
                        };
                        setSections(sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s)));
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005d52]"
                    />
                  </div>
                </div>

                {/* Elements Tree Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Elements Tree</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddElementToSection(e.target.value as ElementType);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs font-extrabold bg-teal-50 text-[#005d52] border border-teal-200 rounded-xl px-2.5 py-1.5 cursor-pointer shadow-2xs"
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

                  {/* List of Section Elements with Drag & Drop */}
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {currentElements.map((elem, idx) => {
                      const isSelected = selectedElementId === elem.id;
                      const isDragging = draggedElementId === elem.id;

                      const typeColor =
                        elem.type === "heading"
                          ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                          : elem.type === "button"
                          ? "bg-teal-100 text-[#005d52] border-teal-200"
                          : elem.type === "image"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : elem.type === "video"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : elem.type === "stats"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200";

                      return (
                        <div
                          key={elem.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", elem.id);
                            setDraggedElementId(elem.id);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleElementDrop(e, elem.id)}
                          onClick={() => handleSelectElement(elem, selectedSection.id)}
                          className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-grab active:cursor-grabbing transition-all ${
                            isSelected
                              ? "bg-teal-50 border-[#005d52] text-teal-950 font-bold shadow-xs ring-2 ring-[#005d52]/40"
                              : isDragging
                              ? "opacity-50 border-teal-400 bg-teal-50/50"
                              : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}.</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${typeColor}`}>
                              {elem.type}
                            </span>
                            <span className="font-bold text-slate-800 truncate text-xs">
                              {elem.content?.text || elem.content?.heading || elem.content?.url || elem.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveElement(elem.id, "up");
                              }}
                              disabled={idx === 0}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer font-bold"
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
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer font-bold"
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
                              className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-extrabold cursor-pointer"
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
