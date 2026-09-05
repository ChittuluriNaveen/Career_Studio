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
  });

  return company;
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
        logoUrl: input.logoUrl || null,
        bannerUrl: input.bannerUrl || null,
        cultureVideoUrl: input.cultureVideoUrl || null,
        primaryColor: input.primaryColor || "#005d52",
        secondaryColor: input.secondaryColor || "emerald-dark",
        ...(input.tagline !== undefined ? { tagline: input.tagline } : {}),
        ...(input.aboutText !== undefined ? { aboutText: input.aboutText } : {}),
        ...(input.fontFamily ? { fontFamily: input.fontFamily } : {}),
        ...(input.cornerRadius !== undefined && input.cornerRadius !== null ? { cornerRadius: Number(input.cornerRadius) } : {}),
        ...(input.sectionSpacing ? { sectionSpacing: input.sectionSpacing } : {}),
      },
    });

    const slug = session.user.companySlug || updatedCompany.slug;

    revalidatePath(`/company/${slug}/details`);
    revalidatePath(`/company/${slug}/design`);
    revalidatePath(`/company/${slug}/preview`);
    revalidatePath(`/${slug}/careers`);
    revalidatePath("/dashboard");

    return { success: true, company: updatedCompany };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update company details" };
  }
}

export const updateBrandThemeAction = updateCompanyDetailsAction;
