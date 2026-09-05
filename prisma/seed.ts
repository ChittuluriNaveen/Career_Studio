import { PrismaClient, JobType, SectionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Naveen%40285@127.0.0.1:5433/whitecarrot_db?schema=public",
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database with dynamic company variables...");

  // Clean existing data
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
      secondaryColor: "#0f172a", // Dark Slate
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

  const acmeDepts = await Promise.all([
    db.department.create({ data: { name: "Engineering", companyId: acme.id } }),
    db.department.create({ data: { name: "Product & Design", companyId: acme.id } }),
    db.department.create({ data: { name: "Marketing & Growth", companyId: acme.id } }),
    db.department.create({ data: { name: "Sales & CX", companyId: acme.id } }),
  ]);

  const acmeLocs = await Promise.all([
    db.location.create({ data: { name: "San Francisco, CA", isRemote: false, companyId: acme.id } }),
    db.location.create({ data: { name: "New York, NY", isRemote: false, companyId: acme.id } }),
    db.location.create({ data: { name: "Remote - US", isRemote: true, companyId: acme.id } }),
    db.location.create({ data: { name: "London, UK", isRemote: false, companyId: acme.id } }),
  ]);

  const acmePage = await db.careersPage.create({
    data: {
      companyId: acme.id,
      metaTitle: "Careers at Acme Corp | Join Our World-Class Team",
      metaDescription: "Explore open engineering, product, and growth roles at Acme Corp. Help us build next-generation enterprise software.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Sections for Acme Corp with @company_ variables
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
            { id: "h-text-1", type: "text", position: 2, enabled: true, alignment: "center", content: { text: "Join @company_name in @company_location to build scalable, mission-critical systems. @company_tagline" } },
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
        type: SectionType.ABOUT_US,
        title: "About Us",
        content: {
          templateId: "about-centered",
          layout: { container: "narrow", alignment: "center", paddingY: "md" },
          elements: [
            { id: "ab-head-1", type: "heading", position: 0, enabled: true, alignment: "center", content: { text: "About @company_name", level: 2 } },
            { id: "ab-text-1", type: "text", position: 1, enabled: true, alignment: "center", content: { text: "@company_description" } },
          ],
        },
        orderIndex: 1,
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
        orderIndex: 2,
        isDraft: false,
        isPublished: true,
      },
    ],
  });

  await db.job.createMany({
    data: [
      {
        title: "Senior Full Stack Engineer (Next.js & Node.js)",
        slug: "senior-full-stack-engineer",
        description: "Lead front-end architecture and backend microservices using Next.js, React, TypeScript, and Node.js.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[0].id,
        locationId: acmeLocs[2].id,
      },
      {
        title: "Principal Cloud Systems Architect",
        slug: "principal-cloud-systems-architect",
        description: "Architect high-availability Kubernetes clusters and Terraform infrastructure.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[0].id,
        locationId: acmeLocs[0].id,
      },
      {
        title: "Lead Product Designer (UI/UX Systems)",
        slug: "lead-product-designer",
        description: "Define the visual design language and component system for developer portal.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[1].id,
        locationId: acmeLocs[1].id,
      },
    ],
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
      cultureVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      primaryColor: "#059669", // Emerald Green
      secondaryColor: "#064e3b",
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

  const novaDepts = await Promise.all([
    db.department.create({ data: { name: "AI Research Labs", companyId: technova.id } }),
    db.department.create({ data: { name: "BioInformatics", companyId: technova.id } }),
    db.department.create({ data: { name: "Software Infrastructure", companyId: technova.id } }),
  ]);

  const novaLocs = await Promise.all([
    db.location.create({ data: { name: "Boston, MA", isRemote: false, companyId: technova.id } }),
    db.location.create({ data: { name: "Remote - Worldwide", isRemote: true, companyId: technova.id } }),
  ]);

  const novaPage = await db.careersPage.create({
    data: {
      companyId: technova.id,
      metaTitle: "Careers at TechNova AI | Build the Future of AI Healthcare",
      metaDescription: "Join TechNova AI research labs. We are hiring machine learning researchers, bioinformaticians, and full-stack software engineers.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Sections for TechNova AI with dynamic @company_ variables!
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
            { id: "tn-text-1", type: "text", position: 2, enabled: true, alignment: "center", content: { text: "Based in @company_location. @company_tagline. @company_description" } },
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
        type: SectionType.ABOUT_US,
        title: "About Us",
        content: {
          templateId: "about-centered",
          layout: { container: "narrow", alignment: "center", paddingY: "md" },
          elements: [
            { id: "tn-ab-head", type: "heading", position: 0, enabled: true, alignment: "center", content: { text: "About @company_name", level: 2 } },
            { id: "tn-ab-text", type: "text", position: 1, enabled: true, alignment: "center", content: { text: "@company_description Headquartered in @company_location with @company_size." } },
          ],
        },
        orderIndex: 1,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: novaPage.id,
        companyId: technova.id,
        type: SectionType.OPEN_ROLES,
        title: "Open Opportunities",
        content: {
          templateId: "jobs-grid-cards",
          layout: { container: "wide", alignment: "left", paddingY: "md" },
          elements: [
            { id: "tn-j-head", type: "heading", position: 0, enabled: true, alignment: "left", content: { text: "Open Careers at @company_name", level: 2 } },
            { id: "tn-j-text", type: "text", position: 1, enabled: true, alignment: "left", content: { text: "Explore our @active_jobs_count open positions in AI Research, BioInformatics, and Software Engineering." } },
          ],
        },
        orderIndex: 2,
        isDraft: false,
        isPublished: true,
      },
    ],
  });

  await db.job.createMany({
    data: [
      {
        title: "Senior AI / ML Research Scientist (Genomics)",
        slug: "senior-ml-research-scientist",
        description: "Research and deploy transformer-based foundation models trained on high-throughput genomic datasets.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: technova.id,
        departmentId: novaDepts[0].id,
        locationId: novaLocs[0].id,
      },
      {
        title: "Lead Computational Biologist",
        slug: "lead-computational-biologist",
        description: "Develop algorithmic pipelines for structural biology analysis and molecular dynamics simulations.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: technova.id,
        departmentId: novaDepts[1].id,
        locationId: novaLocs[1].id,
      },
      {
        title: "Backend Infrastructure Engineer (PyTorch & Rust)",
        slug: "backend-infrastructure-engineer",
        description: "Scale model training pipelines across multi-node GPU clusters, optimizing distributed memory layout.",
        jobType: JobType.REMOTE,
        isPublished: true,
        companyId: technova.id,
        departmentId: technova.id ? novaDepts[2].id : novaDepts[0].id,
        locationId: novaLocs[1].id,
      },
    ],
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
