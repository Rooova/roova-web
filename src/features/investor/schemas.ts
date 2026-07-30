import { z } from "zod";

export { agencyPropertySchema as propertySchema } from "@/features/agency/schemas";
export type { AgencyProperty as Property } from "@/features/agency/schemas";

export const investmentStatusSchema = z.enum(["PENDING", "CONFIRMED", "REFUNDED", "CANCELLED"]);
export type InvestmentStatus = z.infer<typeof investmentStatusSchema>;

export const investmentSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  shares: z.number(),
  pricePerShare: z.number(),
  totalAmount: z.number(),
  status: investmentStatusSchema,
  createdAt: z.string(),
});
export type Investment = z.infer<typeof investmentSchema>;

export const investmentPropertySummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string(),
  status: z.string(),
  tier: z.string(),
});
export type InvestmentPropertySummary = z.infer<typeof investmentPropertySummarySchema>;

export const createInvestmentInputSchema = z.object({
  propertyId: z.string(),
  shares: z.coerce.number().int().positive("Enter the number of shares"),
});
export type CreateInvestmentInput = z.infer<typeof createInvestmentInputSchema>;

export const walletSchema = z.object({
  availableBalance: z.number(),
  escrowedBalance: z.number(),
  currency: z.string(),
});
export type Wallet = z.infer<typeof walletSchema>;

export const walletTransactionTypeSchema = z.enum(["DEPOSIT", "INVEST", "REFUND"]);
export const walletTransactionSchema = z.object({
  id: z.string(),
  type: walletTransactionTypeSchema,
  amount: z.number(),
  depositId: z.string().nullable(),
  investmentId: z.string().nullable(),
  availableBalanceAfter: z.number().nullable(),
  escrowedBalanceAfter: z.number().nullable(),
  createdAt: z.string(),
});
export type WalletTransaction = z.infer<typeof walletTransactionSchema>;

export const depositStatusSchema = z.enum(["PENDING", "SUCCESS", "FAILED", "MISMATCHED"]);
export const depositSchema = z.object({
  reference: z.string(),
  amount: z.number(),
  status: depositStatusSchema,
  verifiedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type Deposit = z.infer<typeof depositSchema>;

export const createDepositInputSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than zero"),
});
export type CreateDepositInput = z.infer<typeof createDepositInputSchema>;
