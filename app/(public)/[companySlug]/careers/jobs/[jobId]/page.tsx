import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicJobByIdAction } from "@/lib/actions/jobs";
import JobDetailsClient from "./JobDetailsClient";

interface PageProps {
  params: Promise<{
    companySlug: string;
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companySlug, jobId } = await params;
  const job = await getPublicJobByIdAction(companySlug, jobId);

  if (!job) {
    return { title: "Job Requisition Not Found" };
  }

  return {
    title: `${job.title} at ${job.company.name} | Careers`,
    description: job.summary || job.description || `Apply for ${job.title} at ${job.company.name}.`,
    openGraph: {
      title: `${job.title} | ${job.company.name} Careers`,
      description: job.summary || `Open job opportunity at ${job.company.name}.`,
    },
  };
}

export default async function PublicJobDetailsPage({ params }: PageProps) {
  const { companySlug, jobId } = await params;
  const job = await getPublicJobByIdAction(companySlug, jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailsClient companySlug={companySlug} job={job} />;
}
