"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ArrowRight,
  Globe,
  Lock,
  Menu,
  X,
  Layers,
  Palette,
  Briefcase,
  Eye,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  Zap,
  Code2,
  Users,
  Layout,
  MousePointerClick,
  Sliders,
  Check,
  ChevronRight,
} from "lucide-react";
import LazySectionReveal from "@/components/ui/LazySectionReveal";

interface LandingPageClientProps {
  isAuthenticated: boolean;
  companySlug?: string | null;
}

export default function LandingPageClient({
  isAuthenticated,
  companySlug,
}: LandingPageClientProps) {
  // Mobile Nav Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compact Sticky Navbar State on Scroll
  const [scrolled, setScrolled] = useState(false);

  // Interactive Product Showcase Active Tab
  const [showcaseTab, setShowcaseTab] = useState<"design" | "jobs" | "responsive" | "publish">("design");

  // Interactive Before/After Toggle State
  const [showBeforeAfter, setShowBeforeAfter] = useState<"after" | "before">("after");

  // Responsive Showcase Device Viewport State
  const [responsiveDevice, setResponsiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Hero Preview Active Color Simulation
  const [heroColor, setHeroColor] = useState<string>("#005d52");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ctaHref = isAuthenticated
    ? `/dashboard`
    : `/register`;

  const ctaLabel = isAuthenticated
    ? "Open Recruiter Dashboard"
    : "Start Building Free";

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-xs"
            : "bg-white border-b border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#005d52] flex items-center justify-center text-white font-black text-base shadow-xs group-hover:scale-105 transition-transform">
              W
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-none">WhiteCarrot</span>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">Careers Builder</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <button
              onClick={() => scrollToSection("product")}
              className="hover:text-[#005d52] transition-colors cursor-pointer"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-[#005d52] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-[#005d52] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("templates")}
              className="hover:text-[#005d52] transition-colors cursor-pointer"
            >
              Templates
            </button>
          </nav>

          {/* Desktop Right CTA Action */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                Log In
              </Link>
            )}

            <Link
              href={ctaHref}
              className="text-xs font-extrabold text-white bg-[#005d52] hover:bg-[#004a41] px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-[65px] bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-white border-b border-slate-200 p-6 space-y-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-800">
                <button
                  onClick={() => scrollToSection("product")}
                  className="text-left py-2 border-b border-slate-100 hover:text-[#005d52]"
                >
                  Product
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left py-2 border-b border-slate-100 hover:text-[#005d52]"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left py-2 border-b border-slate-100 hover:text-[#005d52]"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("templates")}
                  className="text-left py-2 border-b border-slate-100 hover:text-[#005d52]"
                >
                  Templates
                </button>
              </nav>

              <div className="pt-2 flex flex-col gap-2">
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="w-full text-center py-3 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    Log In
                  </Link>
                )}
                <Link
                  href={ctaHref}
                  className="w-full text-center py-3 text-xs font-extrabold text-white bg-[#005d52] rounded-xl shadow-xs"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-extrabold text-[#005d52] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#005d52]" />
            <span>THE MODERN CAREERS PAGE BUILDER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Build a careers page your best candidates want to join.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Design a beautiful, responsive careers experience for your company — without writing code or waiting for developers.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={ctaHref}
              className="w-full sm:w-auto px-8 py-4 bg-[#005d52] hover:bg-[#004a41] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => scrollToSection("product")}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <span>Explore Careers Pages</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Hero Interactive UI Product Mockup */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto bg-slate-900 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800 relative transition-all">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs text-slate-200">
            {/* Mockup Header Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-400 font-bold hidden sm:inline">WhiteCarrot Studio · Acme Corp</span>
              </div>

              {/* Viewport Simulation Switches */}
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-[11px] font-bold">
                <span className="text-teal-400 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">100% Live Sync</span>
              </div>
            </div>

            {/* Mockup 3-Column Interface */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
              {/* Left Column: Sections Outline */}
              <div className="hidden md:block md:col-span-3 bg-slate-900/60 p-3 border-r border-slate-800 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Sections Outline</span>
                <div className="space-y-1.5">
                  {[
                    { type: "HERO", label: "Hero Banner", active: true },
                    { type: "ABOUT", label: "Company Culture", active: false },
                    { type: "VALUES", label: "Core Values", active: false },
                    { type: "JOBS", label: "Open Requisitions", active: false },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-[11px] font-bold flex items-center justify-between ${
                        item.active
                          ? "bg-[#005d52] text-white shadow-xs"
                          : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="text-[9px] font-mono opacity-80 uppercase">{item.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Column: Live Preview Canvas */}
              <div className="md:col-span-6 bg-slate-950 p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden">
                <div className="w-full bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-extrabold text-[10px] uppercase">
                    We Are Hiring
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Join Our Engineering Team
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Building the next generation of candidate talent tools.
                  </p>
                  <div
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-md transition-colors"
                    style={{ backgroundColor: heroColor }}
                  >
                    View Open Positions →
                  </div>
                </div>
              </div>

              {/* Right Column: Properties Inspector */}
              <div className="hidden md:block md:col-span-3 bg-slate-900/60 p-3 border-l border-slate-800 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Theme Properties</span>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 block">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    {["#005d52", "#2563eb", "#7c3aed", "#d97706"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setHeroColor(col)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          heroColor === col ? "scale-110 border-white ring-2 ring-teal-400" : "border-transparent"
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block">Corner Radius</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-teal-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITY INDICATORS / SOCIAL PROOF */}
      <section className="bg-white py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Everything you need to build a better hiring experience
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-center">
            {[
              { icon: Zap, text: "Drag & Drop Sections" },
              { icon: Palette, text: "Real-Time Brand Themes" },
              { icon: Smartphone, text: "100% Mobile Responsive" },
              { icon: Briefcase, text: "Job Requisition Manager" },
              { icon: Sparkles, text: "1-Click Page Publishing" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-800 text-xs font-extrabold shadow-2xs">
                  <Icon className="w-4 h-4 text-[#005d52]" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            The Problem
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your careers page should be more than a list of jobs.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Traditional careers pages hurt candidate conversion before talent even submits an application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Generic Templates",
              description: "Most careers pages look identical. Candidates leave without understanding your company culture, mission, or values.",
              icon: Layout,
              badge: "Low Engagement",
            },
            {
              title: "Poor Candidate Experience",
              description: "Important information about perks, teams, and culture is difficult to discover, leading to high drop-off rates.",
              icon: Users,
              badge: "Application Loss",
            },
            {
              title: "Developer Dependency",
              description: "Every single text change or new job posting requires engineering tickets and sprint planning, slowing recruitment.",
              icon: Code2,
              badge: "Slower Hiring",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PRODUCT SOLUTION SECTION */}
      <section id="product" className="py-16 sm:py-24 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              The Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Design it your way.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Recruiters can create and customize a high-converting careers portal without depending on engineering.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Section Builder", desc: "Modular drag & drop sections (Hero, About, Perks, Gallery, Jobs).", icon: Layers },
              { title: "Visual Editor", desc: "Live inline editing of typography, brand colors, spacing & borders.", icon: Sliders },
              { title: "Responsive Controls", desc: "Test & tune desktop, tablet & mobile viewports in real time.", icon: Monitor },
              { title: "Job Management", desc: "Create requisitions, filter by department, & publish instantly.", icon: Briefcase },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[#005d52] w-fit shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE PRODUCT SHOWCASE (TABBED DEMO) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Interactive Showcase
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            See the builder in action.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Click the tabs below to test different features of the Careers Studio.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "design" as const, label: "Visual Design", icon: Palette },
            { id: "jobs" as const, label: "Job Management", icon: Briefcase },
            { id: "responsive" as const, label: "Responsive Controls", icon: Smartphone },
            { id: "publish" as const, label: "Instant Publishing", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = showcaseTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setShowcaseTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#005d52] text-white shadow-md scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase Display Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl min-h-[360px] flex flex-col justify-center">
          {showcaseTab === "design" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#005d52]">Real-Time Visual Customization</span>
                <h3 className="text-2xl font-black text-slate-900">Fine-tune brand colors, font families & corner radii.</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Every change to primary colors, font selections, corner rounding, or container shadows reflects immediately on the live preview canvas without page reloads.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#005d52] border border-teal-200 text-xs font-bold">hsl colors</span>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">Google Fonts</span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">Glassmorphism</span>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-300">
                  <span>Inspector Controls</span>
                  <span className="text-teal-400">Live Sync</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[11px]">Selected Font: Geist Sans</span>
                    <div className="p-2 bg-slate-800 rounded-lg text-white font-bold">Inter / Geist Sans</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[11px]">Card Corner Radius: 16px</span>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === "jobs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#005d52]">Requisition Management</span>
                <h3 className="text-2xl font-black text-slate-900">Post open roles & filter by department.</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Create requisition details, assign department tags, define salary ranges, and toggle job status between Active and Draft mode seamlessly.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">Active Requisitions</span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">Draft Positions</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Senior Frontend Engineer</span>
                    <span className="text-[10px] text-slate-500">Engineering · San Francisco, CA</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Lead Product Designer</span>
                    <span className="text-[10px] text-slate-500">Design · Remote</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    DRAFT
                  </span>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === "responsive" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#005d52]">100% Mobile Ready</span>
                <h3 className="text-2xl font-black text-slate-900">Adaptable layouts for every candidate device.</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Every section template transforms cleanly from multi-column desktop grids to single-column stacked mobile cards, preventing overflow.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-[#005d52] border border-teal-200 text-xs font-bold">Desktop (1440px)</span>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">Tablet (768px)</span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">Mobile (375px)</span>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex justify-center">
                <div className="w-[260px] bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-center shadow-lg">
                  <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
                  <div className="w-16 h-1.5 bg-teal-400 rounded-full mx-auto" />
                  <div className="w-32 h-2.5 bg-white rounded-full mx-auto" />
                  <div className="w-20 h-4 bg-[#005d52] rounded-lg mx-auto" />
                </div>
              </div>
            </div>
          )}

          {showcaseTab === "publish" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#005d52]">1-Click Production Push</span>
                <h3 className="text-2xl font-black text-slate-900">Publish live candidate pages instantly.</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  When you are satisfied with your draft section layout, hit publish to push all changes directly to your public candidate portal URL.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">Published Live</span>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">Public URL Slug</span>
                </div>
              </div>
              <div className="bg-emerald-950 p-6 rounded-2xl border border-emerald-800 text-emerald-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Careers Page Live & Active</span>
                </div>
                <p className="text-xs text-emerald-300 font-mono">
                  https://whitecarrot.app/acme-corp/careers
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-24 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered for recruitment teams.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Everything you need to showcase your employer brand and attract top-tier talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Visual Page Builder", desc: "Design your careers page visually without writing CSS or HTML code.", icon: Layout },
              { title: "Fully Responsive", desc: "Create candidate experiences that work seamlessly across desktop, tablet & mobile.", icon: Smartphone },
              { title: "Flexible Templates", desc: "Start from 10+ recruiter-tested templates or build custom section layouts.", icon: Sparkles },
              { title: "Job Management", desc: "Create, edit, archive, and publish job postings from one central dashboard.", icon: Briefcase },
              { title: "Real-Time Preview", desc: "See your design changes, fonts, colors, and layout updates instantly.", icon: Eye },
              { title: "Candidate Experience", desc: "Give job seekers a clear, engaging path from discovery to application submission.", icon: Users },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 hover:border-slate-400 hover:shadow-xs transition-all group">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 text-[#005d52] w-fit shadow-2xs group-hover:bg-[#005d52] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (CONNECTED TIMELINE) */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Launch in 4 simple steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: "01", title: "Create Your Company", desc: "Set up your recruiter account & company brand slug." },
            { step: "02", title: "Design Careers Page", desc: "Choose templates, customize colors & reorder sections." },
            { step: "03", title: "Publish Jobs", desc: "Post requisitions with department, location & salary details." },
            { step: "04", title: "Receive Applications", desc: "Collect applications from candidates on your live site." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-2xs relative">
              <span className="text-3xl font-black text-[#005d52]">{item.step}</span>
              <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TEMPLATES SHOWCASE */}
      <section id="templates" className="py-16 sm:py-24 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Templates
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pre-built section templates for any brand style.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Modern Tech", desc: "Hero split, engineering focus, crisp typography.", tag: "Acme Corp Style" },
              { name: "Biotech & AI", desc: "Dark glass elements, culture video embed & perks grid.", tag: "TechNova Style" },
              { name: "Minimalist Studio", desc: "Flat cards, high-legibility text & focused jobs grid.", tag: "Clean Minimal" },
              { name: "Enterprise Corporate", desc: "Teal classic theme, mission statements & values cards.", tag: "Corporate" },
            ].map((tmpl, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4 hover:border-[#005d52] transition-all group">
                <div className="h-28 bg-slate-900 rounded-2xl p-3 flex flex-col justify-center items-center text-center space-y-2 border border-slate-800">
                  <div className="w-16 h-1.5 rounded-full bg-teal-400" />
                  <div className="w-24 h-2 rounded-full bg-white" />
                  <div className="w-12 h-3 rounded-md bg-[#005d52]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">{tmpl.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#005d52] border border-teal-200">
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tmpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE BEFORE / AFTER SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-[#005d52] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Transformation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            See the difference.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Toggle between a traditional unstyled job list and a modern WhiteCarrot careers site.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex justify-center">
          <div className="bg-slate-200 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setShowBeforeAfter("before")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                showBeforeAfter === "before"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Generic Job List (Before)
            </button>
            <button
              onClick={() => setShowBeforeAfter("after")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                showBeforeAfter === "after"
                  ? "bg-[#005d52] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Custom Branded Experience (After)
            </button>
          </div>
        </div>

        {/* Display Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl min-h-[260px] flex flex-col justify-center">
          {showBeforeAfter === "before" ? (
            <div className="space-y-4 text-left max-w-xl mx-auto">
              <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block">Traditional Careers Page</span>
              <h4 className="text-lg font-bold text-slate-800 font-serif">Open Positions at Company Inc.</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-mono">
                <li>Software Engineer (Full-time, SF)</li>
                <li>Product Designer (Remote)</li>
                <li>Sales Representative (Chicago)</li>
              </ul>
              <p className="text-[11px] text-slate-400 italic">Plain unstyled text list with no brand identity, culture videos, or company story.</p>
            </div>
          ) : (
            <div className="space-y-4 text-center max-w-xl mx-auto">
              <span className="text-xs font-extrabold text-[#005d52] uppercase tracking-wider block">WhiteCarrot Branded Experience</span>
              <h4 className="text-2xl font-black text-slate-900">Build The Future With Us</h4>
              <p className="text-xs text-slate-600 font-medium">Join an ambitious team working on impactful challenges with great benefits & flexible work.</p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-4 py-2 bg-[#005d52] text-white text-xs font-extrabold rounded-xl shadow-xs">View 12 Openings →</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 11. BOTTOM CTA BANNER */}
      <section className="py-16 sm:py-24 bg-[#005d52] text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to build a careers page your candidates remember?
          </h2>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto font-medium">
            Create your company's hiring experience in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={ctaHref}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-[#005d52] font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-teal-900/60 hover:bg-teal-900/80 text-white border border-teal-400/40 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 12. CLEAN SAAS FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#005d52] text-white font-extrabold flex items-center justify-center text-xs">
                W
              </div>
              <span className="font-black text-slate-900 text-base">WhiteCarrot</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              The modern careers page builder & recruitment portal platform for growing companies.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-black uppercase text-slate-900 text-[10px] tracking-wider block">Product</span>
            <ul className="space-y-1.5 font-medium">
              <li><button onClick={() => scrollToSection("product")} className="hover:text-[#005d52]">Features</button></li>
              <li><button onClick={() => scrollToSection("templates")} className="hover:text-[#005d52]">Templates</button></li>
              <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-[#005d52]">Builder Overview</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-black uppercase text-slate-900 text-[10px] tracking-wider block">Company</span>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/acme-corp/careers" target="_blank" className="hover:text-[#005d52]">Acme Demo Page</Link></li>
              <li><Link href="/technova/careers" target="_blank" className="hover:text-[#005d52]">TechNova Demo Page</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-black uppercase text-slate-900 text-[10px] tracking-wider block">Access</span>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/login" className="hover:text-[#005d52]">Recruiter Login</Link></li>
              <li><Link href="/register" className="hover:text-[#005d52]">Create Free Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 WhiteCarrot Careers Page Builder · All Rights Reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
