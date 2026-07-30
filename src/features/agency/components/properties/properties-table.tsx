"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProperties } from "@/features/agency/queries";
import { formatNairaCompact } from "@/lib/utils";
import type { PropertyStatus } from "@/features/agency/schemas";

const FILTERS: { value: "all" | PropertyStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "LIVE", label: "Live" },
  { value: "FUNDED", label: "Funded" },
  { value: "PENDING_REVIEW", label: "Pending" },
  { value: "DRAFT", label: "Draft" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CLOSED_UNFUNDED", label: "Closed" },
];

const STATUS_BADGE: Record<
  PropertyStatus,
  { label: string; variant: "success" | "primary" | "outline" | "warning" | "destructive" }
> = {
  LIVE: { label: "Live", variant: "success" },
  FUNDED: { label: "Funded", variant: "primary" },
  DRAFT: { label: "Draft", variant: "outline" },
  PENDING_REVIEW: { label: "Pending review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  CLOSED_UNFUNDED: { label: "Closed (unfunded)", variant: "outline" },
};

export function PropertiesTable() {
  const { data, isPending, isError, refetch } = useProperties();
  const [filter, setFilter] = useState<"all" | PropertyStatus>("all");

  const filtered = data?.filter((p) => filter === "all" || p.status === filter) ?? [];

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList className="shadow-soft bg-card">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && filtered.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No properties here"
          description="Try a different filter."
        />
      )}

      {filtered.length > 0 && (
        <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Funding</th>
                  <th className="px-5 py-3 font-medium">Investors</th>
                  <th className="px-5 py-3 font-medium">Yield</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((property) => {
                  const percent =
                    property.target > 0
                      ? Math.round((property.raised / property.target) * 100)
                      : 0;
                  const status = STATUS_BADGE[property.status];
                  return (
                    <tr key={property.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <Link
                          href={`/agency/properties/${property.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {property.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">{property.location}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-40 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatNairaCompact(property.raised)}</span>
                            <span>{percent}%</span>
                          </div>
                          <Progress value={percent} />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground">{property.investors}</td>
                      <td className="px-5 py-4 text-success">{property.yieldPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
