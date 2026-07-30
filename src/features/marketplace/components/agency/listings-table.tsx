"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { useMyListings } from "@/features/marketplace/queries";
import { formatNairaCompact } from "@/lib/utils";
import type { ListingStatus } from "@/features/marketplace/schemas";

const STATUS_BADGE: Record<
  ListingStatus,
  { label: string; variant: "success" | "warning" | "outline" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  UNDER_OFFER: { label: "Under offer", variant: "warning" },
  SOLD: { label: "Sold", variant: "outline" },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" },
};

export function AgencyListingsTable() {
  const { data, isPending, isError, refetch } = useMyListings();

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Home}
        title="No listings yet"
        description="Create your first direct-sale listing."
      />
    );
  }

  return (
    <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Property</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Plan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((listing) => {
              const status = STATUS_BADGE[listing.status];
              return (
                <tr key={listing.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={`/agency/marketplace/${listing.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{listing.location}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {formatNairaCompact(listing.price)}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{listing.paymentPlanType}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
