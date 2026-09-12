"use client";

import { useState } from "react";
import { SectionElement, ElementType } from "@/lib/templates/registry";
import {
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Video as VideoIcon,
  Type,
  Link2,
} from "lucide-react";
import ElementStylePanel from "./ElementStylePanel";
import { ElementStyles } from "@/lib/templates/registry";
import MediaPickerModal from "@/components/editor/MediaPickerModal";
import CompanyVariableChips from "@/components/editor/CompanyVariableChips";
import AIPolishButton from "@/components/editor/AIPolishButton";

export const TECH_STACK_PRESETS = [
  { name: "React 19", icon: "⚛️", category: "Frontend & SSR", description: "Server components, reactive hooks, and component architecture." },
  { name: "Next.js", icon: "▲", category: "Fullstack Framework", description: "App Router, Turbopack, and server-side rendering." },
  { name: "TypeScript", icon: "🔷", category: "Core Architecture", description: "Strict static typing and robust end-to-end API contracts." },
  { name: "Python", icon: "🐍", category: "AI & ML Engine", description: "Data engineering, machine learning pipelines, and LLM services." },
  { name: "PostgreSQL", icon: "🐘", category: "Database Layer", description: "Relational data persistence, schema indexing, and pooler connections." },
  { name: "Node.js", icon: "🟢", category: "Backend Microservices", description: "Event-driven runtime for high-performance API services." },
  { name: "AWS Cloud", icon: "☁️", category: "Infrastructure & CDN", description: "Cloud compute, S3 object storage, and global edge distribution." },
  { name: "Docker", icon: "🐳", category: "Containers", description: "Containerized deployment environments and orchestration." },
  { name: "Figma", icon: "🎨", category: "Product Design", description: "Design tokens, UI prototyping, and collaborative design specs." },
  { name: "PyTorch AI", icon: "🔥", category: "Deep Learning", description: "Neural network training, GPU acceleration, and model inference." },
  { name: "Redis", icon: "🔴", category: "In-Memory Cache", description: "High-speed caching, session store, and pub/sub messaging." },
  { name: "GraphQL", icon: "📐", category: "API Gateway", description: "Declarative data fetching and schema federation." },
  { name: "Go / Golang", icon: "🦫", category: "High-Concurrency", description: "Low-latency backend microservices and networking." },
  { name: "Rust", icon: "🦀", category: "Systems Engine", description: "Memory-safe systems programming and high-speed WASM modules." },
  { name: "Java", icon: "☕", category: "Enterprise Services", description: "Mission-critical enterprise backend architecture." },
  { name: "Kubernetes", icon: "☸️", category: "Container Orchestration", description: "Cluster management, auto-scaling, and resilience." },
  { name: "Tailwind CSS", icon: "💨", category: "Styling System", description: "Utility-first design tokens and modern responsive UI." },
  { name: "GitHub", icon: "🐙", category: "DevOps & CI/CD", description: "Version control, GitHub Actions, and code review workflows." },
  { name: "Slack", icon: "💬", category: "Team Operations", description: "Automated alert webhooks and real-time team communication." },
  { name: "MongoDB", icon: "🍃", category: "NoSQL Database", description: "Document-oriented database for rapid data model iteration." },
];

interface ElementEditorPanelProps {
  element: SectionElement;
  company?: any;
  onUpdateElement: (updated: SectionElement) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  activeDeviceMode?: "desktop" | "tablet" | "mobile";
}

export default function ElementEditorPanel({
  element,
  company,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  activeDeviceMode = "desktop",
}: ElementEditorPanelProps) {
  const [editorTab, setEditorTab] = useState<"content" | "style">("content");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"url" | "posterUrl">("url");
  const [activeItemMediaIndex, setActiveItemMediaIndex] = useState<number | null>(null);
  const [activeItemMediaProp, setActiveItemMediaProp] = useState<string>("url");

  const updateContentField = (key: string, value: any) => {
    onUpdateElement({
      ...element,
      content: {
        ...element.content,
        [key]: value,
      },
    });
  };

  const handleInsertTagToField = (key: string, tag: string) => {
    const currentVal = element.content[key] || "";
    updateContentField(key, currentVal ? `${currentVal} ${tag}` : tag);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
        <div>
          <span className="font-black uppercase text-[#005d52] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-xs tracking-wider inline-block">
            {element.type}
          </span>
          <span className="text-[11px] font-mono text-slate-500 block mt-1">ID: {element.id}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onDuplicateElement && (
            <button
              type="button"
              onClick={() => onDuplicateElement(element.id)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer shadow-2xs"
              title="Duplicate Element"
            >
              + Copy
            </button>
          )}
          {onDeleteElement && (
            <button
              type="button"
              onClick={() => onDeleteElement(element.id)}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
              title="Delete Element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs: Content vs Style */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-black gap-1">
        <button
          type="button"
          onClick={() => setEditorTab("content")}
          className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
            editorTab === "content"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setEditorTab("style")}
          className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
            editorTab === "style"
              ? "bg-slate-900 text-white shadow-xs font-black"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Style & Responsive
        </button>
      </div>

      {editorTab === "style" ? (
        <ElementStylePanel
          element={element}
          onUpdateElementStyles={(styles) => onUpdateElement({ ...element, styles })}
          onResetElementStyles={() => onUpdateElement({ ...element, styles: {} })}
          activeDeviceMode={activeDeviceMode}
        />
      ) : (
        <>

      {/* Alignment Selector */}
      <div>
        <label className="block font-bold text-slate-700 mb-1">Alignment</label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => onUpdateElement({ ...element, alignment: align })}
              className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 capitalize transition-all ${
                (element.alignment || "left") === align
                  ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
              {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
              {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
              <span>{align}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Column Width Selector */}
      <div>
        <label className="block font-bold text-slate-700 mb-1">Grid Column Width</label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["full", "half", "third"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onUpdateElement({ ...element, width: w })}
              className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 capitalize transition-all ${
                (element.width || "full") === w
                  ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{w}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ELEMENT SPECIFIC INPUTS */}

      {/* 1. Heading Element */}
      {element.type === "heading" && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => handleInsertTagToField("text", tag)}
            label="Insert Company Variable Chips (@)"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-600">Heading Text</label>
              <AIPolishButton
                currentText={element.content.text || element.content.title || element.content.heading || ""}
                type="heading"
                companyName={company?.name}
                onApplyEnhancedText={(enhanced) => updateContentField("text", enhanced)}
              />
            </div>
            <input
              type="text"
              value={element.content.text || element.content.title || element.content.heading || ""}
              onChange={(e) => updateContentField("text", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Heading Level</label>
            <select
              value={element.content.level || 2}
              onChange={(e) => updateContentField("level", parseInt(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
            >
              <option value={1}>H1 - Large Hero Headline</option>
              <option value={2}>H2 - Section Title</option>
              <option value={3}>H3 - Subtitle / Group Heading</option>
            </select>
          </div>
        </div>
      )}

      {/* 2. Text / Paragraph / Badge Element */}
      {(element.type === "text" || element.type === "badge") && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => handleInsertTagToField("text", tag)}
            label="Insert Company Variable Chips (@)"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-600">Text Content</label>
              <AIPolishButton
                currentText={element.content.text || element.content.subtitle || element.content.description || ""}
                type="description"
                companyName={company?.name}
                onApplyEnhancedText={(enhanced) => updateContentField("text", enhanced)}
              />
            </div>
            <textarea
              rows={4}
              value={element.content.text || element.content.subtitle || element.content.description || ""}
              onChange={(e) => updateContentField("text", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* 3. Image Element */}
      {element.type === "image" && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => handleInsertTagToField("url", tag)}
            label="Use Company Image Asset (@)"
          />

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Image URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={element.content.url || element.content.src || ""}
                onChange={(e) => updateContentField("url", e.target.value)}
                placeholder="https://... or @company_banner"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaTargetField("url");
                  setIsMediaPickerOpen(true);
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 font-bold whitespace-nowrap"
              >
                Browse
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Image Fit</label>
            <select
              value={element.content.fit || "cover"}
              onChange={(e) => updateContentField("fit", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            >
              <option value="cover">Cover (Fill container seamlessly)</option>
              <option value="contain">Contain (Fit entire image without cropping)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Alt Text (Accessibility)</label>
            <input
              type="text"
              value={element.content.alt || ""}
              onChange={(e) => updateContentField("alt", e.target.value)}
              placeholder="Descriptive text..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>
      )}

      {/* 4. Video Element */}
      {element.type === "video" && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => handleInsertTagToField("videoUrl", tag)}
            label="Use Company Video Asset (@)"
          />

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Video Embed URL (YouTube/Vimeo)</label>
            <input
              type="text"
              value={element.content.videoUrl || element.content.url || ""}
              onChange={(e) => updateContentField("videoUrl", e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Poster Thumbnail Image</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={element.content.posterUrl || ""}
                onChange={(e) => updateContentField("posterUrl", e.target.value)}
                placeholder="https://..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaTargetField("posterUrl");
                  setIsMediaPickerOpen(true);
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 font-bold whitespace-nowrap"
              >
                Browse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Button Element */}
      {element.type === "button" && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => handleInsertTagToField("label", tag)}
            label="Insert Company Variable Chips (@)"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-600">Button Label</label>
              <AIPolishButton
                currentText={element.content.label || element.content.text || element.content.ctaText || element.content.buttonText || ""}
                type="button"
                companyName={company?.name}
                onApplyEnhancedText={(enhanced) => {
                  onUpdateElement({
                    ...element,
                    content: {
                      ...element.content,
                      label: enhanced,
                      text: enhanced,
                    },
                  });
                }}
              />
            </div>
            <input
              type="text"
              value={element.content.label || element.content.text || element.content.ctaText || element.content.buttonText || ""}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateElement({
                  ...element,
                  content: {
                    ...element.content,
                    label: val,
                    text: val,
                  },
                });
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Link URL or Section Anchor (#)</label>
            <input
              type="text"
              value={element.content.linkUrl || element.content.url || ""}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateElement({
                  ...element,
                  content: {
                    ...element.content,
                    linkUrl: val,
                    url: val,
                  },
                });
              }}
              placeholder="#open-positions, #jobs, #about, #benefits, #culture, #apply or https://..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs mb-2"
            />

            {/* Quick Section Anchor Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Internal Section Anchor Links:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { tag: "#open-positions", label: "Open Positions" },
                  { tag: "#jobs", label: "Jobs Section" },
                  { tag: "#about", label: "About Us" },
                  { tag: "#benefits", label: "Perks & Benefits" },
                  { tag: "#culture", label: "Culture" },
                  { tag: "#hero", label: "Hero Top" },
                  { tag: "#apply", label: "Apply Now" },
                ].map((anchor) => (
                  <button
                    key={anchor.tag}
                    type="button"
                    onClick={() => {
                      onUpdateElement({
                        ...element,
                        content: {
                          ...element.content,
                          linkUrl: anchor.tag,
                          url: anchor.tag,
                        },
                      });
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      (element.content.linkUrl || element.content.url) === anchor.tag
                        ? "bg-teal-600 text-white border-teal-700 shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    }`}
                  >
                    {anchor.tag} ({anchor.label})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. List / Stats / Gallery / People / Departments / TechStack / Process / Testimonials Item Managers */}
      {(element.type === "stats" ||
        element.type === "list" ||
        element.type === "gallery" ||
        element.type === "people" ||
        element.type === "departments" ||
        element.type === "techstack" ||
        element.type === "process" ||
        element.type === "testimonials") && (
        <div className="space-y-3">
          <CompanyVariableChips
            company={company}
            onInsertVariable={(tag) => {
              // Appends variable to top element title or description if needed
              handleInsertTagToField("title", tag);
            }}
            label="Insert Company Variable Chips (@)"
          />

          <div className="flex items-center justify-between">
            <label className="block font-bold text-slate-700">
              {element.type === "people"
                ? `Team Pillars (${element.content.items?.length || 0})`
                : element.type === "departments"
                ? `Departments (${element.content.items?.length || 0})`
                : element.type === "techstack"
                ? `Tech Tools (${element.content.items?.length || 0})`
                : element.type === "process"
                ? `Process Steps (${element.content.items?.length || 0})`
                : element.type === "testimonials"
                ? `Testimonials (${element.content.items?.length || 0})`
                : `Items (${element.content.items?.length || 0})`}
            </label>
            <button
              type="button"
              onClick={() => {
                const currentItems = element.content.items || [];
                const newItem =
                  element.type === "people"
                    ? {
                        id: Date.now().toString(),
                        title: "New Team Member",
                        subtitle: "Role & Position",
                        description: "Bio story at @company_name...",
                        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                        linkUrl: "https://linkedin.com",
                      }
                    : element.type === "departments"
                    ? {
                        id: Date.now().toString(),
                        title: "New Department",
                        icon: "⚡",
                        value: "1 Role",
                        description: "Team description summary...",
                        linkUrl: "#open-positions",
                      }
                    : element.type === "techstack"
                    ? {
                        id: Date.now().toString(),
                        title: "New Technology",
                        icon: "🚀",
                        value: "Tool Category",
                        description: "How we use this tool at @company_name...",
                      }
                    : element.type === "process"
                    ? {
                        id: Date.now().toString(),
                        title: "Step: Interview Stage",
                        value: "30 Mins",
                        description: "Step details and interview expectations...",
                      }
                    : element.type === "testimonials"
                    ? {
                        id: Date.now().toString(),
                        title: "Teammate Name",
                        subtitle: "Role · Tenure at @company_name",
                        description: "“Working at @company_name has been transformational...”",
                        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                      }
                    : element.type === "stats"
                    ? { id: Date.now().toString(), title: "New Metric", value: "100+" }
                    : element.type === "gallery"
                    ? { id: Date.now().toString(), title: "New Photo", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" }
                    : { id: Date.now().toString(), title: "New Benefit", description: "Details..." };
                updateContentField("items", [...currentItems, newItem]);
              }}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] shadow-2xs cursor-pointer"
            >
              + Add {element.type === "people" ? "Teammate" : element.type === "departments" ? "Department" : element.type === "techstack" ? "Tool" : element.type === "process" ? "Step" : element.type === "testimonials" ? "Quote" : "Item"}
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {(element.content.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                  <span className="font-black text-[10px] text-teal-800 uppercase tracking-wider">
                    {element.type === "people"
                      ? `Pillar #${idx + 1}`
                      : element.type === "departments"
                      ? `Department #${idx + 1}`
                      : `Item #${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = element.content.items || [];
                      const updatedItems = currentItems.filter((_: any, i: number) => i !== idx);
                      updateContentField("items", updatedItems);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                  >
                    × Remove
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Name / Title</label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const updatedItems = [...(element.content.items || [])];
                      updatedItems[idx] = { ...updatedItems[idx], title: e.target.value };
                      updateContentField("items", updatedItems);
                    }}
                    placeholder="Name or Title"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                  />
                </div>

                {element.type === "people" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Role / Position Title</label>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], subtitle: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="e.g. Co-Founder & CEO"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Bio / Teammate Story</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="Teammate story or focus area at @company_name..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Avatar Photo URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = { ...updatedItems[idx], url: e.target.value };
                            updateContentField("items", updatedItems);
                          }}
                          placeholder="https://..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemMediaIndex(idx);
                            setActiveItemMediaProp("url");
                            setIsMediaPickerOpen(true);
                          }}
                          className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold text-[10px] cursor-pointer"
                        >
                          Browse
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Social Profile Link (LinkedIn)</label>
                      <input
                        type="text"
                        value={item.linkUrl || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], linkUrl: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </>
                )}

                {element.type === "departments" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Department Icon/Emoji</label>
                        <input
                          type="text"
                          value={item.icon || "🏢"}
                          onChange={(e) => {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = { ...updatedItems[idx], icon: e.target.value };
                            updateContentField("items", updatedItems);
                          }}
                          placeholder="💻, 🎨, 🚀"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Roles Count Badge</label>
                        <input
                          type="text"
                          value={item.value || ""}
                          onChange={(e) => {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = { ...updatedItems[idx], value: e.target.value };
                            updateContentField("items", updatedItems);
                          }}
                          placeholder="e.g. 3 Roles"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Department Description</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="Core mission and tech stack of this department..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Target Section Anchor</label>
                      <input
                        type="text"
                        value={item.linkUrl || "#open-positions"}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], linkUrl: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="#open-positions"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </>
                )}

                {element.type === "techstack" && (
                  <>
                    {/* Quick Select Tech Preset Dropdown */}
                    <div className="bg-teal-50/80 p-2.5 rounded-xl border border-teal-200/80 space-y-1">
                      <label className="block text-[10px] font-black uppercase text-teal-800 tracking-wider">
                        ⚡ Quick Select Preset Tool
                      </label>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const selected = TECH_STACK_PRESETS.find((p) => p.name === e.target.value);
                          if (selected) {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = {
                              ...updatedItems[idx],
                              title: selected.name,
                              icon: selected.icon,
                              value: selected.category,
                              description: selected.description,
                            };
                            updateContentField("items", updatedItems);
                          }
                        }}
                        className="w-full p-2 bg-white border border-teal-300 rounded-lg text-xs font-bold text-teal-950 focus:ring-2 focus:ring-teal-600 cursor-pointer"
                      >
                        <option value="" disabled>
                          -- Choose Popular Tool (1-Click Fill) --
                        </option>
                        {TECH_STACK_PRESETS.map((preset) => (
                          <option key={preset.name} value={preset.name}>
                            {preset.icon} {preset.name} ({preset.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Icon / Emoji / Custom Logo
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={item.icon || item.url || "⚙️"}
                            onChange={(e) => {
                              const updatedItems = [...(element.content.items || [])];
                              updatedItems[idx] = { ...updatedItems[idx], icon: e.target.value };
                              updateContentField("items", updatedItems);
                            }}
                            placeholder="⚛️ or https://... logo"
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItemMediaIndex(idx);
                              setActiveItemMediaProp("icon");
                              setIsMediaPickerOpen(true);
                            }}
                            className="px-2 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold text-[10px] whitespace-nowrap cursor-pointer"
                            title="Browse or upload custom logo image to DB"
                          >
                            Logo
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Category Badge</label>
                        <input
                          type="text"
                          value={item.value || ""}
                          onChange={(e) => {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = { ...updatedItems[idx], value: e.target.value };
                            updateContentField("items", updatedItems);
                          }}
                          placeholder="e.g. Frontend & SSR"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tool Description & Usage</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="How we use this technology at @company_name..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </>
                )}

                {element.type === "process" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Duration Badge</label>
                      <input
                        type="text"
                        value={item.value || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], value: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="e.g. 30 Mins or 1-2 Days"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Step Details & Description</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="What candidates should expect at this stage..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </>
                )}

                {element.type === "testimonials" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Role & Team Subtitle</label>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], subtitle: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="e.g. Staff Engineer · 3 Yrs at @company_name"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quote Narrative</label>
                      <textarea
                        rows={3}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updatedItems = [...(element.content.items || [])];
                          updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                          updateContentField("items", updatedItems);
                        }}
                        placeholder="“Joining @company_name was the best career decision...”"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium italic"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Avatar Image URL</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) => {
                            const updatedItems = [...(element.content.items || [])];
                            updatedItems[idx] = { ...updatedItems[idx], url: e.target.value };
                            updateContentField("items", updatedItems);
                          }}
                          placeholder="https://..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemMediaIndex(idx);
                            setActiveItemMediaProp("url");
                            setIsMediaPickerOpen(true);
                          }}
                          className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold text-[10px] cursor-pointer"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {element.type === "stats" && (
                  <input
                    type="text"
                    value={item.value || ""}
                    onChange={(e) => {
                      const updatedItems = [...(element.content.items || [])];
                      updatedItems[idx] = { ...updatedItems[idx], value: e.target.value };
                      updateContentField("items", updatedItems);
                    }}
                    placeholder="Metric Value (e.g. 50+)"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                )}

                {element.type === "list" && (
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => {
                      const updatedItems = [...(element.content.items || [])];
                      updatedItems[idx] = { ...updatedItems[idx], description: e.target.value };
                      updateContentField("items", updatedItems);
                    }}
                    placeholder="Description detail..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                )}

                {element.type === "gallery" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.url || ""}
                      onChange={(e) => {
                        const updatedItems = [...(element.content.items || [])];
                        updatedItems[idx] = { ...updatedItems[idx], url: e.target.value };
                        updateContentField("items", updatedItems);
                      }}
                      placeholder="Image URL"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveItemMediaIndex(idx);
                        setActiveItemMediaProp("url");
                        setIsMediaPickerOpen(true);
                      }}
                      className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold text-[10px] cursor-pointer"
                    >
                      Browse
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Divider Element Controls */}
      {element.type === "divider" && (
        <div className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Line Thickness</label>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["1px", "2px", "4px", "6px"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateContentField("thickness", t)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    (element.content.thickness || "1px") === t
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Line Width</label>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["25%", "50%", "75%", "100%"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateContentField("width", w)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    (element.content.width || "100%") === w
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Line Style</label>
            <select
              value={element.content.style || "solid"}
              onChange={(e) => updateContentField("style", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
            >
              <option value="solid">Solid Line (────)</option>
              <option value="dashed">Dashed Line (- - - -)</option>
              <option value="dotted">Dotted Line (• • • •)</option>
            </select>
          </div>
        </div>
      )}

      {/* 8. Spacer Element Controls */}
      {element.type === "spacer" && (
        <div className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Desktop Vertical Height</label>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["16px", "32px", "48px", "64px"].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => updateContentField("height", h)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    (element.content.height || "32px") === h
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Mobile Vertical Height</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["8px", "16px", "24px"].map((mh) => (
                <button
                  key={mh}
                  type="button"
                  onClick={() => updateContentField("mobileHeight", mh)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    (element.content.mobileHeight || "16px") === mh
                      ? "bg-white text-teal-800 shadow-xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {mh}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setActiveItemMediaIndex(null);
        }}
        onSelectMedia={(url) => {
          if (activeItemMediaIndex !== null) {
            const currentItems = [...(element.content.items || [])];
            if (currentItems[activeItemMediaIndex]) {
              currentItems[activeItemMediaIndex] = {
                ...currentItems[activeItemMediaIndex],
                [activeItemMediaProp]: url,
              };
              updateContentField("items", currentItems);
            }
            setActiveItemMediaIndex(null);
          } else {
            updateContentField(mediaTargetField, url);
          }
          setIsMediaPickerOpen(false);
        }}
      />
        </>
      )}
    </div>
  );
}
