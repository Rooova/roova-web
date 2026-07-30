import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PropertiesTable } from "@/features/agency/components/properties/properties-table";

export const metadata: Metadata = {
  title: "Properties — Agency Dashboard | Roova",
};

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        subtitle="Manage your listings and track funding progress."
        action={
          <Link href="/agency/properties/new" className={buttonVariants({ size: "sm" })}>
            List a property
          </Link>
        }
      />
      <PropertiesTable />
    </div>
  );
}
