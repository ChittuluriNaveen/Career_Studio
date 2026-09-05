"use server";

import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";

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

  const now = new Date();

  // Fetch departments & locations for search filters
  const [dbDepartments, dbLocations, jobs] = await Promise.all([
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
        ...(isPreviewMode
          ? {}
          : {
              status: JobStatus.ACTIVE,
              OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
            }),
      },
      include: {
        department: true,
        location: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Extract distinct departments & locations from active jobs if relation tables are empty
  const extractedDepts = Array.from(
    new Set(jobs.map((j) => j.departmentName).filter((d): d is string => Boolean(d)))
  ).map((name, idx) => ({ id: `dept-${idx}`, name }));

  const extractedLocs = Array.from(
    new Set(
      jobs
        .map((j) =>
          j.locationCity && j.locationCountry
            ? `${j.locationCity}, ${j.locationCountry}`
            : j.locationCity || j.locationCountry
        )
        .filter((l): l is string => Boolean(l))
    )
  ).map((name, idx) => ({ id: `loc-${idx}`, name }));

  const departments = dbDepartments.length > 0 ? dbDepartments : extractedDepts;
  const locations = dbLocations.length > 0 ? dbLocations : extractedLocs;

  return {
    company,
    sections,
    departments,
    locations,
    jobs,
  };
}
