import { z } from "zod";

export const propertyStatusSchema = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "LIVE",
  "REJECTED",
  "FUNDED",
  "CLOSED_UNFUNDED",
]);
export type PropertyStatus = z.infer<typeof propertyStatusSchema>;

export const agencyPropertySchema = z.object({
  id: z.string(),
  agencyId: z.string(),
  location: z.string(),
  title: z.string(),
  tier: z.string(),
  status: propertyStatusSchema,
  yieldPct: z.number(),
  raised: z.number(),
  target: z.number(),
  investors: z.number(),
  daysRemaining: z.number(),
  sharePrice: z.number(),
  sharesSold: z.number(),
  totalShares: z.number().nullable(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  rejectionReason: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AgencyProperty = z.infer<typeof agencyPropertySchema>;

export const propertyTierSchema = z.enum(["Gold tier", "Silver tier"]);
export type PropertyTier = z.infer<typeof propertyTierSchema>;

export const createPropertyInputSchema = z.object({
  title: z.string().min(3, "Enter a property name"),
  location: z.string().min(2, "Enter a location"),
  tier: propertyTierSchema,
  target: z.coerce.number().positive("Enter a funding target greater than zero"),
  sharePrice: z.coerce.number().positive("Share price must be greater than zero"),
  yieldPct: z.coerce
    .number()
    .positive("Enter a projected annual yield")
    .max(100, "Enter a realistic percentage"),
  daysRemaining: z.coerce
    .number()
    .int("Enter a whole number of days")
    .positive("Enter the funding window in days"),
});
export type CreatePropertyInput = z.infer<typeof createPropertyInputSchema>;

export const overviewStatsSchema = z.object({
  totalRaised: z.number(),
  activeListings: z.number(),
  totalInvestors: z.number(),
  commissionEarned: z.number(),
});
export type OverviewStats = z.infer<typeof overviewStatsSchema>;

export const fundingPointSchema = z.object({
  month: z.string(),
  amount: z.number(),
});
export type FundingPoint = z.infer<typeof fundingPointSchema>;

export const earningsPointSchema = z.object({
  month: z.string(),
  commission: z.number(),
});
export type EarningsPoint = z.infer<typeof earningsPointSchema>;

export const payoutSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  status: z.enum(["paid", "pending"]),
});
export type Payout = z.infer<typeof payoutSchema>;

export const investorRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  shares: z.number(),
  amount: z.number(),
  date: z.string(),
});
export type InvestorRow = z.infer<typeof investorRowSchema>;

export const notificationTypeSchema = z.enum([
  "funding_milestone",
  "new_investor",
  "commission_payout",
  "kyc_alert",
  "system",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});
export type Notification = z.infer<typeof notificationSchema>;

export const agencySettingsSchema = z.object({
  name: z.string().min(2, "Enter an agency name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  payoutBank: z.string().min(2, "Enter a bank name"),
  payoutAccount: z.string().min(4, "Enter an account number"),
});
export type AgencySettings = z.infer<typeof agencySettingsSchema>;
