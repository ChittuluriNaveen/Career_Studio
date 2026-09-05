"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface BulletListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

export default function BulletListEditor({
  label,
  items,
  onChange,
  placeholder = "Enter bullet point...",
  required = false,
}: BulletListEditorProps) {
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleAddItem = () => {
    onChange([...items, ""]);
  };

  const handleDeleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-xs text-slate-400">No items added yet.</p>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-bold text-indigo-600 hover:underline mt-1 cursor-pointer"
          >
            + Add first bullet item
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 w-5 text-right">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleMove(index, "up")}
                disabled={index === 0}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleMove(index, "down")}
                disabled={index === items.length - 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteItem(index)}
                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                title="Delete Bullet"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
