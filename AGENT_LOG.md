# Agent Execution & AI Assistance Log

This document highlights how AI coding tools were utilized throughout the planning, architecture, prototyping, and refinement phases of the Careers Page Builder assignment.

---

## 1. System Architecture & Multi-Tenant Planning
- **Prompt**: Analyzed the Whitecarrot assignment specification to design a 6-hour production prototype.
- **Architectural Refinement**: Enforced strict multi-tenant isolation where `Company` is the root boundary (`companyId`). Guaranteed that all Prisma queries in Server Actions explicitly require `companyId` matching the authenticated session.

---

## 2. Component Design & dnd-kit Integration
- **Prompts**: Configured `@dnd-kit/core` and `@dnd-kit/sortable` with keyboard coordinates and pointer sensors for accessible section reordering.
- **Refinements**: Handled draft state (`isDraft = true`) versus published state (`isPublished = true`) to prevent un-published recruiter edits from appearing on public candidate portals.

---

## 3. SEO & Candidate Search Optimization
- **Prompts**: Built client-side instant search filtering for job title, location, and job type with zero latency.
- **Structured Data**: Integrated JSON-LD `JobPosting` and `Organization` schema tags for search engine crawlability.
