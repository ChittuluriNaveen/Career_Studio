"use client";

import { SectionType, JobType } from "@prisma/client";
import { Sparkles, Play, Check, Laptop, Heart, Plane, GraduationCap, MapPin, Building, Search, Filter } from "lucide-react";
import JobSearchFilter from "@/components/candidate/JobSearchFilter";

interface PageRendererProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    tagline: string | null;
    aboutText: string | null;
  };
  sections: Array<{
    id: string;
    type: SectionType;
    title: string | null;
    content: any;
    orderIndex: number;
  }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; isRemote: boolean }>;
  jobs: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    jobType: JobType;
    department: { name: string };
    location: { name: string };
    createdAt: Date | string;
  }>;
  isPreviewMode?: boolean;
}

export default function PageRenderer({
  company,
  sections,
  departments,
  locations,
  jobs,
  isPreviewMode = false,
}: PageRendererProps) {
  const primaryColor = company.primaryColor || "#2563eb";
  const secondaryColor = company.secondaryColor || "#0f172a";
  const fontFamily = company.fontFamily || "Inter";

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-blue-500 selection:text-white"
      style={{
        backgroundColor: secondaryColor,
        fontFamily,
      }}
    >
      {/* Recruiter Preview Floating Alert */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-amber-500/90 text-slate-950 font-bold px-4 py-2 text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          <span>Live Draft Preview Mode (Unpublished Recruiter Canvas)</span>
        </div>
      )}

      {/* Company Header Banner */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} Logo`}
                className="w-10 h-10 rounded-xl object-cover border border-white/20"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">{company.name}</span>
              <span className="text-xs text-slate-400 block font-medium">Careers & Opportunities</span>
            </div>
          </div>

          <a
            href="#open-positions"
            className="px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Browse Jobs ({jobs.length})
          </a>
        </div>
      </header>

      {/* Render Dynamic Canvas Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">
        {sections.map((section) => {
          switch (section.type) {
            case SectionType.HERO:
              return (
                <section
                  key={section.id}
                  className="relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-white/10 text-center space-y-6 shadow-2xl"
                  style={{
                    backgroundImage: section.content?.backgroundImage
                      ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('${section.content.backgroundImage}')`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                      {section.title || company.name}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                      {section.content?.subtitle || company.tagline}
                    </p>
                    <div className="pt-4 flex justify-center">
                      <a
                        href="#open-positions"
                        className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{section.content?.ctaText || "Explore Open Roles"}</span>
                      </a>
                    </div>
                  </div>
                </section>
              );

            case SectionType.ABOUT_US:
              return (
                <section key={section.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">{section.title || "About Us"}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {section.content?.body || company.aboutText}
                    </p>
                  </div>

                  {(section.content?.stat1Number || section.content?.stat2Number) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      {section.content?.stat1Number && (
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                          <div className="text-2xl font-black text-white" style={{ color: primaryColor }}>
                            {section.content.stat1Number}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{section.content.stat1Label}</div>
                        </div>
                      )}
                      {section.content?.stat2Number && (
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                          <div className="text-2xl font-black text-white" style={{ color: primaryColor }}>
                            {section.content.stat2Number}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{section.content.stat2Label}</div>
                        </div>
                      )}
                      {section.content?.stat3Number && (
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                          <div className="text-2xl font-black text-white" style={{ color: primaryColor }}>
                            {section.content.stat3Number}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{section.content.stat3Label}</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );

            case SectionType.CULTURE_VIDEO:
              return (
                <section key={section.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">{section.title || "Life & Culture"}</h2>
                    {section.content?.description && (
                      <p className="text-xs text-slate-300">{section.content.description}</p>
                    )}
                  </div>

                  {section.content?.videoUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                      <iframe
                        src={section.content.videoUrl}
                        title={section.title || "Culture Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </section>
              );

            case SectionType.VALUES:
              return (
                <section key={section.id} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white text-center">{section.title || "Our Principles"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(section.content?.values || []).map((val: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: primaryColor }}>
                          0{idx + 1}
                        </div>
                        <h3 className="text-base font-bold text-white">{val.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{val.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case SectionType.PERKS_BENEFITS:
              return (
                <section key={section.id} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white text-center">{section.title || "Perks & Benefits"}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {(section.content?.perks || []).map((perk: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="p-2.5 rounded-xl w-fit bg-white/10 text-white">
                          <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <h3 className="text-sm font-bold text-white">{perk.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{perk.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case SectionType.OPEN_ROLES:
              return (
                <section key={section.id} id="open-positions" className="space-y-6 pt-4 scroll-mt-20">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">{section.title || "Open Positions"}</h2>
                    <p className="text-xs text-slate-300">
                      {section.content?.subtitle || "Find your next career milestone at " + company.name}
                    </p>
                  </div>

                  {/* Interactive Candidate Search & Filters Component */}
                  <JobSearchFilter
                    jobs={jobs}
                    departments={departments}
                    locations={locations}
                    primaryColor={primaryColor}
                  />
                </section>
              );

            default:
              return null;
          }
        })}
      </main>

      {/* Candidate Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-8 px-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto space-y-2">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">Powered by Whitecarrot ATS & Careers Builder</p>
        </div>
      </footer>
    </div>
  );
}
