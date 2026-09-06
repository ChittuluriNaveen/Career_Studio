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
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-[#005d52] flex items-center justify-center text-white font-extrabold shadow-xs text-sm">
                W
              </div>
              <span className="text-slate-900 hidden sm:inline font-extrabold tracking-tight">WhiteCarrot</span>
            </Link>
            <span className="text-slate-300 font-mono">/</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-[#005d52] border border-teal-200">
              {companyName}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>Public Page</span>
            </a>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
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
