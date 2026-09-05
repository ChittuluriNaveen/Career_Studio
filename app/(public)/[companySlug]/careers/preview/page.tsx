import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ companySlug: string }>;
}

export default async function LegacyPreviewRedirect({ params }: PageProps) {
  const { companySlug } = await params;
  redirect(`/company/${companySlug}/preview`);
}
