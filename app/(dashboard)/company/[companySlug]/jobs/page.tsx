import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import { db } from "@/lib/db";
import JobsListClient from "./JobsListClient";

interface JobsPageProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function RecruiterJobsPage({ params }: JobsPageProps) {
  const { companySlug } = await params;
  const { session, company } = await verifyCompanyAccess(companySlug);

  const [jobs, departments, locations] = await Promise.all([
    db.job.findMany({
      where: { companyId: company.id },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <JobsListClient
          companySlug={company.slug}
          initialJobs={jobs}
          departments={departments}
          locations={locations}
        />
      </main>
    </div>
  );
}
