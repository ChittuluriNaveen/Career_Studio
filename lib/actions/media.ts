"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getCompanyMediaAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const media = await db.media.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: "desc" },
  });

  return media;
}

export async function createMediaRecordAction(input: {
  url: string;
  type: string;
  altText?: string;
}) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  try {
    const media = await db.media.create({
      data: {
        companyId: session.user.companyId,
        url: input.url,
        type: input.type || "image",
        altText: input.altText || null,
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/design`);
      revalidatePath(`/company/${session.user.companySlug}/details`);
      revalidatePath(`/${session.user.companySlug}/careers`);
    }
    revalidatePath("/dashboard");

    return { success: true, media };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to record media asset" };
  }
}

export async function deleteMediaRecordAction(id: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  try {
    await db.media.deleteMany({
      where: {
        id,
        companyId: session.user.companyId, // Strict tenant isolation guard
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/design`);
      revalidatePath(`/company/${session.user.companySlug}/details`);
    }
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete media asset" };
  }
}
