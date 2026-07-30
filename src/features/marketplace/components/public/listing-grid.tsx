"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { useListings } from "@/features/marketplace/queries";
import { formatNairaCompact } from "@/lib/utils";

export function ListingGrid() {
  const { data, isPending, isError, refetch } = useListings();

  if (isPending) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
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
        description="Check back soon for new direct-sale properties."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((listing) => (
        <Link
          key={listing.id}
          href={`/marketplace/${listing.id}`}
          className="shadow-soft group flex flex-col overflow-hidden rounded-2xl bg-card transition-transform hover:-translate-y-0.5"
        >
          <div className="flex h-40 items-center justify-center bg-muted">
            {listing.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Home className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground group-hover:text-primary">
                  {listing.title}
                </p>
                <p className="text-xs text-muted-foreground">{listing.location}</p>
              </div>
              <Badge variant="outline">
                {listing.bedrooms} bed &middot; {listing.bathrooms} bath
              </Badge>
            </div>
            <p className="mt-auto font-medium text-foreground">
              {formatNairaCompact(listing.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              {listing.paymentPlanType === "FULL_PAYMENT"
                ? "Full payment only"
                : listing.paymentPlanType === "BOTH"
                  ? "Full payment or installments"
                  : "Installments available"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
