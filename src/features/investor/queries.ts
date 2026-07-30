import { useQuery } from "@tanstack/react-query";
import {
  getProperties,
  getProperty,
  getMyInvestments,
  getWallet,
  getWalletTransactions,
} from "@/features/investor/api";

export const investorKeys = {
  all: ["investor"] as const,
  properties: () => [...investorKeys.all, "properties"] as const,
  property: (id: string) => [...investorKeys.all, "properties", id] as const,
  investments: () => [...investorKeys.all, "investments"] as const,
  wallet: () => [...investorKeys.all, "wallet"] as const,
  walletTransactions: () => [...investorKeys.all, "wallet-transactions"] as const,
};

export function useInvestorProperties() {
  return useQuery({ queryKey: investorKeys.properties(), queryFn: getProperties });
}

export function useInvestorProperty(id: string) {
  return useQuery({ queryKey: investorKeys.property(id), queryFn: () => getProperty(id) });
}

export function useMyInvestments() {
  return useQuery({ queryKey: investorKeys.investments(), queryFn: getMyInvestments });
}

export function useWallet() {
  return useQuery({ queryKey: investorKeys.wallet(), queryFn: getWallet });
}

export function useWalletTransactions() {
  return useQuery({ queryKey: investorKeys.walletTransactions(), queryFn: getWalletTransactions });
}
