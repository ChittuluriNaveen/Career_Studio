"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
  tagline?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  description?: string;
  aboutText?: string;
  logoUrl?: string;
  bannerUrl?: string;
  cultureVideoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  cornerRadius?: number;
  sectionSpacing?: string;
}

export async function registerRecruiterAction(input: RegisterInput) {
  const {
    name,
    companyName,
    email,
    password,
    tagline,
    website,
    industry,
    companySize,
    location,
    description,
    aboutText,
    logoUrl,
    bannerUrl,
    cultureVideoUrl,
    primaryColor,
    secondaryColor,
    fontFamily,
    cornerRadius,
    sectionSpacing,
  } = input;

  if (!email || !password || !name || !companyName) {
    return { success: false, error: "Name, Company Name, Email, and Password are required." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    return { success: false, error: "An account with this email address already exists. Please log in." };
  }

  // Generate unique slug
  let baseSlug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) baseSlug = "company";

  let slug = baseSlug;
  let counter = 1;
  while (await db.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Create Company with ALL provided database fields
      const company = await tx.company.create({
        data: {
          name: companyName.trim(),
          slug,
          tagline: tagline?.trim() || null,
          website: website?.trim() || null,
          industry: industry?.trim() || null,
          companySize: companySize?.trim() || null,
          location: location?.trim() || null,
          description: description?.trim() || null,
          aboutText: aboutText?.trim() || null,
          logoUrl: logoUrl?.trim() || null,
          bannerUrl: bannerUrl?.trim() || null,
          cultureVideoUrl: cultureVideoUrl?.trim() || null,
          primaryColor: primaryColor?.trim() || "#005d52",
          secondaryColor: secondaryColor?.trim() || "#0f172a",
          fontFamily: fontFamily?.trim() || "Inter",
          cornerRadius: typeof cornerRadius === "number" ? cornerRadius : 12,
          sectionSpacing: sectionSpacing?.trim() || "3.5rem",
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: Role.RECRUITER,
          companyId: company.id,
        },
      });

      // 3. Create CareersPage record
      const careersPage = await tx.careersPage.create({
        data: {
          companyId: company.id,
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      // 4. Seed default Location records matching company headquarters
      const defaultLocName = location?.trim() || "Mittapalli";
      const hqLocation = await tx.location.create({
        data: {
          companyId: company.id,
          name: defaultLocName,
          isRemote: false,
        },
      });

      await tx.location.create({
        data: {
          companyId: company.id,
          name: "Remote",
          isRemote: true,
        },
      });

      // 5. Seed default Department records
      const engDept = await tx.department.create({
        data: {
          companyId: company.id,
          name: "Engineering",
        },
      });

      await tx.department.createMany({
        data: [
          { companyId: company.id, name: "Product & Design" },
          { companyId: company.id, name: "Sales & Marketing" },
          { companyId: company.id, name: "Operations" },
        ],
      });

      // 6. Seed initial default sections using full registry template elements
      const heroTmpl = TEMPLATE_REGISTRY["hero-centered"];
      const peopleTmpl = TEMPLATE_REGISTRY["people-pillars"];
      const deptTmpl = TEMPLATE_REGISTRY["departments-grid"];
      const aboutTmpl = TEMPLATE_REGISTRY["about-image-left"];
      const cultureTmpl = TEMPLATE_REGISTRY["culture-video-embed"];
      const benefitsTmpl = TEMPLATE_REGISTRY["benefits-grid-cards"];
      const jobsTmpl = TEMPLATE_REGISTRY["jobs-grid-cards"];
      const ctaTmpl = TEMPLATE_REGISTRY["cta-banner-centered"];

      await tx.pageSection.createMany({
        data: [
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "HERO",
            title: heroTmpl.name,
            orderIndex: 0,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: heroTmpl.templateId,
              showInNav: true,
              layout: heroTmpl.layout,
              elements: heroTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "PEOPLE",
            title: peopleTmpl.name,
            orderIndex: 1,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: peopleTmpl.templateId,
              showInNav: true,
              layout: peopleTmpl.layout,
              elements: peopleTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "DEPARTMENTS",
            title: deptTmpl.name,
            orderIndex: 2,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: deptTmpl.templateId,
              showInNav: true,
              layout: deptTmpl.layout,
              elements: deptTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "ABOUT_US",
            title: aboutTmpl.name,
            orderIndex: 3,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: aboutTmpl.templateId,
              showInNav: true,
              layout: aboutTmpl.layout,
              elements: aboutTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "CULTURE_VIDEO",
            title: cultureTmpl.name,
            orderIndex: 4,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: cultureTmpl.templateId,
              showInNav: true,
              layout: cultureTmpl.layout,
              elements: cultureTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "PERKS_BENEFITS",
            title: benefitsTmpl.name,
            orderIndex: 5,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: benefitsTmpl.templateId,
              showInNav: true,
              layout: benefitsTmpl.layout,
              elements: benefitsTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "OPEN_ROLES",
            title: jobsTmpl.name,
            orderIndex: 6,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: jobsTmpl.templateId,
              showInNav: true,
              layout: jobsTmpl.layout,
              elements: jobsTmpl.defaultElements,
            } as any,
          },
          {
            careersPageId: careersPage.id,
            companyId: company.id,
            type: "CTA",
            title: ctaTmpl.name,
            orderIndex: 7,
            enabled: true,
            isDraft: false,
            isPublished: true,
            layoutVariant: "01",
            content: {
              templateId: ctaTmpl.templateId,
              showInNav: false,
              layout: ctaTmpl.layout,
              elements: ctaTmpl.defaultElements,
            } as any,
          },
        ],
      });

      return { user, company };
    });

    return { success: true, companySlug: result.company.slug, email: result.user.email };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create account" };
  }
}
