"use client";

import { useState } from "react";
import { Sparkles, Database, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { COMPANY_VARIABLES, CompanyVariableItem } from "@/lib/templates/variables";

interface CompanyVariableChipsProps {
  company?: any;
  onInsertVariable: (tag: string) => void;
  label?: string;
}

export default function CompanyVariableChips({
  company,
  onInsertVariable,
  label = "Insert Dynamic Company Data (@)",
}: CompanyVariableChipsProps) {
  const [expanded, setExpanded] = useState(false);

  const getResolvedValue = (item: CompanyVariableItem) => {
    if (!company) return item.example;
    if (item.field === "activeJobsCount") return "5";
    return company[item.field] || item.example;
  };

  return (
    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-extrabold text-slate-700">{label}</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
        >
          <span>{expanded ? "Show Less" : "Show All (@)"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Primary Variable Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {(expanded ? COMPANY_VARIABLES : COMPANY_VARIABLES.slice(0, 4)).map((item) => {
          const resolvedVal = getResolvedValue(item);
          return (
            <button
              key={item.tag}
              type="button"
              onClick={() => onInsertVariable(item.tag)}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-md text-[10px] font-bold text-slate-800 transition-all shadow-2xs group cursor-pointer"
              title={`Click to insert ${item.tag} (Live: "${resolvedVal}")`}
            >
              <span>{item.icon}</span>
              <span className="font-mono text-indigo-600 group-hover:text-indigo-700">{item.tag}</span>
              {resolvedVal && (
                <span className="text-[9px] text-slate-400 font-normal truncate max-w-[80px]">
                  ({resolvedVal})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
