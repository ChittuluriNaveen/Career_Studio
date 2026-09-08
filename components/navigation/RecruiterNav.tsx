"use client";

import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

interface RecruiterNavProps {
  companySlug: string;
  companyName: string;
  userName?: string | null;
}

export function RecruiterNav({ companySlug, companyName, userName }: RecruiterNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-white border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-[#005d52] flex items-center justify-center text-white font-extrabold shadow-xs text-sm">
                W
              </div>
              <span className="text-slate-900 hidden sm:inline font-extrabold tracking-tight">WhiteCarrot</span>
            </Link>
            <span className="text-slate-300 font-mono">/</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-[#005d52] border border-teal-200 truncate max-w-[120px] sm:max-w-none">
              {companyName}
            </span>
          </div>

          {/* Desktop Navigation Links */}
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

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
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
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    item.active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <a
                href={`/${companySlug}/careers`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-700" />
                  <span>View Candidate Careers Page</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-200/80 px-2 py-0.5 rounded-md">Live</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out of Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
