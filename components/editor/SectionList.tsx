"use client";

import { useState } from "react";
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
import { SectionType } from "@prisma/client";
import SectionCard from "./SectionCard";
import { updateSectionOrderAction } from "@/lib/actions/sections";

interface SectionListProps {
  initialSections: Array<{
    id: string;
    type: SectionType;
    title: string | null;
    content: any;
    orderIndex: number;
    isDraft: boolean;
    isPublished: boolean;
  }>;
  onEditSection: (section: any) => void;
  onDeleteSection: (id: string) => void;
}

export default function SectionList({
  initialSections,
  onEditSection,
  onDeleteSection,
}: SectionListProps) {
  const [sections, setSections] = useState(initialSections);
  const [reordering, setReordering] = useState(false);

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

  // Sync internal state when parent props change
  if (JSON.stringify(initialSections.map((s) => s.id)) !== JSON.stringify(sections.map((s) => s.id))) {
    setSections(initialSections);
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        orderIndex: index,
      }));

      setSections(newOrder);
      setReordering(true);

      const res = await updateSectionOrderAction({
        sections: newOrder.map((s) => ({ id: s.id, orderIndex: s.orderIndex })),
      });

      setReordering(false);
    }
  };

  return (
    <div className="space-y-4">
      {reordering && (
        <div className="text-xs text-blue-400 font-semibold flex items-center gap-2">
          <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-blue-400 border-t-transparent" />
          <span>Saving section order...</span>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onEdit={onEditSection}
                onDelete={onDeleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
