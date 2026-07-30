"use client";

import { useState, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useInvestorProperty } from "@/features/investor/queries";
import { useWallet } from "@/features/investor/queries";
import { useInvest } from "@/features/investor/mutations";
import { formatNairaFull } from "@/lib/utils";

export function PropertyInvestDetail({ id }: { id: string }) {
  const { data: property, isPending, isError, refetch } = useInvestorProperty(id);
  const { data: wallet } = useWallet();
  const invest = useInvest();
  const [shares, setShares] = useState("1");
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!property) {
    return (
      <EmptyState
        icon={Building2}
        title="Property not found"
        description="This listing doesn't exist or isn't open for investment."
      />
    );
  }

  const percent =
    property.target > 0 ? Math.round((property.raised / property.target) * 100) : 0;
  const sharesCount = Number(shares) || 0;
  const totalAmount = sharesCount * property.sharePrice;
  const canInvest = property.status === "LIVE";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (sharesCount <= 0) {
      setError("Enter a number of shares greater than zero");
      return;
    }
    if (wallet && totalAmount > wallet.availableBalance) {
      setError("Your wallet balance is too low for this investment — deposit more first.");
      return;
    }
    setError(null);
    invest.mutate({ propertyId: property.id, shares: sharesCount });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="shadow-soft rounded-2xl bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {property.location}
              </p>
              <h1 className="mt-1 text-xl font-medium tracking-[-0.02em] text-foreground">
                {property.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{property.tier}</p>
            </div>
            <Badge variant={property.status === "FUNDED" ? "primary" : "success"}>
              {property.status === "FUNDED" ? "Funded" : "Live"}
            </Badge>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Raised</p>
              <p className="mt-1 font-medium text-foreground">
                {formatNairaFull(property.raised)} of {formatNairaFull(property.target)}
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

          {property.description && (
            <p className="mt-4 text-sm text-muted-foreground">{property.description}</p>
          )}
        </div>
      </div>

      <div>
        {!canInvest ? (
          <p className="shadow-soft rounded-2xl bg-card p-6 text-sm text-muted-foreground">
            This property is no longer accepting new investments.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="shadow-soft space-y-4 rounded-2xl bg-card p-6"
          >
            <h3 className="font-medium tracking-[-0.01em] text-foreground">Invest</h3>

            {wallet && (
              <p className="text-xs text-muted-foreground">
                Wallet balance: {formatNairaFull(wallet.availableBalance)}
              </p>
            )}

            <FormField label="Number of shares" htmlFor="shares" error={error ?? undefined}>
              <Input
                id="shares"
                type="number"
                min="1"
                value={shares}
                onChange={(event) => {
                  setShares(event.target.value);
                  setError(null);
                }}
              />
            </FormField>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Share price</span>
              <span className="text-foreground">{formatNairaFull(property.sharePrice)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatNairaFull(totalAmount)}</span>
            </div>

            <Button type="submit" className="w-full" disabled={invest.isPending}>
              {invest.isPending ? "Investing…" : "Confirm investment"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
