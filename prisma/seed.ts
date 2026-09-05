import { PrismaClient, JobType, EmploymentType, WorkMode, JobStatus, SectionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Naveen%40285@127.0.0.1:5433/whitecarrot_db?schema=public",
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database with realistic multi-tenant job data...");

  // Clean existing data
  await db.application.deleteMany();
  await db.job.deleteMany();
  await db.pageSection.deleteMany();
  await db.careersPage.deleteMany();
  await db.department.deleteMany();
  await db.location.deleteMany();
  await db.user.deleteMany();
  await db.company.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // ----------------------------------------------------
  // COMPANY 1: ACME CORP (Tech Enterprise)
  // ----------------------------------------------------
  const acme = await db.company.create({
    data: {
      name: "Acme Corp",
      slug: "acme-corp",
      website: "https://acme.com",
      industry: "Enterprise Cloud Automation",
      companySize: "250-500 employees",
      location: "San Francisco, CA",
      description: "Acme Corp empowers thousands of global businesses to automate complex enterprise workflows.",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      primaryColor: "#2563eb", // Royal Blue
      secondaryColor: "cyber-dark", // Dark Theme Key
      fontFamily: "Inter",
      tagline: "Building the future of enterprise cloud automation.",
      aboutText: "Acme Corp empowers thousands of global businesses to automate complex workflows with speed, security, and elegance.",
    },
  });

  await db.user.create({
    data: {
      email: "recruiter@acme.com",
      name: "Sarah Jenkins",
      passwordHash,
      role: "RECRUITER",
      companyId: acme.id,
    },
  });

  const acmePage = await db.careersPage.create({
    data: {
      companyId: acme.id,
      metaTitle: "Careers at Acme Corp | Join Our World-Class Team",
      metaDescription: "Explore open engineering, product, and growth roles at Acme Corp. Help us build next-generation enterprise software.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Page sections
  await db.pageSection.createMany({
    data: [
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.HERO,
        title: "Hero Centered",
        content: {
          templateId: "hero-centered",
          layout: { container: "narrow", alignment: "center", paddingY: "lg" },
          elements: [
            { id: "h-badge-1", type: "badge", position: 0, enabled: true, alignment: "center", content: { text: "We Are Hiring at @company_name · @active_jobs_count Open Roles" } },
            { id: "h-head-1", type: "heading", position: 1, enabled: true, alignment: "center", content: { text: "Build the Future of @company_industry with @company_name", level: 1 } },
            { id: "h-text-1", type: "text", position: 2, enabled: true, alignment: "center", content: { text: "Join @company_name in @company_location to build scalable systems. @company_tagline" } },
            { id: "h-btn-1", type: "button", position: 3, enabled: true, alignment: "center", content: { label: "Explore Open Opportunities", linkUrl: "#open-positions" } },
          ],
        },
        orderIndex: 0,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.OPEN_ROLES,
        title: "Open Requisitions",
        content: {
          templateId: "jobs-grid-cards",
          layout: { container: "wide", alignment: "left", paddingY: "md" },
          elements: [
            { id: "j-head-1", type: "heading", position: 0, enabled: true, alignment: "left", content: { text: "Open Careers at @company_name", level: 2 } },
            { id: "j-text-1", type: "text", position: 1, enabled: true, alignment: "left", content: { text: "Explore @active_jobs_count positions currently open across Engineering, Product, and Sales." } },
          ],
        },
        orderIndex: 1,
        isDraft: false,
        isPublished: true,
      },
    ],
  });

  // Jobs for Acme Corp
  const job1 = await db.job.create({
    data: {
      title: "Senior Full Stack Engineer (Next.js & Node.js)",
      slug: "senior-full-stack-engineer",
      departmentName: "Engineering",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      locationCity: "San Francisco",
      locationCountry: "United States",
      salaryMin: 140000,
      salaryMax: 180000,
      currency: "USD",
      salaryVisible: true,
      summary: "Lead front-end architecture and backend microservices using Next.js, React, TypeScript, and Node.js for cloud automation.",
      responsibilities: [
        "Architect and implement high-performance web applications using Next.js App Router & TypeScript.",
        "Collaborate with Product and Design teams to build intuitive, accessible component systems.",
        "Optimize distributed GraphQL and REST endpoints for sub-100ms response latency.",
        "Conduct rigorous code reviews and mentor junior engineering team members.",
      ],
      requirements: [
        "5+ years of software engineering experience in production JavaScript/TypeScript environments.",
        "Deep expertise with React, Next.js, and server-side rendering architecture.",
        "Hands-on experience with PostgreSQL, Prisma ORM, and Redis caching.",
        "Strong understanding of web performance optimization and accessibility standards.",
      ],
      preferredSkills: ["Docker & Kubernetes containerization", "AWS Cloud infrastructure", "Tailwind CSS & Radix UI"],
      benefits: [
        "100% remote flexibility with home office stipend",
        "Top-tier health, dental, and vision insurance for candidate and family",
        "$3,000 annual learning and development budget",
        "Unlimited PTO with mandatory 25 days minimum vacation",
      ],
      datePosted: new Date(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days in future
      status: JobStatus.ACTIVE,
      isPublished: true,
      companyId: acme.id,
    },
  });

  await db.job.create({
    data: {
      title: "Principal Cloud Systems Architect",
      slug: "principal-cloud-systems-architect",
      departmentName: "Infrastructure",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      locationCity: "New York",
      locationCountry: "United States",
      salaryMin: 180000,
      salaryMax: 230000,
      currency: "USD",
      salaryVisible: true,
      summary: "Architect high-availability Kubernetes clusters and Terraform infrastructure supporting millions of concurrent RPC requests.",
      responsibilities: [
        "Design cloud-native architecture across multi-region AWS and GCP deployments.",
        "Manage CI/CD pipelines, automated testing suites, and blue-green zero-downtime deployment workflows.",
        "Ensure enterprise SOC-2 compliance, zero-trust network boundaries, and automated threat mitigation.",
      ],
      requirements: [
        "7+ years of DevOps / Site Reliability Engineering experience at enterprise scale.",
        "Expert knowledge of Terraform, Kubernetes, Helm, and Istio service mesh.",
        "Proven track record managing multi-cloud infra handling >99.99% uptime SLAs.",
      ],
      preferredSkills: ["Go & Rust scripting", "eBPF monitoring & Datadog APM", "Vault secret management"],
      benefits: [
        "Competitive equity packages",
        "Full medical coverage",
        "Annual international team retreats",
      ],
      datePosted: new Date(),
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
      isPublished: true,
      companyId: acme.id,
    },
  });

  await db.job.create({
    data: {
      title: "Lead Product Designer (UI/UX Systems)",
      slug: "lead-product-designer",
      departmentName: "Product & Design",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      locationCity: "London",
      locationCountry: "United Kingdom",
      salaryMin: 90000,
      salaryMax: 120000,
      currency: "GBP",
      salaryVisible: false, // Salary hidden test case
      summary: "Define the visual design language, interaction design systems, and Figma component libraries for developer portals.",
      responsibilities: [
        "Design pixel-perfect user interfaces, user flows, and wireframes for complex cloud workflows.",
        "Conduct candidate and customer usability interviews to iterate on product usability.",
        "Maintain comprehensive Figma design tokens synced with frontend Tailwind themes.",
      ],
      requirements: [
        "4+ years designing B2B SaaS desktop software interfaces.",
        "Strong portfolio showcasing system design thinking and responsive web design.",
        "Expert proficiency in Figma, prototyping tools, and user research methodologies.",
      ],
      preferredSkills: ["HTML/CSS understanding", "Micro-animation design with Framer"],
      benefits: ["Flex hybrid schedule", "Pension match scheme", "Wellness allowance"],
      datePosted: new Date(),
      status: JobStatus.ACTIVE,
      isPublished: true,
      companyId: acme.id,
    },
  });

  // Draft Job test case
  await db.job.create({
    data: {
      title: "Director of Enterprise Sales (Draft Requisition)",
      slug: "director-of-enterprise-sales",
      departmentName: "Sales & Business Development",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.ON_SITE,
      locationCity: "San Francisco",
      locationCountry: "United States",
      salaryMin: 200000,
      salaryMax: 280000,
      currency: "USD",
      salaryVisible: true,
      summary: "Lead Fortune 500 account executive strategy and expand ARR across North America.",
      responsibilities: ["Build enterprise sales playbook."],
      requirements: ["10+ years B2B enterprise SaaS sales track record."],
      preferredSkills: ["Salesforce CRM"],
      benefits: ["Commission bonus structure"],
      status: JobStatus.DRAFT,
      isPublished: false,
      companyId: acme.id,
    },
  });

  // Seed sample candidate application
  await db.application.create({
    data: {
      jobId: job1.id,
      companyId: acme.id,
      candidateName: "Alex Rivera",
      candidateEmail: "alex.rivera@example.com",
      resumeUrl: "https://example.com/resumes/alex-rivera.pdf",
      coverLetter: "I am thrilled to apply for the Senior Full Stack Engineer role at Acme Corp. With 6 years building Next.js apps, I am confident in adding immediate value to your engineering team.",
      status: "PENDING",
    },
  });

  // ----------------------------------------------------
  // COMPANY 2: TECHNOVA AI (AI Healthcare Startup)
  // ----------------------------------------------------
  const technova = await db.company.create({
    data: {
      name: "TechNova AI",
      slug: "technova",
      website: "https://technova.ai",
      industry: "Generative AI & Precision Healthcare",
      companySize: "100-250 employees",
      location: "Boston, MA (Remote Available)",
      description: "TechNova combines modern deep learning foundation models with biomedical datasets to accelerate drug discovery.",
      logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7edc?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
      primaryColor: "#059669", // Emerald
      secondaryColor: "emerald-biotech",
      fontFamily: "Outfit",
      tagline: "Pioneering Generative AI for Precision Healthcare",
      aboutText: "TechNova combines modern deep learning foundation models with biomedical data to accelerate life-saving drug discovery.",
    },
  });

  await db.user.create({
    data: {
      email: "recruiter@technova.com",
      name: "David Kim",
      passwordHash,
      role: "RECRUITER",
      companyId: technova.id,
    },
  });

  const novaPage = await db.careersPage.create({
    data: {
      companyId: technova.id,
      metaTitle: "Careers at TechNova AI | Build the Future of AI Healthcare",
      metaDescription: "Join TechNova AI research labs. We are hiring machine learning researchers, bioinformaticians, and full-stack software engineers.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await db.pageSection.createMany({
    data: [
      {
        careersPageId: novaPage.id,
        companyId: technova.id,
        type: SectionType.HERO,
        title: "Hero Centered",
        content: {
          templateId: "hero-centered",
          layout: { container: "narrow", alignment: "center", paddingY: "lg" },
          elements: [
            { id: "tn-badge-1", type: "badge", position: 0, enabled: true, alignment: "center", content: { text: "Careers at @company_name · @active_jobs_count Open Roles" } },
            { id: "tn-head-1", type: "heading", position: 1, enabled: true, alignment: "center", content: { text: "Advance @company_industry at @company_name", level: 1 } },
            { id: "tn-text-1", type: "text", position: 2, enabled: true, alignment: "center", content: { text: "Based in @company_location. @company_tagline" } },
            { id: "tn-btn-1", type: "button", position: 3, enabled: true, alignment: "center", content: { label: "View Open Research & Engineering Positions", linkUrl: "#open-positions" } },
          ],
        },
        orderIndex: 0,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: novaPage.id,
        companyId: technova.id,
        type: SectionType.OPEN_ROLES,
        title: "Open Positions",
        content: {
          templateId: "jobs-grid-cards",
          layout: { container: "wide", alignment: "left", paddingY: "md" },
          elements: [
            { id: "tn-j-head", type: "heading", position: 0, enabled: true, alignment: "left", content: { text: "Open Careers at @company_name", level: 2 } },
            { id: "tn-j-text", type: "text", position: 1, enabled: true, alignment: "left", content: { text: "Explore our @active_jobs_count open positions in AI Research, BioInformatics, and Software Engineering." } },
          ],
        },
        orderIndex: 1,
        isDraft: false,
        isPublished: true,
      },
    ],
  });

  await db.job.create({
    data: {
      title: "Senior AI / ML Research Scientist (Genomics)",
      slug: "senior-ml-research-scientist",
      departmentName: "AI Research Labs",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      locationCity: "Boston",
      locationCountry: "United States",
      salaryMin: 160000,
      salaryMax: 220000,
      currency: "USD",
      salaryVisible: true,
      summary: "Research and deploy transformer-based foundation models trained on high-throughput genomic and proteomic datasets.",
      responsibilities: [
        "Train large language and diffusion models on multi-terabyte genomic sequencing data.",
        "Publish high-impact research papers at NeurIPS, ICML, and Nature Biotechnology.",
        "Bridge experimental biology with algorithmic deep learning architectures.",
      ],
      requirements: [
        "Ph.D. in Computer Science, Machine Learning, Computational Biology, or related quantitative field.",
        "Proven publication record in top-tier AI Conferences.",
        "Expertise in PyTorch, Distributed Data Parallel (DDP), and GPU cluster optimization.",
      ],
      preferredSkills: ["BioNeMo framework", "AlphaFold 2/3 molecular modeling", "CUDA kernel programming"],
      benefits: [
        "Competitive startup equity with high growth trajectory",
        "Full health and dental coverage",
        "Generous conference travel stipends",
      ],
      datePosted: new Date(),
      status: JobStatus.ACTIVE,
      isPublished: true,
      companyId: technova.id,
    },
  });

  await db.job.create({
    data: {
      title: "Backend Infrastructure Engineer (PyTorch & Rust)",
      slug: "backend-infrastructure-engineer",
      departmentName: "Software Engineering",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      locationCity: "Remote",
      locationCountry: "Worldwide",
      salaryMin: 130000,
      salaryMax: 170000,
      currency: "USD",
      salaryVisible: true,
      summary: "Scale model training pipelines across multi-node GPU clusters, optimizing distributed memory layout and data ingestion.",
      responsibilities: [
        "Build streaming data loaders handling terabytes of genomic variant files.",
        "Develop high-speed Rust bindings for PyTorch tensor manipulation.",
      ],
      requirements: [
        "3+ years experience with Rust or C++ in production backend infrastructure.",
        "Familiarity with Linux kernel I/O and GPU IPC.",
      ],
      preferredSkills: ["Apache Arrow", "Parquet file format", "Ray distributed execution"],
      benefits: ["Remote work flexibility", "Wellness reimbursement", "Learning budget"],
      datePosted: new Date(),
      status: JobStatus.ACTIVE,
      isPublished: true,
      companyId: technova.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("🔑 Recruiter Credentials:");
  console.log("   - Company 1: recruiter@acme.com / password123 (Slug: acme-corp)");
  console.log("   - Company 2: recruiter@technova.com / password123 (Slug: technova)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
