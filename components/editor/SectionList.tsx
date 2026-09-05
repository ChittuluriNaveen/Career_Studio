"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionType } from "@prisma/client";
import { useState } from "react";
import {
  GripVertical,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Sparkles,
  Info,
  Image as ImageIcon,
  Tv,
  Heart,
  Grid,
  Type,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { updateSectionOrderAction, toggleSectionVisibilityAction, duplicateSectionAction } from "@/lib/actions/sections";

const SECTION_TYPE_BADGES: Record<SectionType, { label: string; icon: any; color: string }> = {
  HERO: { label: "Hero Banner", icon: Sparkles, color: "text-blue-600 bg-blue-50 border-blue-200" },
  ABOUT_US: { label: "About Us", icon: Info, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  IMAGE_TEXT: { label: "Image + Text", icon: ImageIcon, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  CULTURE_VIDEO: { label: "Culture Video", icon: Tv, color: "text-purple-600 bg-purple-50 border-purple-200" },
  VALUES: { label: "Core Values", icon: Heart, color: "text-amber-600 bg-amber-50 border-amber-200" },
  PERKS_BENEFITS: { label: "Perks & Benefits", icon: Sparkles, color: "text-pink-600 bg-pink-50 border-pink-200" },
  GALLERY: { label: "Image Gallery", icon: Grid, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  CUSTOM_TEXT: { label: "Custom Content", icon: Type, color: "text-slate-600 bg-slate-100 border-slate-200" },
  OPEN_ROLES: { label: "Open Jobs Grid", icon: Briefcase, color: "text-teal-600 bg-teal-50 border-teal-200" },
  CTA: { label: "Call To Action", icon: Megaphone, color: "text-orange-600 bg-orange-50 border-orange-200" },
};

interface Section {
  id: string;
  type: SectionType;
  title: string | null;
  content: any;
  layoutVariant?: string;
  orderIndex: number;
  enabled?: boolean;
  isDraft?: boolean;
  isPublished?: boolean;
}

interface SectionCardProps {
  section: Section;
  isSelected: boolean;
  onSelect: (section: Section) => void;
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, currentEnabled: boolean) => void;
  onDuplicate: (id: string) => void;
}

function SortableSectionCard({
  section,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleVisibility,
  onDuplicate,
}: SectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : section.enabled === false ? 0.6 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const badge = SECTION_TYPE_BADGES[section.type] || {
    label: section.type,
    icon: Type,
    color: "text-slate-600 bg-slate-100 border-slate-200",
  };
  const Icon = badge.icon;
  const isEnabled = section.enabled !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
        isSelected
          ? "bg-teal-50/90 border-teal-400 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-400/50"
          : !isEnabled
          ? "bg-slate-100/70 border-slate-200 text-slate-400 italic"
          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
      } ${isDragging ? "shadow-xl ring-2 ring-teal-400/30" : ""}`}
      onClick={() => onSelect(section)}
    >
      <div className="flex items-center gap-2 truncate min-w-0 flex-1">
        {/* Drag handle */}
        <button
          type="button"
          className="flex-shrink-0 touch-none cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className={`p-1.5 rounded-lg border flex-shrink-0 ${badge.color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>

        <div className="truncate min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`text-xs block truncate font-bold ${!isEnabled ? "line-through text-slate-400" : "text-slate-900"}`}>
              {section.title || badge.label}
            </span>
            {!isEnabled && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Hidden
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono text-slate-400 uppercase">
            {badge.label} · L{section.layoutVariant || "01"}
          </span>
        </div>
      </div>

      {/* Control buttons: Toggle Eye, Duplicate, Edit, Delete */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(section.id, isEnabled);
          }}
          className={`p-1 rounded transition-colors ${
            isEnabled ? "text-slate-400 hover:text-amber-600" : "text-amber-600 hover:text-slate-600"
          }`}
          title={isEnabled ? "Hide section from candidate page" : "Show section on candidate page"}
        >
          {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(section.id);
          }}
          className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
          title="Duplicate section"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(section);
          }}
          className="p-1 rounded text-slate-400 hover:text-teal-700 transition-colors"
          title="Edit section content"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section.id);
          }}
          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
          title="Delete section"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface SectionListProps {
  initialSections?: Section[];
  sections?: Section[];
  selectedSectionId?: string | null;
  onSelectSection?: (section: Section) => void;
  onEditSection?: (section: Section) => void;
  onDeleteSection: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicateSection?: (id: string) => void;
  onToggleHideSection?: (id: string, currentEnabled: boolean) => void;
  onSectionsUpdated?: () => void;
  onReorderSections?: (sections: Section[]) => void;
}

export default function SectionList({
  initialSections,
  sections: propSections,
  selectedSectionId,
  onSelectSection,
  onEditSection,
  onDeleteSection,
  onDuplicateSection,
  onToggleHideSection,
  onSectionsUpdated,
  onReorderSections,
}: SectionListProps) {
  const activeList = propSections || initialSections || [];
  const [sections, setSections] = useState(activeList);
  const [reordering, setReordering] = useState(false);

  // Sync internal state when parent props change
  const parentIds = activeList.map((s) => `${s.id}-${s.enabled}-${s.orderIndex}`).join(",");
  const localIds = sections.map((s) => `${s.id}-${s.enabled}-${s.orderIndex}`).join(",");
  if (parentIds !== localIds) {
    setSections(activeList);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        orderIndex: index,
      }));

      setSections(reordered);
      setReordering(true);

      if (onReorderSections) {
        onReorderSections(reordered);
      } else {
        await updateSectionOrderAction({
          sections: reordered.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
        });
      }

      setReordering(false);
      if (onSectionsUpdated) onSectionsUpdated();
    }
  };

  const handleToggleVisibility = async (id: string, currentEnabled: boolean) => {
    if (onToggleHideSection) {
      onToggleHideSection(id, currentEnabled);
      return;
    }
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !currentEnabled } : sec))
    );
    await toggleSectionVisibilityAction({ id, enabled: !currentEnabled });
    if (onSectionsUpdated) onSectionsUpdated();
  };

  const handleDuplicate = async (id: string) => {
    if (onDuplicateSection) {
      onDuplicateSection(id);
      return;
    }
    const res = await duplicateSectionAction(id);
    if (res.success && onSectionsUpdated) {
      onSectionsUpdated();
    }
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 space-y-2 text-slate-400">
        <div className="text-2xl">📄</div>
        <p className="text-xs font-medium text-slate-600">No sections added yet</p>
        <p className="text-[11px] text-slate-400">Click "+ Add section" below to pick from the section library.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reordering && (
        <div className="text-xs text-teal-700 font-semibold flex items-center gap-2 py-1">
          <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-teal-600 border-t-transparent" />
          <span>Saving section order...</span>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSectionCard
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onSelect={onSelectSection || (() => {})}
              onEdit={onEditSection || (() => {})}
              onDelete={onDeleteSection}
              onToggleVisibility={handleToggleVisibility}
              onDuplicate={handleDuplicate}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
