import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession("ADMIN");
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
