import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPublicCareersData } from "@/lib/actions/public";
import PageRenderer from "@/components/preview/PageRenderer";

interface PageProps {
  params: Promise<{ companySlug: string }>;
}

export default async function RecruiterPreviewPage({ params }: PageProps) {
  const session = await auth();
  const resolvedParams = await params;

  // Protect preview route: verify recruiter belongs to this company tenant
  if (!session?.user?.companyId) {
    redirect("/login");
  }

  const data = await getPublicCareersData(resolvedParams.companySlug, true);

  if (!data) {
    notFound();
  }

  // Ensure recruiter cannot preview another tenant's draft
  if (data.company.id !== session.user.companyId) {
    redirect("/dashboard");
  }

  return (
    <PageRenderer
      company={data.company}
      sections={data.sections}
      departments={data.departments}
      locations={data.locations}
      jobs={data.jobs}
      isPreviewMode={true}
    />
  );
}
