interface StructuredDataProps {
  company: {
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    jobType: string;
    location: { name: string };
    createdAt: Date | string;
  }>;
}

export default function StructuredData({ company, jobs }: StructuredDataProps) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://careers.whitecarrot.io";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: `${baseUrl}/${company.slug}/careers`,
    logo: company.logoUrl || undefined,
  };

  // JobPosting Schema array
  const jobPostingSchemas = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: company.name,
      value: job.id,
    },
    datePosted: new Date(job.createdAt).toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
      sameAs: `${baseUrl}/${company.slug}/careers`,
      logo: company.logoUrl || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.name,
      },
    },
    employmentType: job.jobType === "FULL_TIME" ? "FULL_TIME" : "OTHER",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {jobPostingSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
