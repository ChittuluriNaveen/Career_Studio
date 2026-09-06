# WhiteCarrot Careers Page Builder & Candidate Portal

A multi-tenant Careers Page Studio and Candidate Job Discovery platform built with Next.js 16 (App Router), Prisma, PostgreSQL, Auth.js (v5), and Tailwind CSS. 

This platform allows recruiters to design, customize, preview, and publish company careers pages using a drag-and-drop studio editor—while giving candidates a high-contrast, multi-filtered job discovery and application experience.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **PostgreSQL**: Local or remote database instance

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/whitecarrot_db?schema=public"
AUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Migration & Seeding
Push the Prisma schema to PostgreSQL and seed initial multi-tenant demo data:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Recruiter Demo Accounts

You can log in to the recruiter dashboard using any of the seeded company accounts:

| Company | Recruiter Email | Password | Live Public Careers URL |
| :--- | :--- | :--- | :--- |
| **Acme Corp** | `recruiter@acme.com` | `password123` | `http://localhost:3000/acme-corp/careers` |
| **TechNova AI** | `recruiter@technova.com` | `password123` | `http://localhost:3000/technova/careers` |

---

## 🎯 Product Architecture Overview

The system divides the candidate acquisition lifecycle into two distinct experiences managed by recruiters:

```
Recruiter Studio (/company/[companySlug]/design)
 ├── Brand Theme & Luminance Engine (Custom Hex / Presets)
 ├── Section Canvas (Drag & Drop Reordering via dnd-kit)
 ├── Element Inspector (Typography, Spacing, Live Variables)
 └── Draft vs Published Version Control

Candidate Experience (/[companySlug]/careers/...)
 ├── Company Careers Story (/careers)
 ├── Dedicated Jobs Feed / Marketplace (/careers/jobs)
 ├── Dynamic Multi-Filter Search (Department, Location, Type, Work Mode)
 └── Requisition Details & Candidate Application Form (/careers/jobs/[jobId])
```

---

## ✨ Key Technical Features

### 1. Recruiter Experience (Careers Studio)
- **Live Visual Canvas Editor**: Edit text, images, videos, and layouts in real-time with responsive device viewport toggles (Desktop, Tablet, Mobile).
- **Dynamic Theme & Relative Luminance Engine**: Pick any custom background hex color (`#0f172a`, `#022c22`, `#f8fafc`, etc.) or choose from 6 curated presets (`cyber-dark`, `corporate-clean`, `midnight-purple`, `emerald-biotech`, `minimal-luxury`, `vibrant-creative`). Automatically evaluates relative luminance ($Y = 0.2126R + 0.7152G + 0.0722B$) to adjust font contrast, card glassmorphism overlays, border colors, and hero gradients.
- **Visual Drag & Drop Reordering**: Reorder page sections using `@dnd-kit/core` and `@dnd-kit/sortable` with keyboard and touch support.
- **Live Variable Interpolation**: Use dynamic placeables like `@company_name`, `@jobs_count`, `@company_logo`, `@company_banner`, and `@culture_video` within headings and paragraphs.
- **Draft & Publish Lifecycle**: Save edits safely in draft mode (`isDraft = true`) without impacting the live candidate portal until clicking "Save & Publish".
- **Company & Job Management**: Update brand assets, manage locations and departments, post open roles with multi-currency salary ranges (`$`, `₹`, `€`, `£`), and review candidate applications.

### 2. Candidate Portal
- **Fast Job Discovery**: Instant client-side search across titles, departments, summaries, and locations (with city/country fallbacks) without page reloads.
- **Full Device-Width Banners**: Hero sections span 100% viewport width while keeping content cleanly constrained.
- **Preview Isolation**: When testing within the recruiter studio, clicking buttons or job cards switches views internally within the preview canvas without changing the browser URL.
- **Complete Application Flow**: Dedicated job details page with snapshot attributes, requirements list, benefits cards, and a candidate application form that saves directly to PostgreSQL.
- **Branded Candidate Footer**: Dynamic footer featuring company contact details (email, talent acquisition phone, headquarters address) and high-contrast social media logos (Facebook, Instagram, LinkedIn, Twitter/X) styled to match the active theme.
- **SEO & Google Jobs Integration**: Server-side rendered meta tags and JSON-LD structured data (`JobPosting` and `Organization`) for search engine indexation.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: Auth.js (NextAuth v5) Credentials Provider with JWT session enrichment
- **Styling**: Vanilla CSS, Tailwind CSS, HSL Color Utility
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Validation**: Zod schema validation
- **Icons**: Lucide React

---

## 📂 Project Structure

```
├── app/
│   ├── (dashboard)/            # Recruiter Studio & Admin Routes
│   │   └── company/[companySlug]/
│   │       ├── design/         # Live Studio Canvas & Inspector
│   │       ├── details/        # Company Brand Profile Management
│   │       └── jobs/           # Job Requisitions & Applications
│   ├── (public)/               # Candidate Facing Routes
│   │   └── [companySlug]/careers/
│   │       ├── page.tsx        # Careers Story Homepage
│   │       └── jobs/           # Marketplace & Job Details
│   └── api/                    # Auth & File Upload API Handlers
├── components/
│   ├── candidate/              # Candidate Marketplace & Job Cards
│   ├── editor/                 # Studio Panels, Section List & Inspectors
│   ├── preview/                # Canvas Renderers & Element Tree Engine
│   └── ui/                     # Shared UI Components & Loaders
├── lib/
│   ├── actions/                # Next.js Server Actions (Database & Auth)
│   ├── templates/              # Section Templates Registry & Style Resolvers
│   └── themes/                 # Theme Registry & Luminance Math Engine
├── prisma/                     # Database Schema & Seed Script
└── public/                     # Static Assets & Logos
```

---

## 🧪 Testing & Verification

Run the type checker and build commands to verify build validity:

```bash
# Type check TypeScript definitions
npx tsc --noEmit

# Test production build compilation
npm run build
```

---

## 📜 License

MIT. Built for the WhiteCarrot technical evaluation assignment.
