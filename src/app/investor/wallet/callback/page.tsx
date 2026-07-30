import type { Metadata } from "next";
import { WalletCallbackContent } from "@/features/investor/components/wallet-callback-content";

export const metadata: Metadata = {
  title: "Confirming deposit — Roova",
};

export default async function WalletCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <div className="mx-auto max-w-md py-12">
        <p className="text-center text-sm text-muted-foreground">Missing payment reference.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <WalletCallbackContent reference={reference} />
    </div>
  );
}
