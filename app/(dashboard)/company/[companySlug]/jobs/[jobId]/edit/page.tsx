import { notFound } from "next/navigation";
import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import { db } from "@/lib/db";
import EditJobForm from "./EditJobForm";

interface EditJobPageProps {
  params: Promise<{
    companySlug: string;
    jobId: string;
  }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { companySlug, jobId } = await params;
  const { session, company } = await verifyCompanyAccess(companySlug);

  const [job, departments, locations] = await Promise.all([
    db.job.findFirst({
      where: {
        id: jobId,
        companyId: company.id, // Tenant isolation guard
      },
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

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <EditJobForm
          companySlug={company.slug}
          job={job}
          departments={departments}
          locations={locations}
        />
      </main>
    </div>
  );
}
