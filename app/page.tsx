import { Metadata } from "next";
import { auth } from "@/lib/auth";
import LandingPageClient from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
  title: "Build a Careers Page Your Candidates Remember",
  description:
    "Create beautiful, responsive careers pages, manage jobs and deliver a better candidate experience — without relying on developers.",
};

export default async function RootHomePage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.companyId);
  const companySlug = session?.user?.companySlug || null;

  return (
    <LandingPageClient
      isAuthenticated={isAuthenticated}
      companySlug={companySlug}
    />
  );
}

