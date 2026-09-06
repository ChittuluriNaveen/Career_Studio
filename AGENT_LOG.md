# Agent Execution & AI Collaboration Log

This log documents the iterative implementation process, architectural decisions, and bug-fixing sessions carried out in pair-programming collaboration with the AI assistant (Antigravity Agent / DeepMind Coding Assistant).

---

## 1. Multi-Tenant Architecture & Database Schema Design

### Objective
Establish a clean multi-tenant database model supporting recruiter management and candidate application processing.

### Key Milestones
- **Multi-Tenant Isolation**: Verified that `Company` acts as the single source of truth (`companyId`). Added foreign key cascading and explicit `companyId` filtering across Server Actions to prevent cross-tenant data leaks.
- **Data Models**: Created Prisma models for `Company`, `User`, `PageSection`, `Job`, `Department`, `Location`, and `Application`.
- **Seeding**: Created a comprehensive database seed script (`prisma/seed.ts`) populating demo data for Acme Corp and TechNova AI with sample job requisitions, section templates, and recruiter credentials (`recruiter@acme.com` / `password123`).

---

## 2. Recruiter Studio Development & dnd-kit Canvas

### Objective
Build a visual section-based editor (`/company/[companySlug]/design`) where recruiters can add, reorder, edit, and style page sections in real-time.

### Key Milestones
- **Drag-and-Drop Reordering**: Integrated `@dnd-kit/core` and `@dnd-kit/sortable` to enable fluid section dragging with keyboard accessibility.
- **Draft vs. Published Workflow**: Separated draft changes (`isDraft = true`) from live candidate views until the recruiter explicitly triggers "Save & Publish".
- **Element Inspector & Variable Interpolation**: Created an inspector side-panel to modify element typography, alignment, button CTAs, and images. Built a live variable replacer (`@company_name`, `@jobs_count`, `@company_logo`, `@culture_video`) that resolves runtime tokens into brand assets.
- **Undo / Redo System**: Implemented a historical state stack (`history`, `historyIndex`) allowing recruiters to revert layout changes instantly.

---

## 3. Custom Hex Background & Relative Luminance Contrast Engine

### Objective
Allow recruiters to input any custom background color (hex code) or choose from preset themes without breaking accessibility or text readability.

### Key Milestones
- **Luminance Contrast Math**: Built a color utility in `lib/themes/registry.ts` computing relative luminance ($Y = 0.2126R + 0.7152G + 0.0722B$).
- **Dynamic Style Binding**:
  - Automatically switches text colors between `#0f172a` (light background) and `#f8fafc` (dark background).
  - Dynamically calculates glassmorphism card overlays, border contrast ratios, and hero background gradients based on theme mode.
- **Theme Presets**: Integrated 6 curated themes (`cyber-dark`, `midnight-purple`, `emerald-biotech`, `corporate-clean`, `minimal-luxury`, `vibrant-creative`).

---

## 4. Product Concept Refinement: Split Careers & Jobs Discovery

### Objective
Refactor candidate experience into two distinct entry points:
1. **Careers Story Homepage (`/[companySlug]/careers`)**
2. **Dedicated Jobs Marketplace (`/[companySlug]/careers/jobs`)**

### Key Milestones
- **Dedicated Jobs Marketplace**: Created `PublicJobsFeedClient.tsx` featuring instant client-side search across titles, departments, locations, and employment types.
- **Job Card Variants**: Built flexible card design options (`modern-card`, `compact-list`, `minimal-card`).
- **End-to-End Application Flow**: Enhanced the Job Details requisition page (`/[companySlug]/careers/jobs/[jobId]`) with a complete candidate application form submitting to PostgreSQL via `submitApplicationAction`.

---

## 5. Major Bug-Fixing & Polish Iterations

### A. React Duplicate Key Warning
- **Issue**: Console warning `Each child in a list should have a unique "key" prop` in `PublicJobsFeedClient.tsx`.
- **Fix**: Replaced plain `key={loc.name}` with index-composite keys `key={"loc-" + loc.name + "-" + idx}` across location, department, and work mode filters.

### B. Preview Canvas Window Scroll Stability
- **Issue**: Selecting sections or elements inside the studio canvas caused the outer browser viewport to scroll upwards.
- **Fix**: Replaced global `scrollIntoView` calls with scoped container scrolling: `container.scrollTo({ top: offset, behavior: "smooth" })` targeting the `.overflow-y-auto` canvas panel.

### C. Studio Preview URL Navigation Isolation
- **Issue**: Clicking "Explore Open Roles", header links, footer links, or job cards in Studio Preview mode triggered Next.js router navigation, redirecting recruiters away from `/company/[companySlug]/design`.
- **Fix**: Passed `isPreviewMode` and `onNavigatePage` callbacks across `CareersPageRenderer`, `JobSearchFilter`, `PublicJobsFeedClient`, `JobCard`, and `JobDetailsClient`. In Preview Mode, Next.js `<Link>` tags are replaced with buttons calling `onNavigatePage("jobs" | "careers" | "job-details", jobId)`, updating the studio canvas internally without changing the browser URL.

### D. Light Theme Title Contrast
- **Issue**: Hero banner titles (`<h1>`) in `PublicJobsFeedClient` and `JobDetailsClient` had hardcoded `text-white` classes, making titles invisible when switching to light mode themes.
- **Fix**: Removed hardcoded `text-white` classes and bound headings dynamically to `style={{ color: theme.textColor }}`.

---

## 6. Build & Type Safety Verification

- **TypeScript Type Check**: `npx tsc --noEmit` — Passed with **0 errors**.
- **Next.js Production Build**: `npm run build` — Compiled successfully across all dynamic and static routes.
