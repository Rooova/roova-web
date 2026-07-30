"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useInvestorProperties } from "@/features/investor/queries";
import { formatNairaCompact } from "@/lib/utils";

export function PropertyBrowseGrid() {
  const { data, isPending, isError, refetch } = useInvestorProperties();

  if (isPending) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties open for investment"
        description="Check back soon for new funding rounds."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((property) => {
        const percent =
          property.target > 0 ? Math.round((property.raised / property.target) * 100) : 0;
        return (
          <Link
            key={property.id}
            href={`/investor/properties/${property.id}`}
            className="shadow-soft group flex flex-col gap-3 rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground group-hover:text-primary">
                  {property.title}
                </p>
                <p className="text-xs text-muted-foreground">{property.location}</p>
              </div>
              <Badge variant={property.status === "FUNDED" ? "primary" : "success"}>
                {property.status === "FUNDED" ? "Funded" : "Live"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatNairaCompact(property.raised)} raised</span>
                <span>{percent}%</span>
              </div>
              <Progress value={percent} />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Share price</span>
              <span className="font-medium text-foreground">
                {formatNairaCompact(property.sharePrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Projected yield</span>
              <span className="font-medium text-success">{property.yieldPct}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
