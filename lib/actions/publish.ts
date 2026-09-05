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
    // 1. Transactionally promote all draft page sections to published
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
        },
        create: {
          companyId,
          isPublished: true,
          publishedAt: new Date(),
        },
      }),
    ]);

    // 2. Purge Next.js static cache for candidate view
    revalidatePath(`/${companySlug}/careers`);
    revalidatePath(`/dashboard/editor`);

    return { success: true, publishedAt: new Date() };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to publish careers page" };
  }
}
