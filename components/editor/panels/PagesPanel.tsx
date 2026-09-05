"use client";

import { useState } from "react";
import { FileText, Plus, Edit2, Trash2, GripVertical, Check, Globe } from "lucide-react";

interface PagesPanelProps {
  companySlug: string;
}

export default function PagesPanel({ companySlug }: PagesPanelProps) {
  const [pages, setPages] = useState([
    { id: "1", name: "Careers", path: "/careers", isDefault: true, isPublished: true },
    { id: "2", name: "About Us", path: "/about", isDefault: false, isPublished: false },
    { id: "3", name: "Culture & Life", path: "/culture", isDefault: false, isPublished: false },
  ]);

  const [activePageId, setActivePageId] = useState("1");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveRename = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: editingName } : p))
    );
    setEditingId(null);
  };

  const handleDeletePage = (id: string) => {
    if (pages.length <= 1) return alert("Cannot delete the last remaining page.");
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPage = () => {
    const name = prompt("Enter new page title:");
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    setPages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        path: `/${slug}`,
        isDefault: false,
        isPublished: false,
      },
    ]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Pages</h2>
          <p className="text-[11px] text-slate-400">Saved site routes ({pages.length})</p>
        </div>
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Active
        </span>
      </div>

      <div className="space-y-1.5">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const isEditing = page.id === editingId;

          return (
            <div
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isActive
                  ? "bg-teal-50/90 border-teal-300 text-teal-950 font-bold shadow-2xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                <GripVertical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <FileText className="w-4 h-4 text-teal-700 flex-shrink-0" />
                
                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRename(page.id)}
                      className="p-1 rounded bg-teal-800 text-white"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="truncate min-w-0">
                    <span className="text-xs block truncate font-medium">{page.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{page.path}</span>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(page.id, page.name);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-teal-700 transition-colors"
                    title="Rename page"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {!page.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddPage}
        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4 text-teal-700" />
        <span>+ Add page</span>
      </button>
    </div>
  );
}
