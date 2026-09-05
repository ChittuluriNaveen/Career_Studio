# Careers Page Builder 🚀

A production-quality multi-tenant Careers Page Builder application enabling recruiters to create, customize, preview, and publish branded company careers portals—and candidates to seamlessly search and filter open positions across desktop and mobile.

---

## 🔑 Quick Demo Credentials

Try the recruiter workspace with pre-populated demo tenant accounts:

| Company | Recruiter Email | Password | Public Careers URL |
| :--- | :--- | :--- | :--- |
| **Acme Corp** | `recruiter@acme.com` | `password123` | [`/acme-corp/careers`](http://localhost:3000/acme-corp/careers) |
| **TechNova AI** | `recruiter@technova.com` | `password123` | [`/technova/careers`](http://localhost:3000/technova/careers) |

---

## ✨ What Was Built

### Recruiter Experience
1. **Recruiter Authentication**: Auth.js credentials provider with tenant JWT session enrichment.
2. **Brand Theme Customization**: Custom hex pickers & curated presets for Primary/Secondary colors, font family selection, company logo & banner URLs, and tagline text.
3. **dnd-kit Visual Section Editor**: Drag-and-drop canvas to add, remove, and reorder content sections (Hero Banner, About Us Story, Culture Video, Core Values, Perks & Benefits, Open Roles Grid).
4. **Live Draft Preview**: Real-time recruiter preview (`/[companySlug]/careers/preview`) to inspect changes before publishing.
5. **Save & Publish Pipeline**: Single-click publication promoting draft canvas states to public candidate view with Next.js static cache revalidation.
6. **Job Postings Management**: Create roles, assign departments & locations, and toggle live/draft status.

### Candidate Experience
1. **Branded Careers Page**: Dynamic rendering matching each company's brand colors, typography, and logo.
2. **Instant Job Search & Filters**: Search positions by title/keyword, filter by location, and filter by job type (`Full Time`, `Remote`, `Hybrid`, `Contract`).
3. **Responsive & Accessible**: Mobile responsive filter drawer, high contrast ratios, and keyboard focus states.
4. **SEO & Google Jobs Ready**: OpenGraph metadata and JSON-LD `JobPosting` / `Organization` structured data scripts.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js v18+ (tested on Node v22)
- PostgreSQL database (or user-space PostgreSQL server)

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
- **File Upload Service**: Direct S3 / Cloud Storage integration for company logos and banner uploads.
- **Analytics & Conversion Metrics**: Candidate page view analytics and job application click tracking.
