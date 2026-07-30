"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyOffers } from "@/features/marketplace/queries";
import { useWithdrawOffer } from "@/features/marketplace/mutations";
import { formatNairaFull } from "@/lib/utils";
import type { OfferStatus } from "@/features/marketplace/schemas";

const STATUS_BADGE: Record<
  OfferStatus,
  { label: string; variant: "success" | "warning" | "outline" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" },
};

export function OffersList() {
  const { data, isPending, isError, refetch } = useMyOffers();
  const withdrawOffer = useWithdrawOffer();

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
        icon={FileText}
        title="No offers yet"
        description="Offers you submit on marketplace listings will appear here."
      />
    );
  }

  return (
    <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Listing</th>
              <th className="px-5 py-3 font-medium">Offer</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ offer, listing }) => {
              const status = STATUS_BADGE[offer.status];
              return (
                <tr key={offer.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    {listing ? (
                      <Link
                        href={`/marketplace/${listing.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {listing.title}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unknown listing</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {formatNairaFull(offer.offerAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    {offer.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={withdrawOffer.isPending}
                        onClick={() => withdrawOffer.mutate(offer.id)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
