import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicCareersData } from "@/lib/actions/public";
import PageRenderer from "@/components/preview/PageRenderer";
import StructuredData from "@/components/candidate/StructuredData";

interface PageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getPublicCareersData(resolvedParams.companySlug);

  if (!data) {
    return {
      title: "Careers Page Not Found",
    };
  }

  const { company } = data;

  return {
    title: `Careers at ${company.name} | Join Our Team`,
    description: company.tagline || company.aboutText || `Explore open roles and career opportunities at ${company.name}.`,
    openGraph: {
      title: `Careers at ${company.name}`,
      description: company.tagline || `Join our team at ${company.name}.`,
      images: company.bannerUrl ? [{ url: company.bannerUrl }] : [],
    },
  };
}

export default async function PublicCareersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getPublicCareersData(resolvedParams.companySlug, false);

  if (!data) {
    notFound();
  }

  return (
    <>
      <StructuredData company={data.company} jobs={data.jobs} />
      <PageRenderer
        company={data.company}
        sections={data.sections}
        departments={data.departments}
        locations={data.locations}
        jobs={data.jobs}
        isPreviewMode={false}
      />
    </>
  );
}
