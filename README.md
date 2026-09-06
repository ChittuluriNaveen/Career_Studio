# Careers Page Builder 🚀

A production-quality multi-tenant Careers Page Builder application enabling recruiters to create, customize, preview, and publish branded company careers portals—and candidates to seamlessly search, filter, view details, and apply to open positions across desktop, tablet, and mobile.

---

## 🔑 Quick Demo Credentials

Try the recruiter workspace with pre-populated demo tenant accounts:

| Company | Recruiter Email | Password | Public Careers URL |
| :--- | :--- | :--- | :--- |
| **Acme Corp** | `recruiter@acme.com` | `password123` | [`/acme-corp/careers`](http://localhost:3000/acme-corp/careers) |
| **TechNova AI** | `recruiter@technova.com` | `password123` | [`/technova/careers`](http://localhost:3000/technova/careers) |

---

## ✨ What Was Built

### 1. Recruiter Experience
1. **Recruiter Authentication**: Auth.js (NextAuth v5) credentials provider with tenant JWT session enrichment and RBAC.
2. **Live Studio Design Editor**: Real-time Careers Page Studio (`/company/[companySlug]/design`) supporting element select, drag-to-resize, typography control, and instant variable interpolation (`@company_name`, `@jobs_count`, `@company_logo`, `@culture_video`).
3. **Custom Hex Background Theme & Luminance Contrast Engine**: Custom background color picker supporting any light or dark hex code (`#0f172a`, `#1e1b4b`, `#022c22`, `#f8fafc`, etc.) + 6 curated theme presets (`cyber-dark`, `corporate-clean`, `midnight-purple`, `emerald-biotech`, `minimal-luxury`, `vibrant-creative`). Features automatic relative luminance contrast detection (`0.2126*R + 0.7152*G + 0.0722*B`) to dynamically adjust text contrast, input field borders, glassmorphism cards, and hero gradients.
4. **dnd-kit Visual Section Reordering**: Drag-and-drop canvas to add, remove, and reorder content sections (Hero Banner, About Us, Life at Company, Core Values, Perks & Benefits, Open Roles Grid, Media Gallery, Culture Video).
5. **Multi-Device Responsive Preview Mode**: Instant live preview (`/[companySlug]/careers/preview`) with Desktop, Tablet, and Mobile view toggles.
6. **Save & Publish Pipeline**: Draft vs Published version control allowing recruiters to edit safely in Studio without altering the live candidate portal until clicking "Save & Publish".
7. **Recruiter Company Details Management**: Centralized company details editor (`/company/[companySlug]/details`) allowing recruiters to update company name, slug, logo, banner, location, primary brand color, background theme, and hero text with instant database synchronization.
8. **Job Postings & Candidate Application Tracking**: Create and edit job roles, configure salaries in multiple currencies (`$`, `₹`, `€`, `£`), set location & employment type, and view submitted candidate applications.

### 2. Candidate Experience
1. **Branded Public Careers Portal**: Dynamic SSR rendering matching each company's brand colors, typography, theme background, and logo.
2. **Instant Job Search & Multi-Filter Matrix**: Substring search by title/keyword, filter by department, filter by location (with city/country fallback), and filter by employment type (`Full Time`, `Part Time`, `Contract`, `Internship`).
3. **Full End-to-End Candidate Application Flow**: Dedicated Job Details page (`/[companySlug]/careers/jobs/[jobId]`) featuring job snapshot, responsibilities, requirements, benefits cards, and a complete Candidate Application Form (Full Name, Email, Resume URL, Cover Letter) with server-side database submission.
4. **Scroll-Driven Micro-Animations**: `LazySectionReveal` utilizing `IntersectionObserver` for stagger-delayed entrance animations (`scale`, `up`, `down`, `fade`) as candidates scroll down the page.
5. **Mobile-Friendly & Accessible UI**: Responsive layout, high-contrast text ratios, and keyboard focus states.
6. **SEO & Google Jobs Ready**: OpenGraph metadata and JSON-LD `JobPosting` / `Organization` structured data scripts.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js v18+ (tested on Node v22)
- PostgreSQL database (or local PostgreSQL server)

### Step-by-step Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure Environment Variables in .env
DATABASE_URL="postgresql://user@127.0.0.1:5433/whitecarrot_db?schema=public"
AUTH_SECRET="whitecarrot_super_secret_auth_key_2026_prototype"
NEXTAUTH_URL="http://localhost:3000"

# 3. Push Database Schema & Generate Prisma Client
npx prisma db push
npx prisma generate

# 4. Seed Database with Sample Multi-Tenant Data
npx prisma db seed

# 5. Start Next.js Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📈 Improvement Plan (Production Roadmap)
- **Domain Alias Routing**: Custom domain mapping (e.g. `careers.acme.com` mapping to tenant slug `acme-corp`).
- **Direct Cloud File Uploads**: Direct S3 / Cloudflare R2 integration for company logos and banner uploads.
- **Analytics & Conversion Metrics**: Candidate page view analytics and job application funnel tracking.
