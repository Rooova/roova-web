import type { Metadata } from "next";
import { PropertyInvestDetail } from "@/features/investor/components/property-invest-detail";

export const metadata: Metadata = {
  title: "Property details — Investor | Roova",
};

export default async function InvestorPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PropertyInvestDetail id={id} />;
}
