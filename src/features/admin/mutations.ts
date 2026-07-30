import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveProperty, rejectProperty } from "@/features/admin/api";
import { adminKeys } from "@/features/admin/queries";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/lib/api-client";

export function useApproveProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      notify.success("Property approved — now live.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't approve this property.")),
  });
}

export function useRejectProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectProperty(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      notify.success("Property rejected.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't reject this property.")),
  });
}
