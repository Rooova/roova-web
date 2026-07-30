import { z } from "zod";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  propertySchema,
  investmentSchema,
  investmentPropertySummarySchema,
  walletSchema,
  walletTransactionSchema,
  depositSchema,
  type Property,
  type Investment,
  type CreateInvestmentInput,
  type CreateDepositInput,
} from "@/features/investor/schemas";

export async function getProperties() {
  const res = await apiGet<unknown[]>("/properties");
  return z.array(propertySchema).parse(res);
}

export async function getProperty(id: string): Promise<Property> {
  const res = await apiGet(`/properties/${id}`);
  return propertySchema.parse(res);
}

export async function invest(input: CreateInvestmentInput): Promise<Investment> {
  const res = await apiPost("/investments", input);
  return investmentSchema.parse(res);
}

export async function getMyInvestments() {
  const res = await apiGet<{ investment: unknown; property: unknown }[]>("/investments/mine");
  return res.map((row) => ({
    investment: investmentSchema.parse(row.investment),
    property: row.property ? investmentPropertySummarySchema.parse(row.property) : null,
  }));
}

export async function getWallet() {
  const res = await apiGet("/wallet");
  return walletSchema.parse(res);
}

export async function getWalletTransactions() {
  const res = await apiGet<unknown[]>("/wallet/transactions");
  return z.array(walletTransactionSchema).parse(res);
}

export async function createDeposit(input: CreateDepositInput) {
  return apiPost<{ reference: string; authorizationUrl: string }>("/wallet/deposits", input);
}

export async function verifyDeposit(reference: string) {
  const res = await apiGet(`/wallet/deposits/${reference}/verify`);
  return depositSchema.parse(res);
}
