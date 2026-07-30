import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PortfolioList } from "@/features/investor/components/portfolio-list";

export const metadata: Metadata = {
  title: "Portfolio — Investor | Roova",
};

export default function InvestorPortfolioPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Portfolio" subtitle="Your shares and investment activity." />
      <PortfolioList />
    </div>
  );
}
