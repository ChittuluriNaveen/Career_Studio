"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Palette,
  Briefcase,
  Building2,
  Eye,
  ExternalLink,
  LogOut,
  Layers,
} from "lucide-react";

interface RecruiterNavProps {
  companySlug: string;
  companyName: string;
  userName?: string | null;
}

export function RecruiterNav({ companySlug, companyName, userName }: RecruiterNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Design Careers Page",
      href: `/company/${companySlug}/design`,
      icon: Palette,
      active: pathname === `/company/${companySlug}/design`,
    },
    {
      label: "Job Postings",
      href: `/company/${companySlug}/jobs`,
      icon: Briefcase,
      active: pathname.startsWith(`/company/${companySlug}/jobs`),
    },
    {
      label: "Company Details",
      href: `/company/${companySlug}/details`,
      icon: Building2,
      active: pathname === `/company/${companySlug}/details`,
    },
    {
      label: "Preview",
      href: `/company/${companySlug}/preview`,
      icon: Eye,
      active: pathname === `/company/${companySlug}/preview`,
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm">
                W
              </div>
              <span className="text-white hidden sm:inline">WhiteCarrot</span>
            </Link>
            <span className="text-slate-600 font-mono">/</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              {companyName}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-all ${
                    item.active
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Public Link */}
          <div className="flex items-center gap-3">
            <a
              href={`/${companySlug}/careers`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 rounded-md transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </a>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
