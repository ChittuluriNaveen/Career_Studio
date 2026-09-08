import { verifyCompanyAccess } from "@/lib/auth-guard";
import CareerStudioClient from "./CareerStudioClient";

interface PageProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function CareersDesignPage({ params }: PageProps) {
  const { companySlug } = await params;
  const { company } = await verifyCompanyAccess(companySlug);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden">
      <CareerStudioClient companySlug={company.slug} />
    </div>
  );
}
