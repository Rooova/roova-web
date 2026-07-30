import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createListing,
  withdrawListing,
  markListingSold,
  acceptOffer,
  rejectOffer,
  createOffer,
  withdrawOffer,
} from "@/features/marketplace/api";
import { marketplaceKeys } from "@/features/marketplace/queries";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/lib/api-client";

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListings() });
      notify.success("Listing created.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't create the listing.")),
  });
}

export function useWithdrawListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawListing,
    onSuccess: (listing) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListings() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListing(listing.id) });
      notify.success("Listing withdrawn.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't withdraw this listing.")),
  });
}

export function useMarkListingSold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markListingSold,
    onSuccess: (listing) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListings() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListing(listing.id) });
      notify.success("Marked as sold.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't update this listing.")),
  });
}

export function useAcceptOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, offerId }: { listingId: string; offerId: string }) =>
      acceptOffer(listingId, offerId),
    onSuccess: (_offer, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListing(listingId) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListings() });
      notify.success("Offer accepted.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't accept this offer.")),
  });
}

export function useRejectOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, offerId }: { listingId: string; offerId: string }) =>
      rejectOffer(listingId, offerId),
    onSuccess: (_offer, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myListing(listingId) });
      notify.success("Offer rejected.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't reject this offer.")),
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myOffers() });
      notify.success("Offer submitted.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't submit your offer.")),
  });
}

export function useWithdrawOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.myOffers() });
      notify.success("Offer withdrawn.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't withdraw this offer.")),
  });
}
