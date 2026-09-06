"use client";

import { useState, useEffect, useRef } from "react";
import { SectionType } from "@prisma/client";
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Save,
  Check,
  Sparkles,
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
import JobDetailsClient from "@/app/(public)/[companySlug]/careers/jobs/[jobId]/JobDetailsClient";
import JobPageEditorPanel from "@/components/editor/panels/JobPageEditorPanel";

import {
  getSectionsAction,
  deleteSectionAction,
  updateSectionContentAction,
  updateSectionOrderAction,
  toggleSectionVisibilityAction,
  duplicateSectionAction,
} from "@/lib/actions/sections";
import { getBrandThemeAction } from "@/lib/actions/brand";
import { getJobsAction, getDepartmentsAndLocationsAction, updateJobAction } from "@/lib/actions/jobs";
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
  const [activePage, setActivePage] = useState<"careers" | "job-details">("careers");
  const [activeNavTab, setActiveNavTab] = useState<LeftNavTab>("sections");
  const [inspectorTab, setInspectorTab] = useState<"content" | "templates" | "element">("content");

  // Collapsible Sidebars State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const [company, setCompany] = useState<any | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [jobSections, setJobSections] = useState<any[]>([
    {
      id: "job-sec-hero",
      type: "HERO",
      title: "Hero Banner & Job Title",
      enabled: true,
      orderIndex: 0,
      content: {
        title: "Senior Full-Stack Engineer",
        subtitle: "Join our high-performing core infrastructure team",
        ctaText: "Apply Now for this Role",
        showInNav: false,
        elements: [
          { id: "hero-dept-badge", type: "badge", position: 0, enabled: true, content: { text: "Engineering" } },
          { id: "hero-emptype-badge", type: "badge", position: 1, enabled: true, content: { text: "Full Time" } },
          { id: "hero-workmode-badge", type: "badge", position: 2, enabled: true, content: { text: "Hybrid" } },
          { id: "hero-title-heading", type: "heading", position: 3, enabled: true, content: { text: "Senior Full-Stack Engineer" } },
          { id: "hero-meta-text", type: "text", position: 4, enabled: true, content: { text: "Location & Compensation Metadata" } },
          { id: "hero-cta-btn", type: "button", position: 5, enabled: true, content: { text: "Apply Now for this Role" } },
        ],
      },
    },
    {
      id: "job-sec-about",
      type: "ABOUT_US",
      title: "About the Role Overview",
      enabled: true,
      orderIndex: 1,
      content: {
        title: "About the Role",
        showInNav: true,
        elements: [
          { id: "about-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "About the Role" } },
          { id: "about-sec-text", type: "text", position: 1, enabled: true, content: { text: "Role summary description paragraph" } },
        ],
      },
    },
    {
      id: "job-sec-responsibilities",
      type: "CUSTOM_TEXT",
      title: "Key Responsibilities",
      enabled: true,
      orderIndex: 2,
      content: {
        title: "Key Responsibilities",
        showInNav: true,
        elements: [
          { id: "resp-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "Key Responsibilities" } },
          { id: "resp-sec-list", type: "list", position: 1, enabled: true, content: { text: "Responsibilities checklist" } },
        ],
      },
    },
    {
      id: "job-sec-requirements",
      type: "CUSTOM_TEXT",
      title: "Qualifications & Requirements",
      enabled: true,
      orderIndex: 3,
      content: {
        title: "Qualifications & Requirements",
        showInNav: true,
        elements: [
          { id: "req-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "Qualifications & Requirements" } },
          { id: "req-sec-list", type: "list", position: 1, enabled: true, content: { text: "Requirements checklist" } },
        ],
      },
    },
    {
      id: "job-sec-benefits",
      type: "PERKS_BENEFITS",
      title: "Perks & Benefits",
      enabled: true,
      orderIndex: 4,
      content: {
        title: "Perks & Benefits",
        showInNav: true,
        elements: [
          { id: "benefits-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "Perks & Benefits" } },
          { id: "benefits-sec-cards", type: "gallery", position: 1, enabled: true, content: { text: "Perks Grid Cards" } },
        ],
      },
    },
    {
      id: "job-sec-snapshot",
      type: "IMAGE_TEXT",
      title: "Job Snapshot Sidebar",
      enabled: true,
      orderIndex: 5,
      content: {
        title: "Job Snapshot",
        showInNav: false,
        elements: [
          { id: "snapshot-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "Job Snapshot" } },
          { id: "snapshot-sec-info", type: "text", position: 1, enabled: true, content: { text: "Job attributes summary" } },
          { id: "snapshot-sec-btn", type: "button", position: 2, enabled: true, content: { text: "Apply Now" } },
        ],
      },
    },
    {
      id: "job-sec-application",
      type: "CTA",
      title: "Candidate Application Form",
      enabled: true,
      orderIndex: 6,
      content: {
        title: "Apply for this Position",
        subtitle: "Submit your details below to start your application process.",
        buttonText: "Submit Application",
        showInNav: false,
        elements: [
          { id: "app-sec-heading", type: "heading", position: 0, enabled: true, content: { text: "Apply for this Position" } },
          { id: "app-sec-subtitle", type: "text", position: 1, enabled: true, content: { text: "Form subtitle note" } },
          { id: "app-sec-submit-btn", type: "button", position: 2, enabled: true, content: { text: "Submit Application" } },
        ],
      },
    },
  ]);
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
    const cloned = JSON.parse(JSON.stringify(newSections));
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, cloned]);
    setHistoryIndex(updatedHistory.length);
    setSaveStatus("unsaved");
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const prevSections = JSON.parse(JSON.stringify(history[prevIdx]));
      setHistoryIndex(prevIdx);
      setSections(prevSections);
      setSaveStatus("saving");

      updateSectionOrderAction({
        sections: prevSections.map((s: any) => ({ id: s.id, orderIndex: s.orderIndex })),
      }).then(() => setSaveStatus("saved"));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const nextSections = JSON.parse(JSON.stringify(history[nextIdx]));
      setHistoryIndex(nextIdx);
      setSections(nextSections);
      setSaveStatus("saving");

      updateSectionOrderAction({
        sections: nextSections.map((s: any) => ({ id: s.id, orderIndex: s.orderIndex })),
      }).then(() => setSaveStatus("saved"));
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
        const clonedSec = JSON.parse(JSON.stringify(secData));
        setHistory([clonedSec]);
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

  const activeSections = activePage === "job-details" ? jobSections : sections;
  const selectedSection = activeSections.find((s) => s.id === selectedSectionId) || activeSections[0];

  const currentJob = {
    ...(jobs[0] || {
      id: "sample-job-1",
      title: "Senior Full-Stack Engineer",
      departmentName: "Engineering & Product",
      locationCity: "San Francisco, CA",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      summary: "Join our high-performing core infrastructure team to build next-generation scalable cloud software.",
      responsibilities: [
        "Design and deploy high-throughput microservices in TypeScript and Go.",
        "Partner with UX designers to build responsive, accessible web interfaces.",
        "Optimize PostgreSQL & Redis query performance for high-traffic workloads.",
      ],
      requirements: [
        "4+ years experience with Next.js, React, Node.js, and TypeScript.",
        "Strong understanding of relational databases and system design.",
        "Demonstrated ownership of production web software at scale.",
      ],
      preferredSkills: ["GraphQL", "Tailwind CSS", "Docker", "AWS/GCP"],
      benefits: [
        "100% Remote-first flexibility",
        "Competitive base salary + equity options",
        "$3,000 annual learning & growth stipend",
        "Comprehensive medical, dental, & vision insurance",
      ],
    }),
    company: company,
  };

  const handleUpdateActiveJobField = async (field: string, value: any) => {
    const updatedJob = { ...currentJob, [field]: value, company };
    if (jobs.length > 0) {
      setJobs([updatedJob, ...jobs.slice(1)]);
    } else {
      setJobs([updatedJob]);
    }

    if (updatedJob.id && !updatedJob.id.startsWith("sample-")) {
      setSaveStatus("saving");
      await updateJobAction(updatedJob.id, {
        title: updatedJob.title,
        departmentName: updatedJob.departmentName,
        employmentType: updatedJob.employmentType,
        workMode: updatedJob.workMode,
        locationCity: updatedJob.locationCity,
        locationCountry: updatedJob.locationCountry || "Global",
        salaryMin: updatedJob.salaryMin,
        salaryMax: updatedJob.salaryMax,
        currency: updatedJob.currency || "USD",
        salaryVisible: updatedJob.salaryVisible,
        summary: updatedJob.summary,
        responsibilities: Array.isArray(updatedJob.responsibilities)
          ? updatedJob.responsibilities
          : typeof updatedJob.responsibilities === "string"
          ? (updatedJob.responsibilities as string).split("\n").filter(Boolean)
          : [],
        requirements: Array.isArray(updatedJob.requirements)
          ? updatedJob.requirements
          : typeof updatedJob.requirements === "string"
          ? (updatedJob.requirements as string).split("\n").filter(Boolean)
          : [],
        preferredSkills: Array.isArray(updatedJob.preferredSkills)
          ? updatedJob.preferredSkills
          : [],
        benefits: Array.isArray(updatedJob.benefits)
          ? updatedJob.benefits
          : typeof updatedJob.benefits === "string"
          ? (updatedJob.benefits as string).split("\n").filter(Boolean)
          : [],
        status: updatedJob.status || "ACTIVE",
        expiryDate: updatedJob.expiryDate || null,
      });
      setSaveStatus("saved");
    }
  };

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

    if (activePage === "job-details") {
      setJobSections((prev) =>
        prev.map((s) =>
          s.id === selectedSection.id
            ? { ...s, type: templateConfig.sectionType, title: templateConfig.name, content: newContent }
            : s
        )
      );
      setSaveStatus("saved");
    } else {
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
    }
  };

  const handleAddNewSectionFromTemplateInline = async (templateId: string) => {
    const templateConfig = TEMPLATE_REGISTRY[templateId];
    if (!templateConfig) return;

    const contentPayload = {
      templateId,
      layout: templateConfig.layout,
      elements: templateConfig.defaultElements,
    };

    if (activePage === "job-details") {
      const newJobSec = {
        id: `job-sec-${Date.now()}`,
        type: templateConfig.sectionType,
        title: templateConfig.name,
        enabled: true,
        orderIndex: jobSections.length,
        content: contentPayload,
      };
      setJobSections((prev) => [...prev, newJobSec]);
      setSelectedSectionId(newJobSec.id);
      setInspectorTab("content");
    } else {
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
    }
  };

  const handleAddElementToSection = (type: ElementType) => {
    if (!selectedSection || !type) return;
    const newElem = createDefaultElement(type, currentElements.length);
    const newElements = [...currentElements, newElem];
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
    } else {
      const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
      setSections(updatedSections);
      pushHistory(updatedSections);
    }
    setSelectedElementId(newElem.id);
    setInspectorTab("element");
  };

  const handleDeleteElementFromSection = (elemId: string) => {
    if (!selectedSection) return;
    const newElements = currentElements.filter((e) => e.id !== elemId);
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
    } else {
      const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
      setSections(updatedSections);
      pushHistory(updatedSections);
    }
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

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
    } else {
      const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
      setSections(updatedSections);
      pushHistory(updatedSections);
    }
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

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
    } else {
      const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
      setSections(updatedSections);
      pushHistory(updatedSections);
    }
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

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
    } else {
      const updatedSections = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s));
      setSections(updatedSections);
      pushHistory(updatedSections);
    }
    setDraggedElementId(null);
  };

  const handleUpdateElement = async (updatedElem: SectionElement) => {
    if (!selectedSection) return;

    const newElements = currentElements.map((e) => (e.id === updatedElem.id ? updatedElem : e));
    const newContent = { ...(selectedSection.content || {}), elements: newElements };

    if (activePage === "job-details") {
      setJobSections((prev) => prev.map((s) => (s.id === selectedSection.id ? { ...s, content: newContent } : s)));
      const val = updatedElem.content?.text || updatedElem.content?.heading || updatedElem.content?.label;
      if (val !== undefined) {
        if (updatedElem.id === "hero-title-heading") {
          handleUpdateActiveJobField("title", val);
        } else if (updatedElem.id === "about-sec-text") {
          handleUpdateActiveJobField("summary", val);
        } else if (updatedElem.id === "resp-sec-list") {
          handleUpdateActiveJobField("responsibilities", val);
        } else if (updatedElem.id === "req-sec-list") {
          handleUpdateActiveJobField("requirements", val);
        } else if (updatedElem.id === "benefits-sec-cards") {
          handleUpdateActiveJobField("benefits", val);
        }
      }
      setSaveStatus("saved");
    } else {
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
    }
  };

  const handleSaveInspector = async () => {
    if (!selectedSection) return;
    setSavingInspector(true);
    setSaveStatus("saving");

    if (activePage === "careers") {
      await updateSectionContentAction({
        id: selectedSection.id,
        title: selectedSection.title || undefined,
        content: selectedSection.content || {},
      });
      await fetchStudioData();
    } else {
      if (currentJob.id && !currentJob.id.startsWith("sample-")) {
        await updateJobAction(currentJob.id, {
          title: currentJob.title,
          departmentName: currentJob.departmentName || "Engineering",
          employmentType: currentJob.employmentType || "FULL_TIME",
          workMode: currentJob.workMode || "HYBRID",
          locationCity: currentJob.locationCity || "Remote",
          locationCountry: currentJob.locationCountry || "Global",
          salaryMin: currentJob.salaryMin,
          salaryMax: currentJob.salaryMax,
          currency: currentJob.currency || "USD",
          salaryVisible: currentJob.salaryVisible,
          summary: currentJob.summary,
          responsibilities: Array.isArray(currentJob.responsibilities) ? currentJob.responsibilities : [],
          requirements: Array.isArray(currentJob.requirements) ? currentJob.requirements : [],
          preferredSkills: Array.isArray(currentJob.preferredSkills) ? currentJob.preferredSkills : [],
          benefits: Array.isArray(currentJob.benefits) ? currentJob.benefits : [],
          status: currentJob.status || "ACTIVE",
          expiryDate: currentJob.expiryDate || null,
        });
      }
    }

    setSavingInspector(false);
    setSaveStatus("saved");
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
          activePage={activePage}
          setActivePage={setActivePage}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          saveStatus={saveStatus}
          isLeftPanelOpen={isLeftPanelOpen}
          onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          isRightPanelOpen={isRightPanelOpen}
          onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          onPublishSuccess={fetchStudioData}
        />
      )}

      {/* 4-Column Career Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Column 1: Narrow Vertical Icon Rail */}
        <LeftIconRail
          activeTab={activeNavTab}
          setActiveTab={(tab) => {
            if (activeNavTab === tab && isLeftPanelOpen) {
              setIsLeftPanelOpen(false);
            } else {
              setActiveNavTab(tab);
              setIsLeftPanelOpen(true);
            }
          }}
        />

        {/* Column 2: Switchable Secondary Panel */}
        {isLeftPanelOpen && (
          <div className="w-88 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-10 shadow-2xs relative">
            {activeNavTab === "pages" && company && (
              <PagesPanel
                companySlug={company.slug}
                activePage={activePage}
                onSelectPage={(page) => setActivePage(page)}
              />
            )}
            
            {activeNavTab === "sections" && (
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
                {activePage === "job-details" ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100 pr-6">
                      <h2 className="font-black text-base text-slate-900 tracking-tight">Job Description View</h2>
                      <p className="text-xs text-slate-500 font-medium">Automatic Brand Theme Alignment</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-950 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#005d52]" />
                        <span className="font-extrabold text-xs">Brand Theme Synchronized</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        The Job Description page is a fixed, clean requisition view. It automatically adopts your company brand theme settings (colors, fonts, card corner radius, badge styling, and light/dark mode).
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveNavTab("design")}
                        className="w-full py-2.5 px-3 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
                      >
                        Customize Brand Design Theme →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 pr-6">
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
                )}
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
        )}

        {/* Column 3: Center Responsive Preview Canvas */}
        <div className="flex-1 bg-slate-200/80 overflow-y-auto p-4 md:p-6 flex justify-center items-start overflow-x-auto relative">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] border border-slate-300 relative ${
              deviceMode === "mobile"
                ? "w-[390px] max-w-full shrink-0 ring-8 ring-slate-400/40 my-4"
                : deviceMode === "tablet"
                ? "w-[768px] max-w-full shrink-0 ring-8 ring-slate-400/40 my-4"
                : "w-full max-w-none my-2"
            }`}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005d52]" />
                <p className="text-xs text-slate-500 font-bold">Loading Careers Studio...</p>
              </div>
            ) : company ? (
              activePage === "job-details" ? (
                <JobDetailsClient
                  companySlug={companySlug}
                  job={currentJob}
                  isPreviewMode={true}
                  onBackToCareers={() => setActivePage("careers")}
                  deviceMode={deviceMode}
                />
              ) : (
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
              )
            ) : null}
          </div>
        </div>

        {/* Column 4: Right Inspector Side Box */}
        {isRightPanelOpen && (
          <div className="w-88 bg-white border-l border-slate-200 flex flex-col justify-between flex-shrink-0 p-4 z-10 overflow-y-auto shadow-2xs relative">
            {activePage === "job-details" ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="font-black text-xs text-slate-900 uppercase tracking-wider">Job Page Theme Inherited</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Synced with primary brand design system</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-600">Primary Accent</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: company?.primaryColor || "#005d52" }}
                      />
                      <span className="font-mono font-bold text-slate-900">{company?.primaryColor || "#005d52"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-600">Typography</span>
                    <span className="font-bold text-slate-900">{company?.fontFamily || "Inter"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-600">Corner Radius</span>
                    <span className="font-mono font-bold text-slate-900">{company?.cornerRadius ?? 16}px</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNavTab("design")}
                  className="w-full py-2.5 px-4 bg-[#005d52] hover:bg-[#004a41] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Edit Brand Design Theme
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Inspector Navigation Tabs */}
                  <div className="flex border-b border-slate-200 pb-2 gap-1.5 text-xs font-black items-center">
                    <button
                      type="button"
                      onClick={() => setInspectorTab("content")}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer ${
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
                      className={`flex-1 py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer ${
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
                      className={`flex-1 py-2 px-2.5 rounded-xl text-center transition-all cursor-pointer relative ${
                        inspectorTab === "element"
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      Element
                      {selectedElement && (
                        <span className="absolute top-1.5 right-1.5 w-2 rounded-full bg-[#005d52] ring-2 ring-white"></span>
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
                              pushHistory(updated);
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
                              pushHistory(updated);
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
                              const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s));
                              setSections(updated);
                              pushHistory(updated);
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
                                cardStyles: { ...currentStyles, shadow: shadow },
                              };
                              const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s));
                              setSections(updated);
                              pushHistory(updated);
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
                              const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s));
                              setSections(updated);
                              pushHistory(updated);
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
                              const updated = sections.map((s) => (s.id === selectedSection.id ? { ...s, content: updatedContent } : s));
                              setSections(updated);
                              pushHistory(updated);
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
                                    {elem.content?.label || elem.content?.text || elem.content?.heading || elem.content?.title || elem.content?.subtitle || elem.content?.url || elem.content?.videoUrl || elem.id}
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
              </>
            )}
          </div>
        )}
    </div>
  </div>
);
}
