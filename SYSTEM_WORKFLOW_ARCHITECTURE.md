# 📐 WhiteCarrot Career Studio - System Architecture & Workflow Guide

> **Target Audience**: Both **Non-Technical Evaluators** (looking for clean, plain-English explanations) and **Technical Interviewers** (looking for exact function names, data flows, and architecture logic).

---

## 📑 Table of Contents

1. [High-Level Ecosystem Architecture](#1-high-level-ecosystem-architecture)
2. [Recruiter Authentication & Security Workflow](#2-recruiter-authentication--security-workflow)
3. [Recruiter Studio & Drag-and-Drop State Workflow](#3-recruiter-studio--drag-and-drop-state-workflow)
4. [Mathematical Relative Luminance Theme Engine](#4-mathematical-relative-luminance-theme-engine)
5. [Target Device Simulation & Responsive Style Pipeline](#5-target-device-simulation--responsive-style-pipeline)
6. [Target Device Responsive Comparison Table (Concrete Example)](#6-target-device-responsive-comparison-table-concrete-example)
7. [Draft vs. Published State Isolation & Live Preview Binding](#7-draft-vs-published-state-isolation--live-preview-binding)
8. [Drag-and-Drop Inner Mechanics & Coordinate Vectors](#8-drag-and-drop-inner-mechanics--coordinate-vectors)
9. [Studio Canvas Preview Navigation Isolation](#9-studio-canvas-preview-navigation-isolation)
10. [Candidate Job Marketplace & Filter Workflow](#10-candidate-job-marketplace--filter-workflow)
11. [Candidate Application Submission Pipeline](#11-candidate-application-submission-pipeline)
12. [SEO & Google Jobs JSON-LD Schema Architecture](#12-seo--google-jobs-json-ld-schema-architecture)

---

## 1. High-Level Ecosystem Architecture

The application is split into **two distinct environments** connected to a single multi-tenant **PostgreSQL database**:

```mermaid
flowchart TD
    subgraph Recruiter_Environment["🔑 RECRUITER ENVIRONMENT (Authenticated)"]
        A["Recruiter Login (/login)"] --> B["Studio Editor (/company/acme-corp/design)"]
        B --> C["Drag & Drop Reordering"]
        B --> D["Brand Theme Engine"]
        B --> E["Responsive Viewports (Desktop/Tablet/Mobile)"]
        B --> F["SEO Panel"]
    end

    subgraph State_Management["⚙️ DRAFT STATE ENGINE"]
        G["In-Memory Client State (React useState)"]
        H["Server Actions (lib/actions/*)"]
        I["PostgreSQL Database (Prisma ORM)"]
        G <--> H
        H <--> I
    end

    subgraph Candidate_Environment["🌐 CANDIDATE ENVIRONMENT (Public & Fast)"]
        J["Company Story Page (/acme-corp/careers)"]
        K["Job Marketplace (/acme-corp/careers/jobs)"]
        L["Job Details & Application (/jobs/job-id)"]
    end

    Recruiter_Environment --> State_Management
    State_Management -- "Save & Publish (revalidatePath)" --> Candidate_Environment
```

### 💡 Non-Technical Summary
Think of the system like a **newspaper publishing studio**:
- **The Recruiter Studio** is the private workspace behind closed doors where recruiters draft articles, reorder layout blocks, pick colors, and preview how it looks on mobile phones.
- **The Draft Engine** acts as the workbench holding scratch work safely without printing it to the public.
- **The Candidate Portal** is the printed newspaper delivered to readers (candidates). It only shows articles that have been officially approved and published!

---

## 2. Recruiter Authentication & Security Workflow

How a recruiter logs into the system securely and how multi-tenant data isolation is enforced.

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    participant Page as app/(auth)/login/page.tsx
    participant AuthAction as lib/actions/auth.ts (loginAction)
    participant AuthJS as lib/auth.ts (NextAuth Credentials)
    participant Guard as lib/auth-guard.ts (requireRecruiter)
    participant DB as PostgreSQL (User & Company)

    R->>Page: Enters Email & Password
    Page->>AuthAction: Submits form data
    AuthAction->>AuthJS: Invokes signIn("credentials")
    AuthJS->>DB: prisma.user.findUnique({ where: { email } })
    DB-->>AuthJS: Returns user record with hashed password & companyId
    AuthJS->>AuthJS: Compares password with bcrypt.compare()
    AuthJS-->>R: Issues Encrypted JWT Cookie (contains user.id, companyId, companySlug)
    
    Note over R, Guard: Subsequent Recruiter API Requests
    R->>Guard: Calls Server Action (e.g., updateSectionAction)
    Guard->>Guard: Decrypts JWT & extracts session.user.companyId
    alt Valid Recruiter Session
        Guard-->>DB: Executes query strictly scoped by companyId
    else Invalid / Unauthenticated
        Guard-->>R: Throws "Unauthorized" Error & redirects to /login
    end
```

---

## 3. Recruiter Studio & Drag-and-Drop State Workflow

How recruiters drag and reorder sections, edit text, and track Undo/Redo history.

```mermaid
flowchart TD
    subgraph User_Action["🖱️ Recruiter Interaction"]
        A1["Drag section card up/down"] --> B1["@dnd-kit trigger onDragEnd"]
        A2["Type text or change color"] --> B2["Input onChange event"]
        A3["Click Undo (Ctrl+Z)"] --> B3["Pop snapshot from history stack"]
    end

    subgraph Client_State["🧠 React Client State (CareerStudioClient.tsx)"]
        B1 --> C1["arrayMove(sections, oldIndex, newIndex)"]
        B2 --> C2["Immutable section update in sections array"]
        B3 --> C3["Restore previous sections[] array"]
        
        C1 --> D["Push new snapshot to history[] stack"]
        C2 --> D
        C3 --> E["Re-render Canvas Preview (60 FPS)"]
        D --> E
    end

    subgraph Database_Sync["💾 Async Database Persistence"]
        E --> F["Trigger Server Action: reorderSectionsAction(sectionIds)"]
        F --> G["Prisma updateMany orderIndex in PostgreSQL"]
    end
```

---

## 4. Mathematical Relative Luminance Theme Engine

How the system guarantees typography readability across **any custom hex background color**.

```mermaid
flowchart LR
    A["Recruiter selects Hex Color (e.g. #06b6d4)"] --> B["parseHexColor(hex) in lib/themes/registry.ts"]
    B --> C["Extract RGB Components: R=6, G=182, B=212"]
    C --> D["Calculate ITU-R Luminance: Y = 0.2126*R + 0.7152*G + 0.0722*B"]
    
    D --> E{"Is Y < 140?"}
    
    E -- "YES (Dark Background)" --> F["Apply Dark Theme Engine"]
    F --> F1["Text Color: #f8fafc (White)"]
    F --> F2["Subtext: #94a3b8 (Light Slate)"]
    F --> F3["Card Bg: rgba(R+15, G+15, B+25, 0.85) Frosted Glass"]
    
    E -- "NO (Light Background)" --> G["Apply Light Theme Engine"]
    G --> G1["Text Color: #0f172a (Dark Slate)"]
    G --> G2["Subtext: #475569 (Muted Dark)"]
    G --> G3["Card Bg: #ffffff (Pure White Card)"]
```

---

## 5. Target Device Simulation & Responsive Style Pipeline

How responsive layouts adapt when switching between **Desktop 🖥️**, **Tablet 📱**, and **Mobile 📲** viewports.

```mermaid
flowchart TD
    A["Element JSON + Active deviceMode ('desktop' | 'tablet' | 'mobile')"] --> B["getElementStyles(element, deviceMode)"]
    
    B --> C["1. getTemplateDefaults(type) -> Get baseline element CSS"]
    C --> D["2. mergeStyles(defaults, element.styles) -> Merge user desktop styles"]
    
    D --> E["3. getResponsiveStyles(styles, deviceMode)"]
    
    subgraph Responsive_Merging["📱 Responsive Device Merging Engine"]
        E --> F{"deviceMode?"}
        F -- "desktop" --> G["Use Base Desktop Styles"]
        F -- "tablet" --> H["Merge Base + responsive.tablet overrides"]
        F -- "mobile" --> I["Merge Base + responsive.tablet + responsive.mobile overrides"]
        
        I --> J{"Explicit mobile font size set?"}
        J -- "NO & text >= 24px" --> K["Auto-Scale Font Size = fontSize * 0.65x"]
        J -- "YES" --> L["Keep explicit mobile font size"]
        
        I --> M{"Layout flex-direction == 'row'?"}
        M -- "YES" --> N["Convert to flex-direction: 'column' (Vertical Stack)"]
    end
    
    G --> O["convertStylesToCSS() -> Converts to React CSSProperties"]
    K --> O
    L --> O
    N --> O
    O --> P["Mount to DOM node: style={computedStyles}"]
```

---

## 6. Target Device Responsive Comparison Table (Concrete Example)

Below is a concrete comparison showing how a single **Hero Title Element** (`"Build Your Dream Career"`) behaves across Desktop, Tablet, and Mobile viewports:

| Property / Viewport | 🖥️ Desktop Mode (1440px) | 📱 Tablet Mode (768px) | 📲 Mobile Mode (375px) |
| :--- | :--- | :--- | :--- |
| **Canvas Frame Width** | 100% (Full Viewport) | 768px Container | 375px Mobile Frame |
| **Base Font Size** | `48px` | `38px` (Tablet Override) | `24px` (Mobile Override) |
| **Auto-Scaling Engine** | Base Value | Explicit Override | If no override: `48px * 0.65x = 31px` |
| **Layout Direction** | `flex-direction: row` | `flex-direction: row` | `flex-direction: column` (Auto Stack) |
| **Container Padding** | `64px 32px` | `48px 24px` | `24px 16px` (Padding Halved) |
| **Max Container Width** | `1200px` | `720px` | `100%` (Enforced Mobile Width) |
| **Generated Inline CSS** | `{ fontSize: "48px", paddingTop: "64px", flexDirection: "row" }` | `{ fontSize: "38px", paddingTop: "48px", flexDirection: "row" }` | `{ fontSize: "24px", paddingTop: "24px", flexDirection: "column" }` |

### 💾 Database JSON Representation in PostgreSQL (`PageSection.content`):
```json
{
  "id": "hero_heading_title",
  "type": "heading",
  "content": { "text": "Build Your Dream Career at @company_name" },
  "styles": {
    "typography": { "fontSize": "48px", "fontWeight": "800", "lineHeight": "1.2" },
    "spacing": { "paddingTop": "64px", "paddingBottom": "32px" },
    "layout": { "flexDirection": "row", "maxWidth": "1200px" },
    "responsive": {
      "tablet": {
        "typography": { "fontSize": "38px" },
        "spacing": { "paddingTop": "48px" }
      },
      "mobile": {
        "typography": { "fontSize": "24px" },
        "spacing": { "paddingTop": "24px" },
        "layout": { "flexDirection": "column", "maxWidth": "100%" }
      }
    }
  }
}
```

---

## 7. Draft vs. Published State Isolation & Live Preview Binding

### Why Unsaved Edits Appear Automatically in Studio Preview BUT NOT on Published URL:
1. **Studio Canvas Preview**: Renders the recruiter's active in-memory React state array (`sections[]`) directly at 60 FPS as they type or pick colors.
2. **Draft Persistence**: Edits save to PostgreSQL with `isDraft = true` and `isPublished = false`.
3. **Candidate Page Filtering**: Public candidate routes execute `prisma.pageSection.findMany({ where: { isPublished: true } })`. SQL filters out draft edits until the recruiter clicks "Save & Publish".

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    actor C as Candidate
    participant Studio as Recruiter Studio (CareerStudioClient.tsx)
    participant Action as lib/actions/sections.ts & publish.ts
    participant DB as PostgreSQL Database
    participant NextCache as Next.js Server Cache (revalidatePath)
    participant CandidatePage as app/(public)/[companySlug]/careers/page.tsx

    Note over R, DB: Phase 1: Draft Edits (Invisible to Candidates)
    R->>Studio: Edits text / reorders sections
    Studio->>Action: Calls updateSectionAction()
    Action->>DB: Updates record with isDraft = true, isPublished = false
    
    C->>CandidatePage: Visits public careers page (/acme-corp/careers)
    CandidatePage->>DB: prisma.pageSection.findMany({ where: { isPublished: true } })
    DB-->>CandidatePage: Returns OLD published data
    CandidatePage-->>C: Sees clean live site (Unaware of draft edits)

    Note over R, NextCache: Phase 2: Save & Publish Event
    R->>Studio: Clicks "Save & Publish"
    Studio->>Action: Calls publishPageAction()
    Action->>DB: Transaction: sets isPublished = true & isDraft = true for active sections
    Action->>NextCache: Calls revalidatePath("/[companySlug]/careers")
    NextCache-->>NextCache: Purges old server HTML cache

    Note over C, CandidatePage: Phase 3: Immediate Live Update
    C->>CandidatePage: Refreshes public careers page
    CandidatePage->>DB: Fetches newly published sections
    CandidatePage-->>C: Sees updated live site instantly!
```

---

## 8. Drag-and-Drop Inner Mechanics & Coordinate Vectors

How drag-and-drop works step-by-step under the hood:

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    participant DND as @dnd-kit DndContext & SortableContext
    participant ClientState as CareerStudioClient.tsx (sections[])
    participant Canvas as Preview Canvas (CareersPageRenderer.tsx)
    participant Action as lib/actions/sections.ts (reorderSectionsAction)
    participant DB as PostgreSQL (PageSection table)

    R->>DND: Grabs drag handle & moves mouse down 150px
    DND->>DND: Computes delta vector (deltaY = +150px) & transforms item card UI visually
    R->>DND: Releases mouse button (pointerup event)
    DND->>ClientState: Triggers onDragEnd({ active, over }) -> finds oldIndex & newIndex
    ClientState->>ClientState: Calls arrayMove(sections, oldIndex, newIndex)
    Note over ClientState: Memory Swap: sections.splice(newIndex, 0, sections.splice(oldIndex, 1)[0])
    ClientState->>Canvas: Re-renders React components in new order instantly (60 FPS)
    ClientState->>Action: Debounced trigger reorderSectionsAction([id1, id2, id3])
    Action->>DB: Bulk UPDATE "PageSection" SET "orderIndex" = CASE id ...
    DB-->>Action: Returns updated records count
```

---

## 9. Studio Canvas Preview Navigation Isolation

How link clicks inside the studio canvas frame update the preview view without navigating away from the recruiter studio session.

```mermaid
flowchart TD
    A["Recruiter clicks 'Explore Open Roles' or Job Card inside Preview Canvas"] --> B["ElementRenderer.tsx handleElementClick(e)"]
    
    subgraph Event_Interception["1. DOM Event Interception"]
        B --> C{"Is isPreviewMode == true?"}
        C -- "YES (Inside Recruiter Studio)" --> D1["e.preventDefault() -> Stop standard browser link navigation"]
        D1 --> D2["e.stopPropagation() -> Stop event bubbling to parent wrappers"]
    end

    subgraph State_Navigation["2. Virtual Canvas Navigation"]
        D2 --> E["Invoke callback prop: onNavigatePage('jobs', jobId)"]
        E --> F["CareerStudioClient.tsx updates state: activePage = 'jobs'"]
        F --> G["Center Canvas re-renders Job Feed view inside preview container"]
    end

    subgraph Session_Persistence["3. Editor Session Protection"]
        G --> P1["Main Browser URL remains /company/acme-corp/design"]
        P1 --> P2["Recruiter editor session & state stay 100% persistent!"]
    end
    
    C -- "NO (On Published Candidate Site)" --> H["Standard Next.js Router navigation: router.push('/acme-corp/careers/jobs')"]
```

---

## 10. Candidate Job Marketplace & Filter Workflow

```mermaid
flowchart TD
    A["Candidate visits /acme-corp/careers/jobs"] --> B["app/(public)/[companySlug]/careers/jobs/page.tsx (Server Component)"]
    B --> C["Fetch active jobs: prisma.job.findMany({ where: { companyId, status: 'ACTIVE' } })"]
    C --> D["Pass jobs array to PublicJobsFeedClient.tsx (Client Component)"]
    
    subgraph Client_Filter_Engine["⚡ Instant Client-Side Filter Engine"]
        D --> E["Candidate types search query (e.g. 'Senior')"]
        D --> F["Candidate selects Department filter (e.g. 'Engineering')"]
        D --> G["Candidate selects Work Mode filter (e.g. 'Remote')"]
        D --> H["Candidate selects Employment Type filter (e.g. 'Full-Time')"]
        
        E --> I["Filter Function: match search text against title, description, summary"]
        F --> I
        G --> I
        H --> I
        
        I --> J["Render filtered JobCard.tsx list instantly in real time!"]
    end
```

---

## 11. Candidate Application Submission Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidate
    participant Form as Application Form Component
    participant AppAction as lib/actions/applications.ts (submitApplicationAction)
    participant Zod as Zod Schema Validator
    participant DB as PostgreSQL (Application Table)

    C->>Form: Fills Name, Email, Resume URL, Cover Letter
    C->>Form: Clicks "Submit Application"
    Form->>AppAction: Submits form data payload
    AppAction->>Zod: Validates fields with applicationSchema
    
    alt Schema Validation Fails
        Zod-->>Form: Returns field error messages
        Form-->>C: Displays inline validation errors
    else Schema Validation Passes
        AppAction->>DB: prisma.application.create({ data: { jobId, companyId, candidateName, candidateEmail, resumeUrl } })
        DB-->>AppAction: Returns created application record
        AppAction-->>Form: Returns { success: true }
        Form-->>C: Displays success confirmation modal!
    end
```

---

## 12. SEO & Google Jobs JSON-LD Schema Architecture

```mermaid
flowchart TD
    A["Candidate or Search Bot visits /acme-corp/careers/jobs/job-123"] --> B["Server Component fetches Job and Company records"]
    B --> C["Render Job Details UI"]
    B --> D["Mount StructuredData React Component (job, company)"]
    
    D --> E["Construct JSON-LD Payload"]
    
    subgraph JSON_LD_Schema["JSON-LD Schema Payload"]
        E --> F1["@context: https://schema.org"]
        E --> F2["@type: JobPosting"]
        E --> F3["title: job.title"]
        E --> F4["description: job.description"]
        E --> F5["datePosted: job.createdAt"]
        E --> F6["employmentType: job.employmentType"]
        E --> F7["hiringOrganization: Organization name"]
        E --> F8["jobLocation: Place address"]
        E --> F9["baseSalary: Currency and Salary Range"]
    end
    
    F1 --> G["Output JSON-LD script tag in HTML head"]
    G --> H["Google Jobs Bot parses JSON-LD and displays role in Google Search Results!"]
```

