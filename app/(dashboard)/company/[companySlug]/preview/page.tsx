import { verifyCompanyAccess } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import CareersPreviewClient from "./CareersPreviewClient";

interface PreviewPageProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function CareersPreviewPage({ params }: PreviewPageProps) {
  const { companySlug } = await params;
  const { company } = await verifyCompanyAccess(companySlug);

  const [sections, jobs, departments, locations] = await Promise.all([
    db.pageSection.findMany({
      where: { companyId: company.id, enabled: true },
      orderBy: { orderIndex: "asc" },
    }),
    db.job.findMany({
      where: { companyId: company.id, isPublished: true },
      include: { department: true, location: true },
      orderBy: { createdAt: "desc" },
    }),
    db.department.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" },
    }),
    db.location.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CareersPreviewClient
      company={company}
      sections={sections}
      jobs={jobs}
      departments={departments}
      locations={locations}
    />
  );
}
