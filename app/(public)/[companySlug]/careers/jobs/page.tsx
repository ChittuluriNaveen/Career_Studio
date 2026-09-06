import { notFound } from "next/navigation";
import { getPublicJobsFeedAction } from "@/lib/actions/public";
import PublicJobsFeedClient from "@/components/candidate/PublicJobsFeedClient";

interface PublicJobsPageProps {
  params: Promise<{ companySlug: string }>;
  searchParams: Promise<{
    search?: string;
    location?: string;
    department?: string;
    employmentType?: string;
    workMode?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: PublicJobsPageProps) {
  const resolvedParams = await params;
  const data = await getPublicJobsFeedAction(resolvedParams.companySlug, {});
  if (!data || !data.company) {
    return { title: "Jobs Not Found" };
  }
  return {
    title: `Open Roles & Careers at ${data.company.name}`,
    description: `Explore ${data.totalCount} open job opportunities at ${data.company.name}. Filter by department, location, and employment type.`,
  };
}

export default async function PublicJobsPage({ params, searchParams }: PublicJobsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const data = await getPublicJobsFeedAction(resolvedParams.companySlug, resolvedSearchParams);

  if (!data || !data.company) {
    notFound();
  }

  return (
    <PublicJobsFeedClient
      company={data.company}
      jobs={data.jobs}
      totalCount={data.totalCount}
      filterDimensions={data.filterDimensions}
      jobsExperienceConfig={data.jobsExperienceConfig}
      isPreviewMode={false}
    />
  );
}
