"use client";

import {
  FileText,
  Layers,
  Briefcase,
  Palette,
  Share2,
  Search,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export type LeftNavTab = "pages" | "sections" | "jobs-experience" | "design" | "share" | "seo" | "settings";

interface LeftIconRailProps {
  activeTab: LeftNavTab;
  setActiveTab: (tab: LeftNavTab) => void;
}

export default function LeftIconRail({ activeTab, setActiveTab }: LeftIconRailProps) {
  const navItems = [
    { id: "pages" as LeftNavTab, label: "Pages Overview", icon: FileText },
    { id: "sections" as LeftNavTab, label: "Sections Outline", icon: Layers },
    { id: "jobs-experience" as LeftNavTab, label: "Jobs Experience Settings", icon: Briefcase },
    { id: "design" as LeftNavTab, label: "Design & Theme Presets", icon: Palette },
    { id: "share" as LeftNavTab, label: "Share & Distribution", icon: Share2 },
    { id: "seo" as LeftNavTab, label: "SEO & Search Metadata", icon: Search },
  ];

  return (
    <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center justify-between py-4 flex-shrink-0 z-20 shadow-2xs">
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`p-3 rounded-2xl transition-all relative group cursor-pointer ${
                isActive
                  ? "bg-teal-50 text-[#005d52] font-black border border-teal-300 shadow-xs ring-1 ring-teal-300/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute left-16 top-2.5 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 w-full px-2">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out of Studio"
          className="p-3 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors group relative cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute left-16 top-2.5 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
