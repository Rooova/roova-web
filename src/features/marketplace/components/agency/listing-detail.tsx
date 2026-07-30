"use client";

import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyListingFull } from "@/features/marketplace/queries";
import {
  useWithdrawListing,
  useMarkListingSold,
  useAcceptOffer,
  useRejectOffer,
} from "@/features/marketplace/mutations";
import { formatNairaFull } from "@/lib/utils";
import type { ListingStatus, OfferStatus } from "@/features/marketplace/schemas";

const LISTING_STATUS_BADGE: Record<
  ListingStatus,
  { label: string; variant: "success" | "warning" | "outline" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  UNDER_OFFER: { label: "Under offer", variant: "warning" },
  SOLD: { label: "Sold", variant: "outline" },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" },
};

const OFFER_STATUS_BADGE: Record<
  OfferStatus,
  { label: string; variant: "success" | "warning" | "outline" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" },
};

export function AgencyListingDetail({ id }: { id: string }) {
  const { data, isPending, isError, refetch } = useMyListingFull(id);
  const withdrawListing = useWithdrawListing();
  const markListingSold = useMarkListingSold();
  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data) {
    return (
      <EmptyState
        icon={Home}
        title="Listing not found"
        description="This listing doesn't exist or may have been removed."
      />
    );
  }

  const { listing, offers } = data;
  const status = LISTING_STATUS_BADGE[listing.status];

  return (
    <div className="space-y-6">
      <div className="shadow-soft rounded-2xl bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {listing.location}
            </p>
            <h2 className="mt-1 text-xl font-medium tracking-[-0.01em] text-foreground">
              {listing.title}
            </h2>
            <p className="mt-0.5 font-medium text-foreground">
              {formatNairaFull(listing.price)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <div className="flex gap-2">
              {(listing.status === "ACTIVE" || listing.status === "UNDER_OFFER") && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={withdrawListing.isPending}
                  onClick={() => withdrawListing.mutate(listing.id)}
                >
                  Withdraw
                </Button>
              )}
              {listing.status === "UNDER_OFFER" && (
                <Button
                  size="sm"
                  disabled={markListingSold.isPending}
                  onClick={() => markListingSold.mutate(listing.id)}
                >
                  Mark sold
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
        <div className="px-6 py-4">
          <h3 className="font-medium tracking-[-0.01em] text-foreground">Offers</h3>
        </div>
        {offers.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">No offers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => {
                  const offerStatus = OFFER_STATUS_BADGE[offer.status];
                  return (
                    <tr key={offer.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-3 text-foreground">
                        {formatNairaFull(offer.offerAmount)}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{offer.paymentPlan}</td>
                      <td className="px-6 py-3">
                        <Badge variant={offerStatus.variant}>{offerStatus.label}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        {offer.status === "PENDING" && listing.status === "ACTIVE" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={acceptOffer.isPending}
                              onClick={() =>
                                acceptOffer.mutate({ listingId: listing.id, offerId: offer.id })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={rejectOffer.isPending}
                              onClick={() =>
                                rejectOffer.mutate({ listingId: listing.id, offerId: offer.id })
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
