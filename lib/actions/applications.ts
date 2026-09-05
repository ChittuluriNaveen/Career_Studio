"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applicationSchema, type ApplicationInput } from "@/lib/validators/job";
import { JobStatus } from "@prisma/client";

export async function submitApplicationAction(input: ApplicationInput) {
  const validated = applicationSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { jobId, companyId, candidateName, candidateEmail, resumeUrl, coverLetter } = validated.data;

  try {
    // Verify job is ACTIVE and not expired
    const job = await db.job.findFirst({
      where: {
        id: jobId,
        companyId,
        status: JobStatus.ACTIVE,
        OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
      },
      select: { id: true, company: { select: { slug: true } } },
    });

    if (!job) {
      return { success: false, error: "This job position is no longer accepting applications." };
    }

    const application = await db.application.create({
      data: {
        jobId,
        companyId,
        candidateName,
        candidateEmail,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
        status: "PENDING",
      },
    });

    if (job.company.slug) {
      revalidatePath(`/${job.company.slug}/careers/jobs/${jobId}`);
      revalidatePath(`/company/${job.company.slug}/jobs/${jobId}`);
    }

    return { success: true, application };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit job application" };
  }
}

export async function getCompanyApplicationsAction() {
  const session = await auth();
  if (!session?.user?.companyId) {
    throw new Error("Unauthorized: Recruiter session required");
  }

  const applications = await db.application.findMany({
    where: { companyId: session.user.companyId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return applications;
}
