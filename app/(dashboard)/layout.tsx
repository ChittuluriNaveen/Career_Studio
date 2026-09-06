import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Palette,
  ExternalLink,
  Eye,
  LogOut,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col page-transition">
      {children}
    </div>
  );
}
