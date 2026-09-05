"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { brandThemeSchema, type BrandThemeInput } from "@/lib/validators/brand";

export async function getBrandThemeAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
  });

  return company;
}

export async function updateBrandThemeAction(input: BrandThemeInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = brandThemeSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { name, tagline, aboutText, primaryColor, secondaryColor, fontFamily, logoUrl, bannerUrl } = validated.data;

  try {
    const updatedCompany = await db.company.update({
      where: { id: session.user.companyId },
      data: {
        name,
        tagline: tagline || null,
        aboutText: aboutText || null,
        primaryColor,
        secondaryColor,
        fontFamily,
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers`);

    return { success: true, company: updatedCompany };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update brand theme" };
  }
}
