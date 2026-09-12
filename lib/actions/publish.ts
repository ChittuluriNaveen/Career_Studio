"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function publishCareersPageAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const companyId = session.user.companyId;
  const companySlug = session.user.companySlug;

  try {
    const [company, sections] = await Promise.all([
      db.company.findUnique({ where: { id: companyId } }),
      db.pageSection.findMany({
        where: { companyId },
        orderBy: { orderIndex: "asc" },
      }),
    ]);

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    const publishedConfig = {
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        primaryColor: company.primaryColor,
        secondaryColor: company.secondaryColor,
        fontFamily: company.fontFamily,
        logoUrl: company.logoUrl,
        bannerUrl: company.bannerUrl,
        tagline: company.tagline,
        aboutText: company.aboutText,
        cornerRadius: company.cornerRadius,
        sectionSpacing: company.sectionSpacing,
      },
      sections: sections.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        content: s.content,
        layoutVariant: s.layoutVariant,
        orderIndex: s.orderIndex,
        enabled: s.enabled,
        isPublished: true,
        isDraft: false,
      })),
    };

    // 1. Transactionally promote all draft page sections to published and update publishedConfig snapshot
    await db.$transaction([
      db.pageSection.updateMany({
        where: { companyId },
        data: {
          isPublished: true,
          isDraft: false,
        },
      }),
      db.careersPage.upsert({
        where: { companyId },
        update: {
          isPublished: true,
          publishedAt: new Date(),
          publishedConfig,
        },
        create: {
          companyId,
          isPublished: true,
          publishedAt: new Date(),
          publishedConfig,
        },
      }),
    ]);

    // 2. Purge Next.js static cache for candidate & recruiter views
    if (companySlug) {
      revalidatePath(`/${companySlug}/careers`);
      revalidatePath(`/company/${companySlug}/preview`);
    }
    revalidatePath("/dashboard");

    return { success: true, publishedAt: new Date() };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to publish careers page" };
  }
}
