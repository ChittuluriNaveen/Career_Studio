import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import CreateJobForm from "./CreateJobForm";

interface NewJobPageProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function CreateJobPage({ params }: NewJobPageProps) {
  const { companySlug } = await params;
  const { session, company } = await verifyCompanyAccess(companySlug);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <CreateJobForm companySlug={company.slug} />
      </main>
    </div>
  );
}
