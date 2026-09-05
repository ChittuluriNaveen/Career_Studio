"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionType } from "@prisma/client";
import {
  GripVertical,
  Trash2,
  Edit3,
  Sparkles,
  Tv,
  Heart,
  Info,
  Briefcase,
  Type,
  ShieldAlert,
} from "lucide-react";

interface SectionCardProps {
  section: {
    id: string;
    type: SectionType;
    title: string | null;
    content: any;
    orderIndex: number;
    isDraft: boolean;
    isPublished: boolean;
  };
  onEdit: (section: any) => void;
  onDelete: (id: string) => void;
}

const SECTION_TYPE_CONFIG: Record<SectionType, { label: string; icon: any; color: string }> = {
  HERO: { label: "Hero Banner", icon: Sparkles, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ABOUT_US: { label: "About Us Story", icon: Info, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  CULTURE_VIDEO: { label: "Culture & Video", icon: Tv, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  VALUES: { label: "Core Values", icon: Heart, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  PERKS_BENEFITS: { label: "Perks & Benefits", icon: Sparkles, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  OPEN_ROLES: { label: "Open Jobs Grid", icon: Briefcase, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  CUSTOM_TEXT: { label: "Custom Text Block", icon: Type, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
};

export default function SectionCard({ section, onEdit, onDelete }: SectionCardProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const config = SECTION_TYPE_CONFIG[section.type] || {
    label: section.type,
    icon: Type,
    color: "text-slate-400 bg-slate-800",
  };
  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-slate-900/90 border rounded-2xl p-4 transition-all flex items-center justify-between gap-4 ${
        isDragging ? "border-blue-500 shadow-2xl z-50 bg-slate-800" : "border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Left: Drag Handle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder section"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className={`p-2.5 rounded-xl border ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{section.title || config.label}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {config.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-md">
            {section.content?.subtitle || section.content?.body || section.content?.description || "Configured content section payload"}
          </p>
        </div>
      </div>

      {/* Right: Actions (Edit & Remove) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(section)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Edit Content</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="p-2 rounded-xl bg-slate-800/40 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all"
          title="Remove section from canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
