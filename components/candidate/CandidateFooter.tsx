"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, Globe } from "lucide-react";

interface CandidateFooterProps {
  company: {
    name: string;
    slug: string;
    logoUrl?: string | null;
    primaryColor: string;
    tagline?: string | null;
    description?: string | null;
    website?: string | null;
    cornerRadius?: number | null;
  };
  theme: {
    mode: string;
    bgColor: string;
    textColor: string;
    subtextColor?: string;
    cardBg: string;
    cardBorder: string;
  };
  jobsCount?: number;
  locations?: Array<{ name: string }>;
  isPreviewMode?: boolean;
  onNavigatePage?: (page: "careers" | "jobs" | "job-details", jobId?: string) => void;
  navItems?: Array<{ id: string; label: string }>;
  onScrollToAnchor?: (anchorId: string) => void;
}

export default function CandidateFooter({
  company,
  theme,
  jobsCount = 0,
  locations = [],
  isPreviewMode = false,
  onNavigatePage,
  navItems = [],
  onScrollToAnchor,
}: CandidateFooterProps) {
  const isDarkMode = theme.mode === "dark";
  const primaryColor = company.primaryColor || "#005d52";
  const cornerRadius = company.cornerRadius ?? 16;
  const companyEmail = `careers@${company.slug.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const primaryLocation = locations.length > 0 ? locations[0].name : "Global HQ";

  return (
    <footer
      className={`border-t py-14 px-6 mt-16 transition-colors w-full ${
        isDarkMode ? "bg-slate-950/90 border-slate-800 text-slate-300" : "bg-slate-50/80 border-slate-200 text-slate-700"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* 1. Company Brand Identity & Social Icons */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} Logo`}
                className="w-9 h-9 object-cover border border-slate-700/50 shadow-sm"
                style={{ borderRadius: `${cornerRadius}px` }}
              />
            ) : (
              <div
                className="w-9 h-9 flex items-center justify-center font-black text-white text-sm shadow-sm"
                style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-base tracking-tight">{company.name}</span>
          </div>

          <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {company.tagline || company.description || `Join ${company.name} and help build the future of our industry.`}
          </p>

          {/* Social Media Logos */}
          <div className="space-y-1.5 pt-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Follow Us
            </span>
            <div className="flex items-center gap-2.5">
              {/* Facebook Logo */}
              <a
                href={`https://facebook.com/${company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={`p-2 rounded-xl border transition-all hover:scale-110 shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram Logo */}
              <a
                href={`https://instagram.com/${company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`p-2 rounded-xl border transition-all hover:scale-110 shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-pink-400 hover:border-pink-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-300"
                }`}
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn Logo */}
              <a
                href={`https://linkedin.com/company/${company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`p-2 rounded-xl border transition-all hover:scale-110 shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.65 1.65 0 1 0 1.65 1.65 1.66 1.66 0 0 0-1.65-1.65z" />
                </svg>
              </a>

              {/* Twitter / X Logo */}
              <a
                href={`https://twitter.com/${company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className={`p-2 rounded-xl border transition-all hover:scale-110 shadow-2xs ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
            Contact Us
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${isDarkMode ? "bg-slate-900 border-slate-800 text-cyan-400" : "bg-white border-slate-200 text-cyan-600"}`}>
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className={`block text-[10px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Email Inquiries</span>
                <a href={`mailto:${companyEmail}`} className="hover:underline font-semibold tracking-tight">
                  {companyEmail}
                </a>
              </div>
            </li>

            <li className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${isDarkMode ? "bg-slate-900 border-slate-800 text-emerald-400" : "bg-white border-slate-200 text-emerald-600"}`}>
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className={`block text-[10px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Talent Acquisition</span>
                <span className="font-semibold tracking-tight">+1 (800) 555-0199</span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-lg border mt-0.5 ${isDarkMode ? "bg-slate-900 border-slate-800 text-rose-400" : "bg-white border-slate-200 text-rose-600"}`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className={`block text-[10px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Headquarters</span>
                <span className="font-semibold leading-tight block">{primaryLocation} Office</span>
              </div>
            </li>
          </ul>
        </div>

        {/* 3. Navigation Links */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
            Explore Careers
          </h4>
          <ul className="space-y-2 text-xs font-semibold">
            {navItems.length > 0 ? (
              navItems.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onScrollToAnchor && onScrollToAnchor(item.id)}
                    className="hover:text-cyan-400 transition-colors capitalize cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>
                  {isPreviewMode ? (
                    <button
                      type="button"
                      onClick={() => onNavigatePage && onNavigatePage("careers")}
                      className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      Careers Homepage
                    </button>
                  ) : (
                    <Link href={`/${company.slug}/careers`} className="hover:text-cyan-400 transition-colors">
                      Careers Homepage
                    </Link>
                  )}
                </li>
                <li>
                  {isPreviewMode ? (
                    <button
                      type="button"
                      onClick={() => onNavigatePage && onNavigatePage("jobs")}
                      className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      Browse Open Positions ({jobsCount})
                    </button>
                  ) : (
                    <Link href={`/${company.slug}/careers/jobs`} className="hover:text-cyan-400 transition-colors">
                      Browse Open Positions ({jobsCount})
                    </Link>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>

        {/* 4. Company Info & External Links */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
            Company Info
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {company.website && (
              <li>
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 opacity-70" />
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            )}

            <li>
              {isPreviewMode ? (
                <button
                  type="button"
                  onClick={() => onNavigatePage && onNavigatePage("jobs")}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  All Job Vacancies ({jobsCount})
                </button>
              ) : (
                <Link href={`/${company.slug}/careers/jobs`} className="hover:text-cyan-400 transition-colors">
                  All Job Vacancies ({jobsCount})
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Sub-footer */}
      <div
        className={`max-w-7xl mx-auto pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
          isDarkMode ? "border-slate-800/80 text-slate-500" : "border-slate-200 text-slate-400"
        }`}
      >
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        <p className="text-[11px] font-medium">Powered by WhiteCarrot Career Experience Studio</p>
      </div>
    </footer>
  );
}
