import { verifyCompanyAccess } from "@/lib/auth-guard";
import { RecruiterNav } from "@/components/navigation/RecruiterNav";
import CareerStudioClient from "./CareerStudioClient";

interface PageProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function CareersDesignPage({ params }: PageProps) {
  const { companySlug } = await params;
  const { session, company } = await verifyCompanyAccess(companySlug);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <RecruiterNav
        companySlug={company.slug}
        companyName={company.name}
        userName={session.user?.name}
      />
      <div className="flex-1">
        <CareerStudioClient companySlug={company.slug} />
      </div>
    </div>
  );
}
