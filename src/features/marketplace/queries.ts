import { useQuery } from "@tanstack/react-query";
import {
  getListings,
  getListing,
  getMyListings,
  getMyListingFull,
  getMyOffers,
} from "@/features/marketplace/api";

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  listings: () => [...marketplaceKeys.all, "listings"] as const,
  listing: (id: string) => [...marketplaceKeys.all, "listings", id] as const,
  myListings: () => [...marketplaceKeys.all, "mine"] as const,
  myListing: (id: string) => [...marketplaceKeys.all, "mine", id] as const,
  myOffers: () => [...marketplaceKeys.all, "my-offers"] as const,
};

export function useListings() {
  return useQuery({ queryKey: marketplaceKeys.listings(), queryFn: getListings });
}

export function useListing(id: string) {
  return useQuery({ queryKey: marketplaceKeys.listing(id), queryFn: () => getListing(id) });
}

export function useMyListings() {
  return useQuery({ queryKey: marketplaceKeys.myListings(), queryFn: getMyListings });
}

export function useMyListingFull(id: string) {
  return useQuery({
    queryKey: marketplaceKeys.myListing(id),
    queryFn: () => getMyListingFull(id),
  });
}

export function useMyOffers() {
  return useQuery({ queryKey: marketplaceKeys.myOffers(), queryFn: getMyOffers });
}
