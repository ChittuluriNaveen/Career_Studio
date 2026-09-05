"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobSchema, type JobInput } from "@/lib/validators/job";
import { JobStatus } from "@prisma/client";

export async function getJobsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const jobs = await db.job.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: "desc" },
  });

  return jobs;
}

export async function getJobByIdAction(jobId: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const job = await db.job.findFirst({
    where: {
      companyId: session.user.companyId,
      OR: [{ id: jobId }, { slug: jobId }],
    },
    include: {
      company: true,
      applications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return job;
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

  const companyId = session.user.companyId;
  const data = validated.data;

  const baseSlug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "job";

  const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const job = await db.job.create({
      data: {
        companyId,
        title: data.title,
        slug,
        departmentName: data.departmentName,
        employmentType: data.employmentType,
        workMode: data.workMode,
        locationCity: data.locationCity,
        locationCountry: data.locationCountry,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency || "USD",
        salaryVisible: data.salaryVisible,
        summary: data.summary,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        preferredSkills: data.preferredSkills,
        benefits: data.benefits,
        datePosted: data.status === "ACTIVE" ? new Date() : null,
        expiryDate: data.expiryDate,
        status: data.status,
        isPublished: data.status === "ACTIVE",
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/jobs`);
      revalidatePath(`/${session.user.companySlug}/careers`);
    }
    revalidatePath("/dashboard");

    return { success: true, job };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create job" };
  }
}

export async function updateJobAction(jobId: string, input: JobInput) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  const validated = jobSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const companyId = session.user.companyId;
  const data = validated.data;

  try {
    const existingJob = await db.job.findFirst({
      where: {
        id: jobId,
        companyId, // Strict tenant boundary guard
      },
    });

    if (!existingJob) {
      return { success: false, error: "Job not found or access denied" };
    }

    const isTransitioningToActive =
      data.status === "ACTIVE" && existingJob.status !== "ACTIVE";

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        departmentName: data.departmentName,
        employmentType: data.employmentType,
        workMode: data.workMode,
        locationCity: data.locationCity,
        locationCountry: data.locationCountry,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency || "USD",
        salaryVisible: data.salaryVisible,
        summary: data.summary,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        preferredSkills: data.preferredSkills,
        benefits: data.benefits,
        expiryDate: data.expiryDate,
        status: data.status,
        isPublished: data.status === "ACTIVE",
        datePosted: isTransitioningToActive
          ? new Date()
          : existingJob.datePosted || (data.status === "ACTIVE" ? new Date() : null),
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/jobs`);
      revalidatePath(`/company/${session.user.companySlug}/jobs/${jobId}`);
      revalidatePath(`/${session.user.companySlug}/careers`);
      revalidatePath(`/${session.user.companySlug}/careers/jobs/${jobId}`);
    }
    revalidatePath("/dashboard");

    return { success: true, job: updatedJob };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update job" };
  }
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return { success: false, error: "Unauthorized: Recruiter session required" };
  }

  try {
    const existing = await db.job.findFirst({
      where: { id: jobId, companyId: session.user.companyId },
    });

    if (!existing) {
      return { success: false, error: "Job not found or access denied" };
    }

    const datePosted =
      status === "ACTIVE" && !existing.datePosted ? new Date() : existing.datePosted;

    await db.job.update({
      where: { id: jobId },
      data: {
        status,
        isPublished: status === "ACTIVE",
        datePosted,
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/jobs`);
      revalidatePath(`/${session.user.companySlug}/careers`);
    }
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update job status" };
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
        companyId: session.user.companyId, // Strict tenant boundary guard
      },
    });

    if (session.user.companySlug) {
      revalidatePath(`/company/${session.user.companySlug}/jobs`);
      revalidatePath(`/${session.user.companySlug}/careers`);
    }
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete job" };
  }
}

// ----------------------------------------------------
// PUBLIC CANDIDATE QUERIES (ACTIVE & NON-EXPIRED ONLY)
// ----------------------------------------------------

export async function getPublicActiveJobsAction(companySlug: string) {
  const company = await db.company.findUnique({
    where: { slug: companySlug },
    select: { id: true },
  });

  if (!company) return [];

  const now = new Date();

  const jobs = await db.job.findMany({
    where: {
      companyId: company.id,
      status: "ACTIVE",
      OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
  });

  return jobs;
}

export async function getPublicJobByIdAction(companySlug: string, jobIdOrSlug: string) {
  const company = await db.company.findUnique({
    where: { slug: companySlug },
  });

  if (!company) return null;

  const now = new Date();

  const job = await db.job.findFirst({
    where: {
      companyId: company.id,
      status: "ACTIVE",
      AND: [
        { OR: [{ id: jobIdOrSlug }, { slug: jobIdOrSlug }] },
        { OR: [{ expiryDate: null }, { expiryDate: { gt: now } }] },
      ],
    },
    include: {
      company: true,
    },
  });

  return job;
}

export async function getDepartmentsAndLocationsAction() {
  try {
    const session = await auth();
    if (!session?.user?.companyId) {
      return { departments: [], locations: [] };
    }

    const jobs = await db.job.findMany({
      where: { companyId: session.user.companyId },
      select: { departmentName: true, locationCity: true, locationCountry: true },
    });

    const departments = Array.from(
      new Set(jobs.map((j) => j.departmentName).filter((d): d is string => Boolean(d)))
    );
    const locations = Array.from(
      new Set(
        jobs
          .map((j) =>
            j.locationCity && j.locationCountry
              ? `${j.locationCity}, ${j.locationCountry}`
              : j.locationCity || j.locationCountry
          )
          .filter((l): l is string => Boolean(l))
      )
    );

    return { departments, locations };
  } catch (error) {
    console.error("Error in getDepartmentsAndLocationsAction:", error);
    return { departments: [], locations: [] };
  }
}

