import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyDetailContent } from "@/features/agency/components/properties/property-detail-content";

export const metadata: Metadata = {
  title: "Property details — Agency Dashboard | Roova",
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Property details" />
      <PropertyDetailContent id={id} />
    </div>
  );
}
