"use client";

import { useState, type FormEvent } from "react";
import { Wallet as WalletIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useWallet, useWalletTransactions } from "@/features/investor/queries";
import { useCreateDeposit } from "@/features/investor/mutations";
import { createDepositInputSchema } from "@/features/investor/schemas";
import { firstFieldErrors, formatNairaFull } from "@/lib/utils";

export function WalletPanel() {
  const { data: wallet, isPending: walletPending } = useWallet();
  const { data: transactions, isPending: txPending, isError, refetch } = useWalletTransactions();
  const createDeposit = useCreateDeposit();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = createDepositInputSchema.safeParse({ amount });
    if (!result.success) {
      setError(firstFieldErrors(result.error).amount ?? "Enter a valid amount");
      return;
    }
    setError(null);
    createDeposit.mutate(result.data, {
      onSuccess: (data) => {
        window.location.href = data.authorizationUrl;
      },
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="shadow-soft grid grid-cols-2 gap-6 rounded-2xl bg-card p-6">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Available</p>
            {walletPending ? (
              <Skeleton className="mt-2 h-8 w-32" />
            ) : (
              <p className="mt-1 text-2xl font-medium text-foreground">
                {formatNairaFull(wallet?.availableBalance ?? 0)}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Escrowed (in active investments)
            </p>
            {walletPending ? (
              <Skeleton className="mt-2 h-8 w-32" />
            ) : (
              <p className="mt-1 text-2xl font-medium text-foreground">
                {formatNairaFull(wallet?.escrowedBalance ?? 0)}
              </p>
            )}
          </div>
        </div>

        <div className="shadow-soft overflow-hidden rounded-2xl bg-card">
          <div className="px-6 py-4">
            <h3 className="font-medium tracking-[-0.01em] text-foreground">Transaction history</h3>
          </div>

          {txPending && (
            <div className="space-y-2 px-6 pb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <div className="px-6 pb-6">
              <ErrorState onRetry={() => refetch()} />
            </div>
          )}

          {transactions && transactions.length === 0 && (
            <p className="px-6 pb-6 text-sm text-muted-foreground">No transactions yet.</p>
          )}

          {transactions && transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-3 text-foreground">{transaction.type}</td>
                      <td className="px-6 py-3 text-foreground">
                        {formatNairaFull(transaction.amount)}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{transaction.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="shadow-soft h-fit space-y-4 rounded-2xl bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <WalletIcon className="h-4 w-4 text-primary" />
          <h3 className="font-medium tracking-[-0.01em] text-foreground">Deposit funds</h3>
        </div>

        <FormField label="Amount (₦)" htmlFor="amount" error={error ?? undefined}>
          <Input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError(null);
            }}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={createDeposit.isPending}>
          {createDeposit.isPending ? "Redirecting…" : "Deposit via Paystack"}
        </Button>
      </form>
    </div>
  );
}
