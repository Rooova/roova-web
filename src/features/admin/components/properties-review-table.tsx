"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdminProperties } from "@/features/admin/queries";
import { useApproveProperty, useRejectProperty } from "@/features/admin/mutations";
import { formatNairaCompact } from "@/lib/utils";
import type { PropertyStatus } from "@/features/admin/schemas";

const FILTERS: { value: "all" | PropertyStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "PENDING_REVIEW", label: "Pending" },
  { value: "LIVE", label: "Live" },
  { value: "REJECTED", label: "Rejected" },
  { value: "FUNDED", label: "Funded" },
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

function RejectAction({ propertyId }: { propertyId: string }) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const rejectProperty = useRejectProperty();

  function handleReject() {
    if (!reason.trim()) return;
    rejectProperty.mutate(
      { id: propertyId, reason: reason.trim() },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          Reject
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-3">
        <p className="px-1 text-sm font-medium text-foreground">Reason for rejection</p>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain what needs to change…"
        />
        <Button
          size="sm"
          className="w-full"
          disabled={!reason.trim() || rejectProperty.isPending}
          onClick={handleReject}
        >
          {rejectProperty.isPending ? "Rejecting…" : "Confirm rejection"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function PropertiesReviewTable() {
  const [filter, setFilter] = useState<"all" | PropertyStatus>("PENDING_REVIEW");
  const { data, isPending, isError, refetch } = useAdminProperties(
    filter === "all" ? undefined : filter,
  );
  const approveProperty = useApproveProperty();

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

      {data && data.length === 0 && (
        <EmptyState
          icon={Building2}
          title="Nothing here"
          description="No properties match this filter."
        />
      )}

      {data && data.length > 0 && (
        <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Agency</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Target</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((property) => {
                  const status = STATUS_BADGE[property.status];
                  return (
                    <tr key={property.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{property.title}</p>
                        <p className="text-xs text-muted-foreground">{property.location}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {property.agencyId}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        {formatNairaCompact(property.target)}
                      </td>
                      <td className="px-5 py-4">
                        {property.status === "PENDING_REVIEW" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={approveProperty.isPending}
                              onClick={() => approveProperty.mutate(property.id)}
                            >
                              Approve
                            </Button>
                            <RejectAction propertyId={property.id} />
                          </div>
                        )}
                      </td>
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
