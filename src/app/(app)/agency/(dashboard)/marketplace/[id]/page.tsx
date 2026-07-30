import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AgencyListingDetail } from "@/features/marketplace/components/agency/listing-detail";

export const metadata: Metadata = {
  title: "Listing details — Agency Dashboard | Roova",
};

export default async function AgencyMarketplaceListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Listing details" />
      <AgencyListingDetail id={id} />
    </div>
  );
}
