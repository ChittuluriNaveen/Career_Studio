# 🎙️ Master Interview & Demo Script: WhiteCarrot Career Studio

This document contains the **complete word-for-word presentation script**, **feature explanations**, and **technical Q&A guide** for your interview presentation.

---

## ⏱️ Timeline & Presentation Flow

```
[0:00 - 0:30]  │ 1. Project Overview & Multi-Tenant Split Architecture
[0:30 - 1:30]  │ 2. Studio Layout, Drag & Drop, Templates & Style Engine
[1:30 - 2:30]  │ 3. Target Devices & Responsive Viewport Simulation Engine
[2:30 - 3:15]  │ 4. Draft vs. Published State Isolation & Live Real-Time Canvas Preview
[3:15 - 4:00]  │ 5. SEO Panel, Google Jobs JSON-LD & Published Candidate Marketplace
[4:00 - 5:00]  │ 6. Technical Q&A Cheatsheet for Interviewer Questions
```

---

## 📄 WORD-FOR-WORD DEMO SCRIPT

### 📍 Phase 1: Overview & Multi-Tenant Architecture [0:00 - 0:30]

**On Screen**: Recruiter Studio landing page or login page (`recruiter@acme.com`).

**Script**:
> "Hi everyone! Today I’m excited to present the **WhiteCarrot Career Experience Studio**.
> 
> Modern companies need a way for talent teams to customize their employer brand without relying on engineers for every text or color change. 
> 
> We built a **multi-tenant SaaS platform** divided into two distinct environments:
> 1. **Recruiter Studio (`/company/acme-corp/design`)**: An authenticated, state-heavy editing suite where recruiters customize sections, templates, themes, and SEO.
> 2. **Candidate Portal (`/acme-corp/careers`)**: A fast, server-rendered public careers story and job marketplace optimized for SEO and conversions.
> 
> Every tenant's data is strictly isolated in PostgreSQL via `companyId` foreign key boundaries."

---

### 📍 Phase 2: Drag & Drop, Templates & Style Engine [0:30 - 1:30]

**On Screen**: Logged into Recruiter Studio (`/company/acme-corp/design`).
1. Drag a section up and down in the left sidebar (`SectionList.tsx`).
2. Open the **Templates Panel** (`TemplatePickerPanel.tsx`) and highlight section types.
3. Open the **Theme Customizer** (`BrandThemeEditor.tsx`) and switch background colors between Dark (`#030712`), Light (`#f8fafc`), or custom hex values.

**Script**:
> "Here in the Studio, recruiters have complete creative control:
> 
> **1. Accessible Drag-and-Drop Reordering**: Powered by `@dnd-kit/sortable` in `SectionList.tsx`. Reordering sections like Hero Banners, Culture Videos, and Open Roles updates the React client state array instantly and syncs the new `orderIndex` to PostgreSQL via Server Actions.
> 
> **2. Pre-Built Template System**: In `lib/templates/registry.ts`, we define core section types like `HERO`, `ABOUT_US`, `CULTURE_VIDEO`, `PERKS_BENEFITS`, and `OPEN_ROLES`, combined with layout variants like `split-image` or `centered-bold`. Recruiters can insert pre-designed templates with one click.
> 
> **3. Relative Luminance Theme Engine (★ Key Innovation)**:
> When recruiters select custom brand background colors, text contrast is **mathematically guaranteed**. In `lib/themes/registry.ts`, we compute ITU-R relative luminance:
> $$Y = 0.2126R + 0.7152G + 0.0722B$$
> 
> If $Y < 140$ (Dark mode), text automatically converts to high-contrast white (`#f8fafc`) with dark glassmorphism cards. If $Y \ge 140$ (Light mode), text switches to slate dark (`#0f172a`). Readability meets WCAG contrast standards automatically!"

---

### 📍 Phase 3: Target Devices & Responsive Viewport Engine [1:30 - 2:30]

**On Screen**: Click the **Desktop 🖥️**, **Tablet 📱**, and **Mobile 📲** viewport toggle buttons in the top preview header.

**Script**:
> "Recruiters can test how their page looks across different target devices in real time:
> 
> **1. Target Device Simulation**: Toggling between Desktop, Tablet, and Mobile resizes the center preview container (`DeviceViewportFrame.tsx`) to match exact device screen widths (375px for mobile, 768px for tablet).
> 
> **2. Automated Responsive Styling Engine**: In `lib/templates/stylesResolver.ts`, our `getResponsiveStyles()` function handles mobile layout adaptation:
> - **Proportional Font Scaling**: Headings $\ge 24\text{px}$ are automatically scaled down by $0.65\times$ for mobile screens so text never overflows.
> - **Flex Layout Stacking**: Horizontal flex rows automatically convert to vertical columns (`flexDirection: "column"`).
> - **Padding Optimization**: Container padding $>24\text{px}$ is automatically reduced for mobile viewports."

---

### 📍 Phase 4: Draft vs. Published State & Live Real-Time Studio Preview [2:30 - 3:15]

**On Screen**: Edit a section heading or change background color in the studio. Show how the preview updates instantly. Show that the published live site URL remains unchanged until clicking "Save & Publish".

**Script**:
> "One of our key engineering highlights is **Draft vs. Published State Isolation**:
> 
> **How Live Preview Works Without Publishing**:
> When a recruiter adds new items, changes fonts, or reorders sections in the Studio, changes update the client React state in memory (`sections[]`). The center canvas (`CareersPageRenderer.tsx`) renders this active draft state directly. Recruiters can test radical design changes in real time at 60 FPS **without affecting live candidate traffic**.
> 
> **Why Un-published Edits are Invisible to Candidates**:
> All draft edits save to PostgreSQL with `isDraft = true` and `isPublished = false`. Public candidate routes (`/acme-corp/careers`) strictly query records where `isPublished = true`.
> 
> **The Publish Flow**:
> When ready, the recruiter clicks **'Save & Publish'**. `publishPageAction()` in `lib/actions/publish.ts` atomically sets `isPublished = true` in PostgreSQL and calls Next.js `revalidatePath('/acme-corp/careers')` to purge server-side HTML cache, updating the live site instantly!"

---

### 📍 Phase 5: SEO Panel, Google Jobs JSON-LD & Published Candidate Marketplace [3:15 - 4:00]

**On Screen**:
1. Open **SEO Panel** (`SEOPanel.tsx`) showing custom Meta Title, Description, and Social Share preview.
2. Open the published live link `/acme-corp/careers/jobs` in a new tab.
3. Show job filtering by Department, Work Mode, Location, and instant text search.

**Script**:
> "Finally, let me show you **SEO & Candidate Experience**:
> 
> **1. SEO & Social Share Customization**: In the **SEO Panel**, recruiters can set custom Meta Titles, Meta Descriptions, Keywords, and Social Share images (OpenGraph cards).
> 
> **2. Google Jobs JSON-LD Schema (★ Key Innovation)**: On public job detail pages, `StructuredData.tsx` generates standard schema.org `JobPosting` JSON-LD code. Search engines like Google Jobs automatically index the open roles, salary ranges, and work modes.
> 
> **3. Published Candidate Marketplace**: Candidates visit `/acme-corp/careers/jobs` for a high-performance marketplace featuring instant client-side search and multi-dimensional filters across Department, Work Mode (Remote/Hybrid/Onsite), and Location—allowing candidates to apply directly!"

---

# 🧠 DEEP FEATURE EXPLANATIONS & CODE POINTERS

Use this reference guide when explaining features in detail during your interview:

### 1. Templates System
* **Code location**: [lib/templates/registry.ts](file:///home/user/Videos/WhiteCarrot_assignment/lib/templates/registry.ts) & [components/editor/panels/TemplatePickerPanel.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/editor/panels/TemplatePickerPanel.tsx)
* **How it works**: Pre-defines section types (`HERO`, `ABOUT_US`, `CULTURE_VIDEO`, `PERKS_BENEFITS`, `GALLERY`, `OPEN_ROLES`, `CTA`) paired with layout variants (`split-image`, `centered-bold`, `grid-cards`). Selecting a template populates the `PageSection.content` JSON schema with default elements and styling.

### 2. Styles System
* **Code location**: [lib/templates/stylesResolver.ts](file:///home/user/Videos/WhiteCarrot_assignment/lib/templates/stylesResolver.ts) & [components/editor/panels/SectionStylePanel.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/editor/panels/SectionStylePanel.tsx)
* **How it works**: Converts layout, spacing, typography, border radius, shadow presets, and glassmorphism settings into inline React `style={...}` objects.

### 3. Responsives & Target Device Simulation
* **Code location**: [lib/templates/stylesResolver.ts](file:///home/user/Videos/WhiteCarrot_assignment/lib/templates/stylesResolver.ts#L75-L184) & `DeviceViewportFrame.tsx`
* **How it works**: Resizes canvas wrapper (`375px` mobile, `768px` tablet, `100%` desktop). `getResponsiveStyles()` applies device overrides, auto-scales font sizes down by $0.65\times$ for mobile, and stacks flex rows into vertical columns.

### 4. Drag & Drop Reordering
* **Code location**: [components/editor/SectionList.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/editor/SectionList.tsx) & [lib/actions/sections.ts](file:///home/user/Videos/WhiteCarrot_assignment/lib/actions/sections.ts#L45-L80)
* **How it works**: Uses `@dnd-kit/sortable` to reorder elements in React state via `arrayMove()`. The updated `orderIndex` is saved to PostgreSQL via Server Action `reorderSectionsAction()`.

### 5. SEO Panel & Google Jobs JSON-LD
* **Code location**: [components/editor/panels/SEOPanel.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/editor/panels/SEOPanel.tsx) & [components/candidate/StructuredData.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/candidate/StructuredData.tsx)
* **How it works**: Configures meta tags and embeds `<script type="application/ld+json">` with `JobPosting` and `Organization` structured data for search engine bots.

### 6. Link Generation & Public Routes
* **Recruiter Studio**: `/company/[companySlug]/design`
* **Candidate Story Page**: `/[companySlug]/careers`
* **Candidate Job Marketplace**: `/[companySlug]/careers/jobs`
* **Candidate Job Details**: `/[companySlug]/careers/jobs/[jobId]`
* **Code location**: [components/editor/panels/SharePanel.tsx](file:///home/user/Videos/WhiteCarrot_assignment/components/editor/panels/SharePanel.tsx) provides instant link copy and QR code generation.

### 7. Draft vs. Published Architecture & Live Real-Time Studio Preview
* **Real-time Studio Preview**: Canvas renders the active in-memory React state `sections[]` directly at 60 FPS without needing to publish.
* **Database Isolation**: Edits save as `isDraft = true`, `isPublished = false`. Public routes filter strictly by `where: { isPublished: true }`.
* **Publish Action**: [lib/actions/publish.ts](file:///home/user/Videos/WhiteCarrot_assignment/lib/actions/publish.ts) sets `isPublished = true` in PostgreSQL and triggers `revalidatePath(...)` to refresh Next.js HTML server cache.

---

# ❓ TOP 10 INTERVIEWER QUESTIONS & EXACT ANSWERS

1. **Q: How does the editor show unsaved draft changes without updating the live site?**
   * **A**: *"The Recruiter Studio renders active client state `sections[]` in memory inside the center canvas frame. In PostgreSQL, edits update draft records (`isDraft = true`), while the public candidate routes strictly query `isPublished = true`."*

2. **Q: What happens when the recruiter clicks 'Save & Publish'?**
   * **A**: *"It triggers `publishPageAction()` in `lib/actions/publish.ts`. This updates database records to `isPublished = true` and invokes Next.js `revalidatePath('/[companySlug]/careers')` to flush server caches so candidates see the updated page immediately."*

3. **Q: How do responsive styles adapt when switching to mobile mode?**
   * **A**: *"Our `getResponsiveStyles()` engine in `stylesResolver.ts` applies mobile style overrides, automatically scales headings $\ge 24\text{px}$ down by $0.65\times$, converts horizontal flex rows into vertical columns, and reduces padding."*

4. **Q: How do you guarantee WCAG typography contrast when recruiters choose custom background colors?**
   * **A**: *"We compute ITU-R relative luminance $Y = 0.2126R + 0.7152G + 0.0722B$ in `lib/themes/registry.ts`. If $Y < 140$, the system automatically enforces high-contrast white text `#f8fafc`. If $Y \ge 140$, it applies dark slate text `#0f172a`."*

5. **Q: How is drag-and-drop implemented?**
   * **A**: *"Using `@dnd-kit/sortable` in `SectionList.tsx`. Dragging calls `arrayMove()` to update array order in React state instantly, followed by a Server Action `reorderSectionsAction()` updating PostgreSQL `orderIndex`."*

6. **Q: How do public URLs work for different companies?**
   * **A**: *"We use Next.js dynamic routing with `[companySlug]`. Each company's public story page is served at `/[companySlug]/careers` and job marketplace at `/[companySlug]/careers/jobs`."*

7. **Q: How does Google Jobs index your job posts?**
   * **A**: *"Public job pages render `StructuredData.tsx`, which injects schema.org `JobPosting` JSON-LD structured data directly into the HTML `<head>`."*

8. **Q: How do dynamic variables like `@company_name` get replaced?**
   * **A**: *"In `lib/templates/variables.ts`, a regex parsing engine replaces tokens like `@company_name` or `@jobs_count` with dynamic data at render time."*

9. **Q: How do you handle multi-tenancy security?**
   * **A**: *"All database models have an indexed `companyId` foreign key, and Server Actions verify `companyId` matching against authenticated JWT session claims."*

10. **Q: What is the main tech stack?**
    * **A**: *"Next.js 16 (App Router), TypeScript, PostgreSQL with Prisma ORM, Auth.js (v5), Tailwind CSS, and `@dnd-kit`."*
