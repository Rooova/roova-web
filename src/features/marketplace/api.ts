import { z } from "zod";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  listingSchema,
  offerSchema,
  offerListingSummarySchema,
  type Listing,
  type Offer,
  type CreateListingInput,
  type CreateOfferInput,
} from "@/features/marketplace/schemas";

function parseDurations(input?: string): number[] | undefined {
  if (!input) return undefined;
  const values = input
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);
  return values.length > 0 ? values : undefined;
}

// --- Public ---

export async function getListings() {
  const res = await apiGet<unknown[]>("/marketplace-listings");
  return z.array(listingSchema).parse(res);
}

export async function getListing(id: string) {
  const res = await apiGet(`/marketplace-listings/${id}`);
  return listingSchema.parse(res);
}

// --- Agency ---

export async function getMyListings() {
  const res = await apiGet<unknown[]>("/marketplace-listings/mine");
  return z.array(listingSchema).parse(res);
}

export async function getMyListingFull(id: string) {
  const res = await apiGet<{ listing: unknown; offers: unknown[] }>(
    `/marketplace-listings/mine/${id}/full`,
  );
  return {
    listing: listingSchema.parse(res.listing),
    offers: z.array(offerSchema).parse(res.offers),
  };
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const res = await apiPost("/marketplace-listings", {
    title: input.title,
    location: input.location,
    description: input.description,
    price: input.price,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    sizeSqm: input.sizeSqm,
    paymentPlanType: input.paymentPlanType,
    downPaymentPct: input.downPaymentPct,
    installmentDurationMonths: parseDurations(input.installmentDurationMonths),
  });
  return listingSchema.parse(res);
}

export async function withdrawListing(id: string): Promise<Listing> {
  const res = await apiPost(`/marketplace-listings/mine/${id}/withdraw`);
  return listingSchema.parse(res);
}

export async function markListingSold(id: string): Promise<Listing> {
  const res = await apiPost(`/marketplace-listings/mine/${id}/mark-sold`);
  return listingSchema.parse(res);
}

export async function acceptOffer(listingId: string, offerId: string): Promise<Offer> {
  const res = await apiPost(`/marketplace-listings/mine/${listingId}/offers/${offerId}/accept`);
  return offerSchema.parse(res);
}

export async function rejectOffer(listingId: string, offerId: string): Promise<Offer> {
  const res = await apiPost(`/marketplace-listings/mine/${listingId}/offers/${offerId}/reject`);
  return offerSchema.parse(res);
}

// --- Investor (offers) ---

export async function createOffer(input: CreateOfferInput): Promise<Offer> {
  const res = await apiPost("/purchase-offers", input);
  return offerSchema.parse(res);
}

export async function getMyOffers() {
  const res = await apiGet<{ offer: unknown; listing: unknown }[]>("/purchase-offers/mine");
  return res.map((row) => ({
    offer: offerSchema.parse(row.offer),
    listing: row.listing ? offerListingSummarySchema.parse(row.listing) : null,
  }));
}

export async function withdrawOffer(id: string): Promise<Offer> {
  const res = await apiPost(`/purchase-offers/mine/${id}/withdraw`);
  return offerSchema.parse(res);
}
