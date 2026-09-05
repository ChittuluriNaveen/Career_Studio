"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobSchema, type JobInput } from "@/lib/validators/job";

export async function getJobsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const jobs = await db.job.findMany({
    where: { companyId: session.user.companyId },
    include: { department: true, location: true },
    orderBy: { createdAt: "desc" },
  });

  return jobs;
}

export async function getDepartmentsAndLocationsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const companyId = session.user.companyId;

  const [departments, locations] = await Promise.all([
    db.department.findMany({ where: { companyId }, orderBy: { name: "asc" } }),
    db.location.findMany({ where: { companyId }, orderBy: { name: "asc" } }),
  ]);

  return { departments, locations };
}

export async function createJobAction(input: JobInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = jobSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { title, description, jobType, departmentId, locationId, isPublished } = validated.data;
  const companyId = session.user.companyId;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const job = await db.job.create({
      data: {
        title,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        description,
        jobType,
        isPublished,
        companyId,
        departmentId,
        locationId,
      },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/${session.user.companySlug}/careers`);

    return { success: true, job };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create job" };
  }
}

export async function toggleJobPublishAction(jobId: string, isPublished: boolean) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  try {
    await db.job.updateMany({
      where: {
        id: jobId,
        companyId: session.user.companyId, // Strict tenant isolation check
      },
      data: { isPublished },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/${session.user.companySlug}/careers`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle job status" };
  }
}

export async function deleteJobAction(jobId: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  try {
    await db.job.deleteMany({
      where: {
        id: jobId,
        companyId: session.user.companyId, // Strict tenant isolation check
      },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/${session.user.companySlug}/careers`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete job" };
  }
}
