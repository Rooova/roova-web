import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ListingGrid } from "@/features/marketplace/components/public/listing-grid";

export const metadata: Metadata = {
  title: "Marketplace — Roova",
};

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-12">
      <PageHeader
        title="Marketplace"
        subtitle="Buy a home outright or on an installment plan — no fractional shares."
      />
      <ListingGrid />
    </div>
  );
}
