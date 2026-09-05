import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRootPage() {
  const session = await auth();
  if (!session?.user?.companyId) {
    redirect("/login");
  }

  // Redirect directly to the single-page Career Studio Builder
  redirect("/dashboard/editor");
}
