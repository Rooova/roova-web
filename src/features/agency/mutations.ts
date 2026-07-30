import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markNotificationRead,
  markAllNotificationsRead,
  updateAgencySettings,
  createProperty,
  submitProperty,
} from "@/features/agency/api";
import { agencyKeys } from "@/features/agency/queries";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/lib/api-client";
import type { Notification } from "@/features/agency/schemas";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: agencyKeys.notifications() });
      const previous = queryClient.getQueryData<Notification[]>(agencyKeys.notifications());
      queryClient.setQueryData<Notification[]>(agencyKeys.notifications(), (old) =>
        old?.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(agencyKeys.notifications(), context?.previous);
      notify.error();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: agencyKeys.notifications() }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: agencyKeys.notifications() });
      const previous = queryClient.getQueryData<Notification[]>(agencyKeys.notifications());
      queryClient.setQueryData<Notification[]>(agencyKeys.notifications(), (old) =>
        old?.map((n) => ({ ...n, read: true })),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(agencyKeys.notifications(), context?.previous);
      notify.error();
    },
    onSuccess: () => notify.success("All caught up."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: agencyKeys.notifications() }),
  });
}

export function useUpdateAgencySettings() {
  return useMutation({
    mutationFn: updateAgencySettings,
    onSuccess: () => notify.success("Settings saved."),
    onError: () => notify.error("Couldn't save your settings. Please try again."),
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.properties() });
      notify.success("Listing created — it's saved as a draft.");
    },
    onError: (error) =>
      notify.error(getErrorMessage(error, "Couldn't create the listing. Please try again.")),
  });
}

export function useSubmitProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitProperty,
    onSuccess: (property) => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.properties() });
      queryClient.invalidateQueries({ queryKey: agencyKeys.property(property.id) });
      notify.success("Submitted for review.");
    },
    onError: (error) =>
      notify.error(getErrorMessage(error, "Couldn't submit this listing. Please try again.")),
  });
}
