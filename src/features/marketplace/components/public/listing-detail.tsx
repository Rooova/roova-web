"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { useListing } from "@/features/marketplace/queries";
import { useMe } from "@/features/auth/queries";
import { formatNairaFull } from "@/lib/utils";
import { MakeOfferForm } from "@/features/marketplace/components/public/make-offer-form";

const STATUS_BADGE = {
  ACTIVE: { label: "Available", variant: "success" as const },
  UNDER_OFFER: { label: "Under offer", variant: "warning" as const },
  SOLD: { label: "Sold", variant: "outline" as const },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" as const },
};

export function ListingDetail({ id }: { id: string }) {
  const { data: listing, isPending, isError, refetch } = useListing(id);
  const { data: investor } = useMe("INVESTOR");

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!listing) {
    return (
      <EmptyState
        icon={Home}
        title="Listing not found"
        description="This listing doesn't exist or may have been removed."
      />
    );
  }

  const status = STATUS_BADGE[listing.status];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
          <div className="flex h-72 items-center justify-center bg-muted">
            {listing.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <Home className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {listing.location}
                </p>
                <h1 className="mt-1 text-xl font-medium tracking-[-0.02em] text-foreground">
                  {listing.title}
                </h1>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <p className="mt-4 text-2xl font-medium text-foreground">
              {formatNairaFull(listing.price)}
            </p>

            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <span>{listing.bedrooms} bedrooms</span>
              <span>{listing.bathrooms} bathrooms</span>
              <span>{listing.sizeSqm} sqm</span>
            </div>

            {listing.description && (
              <p className="mt-4 text-sm text-muted-foreground">{listing.description}</p>
            )}

            {listing.paymentPlanType !== "FULL_PAYMENT" && (
              <div className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
                Installments available
                {listing.downPaymentPct !== null && ` — ${listing.downPaymentPct}% down payment`}
                {listing.installmentDurationMonths.length > 0 &&
                  `, over ${listing.installmentDurationMonths.join("/")} months`}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        {listing.status !== "ACTIVE" ? (
          <p className="shadow-soft rounded-2xl bg-card p-6 text-sm text-muted-foreground">
            This listing is no longer accepting offers.
          </p>
        ) : investor ? (
          <MakeOfferForm listing={listing} />
        ) : (
          <div className="shadow-soft space-y-3 rounded-2xl bg-card p-6 text-sm text-muted-foreground">
            <p>Log in as an investor to make an offer on this property.</p>
            <Link
              href="/login"
              className="inline-block font-medium text-primary hover:text-primary/80"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
