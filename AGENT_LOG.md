# Agent Execution & AI Assistance Log

This document highlights how AI coding tools were utilized throughout the planning, architecture, prototyping, and refinement phases of the Careers Page Builder assignment.

---

## 1. System Architecture & Multi-Tenant Planning
- **Prompt**: Analyzed the Whitecarrot assignment specification to design a production multi-tenant Careers Page Builder.
- **Architectural Refinement**: Enforced strict multi-tenant isolation where `Company` is the root boundary (`companyId`). Guaranteed that all Prisma queries in Server Actions explicitly require `companyId` matching the authenticated session.

---

## 2. Dynamic Custom Hex Theme & Relative Luminance Engine
- **Prompt**: Prompts to design a theme engine allowing recruiters to pick *any custom background color* (light or dark) while maintaining accessible typography contrast.
- **AI Refinement**: Implemented custom RGB parsing and relative luminance calculation (`0.2126*R + 0.7152*G + 0.0722*B < 140`) to dynamically assign contrast text colors (`#f8fafc` vs `#0f172a`), card glassmorphism backgrounds (`rgba(...)` vs `#ffffff`), input field borders, and hero gradient overlays.

---

## 3. Component Design, Element Sizing & dnd-kit Integration
- **Prompts**: Configured `@dnd-kit/core` and `@dnd-kit/sortable` with keyboard coordinates and pointer sensors for accessible section reordering. Added drag-to-resize element controls and live variable interpolation (`@company_name`, `@jobs_count`, `@company_logo`, `@culture_video`).
- **Refinements**: Handled draft state (`isDraft = true`) versus published state (`isPublished = true`) to prevent un-published recruiter edits from appearing on public candidate portals.

---

## 4. End-to-End Candidate Application Flow & Scroll Animations
- **Prompts**: Extended candidate browsing to include a full Job Details view (`/[companySlug]/careers/jobs/[jobId]`) and online Candidate Application submission flow saving to `Application` database table.
- **Scroll-Driven Micro-Animations**: Built `LazySectionReveal` with `IntersectionObserver` to trigger stagger-delayed entrance animations (`scale`, `up`, `down`, `fade`) when candidates scroll.

---

## 5. SEO & Candidate Search Optimization
- **Prompts**: Built client-side instant search filtering for job title, department, location (with city/country fallback), and job type with zero latency.
- **Structured Data**: Integrated JSON-LD `JobPosting` and `Organization` schema tags for search engine crawlability.
