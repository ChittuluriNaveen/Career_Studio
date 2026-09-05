"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Layers, Sparkles, AlertCircle } from "lucide-react";
import SectionList from "@/components/editor/SectionList";
import SectionFormModal from "@/components/editor/SectionFormModal";
import PublishButton from "@/components/editor/PublishButton";
import { getSectionsAction, deleteSectionAction } from "@/lib/actions/sections";

export default function SectionEditorPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  const fetchSections = async () => {
    try {
      const data = await getSectionsAction();
      setSections(data);
    } catch (e) {
      console.error("Failed to load sections", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (section: any) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDeleteSection = async (id: string) => {
    if (confirm("Are you sure you want to remove this section from your careers canvas?")) {
      await deleteSectionAction(id);
      fetchSections();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    fetchSections();
  };

  return (
    <div className="space-y-8">
      {/* Editor Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Careers Canvas Visual Editor</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Section Layout & Content Builder</h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag to reorder sections. Edits save in real-time as draft. Click Publish to update candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Section</span>
          </button>

          <PublishButton />
        </div>
      </div>

      {/* Main Canvas Editor Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs font-medium">Loading company section canvas...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 space-y-4">
          <div className="p-3 w-fit mx-auto rounded-2xl bg-slate-800 text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No sections added yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your company careers page by adding a Hero banner, About Us story, Culture video, or Perks section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Section</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>{sections.length} Active Canvas Sections</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>dnd-kit reorder active</span>
            </span>
          </div>

          <SectionList
            initialSections={sections}
            onEditSection={handleOpenEditModal}
            onDeleteSection={handleDeleteSection}
          />
        </div>
      )}

      {/* Add / Edit Section Modal */}
      <SectionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        sectionToEdit={editingSection}
      />
    </div>
  );
}
