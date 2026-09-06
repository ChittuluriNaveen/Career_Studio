# 🎙️ 4-Minute Demo Script: WhiteCarrot Career Studio & Candidate Portal

> **Target Duration**: Exactly 4:00 Minutes (240 Seconds)  
> **Key Strategy**: Highlight core assignment requirements while emphasizing high-impact features built **above and beyond expectations** (Relative Luminance Theme Engine, Preview Canvas Navigation Isolation, Real Draft/Published State, Google Jobs JSON-LD, Multi-Tenant Boundaries).

---

## ⏱️ Timeline & Presentation Flow

```
[0:00 - 0:30]  │ 1. Hook & Product Architecture Split
[0:30 - 1:45]  │ 2. Recruiter Studio & Engineering Innovations (Above & Beyond)
[1:45 - 3:00]  │ 3. Candidate Experience, Filter Marketplace & Preview Isolation
[3:00 - 3:45]  │ 4. Tech Stack, Data Isolation & SEO Engineering
[3:45 - 4:00]  │ 5. Summary & Closing
```

---

## 📄 Word-for-Word Presentation Script

### 📍 [0:00 - 0:30] Phase 1: Hook & Product Architecture Split

**What to do on screen**: Start on the Recruiter Dashboard landing page or Login page (`recruiter@acme.com`).

**Script**:
> "Hi everyone! Today I’m excited to show you the **WhiteCarrot Career Experience Studio**.
> 
> When looking at how modern companies recruit, we realized that putting an entire job board onto a single homepage creates clutter and lowers candidate conversion. 
> 
> So instead of a simple static page, we built a **two-tier candidate experience ecosystem**:
> 1. A rich **Company Careers Story** (`/acme-corp/careers`) focused on employer branding, culture, video, and team testimonials.
> 2. A separate, high-performance **Dedicated Candidate Marketplace** (`/acme-corp/careers/jobs`) with dynamic multi-filtering.
> 
> Both of these experiences are controlled in real-time by recruiters through our visual Studio."

---

### 📍 [0:30 - 1:45] Phase 2: Recruiter Studio & "Above & Beyond" Innovations

**What to do on screen**: 
1. Log in as `recruiter@acme.com` and open the **Studio Editor** (`/company/acme-corp/design`).
2. Drag and drop a section to reorder it.
3. Open the **Theme Customizer**, change background colors between Dark (`#0f172a`), Light (`#f8fafc`), and presets like `cyber-dark` or `emerald-biotech`.
4. Point out how text and card contrast change automatically.
5. Click **Desktop / Tablet / Mobile** device viewport toggles.

**Script**:
> "Here in the **Recruiter Studio**, we give talent teams complete creative freedom—without letting them break brand design standards.
>
> **1. Visual Drag-and-Drop Canvas**: Powered by `@dnd-kit/sortable`, recruiters can instantly reorder sections like Hero Banners, Culture Videos, Stats, and Testimonials with keyboard and touch accessibility.
> 
> **2. Relative Luminance Contrast Engine (★ ABOVE & BEYOND)**: 
> Instead of hardcoding dark or light mode CSS, we engineered a custom color engine using the ITU-R relative luminance formula:
> $$Y = 0.2126R + 0.7152G + 0.0722B$$
> 
> Watch what happens when I switch between background hex colors or brand presets: whether the recruiter chooses deep slate dark or high-contrast white, our system dynamically computes font colors, border opacity, and card glassmorphism. Text readability is **mathematically guaranteed** across every single section and page!
> 
> **3. Live Interpolation & Responsive Viewports**: Recruiters can preview their layout across Desktop, Tablet, and Mobile frames in real-time while using live variables like `@company_name` and `@jobs_count`.
> 
> **4. Draft vs. Published State Isolation (★ ABOVE & BEYOND)**: Edits are saved in a draft state first. Recruiters can test radical design changes without disrupting live candidate traffic until they click 'Save & Publish'."

---

### 📍 [0:45 - 3:00] Phase 3: Candidate Marketplace & Studio Preview Isolation

**What to do on screen**:
1. Click **"Explore Jobs"** inside the Studio Preview canvas to show page switching inside the iframe/canvas.
2. Open the published candidate portal (`/acme-corp/careers`).
3. Click "Explore Open Roles" to land on the **Job Marketplace** (`/acme-corp/careers/jobs`).
4. Apply filters (Department: *Engineering*, Work Mode: *Remote*, Search query: *Senior*).
5. Click a job card to view the Job Details page and open the candidate application form.

**Script**:
> "Now let's look at the **Candidate Portal**. 
>
> When candidates click 'Explore Open Roles', they transition seamlessly to the **Dedicated Job Marketplace**.
> 
> **1. Theme Consistency**: The exact brand palette, fonts, and dark/light luminance styling set by the recruiter in the studio carry over cleanly across the careers page, job feed, and job details.
> 
> **2. Dynamic Multi-Dimensional Search**: Candidates can filter open roles simultaneously by Department, City/Country Location, Employment Type (Full-time/Contract), and Work Mode (Remote/Hybrid/Onsite)—with instant client-side search across job titles and descriptions.
> 
> **3. Preview Navigation Isolation (★ ABOVE & BEYOND)**: 
> In standard editors, clicking links inside a preview takes you away from the editor page. We engineered preview isolation: when recruiters test navigation inside the studio canvas, our system intercepts route changes and renders internal sub-pages without losing the recruiter’s editor session or URL state.
> 
> **4. Application Flow**: Clicking any role opens a dedicated job page complete with requirements, salary ranges, benefits snapshot, and a direct application submission form that writes directly to PostgreSQL."

---

### 📍 [3:00 - 3:45] Phase 4: Tech Stack, Security & Enterprise Architecture

**What to do on screen**: Briefly show `README.md` or high-level architecture diagram.

**Script**:
> "Under the hood, this platform is built for production reliability and speed:
> 
> - **Framework**: Built on **Next.js 16 (App Router)** with **TypeScript** — verifying zero type errors with `npx tsc --noEmit`.
> - **Database & Security**: **PostgreSQL** paired with **Prisma ORM**. All database queries enforce strict multi-tenant scoping via `companyId` foreign key boundaries to prevent data leakage.
> - **Auth & Validation**: **Auth.js (v5)** with JWT session enrichment and **Zod** schema validation on server actions.
> - **SEO & Google Jobs (★ ABOVE & BEYOND)**: Public job pages generate server-side `JobPosting` and `Organization` JSON-LD structured data for automatic Google Jobs indexing."

---

### 📍 [3:45 - 4:00] Phase 5: Closing Statement

**What to do on screen**: Return to the sleek live published careers page.

**Script**:
> "To summarize: we didn't just build a simple form editor. We built a full-stack, enterprise-ready **Career Experience Studio** with mathematical theme contrast, preview isolation, full multi-tenant data boundaries, and a dedicated candidate job marketplace.
> 
> Thank you! I’d love to take any questions."

---

## 💡 Quick Tips for Delivery
1. **Pacing**: Speak at a steady, confident pace. Don't rush; the timing is allocated naturally.
2. **Key Buzzwords to Emphasize**: *"Mathematical contrast guarantee"*, *"Preview isolation"*, *"Multi-tenant boundaries"*, *"Draft vs Published state"*.
3. **If Short on Time**: You can skip showing the mobile view toggle in Phase 2 and jump straight to the candidate marketplace.
