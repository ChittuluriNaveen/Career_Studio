# Technical Specification: Careers Page Builder

## 1. Overview & Architecture
The **Careers Page Builder** is a multi-tenant web application that allows recruiters to create, customize, preview, and publish branded careers pages for their companies. Candidates can browse company stories, view culture media, search open positions with instant filters, view job details, and submit online job applications.

### Multi-Tenant Strategy
- **Tenant Boundary**: `Company` entity serves as the root tenant context (`companyId`).
- **Data Isolation**: Every company-owned model (`User`, `PageTemplate`, `Section`, `SectionElement`, `Job`, `Department`, `Location`, `Application`) enforces an indexed foreign key `companyId`.
- **Query Scoping**: All Prisma database reads and mutations explicitly scope filters by `companyId` extracted from verified Auth.js tokens or resolved via `companySlug`.

---

## 2. Database Schema (PostgreSQL & Prisma)

```prisma
model Company {
  id             String        @id @default(cuid())
  name           String
  slug           String        @unique
  logoUrl        String?
  bannerUrl      String?
  cultureVideoUrl String?
  location       String?
  heroTitle      String?       @default("Build the future with us")
  heroSubtitle   String?       @default("Discover your next career opportunity")
  primaryColor   String        @default("#0f766e")
  secondaryColor String        @default("corporate-clean")
  fontFamily     String        @default("Inter")
  cornerRadius   Int           @default(16)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  users          User[]
  templates      PageTemplate[]
  sections       Section[]
  elements       SectionElement[]
  jobs           Job[]
  departments    Department[]
  locations      Location[]
  applications   Application[]

  @@index([slug])
}

model Application {
  id            String   @id @default(cuid())
  jobId         String
  companyId     String
  candidateName String
  candidateEmail String
  resumeUrl     String?
  coverLetter   String?
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  job           Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  company       Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([jobId])
  @@index([companyId])
}
```

---

## 3. Technology Stack & Framework Choices

- **Core Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS, Tailwind CSS, & Dynamic HSL Relative Luminance Math
- **UI Components**: Lucide Icons & Custom Component Design System
- **Database ORM**: Prisma ORM with `@prisma/adapter-pg` & PostgreSQL
- **Authentication**: Auth.js (NextAuth.js v5) Credentials Provider
- **Validation**: Zod runtime input validation
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Password Hashing**: bcryptjs

---

## 4. Key Design & Technical Innovations

1. **Custom Hex Background Theme & Luminance Contrast Engine**:
   - Accepts any custom background hex color (`#0f172a`, `#1e1b4b`, `#022c22`, `#f8fafc`, etc.) or preset theme ID (`cyber-dark`, `corporate-clean`, `midnight-purple`, etc.).
   - Computes relative luminance (`0.2126*R + 0.7152*G + 0.0722*B`) to determine light vs dark mode contrast, dynamically providing optimal card background opacity, input borders, text colors (`#f8fafc` vs `#0f172a`), and hero gradients.
2. **Draft vs Published Canvas Separation**:
   - Recruiter Studio edits update draft state (`isDraft = true`) allowing recruiters to preview alterations safely.
   - Click to publish promotes draft sections to public view (`isPublished = true`) with dynamic Next.js cache revalidation.
3. **End-to-End Candidate Application Flow**:
   - Candidates can browse jobs, view detailed position specs, and submit applications directly to the PostgreSQL database.
4. **Scroll-Driven Micro-Animations**:
   - `LazySectionReveal` component utilizes `IntersectionObserver` to trigger stagger-delayed entrance animations (`scale`, `up`, `down`, `fade`) when candidate scrolls to each section.

---

## 5. Test & Quality Plan

- **Automated Type Checking**: TypeScript strict mode (`npx tsc --noEmit`).
- **Production Build Verification**: Next.js production build compiler (`npm run build`).
- **Input & Schema Validation**: Zod runtime validation on authentication, company details, section payloads, and candidate applications.
- **Multi-Tenant Isolation Verification**: Cross-tenant data leakage tests ensuring `companyId` boundaries are enforced across all queries.
