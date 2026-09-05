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
import MediaPickerModal from "@/components/editor/MediaPickerModal";
import CompanyVariableChips from "@/components/editor/CompanyVariableChips";

interface ElementEditorPanelProps {
  element: SectionElement;
  company?: any;
  onUpdateElement: (updated: SectionElement) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
}

export default function ElementEditorPanel({
  element,
  company,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: ElementEditorPanelProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"url" | "posterUrl">("url");

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
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="font-extrabold uppercase text-slate-800 text-[11px] tracking-wider block">
            Element: {element.type}
          </span>
          <span className="text-[10px] font-mono text-slate-400">ID: {element.id}</span>
        </div>
        <div className="flex items-center gap-1">
          {onDuplicateElement && (
            <button
              type="button"
              onClick={() => onDuplicateElement(element.id)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[10px]"
              title="Duplicate Element"
            >
              + Copy
            </button>
          )}
          {onDeleteElement && (
            <button
              type="button"
              onClick={() => onDeleteElement(element.id)}
              className="p-1 rounded bg-red-50 border border-red-200 hover:bg-red-100 text-red-600"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

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
            <label className="block font-semibold text-slate-600 mb-1">Heading Text</label>
            <input
              type="text"
              value={element.content.text || ""}
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
            <label className="block font-semibold text-slate-600 mb-1">Text Content</label>
            <textarea
              rows={4}
              value={element.content.text || ""}
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
                value={element.content.url || ""}
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
              value={element.content.videoUrl || ""}
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
            <label className="block font-semibold text-slate-600 mb-1">Button Label</label>
            <input
              type="text"
              value={element.content.label || ""}
              onChange={(e) => updateContentField("label", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Link URL</label>
            <input
              type="text"
              value={element.content.linkUrl || ""}
              onChange={(e) => updateContentField("linkUrl", e.target.value)}
              placeholder="#open-positions or https://..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 6. List / Stats / Gallery Item Managers */}
      {(element.type === "stats" || element.type === "list" || element.type === "gallery") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-slate-700">List Items ({element.content.items?.length || 0})</label>
            <button
              type="button"
              onClick={() => {
                const currentItems = element.content.items || [];
                const newItem =
                  element.type === "stats"
                    ? { id: Date.now().toString(), title: "New Metric", value: "100+" }
                    : element.type === "gallery"
                    ? { id: Date.now().toString(), title: "New Photo", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" }
                    : { id: Date.now().toString(), title: "New Benefit", description: "Details..." };
                updateContentField("items", [...currentItems, newItem]);
              }}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md text-[11px]"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {(element.content.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[10px] text-slate-500">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = element.content.items || [];
                      const updatedItems = currentItems.filter((_: any, i: number) => i !== idx);
                      updateContentField("items", updatedItems);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    × Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => {
                    const updatedItems = [...(element.content.items || [])];
                    updatedItems[idx] = { ...updatedItems[idx], title: e.target.value };
                    updateContentField("items", updatedItems);
                  }}
                  placeholder="Item Title"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-xs"
                />

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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectMedia={(url) => {
          updateContentField(mediaTargetField, url);
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
