import type { Metadata } from "next";
import { ListingDetail } from "@/features/marketplace/components/public/listing-detail";

export const metadata: Metadata = {
  title: "Listing — Roova Marketplace",
};

export default async function MarketplaceListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <ListingDetail id={id} />
    </div>
  );
}
