import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AddPropertyForm } from "@/features/agency/components/properties/add-property-form";

export const metadata: Metadata = {
  title: "List a property — Agency Dashboard | Roova",
};

export default function NewPropertyPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="List a property"
        subtitle="Submit a new listing for review. It will be saved as a draft."
      />
      <AddPropertyForm />
    </div>
  );
}
