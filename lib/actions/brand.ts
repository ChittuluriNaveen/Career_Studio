"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export interface CompanyDetailsInput {
  name: string;
  website?: string | null;
  industry?: string | null;
  companySize?: string | null;
  location?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  cultureVideoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  tagline?: string | null;
  aboutText?: string | null;
  fontFamily?: string | null;
  cornerRadius?: number | null;
  sectionSpacing?: string | null;
}

export async function getCompanyDetailsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
    include: {
      careersPages: true,
    },
  });

  if (!company) return null;

  const careersPage = company.careersPages?.[0] || null;
  return {
    ...company,
    careersPage,
  };
}

export const getBrandThemeAction = getCompanyDetailsAction;

export async function updateCompanyDetailsAction(input: CompanyDetailsInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  if (!input.name || input.name.trim() === "") {
    return { success: false, error: "Company name is required" };
  }

  try {
    const updatedCompany = await db.company.update({
      where: { id: session.user.companyId },
      data: {
        name: input.name.trim(),
        website: input.website || null,
        industry: input.industry || null,
        companySize: input.companySize || null,
        location: input.location || null,
        description: input.description || null,
        aboutText: input.aboutText || null,
        tagline: input.tagline || null,
        logoUrl: input.logoUrl || null,
        bannerUrl: input.bannerUrl || null,
        cultureVideoUrl: input.cultureVideoUrl || null,
        primaryColor: input.primaryColor || "#005d52",
        secondaryColor: input.secondaryColor || "emerald-dark",
        fontFamily: input.fontFamily || "Inter",
        ...(input.cornerRadius !== undefined && input.cornerRadius !== null ? { cornerRadius: Number(input.cornerRadius) } : {}),
        ...(input.sectionSpacing ? { sectionSpacing: input.sectionSpacing } : {}),
      },
    });

    const companyId = session.user.companyId;
    const slug = session.user.companySlug || updatedCompany.slug;

    // 1. Sync Location record if provided
    if (input.location && input.location.trim()) {
      const locName = input.location.trim();
      await db.location.upsert({
        where: {
          name_companyId: {
            name: locName,
            companyId,
          },
        },
        create: {
          name: locName,
          companyId,
          isRemote: false,
        },
        update: {},
      });
    }

    // 2. Sync HERO section elements if HERO section exists
    const heroSec = await db.pageSection.findFirst({
      where: { companyId, type: "HERO" },
    });

    if (heroSec && heroSec.content) {
      const contentObj = (heroSec.content as any) || {};
      const elements = Array.isArray(contentObj.elements) ? [...contentObj.elements] : [];
      let updatedElements = false;

      const updated = elements.map((elem: any) => {
        if (elem.type === "heading" && input.tagline) {
          updatedElements = true;
          return { ...elem, content: { ...elem.content, text: input.tagline } };
        }
        if (elem.type === "text" && input.description) {
          updatedElements = true;
          return { ...elem, content: { ...elem.content, text: input.description } };
        }
        return elem;
      });

      if (updatedElements) {
        await db.pageSection.update({
          where: { id: heroSec.id },
          data: {
            content: { ...contentObj, elements: updated },
          },
        });
      }
    }

    // 3. Sync ABOUT_US section elements if ABOUT_US section exists
    const aboutSec = await db.pageSection.findFirst({
      where: { companyId, type: "ABOUT_US" },
    });

    if (aboutSec && aboutSec.content) {
      const contentObj = (aboutSec.content as any) || {};
      const elements = Array.isArray(contentObj.elements) ? [...contentObj.elements] : [];
      let updatedElements = false;

      const updated = elements.map((elem: any) => {
        if (elem.type === "text" && (input.aboutText || input.description)) {
          updatedElements = true;
          return { ...elem, content: { ...elem.content, text: input.aboutText || input.description } };
        }
        return elem;
      });

      if (updatedElements) {
        await db.pageSection.update({
          where: { id: aboutSec.id },
          data: {
            content: { ...contentObj, elements: updated },
          },
        });
      }
    }

    revalidatePath(`/company/${slug}/details`);
    revalidatePath(`/company/${slug}/preview`);
    revalidatePath("/dashboard");

    return { success: true, company: updatedCompany };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update company details" };
  }
}

export const updateBrandThemeAction = updateCompanyDetailsAction;
