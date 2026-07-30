import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OffersList } from "@/features/investor/components/offers-list";

export const metadata: Metadata = {
  title: "My offers — Investor | Roova",
};

export default function InvestorMarketplaceOffersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My offers" subtitle="Offers you've submitted on marketplace listings." />
      <OffersList />
    </div>
  );
}
