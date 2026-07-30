"use client";

import Link from "next/link";
import { Wallet as WalletIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { useMyInvestments } from "@/features/investor/queries";
import { formatNairaFull } from "@/lib/utils";
import type { InvestmentStatus } from "@/features/investor/schemas";

const STATUS_BADGE: Record<
  InvestmentStatus,
  { label: string; variant: "success" | "warning" | "outline" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "success" },
  REFUNDED: { label: "Refunded", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function PortfolioList() {
  const { data, isPending, isError, refetch } = useMyInvestments();

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
        icon={WalletIcon}
        title="No investments yet"
        description="Browse live properties and make your first investment."
      />
    );
  }

  const totalInvested = data
    .filter((row) => row.investment.status === "CONFIRMED")
    .reduce((sum, row) => sum + row.investment.totalAmount, 0);

  return (
    <div className="space-y-4">
      <div className="shadow-soft rounded-2xl bg-card p-6">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Total invested</p>
        <p className="mt-1 text-2xl font-medium text-foreground">
          {formatNairaFull(totalInvested)}
        </p>
      </div>

      <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Shares</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ investment, property }) => {
                const status = STATUS_BADGE[investment.status];
                return (
                  <tr key={investment.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4">
                      {property ? (
                        <Link
                          href={`/investor/properties/${property.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {property.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unknown property</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-foreground">{investment.shares}</td>
                    <td className="px-5 py-4 text-foreground">
                      {formatNairaFull(investment.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
