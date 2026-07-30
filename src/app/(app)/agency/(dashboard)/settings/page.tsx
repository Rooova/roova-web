import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/features/agency/components/settings/settings-form";

export const metadata: Metadata = {
  title: "Settings — Agency Dashboard | Roova",
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Update your agency profile and payout details." />
      <SettingsForm />
    </div>
  );
}
