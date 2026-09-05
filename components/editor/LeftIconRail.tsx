"use client";

import {
  FileText,
  Layers,
  Palette,
  Share2,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export type LeftNavTab = "pages" | "sections" | "design" | "share" | "seo" | "settings";

interface LeftIconRailProps {
  activeTab: LeftNavTab;
  setActiveTab: (tab: LeftNavTab) => void;
}

export default function LeftIconRail({ activeTab, setActiveTab }: LeftIconRailProps) {
  const navItems = [
    { id: "pages" as LeftNavTab, label: "Pages", icon: FileText },
    { id: "sections" as LeftNavTab, label: "Sections Outline", icon: Layers },
    { id: "design" as LeftNavTab, label: "Design & Themes", icon: Palette },
    { id: "share" as LeftNavTab, label: "Share & Distribution", icon: Share2 },
    { id: "seo" as LeftNavTab, label: "SEO & Metadata", icon: Search },
  ];

  return (
    <aside className="w-14 bg-white border-r border-slate-200 flex flex-col items-center justify-between py-3 flex-shrink-0 z-20 shadow-xs">
      <div className="flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`p-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? "bg-teal-50 text-teal-800 font-bold border border-teal-200/80 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="absolute left-14 top-2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out of Studio"
          className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors group relative"
        >
          <LogOut className="w-4 h-4" />
          <span className="absolute left-14 top-2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
