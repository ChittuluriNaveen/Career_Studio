"use server";

import { db } from "@/lib/db";

export async function getPublicCareersData(companySlug: string, isPreviewMode: boolean = false) {
  const company = await db.company.findUnique({
    where: { slug: companySlug },
  });

  if (!company) {
    return null;
  }

  // Fetch sections (in preview mode return draft sections, in candidate mode return published & enabled sections)
  const sections = await db.pageSection.findMany({
    where: {
      companyId: company.id, // Strict tenant isolation guard
      ...(isPreviewMode ? {} : { isPublished: true, enabled: true }),
    },
    orderBy: { orderIndex: "asc" },
  });

  // Fetch departments & locations for search filters
  const [departments, locations, jobs] = await Promise.all([
    db.department.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" },
    }),
    db.location.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" },
    }),
    db.job.findMany({
      where: {
        companyId: company.id,
        isPublished: true,
      },
      include: {
        department: true,
        location: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    company,
    sections,
    departments,
    locations,
    jobs,
  };
}
