import { AgencySidebar } from "@/features/agency/components/agency-sidebar";
import { AgencyTopbar } from "@/features/agency/components/agency-topbar";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AgencySidebar />
      <div className="flex flex-1 flex-col">
        <AgencyTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
