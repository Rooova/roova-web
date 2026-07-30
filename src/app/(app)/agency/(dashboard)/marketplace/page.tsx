import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { AgencyListingsTable } from "@/features/marketplace/components/agency/listings-table";

export const metadata: Metadata = {
  title: "Marketplace — Agency Dashboard | Roova",
};

export default function AgencyMarketplacePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        subtitle="Direct-sale listings with payment plans."
        action={
          <Link href="/agency/marketplace/new" className={buttonVariants({ size: "sm" })}>
            New listing
          </Link>
        }
      />
      <AgencyListingsTable />
    </div>
  );
}
