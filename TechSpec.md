# Technical Specification: Careers Page Builder

## 1. Overview & Architecture
The **Careers Page Builder** is a multi-tenant web application that allows recruiters to create, customize, preview, and publish branded careers pages for their companies. Candidates can browse company stories, view culture media, and search open positions with instant filters across location and job types.

### Multi-Tenant Strategy
- **Tenant Boundary**: `Company` entity serves as the root tenant context (`companyId`).
- **Data Isolation**: Every company-owned model (`User`, `CareersPage`, `PageSection`, `Job`, `Department`, `Location`) enforces an indexed foreign key `companyId`.
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
  primaryColor   String        @default("#2563eb")
  secondaryColor String        @default("#1e293b")
  fontFamily     String        @default("Inter")
  tagline        String?
  aboutText      String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  users          User[]
  careersPages   CareersPage[]
  sections       PageSection[]
  jobs           Job[]
  departments    Department[]
  locations      Location[]

  @@index([slug])
}
```

---

## 3. Technology Stack & Framework Choices

- **Core Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & custom HSL dynamic styling
- **UI Components**: Tailwind CSS & Lucide Icons
- **Database ORM**: Prisma ORM with `@prisma/adapter-pg`
- **Authentication**: Auth.js (NextAuth.js v5) Credentials Provider
- **Validation**: Zod runtime input validation
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Password Hashing**: bcryptjs

---

## 4. Key Design & Data Isolation Assumptions

1. **Recruiter Authorization**: Recruiter users are tied strictly to a single `companyId` tenant boundary. They cannot view or modify another company's draft canvas or job listings.
2. **Draft vs Published Separation**: Page section edits save instantly in draft state (`isDraft = true`). Edits become visible to candidates only upon clicking "Save & Publish Careers Page" (`publishCareersPageAction`).
3. **Public Access Security**: Candidate routes (`/[companySlug]/careers`) resolve tenant data via `companySlug` and strictly return published sections (`isPublished = true`).

---

## 5. Test & Quality Plan

- **Automated Schema & Type Testing**: TypeScript strict mode and Prisma client generation.
- **Input Validation**: Zod schemas for login, brand theme, section payload, and job posting creation.
- **Tenant Boundary Verification**: Tested against multiple seeded companies (`acme-corp` and `technova`) ensuring cross-company data leakage is impossible.
