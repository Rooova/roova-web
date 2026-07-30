"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Building2 } from "lucide-react";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/features/agency/queries";
import { useSubmitProperty } from "@/features/agency/mutations";
import { formatNairaCompact, formatNairaFull } from "@/lib/utils";
import type { PropertyStatus } from "@/features/agency/schemas";

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

const SUBMITTABLE_STATUSES: PropertyStatus[] = ["DRAFT", "REJECTED"];

export function PropertyDetailContent({ id }: { id: string }) {
  const { data, isPending, isError, refetch } = useProperty(id);
  const submitProperty = useSubmitProperty();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data) {
    return (
      <EmptyState
        icon={Building2}
        title="Property not found"
        description="This listing doesn't exist or may have been removed."
      />
    );
  }

  const { property, investors } = data;
  const percent =
    property.target > 0 ? Math.round((property.raised / property.target) * 100) : 0;
  const status = STATUS_BADGE[property.status];

  const chartData = [...investors]
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce<{ date: string; cumulative: number }[]>((acc, investor) => {
      const previous = acc.length ? acc[acc.length - 1].cumulative : 0;
      acc.push({ date: investor.date, cumulative: previous + investor.amount });
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      <div className="shadow-soft rounded-2xl bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {property.location}
            </p>
            <h2 className="mt-1 text-xl font-medium tracking-[-0.01em] text-foreground">
              {property.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{property.tier}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            {SUBMITTABLE_STATUSES.includes(property.status) && (
              <Button
                size="sm"
                disabled={submitProperty.isPending}
                onClick={() => submitProperty.mutate(property.id)}
              >
                {submitProperty.isPending ? "Submitting…" : "Submit for review"}
              </Button>
            )}
          </div>
        </div>

        {property.status === "REJECTED" && property.rejectionReason && (
          <div className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="font-medium">Rejected:</span> {property.rejectionReason}
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Raised</p>
            <p className="mt-1 font-medium text-foreground">
              {formatNairaCompact(property.raised)} of {formatNairaCompact(property.target)}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Investors</p>
            <p className="mt-1 font-medium text-foreground">{property.investors}</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Annual yield</p>
            <p className="mt-1 font-medium text-success">{property.yieldPct}%</p>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percent}% funded</span>
            <span>{property.daysRemaining} days remaining</span>
          </div>
          <Progress value={percent} />
        </div>
      </div>

      <div className="shadow-soft rounded-2xl bg-card p-6">
        <h3 className="font-medium tracking-[-0.01em] text-foreground">Funding activity</h3>
        {chartData.length > 0 ? (
          <div className="mt-4">
            <ChartContainer>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value) => formatNairaCompact(value)}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip content={<ChartTooltip formatValue={(v) => formatNairaCompact(Number(v))} />} />
                <Area
                  dataKey="cumulative"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.12}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No investment activity yet.</p>
        )}
      </div>

      <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
        <div className="px-6 py-4">
          <h3 className="font-medium tracking-[-0.01em] text-foreground">Recent investors</h3>
        </div>
        {investors.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">No investors yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-6 py-3 font-medium">Investor</th>
                  <th className="px-6 py-3 font-medium">Shares</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor) => (
                  <tr key={investor.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3 text-foreground">{investor.name}</td>
                    <td className="px-6 py-3 text-foreground">{investor.shares}</td>
                    <td className="px-6 py-3 text-foreground">
                      {formatNairaFull(investor.amount)}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{investor.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
