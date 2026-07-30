import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WalletPanel } from "@/features/investor/components/wallet-panel";

export const metadata: Metadata = {
  title: "Wallet — Investor | Roova",
};

export default function InvestorWalletPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Wallet" subtitle="Deposit funds and track your transaction history." />
      <WalletPanel />
    </div>
  );
}
