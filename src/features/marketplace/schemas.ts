import { z } from "zod";

export const listingStatusSchema = z.enum(["ACTIVE", "UNDER_OFFER", "SOLD", "WITHDRAWN"]);
export type ListingStatus = z.infer<typeof listingStatusSchema>;

export const paymentPlanTypeSchema = z.enum(["FULL_PAYMENT", "INSTALLMENT", "BOTH"]);
export type PaymentPlanType = z.infer<typeof paymentPlanTypeSchema>;

export const listingSchema = z.object({
  id: z.string(),
  agencyId: z.string(),
  title: z.string(),
  location: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sizeSqm: z.number(),
  images: z.array(z.string()),
  status: listingStatusSchema,
  paymentPlanType: paymentPlanTypeSchema,
  downPaymentPct: z.number().nullable(),
  installmentDurationMonths: z.array(z.number()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Listing = z.infer<typeof listingSchema>;

export const createListingInputSchema = z.object({
  title: z.string().min(3, "Enter a property name"),
  location: z.string().min(2, "Enter a location"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Enter a price greater than zero"),
  bedrooms: z.coerce.number().int().min(0, "Enter the number of bedrooms"),
  bathrooms: z.coerce.number().int().min(0, "Enter the number of bathrooms"),
  sizeSqm: z.coerce.number().positive("Enter the size in square metres"),
  paymentPlanType: paymentPlanTypeSchema,
  downPaymentPct: z.coerce.number().min(0).max(100).optional(),
  installmentDurationMonths: z.string().optional(),
});
export type CreateListingInput = z.infer<typeof createListingInputSchema>;

export const offerPaymentPlanSchema = z.enum(["FULL_PAYMENT", "INSTALLMENT"]);
export const offerStatusSchema = z.enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]);
export type OfferStatus = z.infer<typeof offerStatusSchema>;

export const offerSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  buyerId: z.string(),
  paymentPlan: offerPaymentPlanSchema,
  downPaymentPct: z.number().nullable(),
  installmentDurationMonths: z.number().nullable(),
  offerAmount: z.number(),
  message: z.string().nullable(),
  status: offerStatusSchema,
  respondedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type Offer = z.infer<typeof offerSchema>;

export const offerListingSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  location: z.string(),
  price: z.number(),
  status: listingStatusSchema,
});
export type OfferListingSummary = z.infer<typeof offerListingSummarySchema>;

export const createOfferInputSchema = z.object({
  listingId: z.string(),
  paymentPlan: offerPaymentPlanSchema,
  downPaymentPct: z.coerce.number().min(0).max(100).optional(),
  installmentDurationMonths: z.coerce.number().int().positive().optional(),
  offerAmount: z.coerce.number().positive("Enter an offer amount"),
  message: z.string().optional(),
});
export type CreateOfferInput = z.infer<typeof createOfferInputSchema>;
