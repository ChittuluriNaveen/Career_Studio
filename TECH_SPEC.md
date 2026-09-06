# Technical Specification: WhiteCarrot Careers Page Builder & Candidate Portal

## 1. Executive Summary & Architecture Principles

The **WhiteCarrot Careers Page Builder** is a multi-tenant SaaS application that gives recruiting teams complete creative control over their employer brand while offering candidates an intuitive, high-performance job discovery and application platform.

### Core Architectural Decisions
- **Multi-Tenant Scoping**: All tenant resources (`User`, `PageSection`, `SectionElement`, `Job`, `Department`, `Location`, `Application`) belong to a root `Company` entity. Tenant boundaries are enforced via indexed `companyId` foreign keys and checked within Server Actions using session JWT claims.
- **Split Domain Experience**:
  - **Recruiter Dashboard (`/company/[companySlug]/...`)**: Authenticated, state-heavy editing environment for canvas layout, section order, brand themes, and requisition management.
  - **Candidate Experience (`/[companySlug]/careers/...`)**: Fast, server-rendered public pages optimized for speed, responsive layout, SEO indexing, and application submissions.
- **Draft vs. Published Workflow**: Modifications made in the Recruiter Studio modify draft models (`isDraft = true`). Clicking "Save & Publish" atomically commits changes (`isPublished = true`) and triggers Next.js path revalidation.

---

## 2. Data Modeling & Database Schema

The database utilizes PostgreSQL with Prisma ORM.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Company {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  logoUrl         String?
  bannerUrl       String?
  cultureVideoUrl String?
  website         String?
  industry        String?
  companySize     String?
  location        String?
  description     String?
  primaryColor    String        @default("#0f766e")
  secondaryColor  String        @default("corporate-clean")
  fontFamily      String?       @default("Inter")
  tagline         String?
  aboutText       String?
  cornerRadius    Int?          @default(16)
  sectionSpacing  String?       @default("3.5rem")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  users           User[]
  sections        PageSection[]
  jobs            Job[]
  departments     Department[]
  locations       Location[]
  applications    Application[]

  @@index([slug])
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("RECRUITER")
  companyId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
}

model PageSection {
  id            String   @id @default(cuid())
  companyId     String
  type          SectionType
  title         String?
  content       Json
  layoutVariant String?  @default("default")
  orderIndex    Int      @default(0)
  enabled       Boolean  @default(true)
  isDraft       Boolean  @default(true)
  isPublished   Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  company       Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([orderIndex])
}

enum SectionType {
  HERO
  ABOUT_US
  CULTURE_VIDEO
  PERKS_BENEFITS
  GALLERY
  OPEN_ROLES
  CTA
  CUSTOM_TEXT
}

model Job {
  id               String       @id @default(cuid())
  companyId        String
  title            String
  slug             String
  departmentName   String
  employmentType   EmploymentType @default(FULL_TIME)
  workMode         WorkMode     @default(HYBRID)
  locationCity     String
  locationCountry  String
  salaryMin        Int?
  salaryMax        Int?
  currency         String?      @default("USD")
  salaryVisible    Boolean?     @default(true)
  summary          String?
  description      String?
  responsibilities Json?
  requirements     Json?
  preferredSkills  Json?
  benefits         Json?
  status           JobStatus    @default(ACTIVE)
  isPublished      Boolean      @default(true)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  company          Company      @relation(fields: [companyId], references: [id], onDelete: Cascade)
  applications     Application[]

  @@index([companyId])
  @@index([slug])
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
}

enum WorkMode {
  REMOTE
  HYBRID
  ON_SITE
}

enum JobStatus {
  ACTIVE
  CLOSED
  DRAFT
}

model Department {
  id        String   @id @default(cuid())
  companyId String
  name      String
  createdAt DateTime @default(now())

  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
}

model Location {
  id        String   @id @default(cuid())
  companyId String
  name      String
  isRemote  Boolean  @default(false)
  createdAt DateTime @default(now())

  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
}

model Application {
  id             String            @id @default(cuid())
  jobId          String
  companyId      String
  candidateName  String
  candidateEmail String
  resumeUrl      String?
  coverLetter    String?
  status         ApplicationStatus @default(PENDING)
  createdAt      DateTime          @default(now())

  job            Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  company        Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([jobId])
  @@index([companyId])
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  SHORTLISTED
  REJECTED
}
```

---

## 3. Dynamic Custom Hex Theme & Luminance Engine

To guarantee typography contrast and brand fidelity across any background color, the application implements a relative luminance contrast detector (`lib/themes/registry.ts`).

### Relative Luminance Mathematical Model
For any hex background color (preset or custom user input), the engine parses RGB components ($R, G, B \in [0, 255]$) and computes ITU-R BT.709 relative luminance:

$$Y = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$

- **Dark Theme Classification ($Y < 140$)**:
  - `textColor`: `#f8fafc` (high-contrast off-white)
  - `subtextColor`: `#94a3b8` / `#cbd5e1`
  - `cardBg`: `rgba(R+15, G+15, B+25, 0.85)` (semi-transparent glassmorphism)
  - `cardBorder`: `rgba(255, 255, 255, 0.15)`
  - `inputBg`: `rgba(2, 6, 23, 0.75)`
  - `heroBg`: `radial-gradient(ellipse at top, primaryColor40 0%, hexBg 80%)`

- **Light Theme Classification ($Y \ge 140$)**:
  - `textColor`: `#0f172a` (slate dark)
  - `subtextColor`: `#475569`
  - `cardBg`: `#ffffff`
  - `cardBorder`: `#e2e8f0`
  - `inputBg`: `#ffffff`
  - `heroBg`: `linear-gradient(135deg, hexBg 0%, #f1f5f9 100%)`

---

## 4. Recruiter Studio Architecture & Canvas Engine

### State Architecture (`CareerStudioClient.tsx`)
- **Client State**: Maintains `sections`, `jobSections`, `company`, `jobs`, `activePage`, `activeNavTab`, and `inspectorTab`.
- **Undo / Redo History Stack**: Captures snapshots of section architecture states into a historical array, enabling instant undo/redo actions.
- **Section Drag-and-Drop (`SectionList.tsx`)**: Built using `@dnd-kit/core` and `@dnd-kit/sortable` with array reordering (`arrayMove`).
- **Live Variable Interpolation (`lib/templates/variables.ts`)**: Evaluates strings at render time to replace tokens `@company_name`, `@jobs_count`, `@company_logo`, `@company_banner`, `@culture_video` with dynamic data.

### Studio Preview Isolation & Scoped Scrolling
- **URL Navigation Isolation**: When `isPreviewMode` is active, internal links (such as "Explore Open Roles", job cards, navbar links) do not trigger Next.js page transitions. Instead, an `onNavigatePage(page, jobId)` callback updates the active canvas state (`activePage = "careers" | "jobs" | "job-details"`).
- **Scoped Canvas Scrolling**: Auto-scrolling to selected sections uses element-relative math (`container.scrollTo({ top: offset, behavior: "smooth" })`) targeting the scroll panel (`.overflow-y-auto`), keeping the main browser viewport completely fixed.

---

## 5. Candidate Experience & Marketplace Architecture

1. **Company Careers Story (`/careers`)**: Renders high-impact story sections, core values, culture media, perks, and a featured job search block.
2. **Dedicated Jobs Feed / Marketplace (`/careers/jobs`)**:
   - Substring search across title, department, location, and description.
   - Filter matrix by location, department, employment type, work mode, and sort order.
   - Dynamic theme inheritance for filter containers, select dropdowns, and job card variants (`modern-card`, `compact-list`, `minimal-card`).
3. **Requisition Details & Application Submission (`/careers/jobs/[jobId]`)**:
   - Displays position summary, key responsibilities, requirements checklist, snapshot metadata, and multi-currency salary ranges.
   - Application Form validates user input and invokes `submitApplicationAction` to store candidate records in PostgreSQL.

---

## 6. Verification & Quality Assurance Plan

- **TypeScript Compilation**: Enforces zero `any` leaks or signature mismatches via `npx tsc --noEmit`.
- **Production Build Compilation**: Validated via `npm run build` with Turbopack compiler.
- **Theme Luminance Contrast Tests**: Tested against extreme hex values (`#000000`, `#ffffff`, `#090514`, `#f8fafc`, `#022c22`).
