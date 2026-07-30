import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PropertiesReviewTable } from "@/features/admin/components/properties-review-table";

export const metadata: Metadata = {
  title: "Property review — Admin | Roova",
};

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Property review"
        subtitle="Approve or reject listings submitted by agencies."
      />
      <PropertiesReviewTable />
    </div>
  );
}
