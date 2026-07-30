import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyDetailContent } from "@/features/agency/components/properties/property-detail-content";
import { properties } from "@/features/agency/data";

// Best-effort: this only resolves for the seed properties, since anything created
// via the (client-side, simulated) create-listing mutation lives in the browser's
// copy of the mock data, not the server's. PropertyDetailContent handles the
// "doesn't exist" case itself once the client-side query resolves.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  return { title: property ? `${property.title} — Agency Dashboard | Roova` : "Property — Roova" };
}

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
