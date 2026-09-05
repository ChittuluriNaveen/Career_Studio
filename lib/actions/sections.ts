"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createSectionSchema,
  updateSectionOrderSchema,
  updateSectionContentSchema,
  toggleSectionVisibilitySchema,
  type CreateSectionInput,
  type UpdateSectionOrderInput,
  type UpdateSectionContentInput,
  type ToggleSectionVisibilityInput,
} from "@/lib/validators/section";

export async function getSectionsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const sections = await db.pageSection.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { orderIndex: "asc" },
  });

  return sections;
}

export async function addSectionAction(input: CreateSectionInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = createSectionSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const companyId = session.user.companyId;

  // Get or create careers page record for this company tenant
  let careersPage = await db.careersPage.findUnique({
    where: { companyId },
  });

  if (!careersPage) {
    careersPage = await db.careersPage.create({
      data: { companyId },
    });
  }

  // Count existing sections to determine new order index
  const existingCount = await db.pageSection.count({
    where: { companyId },
  });

  try {
    const section = await db.pageSection.create({
      data: {
        careersPageId: careersPage.id,
        companyId,
        type: validated.data.type,
        title: validated.data.title,
        content: validated.data.content,
        layoutVariant: validated.data.layoutVariant || "01",
        orderIndex: existingCount,
        enabled: true,
        isDraft: true,
        isPublished: false,
      },
    });

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true, section };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add section" };
  }
}

export async function updateSectionOrderAction(input: UpdateSectionOrderInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = updateSectionOrderSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid section ordering payload" };
  }

  const companyId = session.user.companyId;

  try {
    // Transactionally update section indexes ensuring companyId isolation
    await db.$transaction(
      validated.data.sections.map((item) =>
        db.pageSection.updateMany({
          where: {
            id: item.id,
            companyId, // Strict tenant boundary check
          },
          data: {
            orderIndex: item.orderIndex,
            isDraft: true,
          },
        })
      )
    );

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sections" };
  }
}

export async function updateSectionContentAction(input: UpdateSectionContentInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = updateSectionContentSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const companyId = session.user.companyId;

  try {
    const existing = await db.pageSection.findFirst({
      where: {
        id: validated.data.id,
        companyId, // Tenant boundary check
      },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Section not found or access denied" };
    }

    const updated = await db.pageSection.update({
      where: { id: validated.data.id },
      data: {
        title: validated.data.title,
        content: validated.data.content,
        ...(validated.data.layoutVariant ? { layoutVariant: validated.data.layoutVariant } : {}),
        ...(typeof validated.data.enabled === "boolean" ? { enabled: validated.data.enabled } : {}),
        isDraft: true,
      },
    });

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true, count: 1, section: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update section content" };
  }
}

export async function toggleSectionVisibilityAction(input: ToggleSectionVisibilityInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = toggleSectionVisibilitySchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const companyId = session.user.companyId;

  try {
    const existing = await db.pageSection.findFirst({
      where: {
        id: validated.data.id,
        companyId,
      },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Section not found or access denied" };
    }

    const updated = await db.pageSection.update({
      where: { id: validated.data.id },
      data: {
        enabled: validated.data.enabled,
        isDraft: true,
      },
    });

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true, section: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle section visibility" };
  }
}

export async function duplicateSectionAction(id: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const companyId = session.user.companyId;

  try {
    const sourceSection = await db.pageSection.findFirst({
      where: { id, companyId },
    });

    if (!sourceSection) {
      return { success: false, error: "Source section not found" };
    }

    const existingCount = await db.pageSection.count({
      where: { companyId },
    });

    const duplicate = await db.pageSection.create({
      data: {
        careersPageId: sourceSection.careersPageId,
        companyId,
        type: sourceSection.type,
        title: `${sourceSection.title || sourceSection.type} (Copy)`,
        content: sourceSection.content as any,
        layoutVariant: sourceSection.layoutVariant,
        orderIndex: existingCount,
        enabled: sourceSection.enabled,
        isDraft: true,
        isPublished: false,
      },
    });

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true, section: duplicate };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to duplicate section" };
  }
}

export async function deleteSectionAction(id: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const companyId = session.user.companyId;

  try {
    const deleted = await db.pageSection.deleteMany({
      where: {
        id,
        companyId, // Strict tenant boundary guard
      },
    });

    revalidatePath("/dashboard/editor");
    revalidatePath(`/${session.user.companySlug}/careers/preview`);

    return { success: true, count: deleted.count };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete section" };
  }
}
