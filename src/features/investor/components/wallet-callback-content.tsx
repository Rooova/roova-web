"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyDeposit } from "@/features/investor/api";
import { investorKeys } from "@/features/investor/queries";
import { formatNairaFull } from "@/lib/utils";

export function WalletCallbackContent({ reference }: { reference: string }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["investor", "deposit-verify", reference],
    queryFn: () => verifyDeposit(reference),
    retry: 1,
  });

  useEffect(() => {
    if (data?.status === "SUCCESS") {
      queryClient.invalidateQueries({ queryKey: investorKeys.wallet() });
      queryClient.invalidateQueries({ queryKey: investorKeys.walletTransactions() });
    }
  }, [data?.status, queryClient]);

  if (isPending) {
    return (
      <div className="shadow-soft flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Confirming your deposit…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="shadow-soft flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center">
        <XCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t confirm this deposit. If you completed payment, check your wallet balance
          in a moment.
        </p>
        <Link href="/investor/wallet" className="font-medium text-primary hover:text-primary/80">
          Back to wallet
        </Link>
      </div>
    );
  }

  if (data.status === "SUCCESS") {
    return (
      <div className="shadow-soft flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" />
        <p className="font-medium text-foreground">
          Deposit of {formatNairaFull(data.amount)} confirmed.
        </p>
        <Link href="/investor/wallet" className="font-medium text-primary hover:text-primary/80">
          Back to wallet
        </Link>
      </div>
    );
  }

  return (
    <div className="shadow-soft flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center">
      <XCircle className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        This payment is {data.status === "PENDING" ? "still pending" : data.status.toLowerCase()}.
        {data.status === "PENDING" && " If you just paid, refresh this page in a moment."}
      </p>
      <Link href="/investor/wallet" className="font-medium text-primary hover:text-primary/80">
        Back to wallet
      </Link>
    </div>
  );
}
