import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { InvestorSidebar } from "@/features/investor/components/investor-sidebar";

export default async function InvestorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession("INVESTOR");
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      <InvestorSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
