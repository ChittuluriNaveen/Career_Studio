import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function verifyCompanyAccess(requestedSlug: string) {
  const session = await auth();
  if (!session?.user?.companyId) {
    redirect("/login");
  }

  const userCompany = await db.company.findUnique({
    where: { id: session.user.companyId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      bannerUrl: true,
      industry: true,
      companySize: true,
      location: true,
      description: true,
      website: true,
      cultureVideoUrl: true,
      primaryColor: true,
      secondaryColor: true,
    },
  });

  if (!userCompany) {
    redirect("/login");
  }

  // Tenant Isolation Check:
  // If the URL requested companySlug does not match the authenticated user's company slug,
  // block cross-tenant access and redirect to the user's dashboard.
  if (userCompany.slug !== requestedSlug) {
    redirect(`/dashboard`);
  }

  return { session, company: userCompany };
}
