import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyBrowseGrid } from "@/features/investor/components/property-browse-grid";

export const metadata: Metadata = {
  title: "Browse properties — Investor | Roova",
};

export default function InvestorBrowsePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Browse properties" subtitle="Fractional investment opportunities." />
      <PropertyBrowseGrid />
    </div>
  );
}
