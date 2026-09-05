import { PrismaClient, JobType, SectionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user@127.0.0.1:5433/whitecarrot_db?schema=public",
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

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

  // Sections for Acme Corp
  await db.pageSection.createMany({
    data: [
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.HERO,
        title: "Shape the Future of Enterprise Cloud",
        content: {
          subtitle: "We are on a mission to automate enterprise workflows for over 10,000 customers worldwide. Join our talented remote-first team.",
          ctaText: "Explore Open Roles",
          backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
        },
        orderIndex: 0,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.ABOUT_US,
        title: "About Acme Corp",
        content: {
          body: "Founded in 2018, Acme Corp has grown from a 4-person startup into a leading global platform powering hyper-scale infrastructure operations. We value autonomy, velocity, customer obsession, and high empathy across all functions.",
          stat1Number: "10,000+",
          stat1Label: "Global Customers",
          stat2Number: "450+",
          stat2Label: "Team Members Worldwide",
          stat3Number: "$120M+",
          stat3Label: "Series C Funding",
        },
        orderIndex: 1,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.CULTURE_VIDEO,
        title: "Life at Acme: Our Engineering Culture",
        content: {
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "Watch our team share their experiences working on distributed systems, modern web tools, and collaborative team rituals.",
        },
        orderIndex: 2,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.PERKS_BENEFITS,
        title: "Perks & Benefits",
        content: {
          perks: [
            { icon: "Laptop", title: "Latest Hardware", description: "Top-tier MacBook Pro M3 Max, 4K monitors, and $1,500 home office stipend." },
            { icon: "Heart", title: "Comprehensive Health", description: "100% premium coverage for medical, dental, vision, and mental wellness." },
            { icon: "Plane", title: "Unlimited PTO", description: "4 weeks recommended minimum PTO plus annual company-wide retreats." },
            { icon: "GraduationCap", title: "Learning Allowance", description: "$2,500 annual budget for courses, books, and international conferences." },
          ],
        },
        orderIndex: 3,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: acmePage.id,
        companyId: acme.id,
        type: SectionType.OPEN_ROLES,
        title: "Explore Open Positions",
        content: {
          subtitle: "Find your next career milestone at Acme Corp.",
        },
        orderIndex: 4,
        isDraft: false,
        isPublished: true,
      },
    ],
  });

  // Jobs for Acme Corp
  await db.job.createMany({
    data: [
      {
        title: "Senior Full Stack Engineer (Next.js & Node.js)",
        slug: "senior-full-stack-engineer",
        description: "We are seeking a Senior Full Stack Engineer to lead front-end architecture and backend microservices using Next.js, React, TypeScript, and Node.js. You will own core customer dashboard features and real-time collaboration engines.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[0].id,
        locationId: acmeLocs[2].id, // Remote - US
      },
      {
        title: "Principal Cloud Systems Architect",
        slug: "principal-cloud-systems-architect",
        description: "Architect high-availability Kubernetes clusters, infrastructure-as-code deployments (Terraform), and low-latency event-driven microservices processing billions of daily events.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[0].id,
        locationId: acmeLocs[0].id, // SF
      },
      {
        title: "Lead Product Designer (UI/UX Systems)",
        slug: "lead-product-designer",
        description: "Define the visual design language, component system, and user experience for Acme's developer portal and web app analytics dashboard.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[1].id,
        locationId: acmeLocs[1].id, // NY
      },
      {
        title: "Staff Product Manager - Developer Platform",
        slug: "staff-product-manager",
        description: "Drive product strategy, roadmap prioritization, and API experience for developer-facing platform capabilities.",
        jobType: JobType.HYBRID,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[1].id,
        locationId: acmeLocs[0].id, // SF
      },
      {
        title: "Technical Content Marketing Specialist",
        slug: "technical-content-marketing-specialist",
        description: "Author technical blog posts, architectural case studies, whitepapers, and developer documentation to showcase Acme's technology leadership.",
        jobType: JobType.CONTRACT,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[2].id,
        locationId: acmeLocs[2].id, // Remote
      },
      {
        title: "Enterprise Account Executive (EMEA)",
        slug: "enterprise-account-executive-emea",
        description: "Lead enterprise sales cycles, contract negotiations, and technical discovery across Fortune 500 accounts in the EMEA region.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: acme.id,
        departmentId: acmeDepts[3].id,
        locationId: acmeLocs[3].id, // London
      },
    ],
  });

  // ----------------------------------------------------
  // COMPANY 2: TECHNOVA INC (AI & BioTech Startup)
  // ----------------------------------------------------
  const technova = await db.company.create({
    data: {
      name: "TechNova AI",
      slug: "technova",
      logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7edc?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
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
    db.department.create({ data: { name: "AI Research", companyId: technova.id } }),
    db.department.create({ data: { name: "BioInformatics", companyId: technova.id } }),
    db.department.create({ data: { name: "Software Engineering", companyId: technova.id } }),
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

  await db.pageSection.createMany({
    data: [
      {
        careersPageId: novaPage.id,
        companyId: technova.id,
        type: SectionType.HERO,
        title: "Solve Humanity's Greatest Health Challenges",
        content: {
          subtitle: "At TechNova, we harness generative AI models to unlock breakthroughs in medicine, therapeutics, and synthetic biology.",
          ctaText: "View Open Research & Engineering Roles",
        },
        orderIndex: 0,
        isDraft: false,
        isPublished: true,
      },
      {
        careersPageId: novaPage.id,
        companyId: technova.id,
        type: SectionType.VALUES,
        title: "Our Core Principles",
        content: {
          values: [
            { title: "Scientific Rigor", description: "Ground every decision in empirical data, peer review, and mathematical truth." },
            { title: "Ethical AI Responsibility", description: "Ensure safety, privacy, and clinical transparency in all model outputs." },
            { title: "Radical Collaboration", description: "Break down silos between machine learning experts, biologists, and clinicians." },
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
        content: { subtitle: "Join our team of pioneers." },
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
        description: "Research and deploy transformer-based foundation models trained on high-throughput genomic and proteomic sequencing datasets.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: technova.id,
        departmentId: novaDepts[0].id,
        locationId: novaLocs[0].id, // Boston
      },
      {
        title: "Lead Computational Biologist",
        slug: "lead-computational-biologist",
        description: "Develop algorithmic pipelines for structural biology analysis, ligand binding predictions, and molecular dynamics simulations.",
        jobType: JobType.FULL_TIME,
        isPublished: true,
        companyId: technova.id,
        departmentId: novaDepts[1].id,
        locationId: novaLocs[1].id, // Remote
      },
      {
        title: "Backend Infrastructure Engineer (PyTorch & Rust)",
        slug: "backend-infrastructure-engineer",
        description: "Scale model training pipelines across multi-node GPU clusters, optimizing distributed memory layout and model inference latencies.",
        jobType: JobType.REMOTE,
        isPublished: true,
        companyId: technova.id,
        departmentId: novaDepts[2].id,
        locationId: novaLocs[1].id, // Remote
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
