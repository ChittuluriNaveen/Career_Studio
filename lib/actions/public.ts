"use server";

import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";

export async function getPublicCareersData(companySlug: string, isPreviewMode: boolean = false) {
  let company = await db.company.findFirst({
    where: { slug: { equals: companySlug, mode: "insensitive" } },
  });

  if (!company) {
    company = await db.company.findUnique({
      where: { slug: companySlug },
    });
  }

  if (!company) {
    return null;
  }

  const careersPage = await db.careersPage.findUnique({
    where: { companyId: company.id },
  });

  if (!isPreviewMode && !careersPage?.isPublished) {
    return null;
  }

  // Fetch sections (in preview mode return draft sections, in candidate mode return published & enabled sections)
  const sections = await db.pageSection.findMany({
    where: {
      companyId: company.id,
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

export async function getPublicJobsFeedAction(
  companySlug: string,
  searchParams?: {
    search?: string;
    location?: string;
    department?: string;
    employmentType?: string;
    workMode?: string;
    sort?: string;
  },
  isPreviewMode: boolean = false
) {
  let company = await db.company.findFirst({
    where: { slug: { equals: companySlug, mode: "insensitive" } },
  });

  if (!company) {
    company = await db.company.findUnique({
      where: { slug: companySlug },
    });
  }

  if (!company) {
    return null;
  }

  const now = new Date();

  // Baseline job query: Company tenant isolated, status = ACTIVE, expiryDate is null OR > now
  const baseWhere: any = {
    companyId: company.id,
    ...(isPreviewMode
      ? {}
      : {
          status: JobStatus.ACTIVE,
          OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
        }),
  };

  // Fetch all active jobs for dynamic filter generation and counts
  const allActiveJobs = await db.job.findMany({
    where: baseWhere,
    orderBy: { createdAt: "desc" },
  });

  // Build dynamic filter dimensions with counts from actual database records
  const locationCounts: Record<string, number> = {};
  const departmentCounts: Record<string, number> = {};
  const employmentTypeCounts: Record<string, number> = {};
  const workModeCounts: Record<string, number> = {};

  allActiveJobs.forEach((job) => {
    const loc =
      job.locationCity && job.locationCountry && job.locationCity !== "Remote"
        ? `${job.locationCity}, ${job.locationCountry}`
        : job.locationCity || "Remote";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;

    const dept = job.departmentName || "General";
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;

    const emp = job.employmentType;
    employmentTypeCounts[emp] = (employmentTypeCounts[emp] || 0) + 1;

    const wm = job.workMode;
    workModeCounts[wm] = (workModeCounts[wm] || 0) + 1;
  });

  const searchFilter = searchParams?.search?.trim()?.toLowerCase();
  const locationFilter = searchParams?.location?.trim();
  const departmentFilter = searchParams?.department?.trim();
  const employmentTypeFilter = searchParams?.employmentType?.trim();
  const workModeFilter = searchParams?.workMode?.trim();
  const sortBy = searchParams?.sort || "newest";

  const filteredJobs = allActiveJobs.filter((job) => {
    if (searchFilter) {
      const matchTitle = job.title.toLowerCase().includes(searchFilter);
      const matchDept = job.departmentName.toLowerCase().includes(searchFilter);
      const matchSummary = job.summary?.toLowerCase().includes(searchFilter);
      const matchCity = job.locationCity.toLowerCase().includes(searchFilter);
      if (!matchTitle && !matchDept && !matchSummary && !matchCity) return false;
    }

    if (locationFilter && locationFilter !== "ALL") {
      const loc =
        job.locationCity && job.locationCountry && job.locationCity !== "Remote"
          ? `${job.locationCity}, ${job.locationCountry}`
          : job.locationCity || "Remote";
      if (loc !== locationFilter && !job.locationCity.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
    }

    if (departmentFilter && departmentFilter !== "ALL") {
      if (job.departmentName !== departmentFilter) return false;
    }

    if (employmentTypeFilter && employmentTypeFilter !== "ALL") {
      if (job.employmentType !== employmentTypeFilter) return false;
    }

    if (workModeFilter && workModeFilter !== "ALL") {
      if (job.workMode !== workModeFilter) return false;
    }

    return true;
  });

  if (sortBy === "oldest") {
    filteredJobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "alphabetical") {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const careersPage = await db.careersPage.findUnique({
    where: { companyId: company.id },
  });

  const jobsExperienceConfig = (careersPage?.jobsExperienceConfig as any) || {};

  return {
    company,
    jobs: filteredJobs,
    totalCount: allActiveJobs.length,
    filteredCount: filteredJobs.length,
    filterDimensions: {
      locations: Object.entries(locationCounts).map(([name, count]) => ({ name, count })),
      departments: Object.entries(departmentCounts).map(([name, count]) => ({ name, count })),
      employmentTypes: Object.entries(employmentTypeCounts).map(([name, count]) => ({ name, count })),
      workModes: Object.entries(workModeCounts).map(([name, count]) => ({ name, count })),
    },
    jobsExperienceConfig,
  };
}
