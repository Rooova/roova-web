import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationsContent } from "@/features/agency/components/notifications/notifications-content";

export const metadata: Metadata = {
  title: "Notifications — Agency Dashboard | Roova",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay on top of funding activity and account alerts."
      />
      <NotificationsContent />
    </div>
  );
}
