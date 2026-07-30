import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invest, createDeposit } from "@/features/investor/api";
import { investorKeys } from "@/features/investor/queries";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/lib/api-client";

export function useInvest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investorKeys.investments() });
      queryClient.invalidateQueries({ queryKey: investorKeys.wallet() });
      notify.success("Investment confirmed.");
    },
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't complete this investment.")),
  });
}

export function useCreateDeposit() {
  return useMutation({
    mutationFn: createDeposit,
    onError: (error) => notify.error(getErrorMessage(error, "Couldn't start this deposit.")),
  });
}
