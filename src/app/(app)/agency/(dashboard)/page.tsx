import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OverviewContent } from "@/features/agency/components/overview/overview-content";

export const metadata: Metadata = {
  title: "Overview — Agency Dashboard | Roova",
};

export default function AgencyOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Welcome back, Adunni Properties." />
      <OverviewContent />
    </div>
  );
}
