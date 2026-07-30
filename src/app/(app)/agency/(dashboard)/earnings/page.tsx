import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EarningsContent } from "@/features/agency/components/earnings/earnings-content";

export const metadata: Metadata = {
  title: "Earnings — Agency Dashboard | Roova",
};

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Earnings" subtitle="Track commission and payout history." />
      <EarningsContent />
    </div>
  );
}
