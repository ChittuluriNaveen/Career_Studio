import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import BrandThemeEditor from "@/components/editor/BrandThemeEditor";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.companyId) {
    redirect("/login");
  }

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
  });

  if (!company) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Brand Theme & Identity Customization</h1>
        <p className="text-slate-400 text-sm">
          Customize how your company brand, colors, typography, and logo appear on candidate careers pages.
        </p>
      </div>

      <BrandThemeEditor initialCompany={company} />
    </div>
  );
}
