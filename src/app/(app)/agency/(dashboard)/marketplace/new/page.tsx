import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CreateListingForm } from "@/features/marketplace/components/agency/create-listing-form";

export const metadata: Metadata = {
  title: "New listing — Agency Dashboard | Roova",
};

export default function NewMarketplaceListingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New listing" subtitle="Create a direct-sale property listing." />
      <CreateListingForm />
    </div>
  );
}
