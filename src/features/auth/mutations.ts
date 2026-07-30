import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  signup,
  requestPasswordReset,
  resetPassword,
  logout,
  type AuthRole,
  type SelfServeRole,
} from "@/features/auth/api";
import type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/api-client";
import { authKeys } from "@/features/auth/queries";
import { notify } from "@/lib/toast";

export function useLogin(role: AuthRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(role, input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(role), user);
      notify.success("Welcome back.");
    },
    onError: (error) =>
      notify.error(getErrorMessage(error, "Couldn't log you in. Check your details and try again.")),
  });
}

export function useSignup(role: SelfServeRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SignupInput) => signup(role, input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(role), user);
      notify.success("Account created.");
    },
    onError: (error) =>
      notify.error(getErrorMessage(error, "Couldn't create your account. Please try again.")),
  });
}

export function useForgotPassword(role: AuthRole) {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => requestPasswordReset(role, input),
    onSuccess: () => notify.success("Reset link sent — check your email."),
    onError: (error) => notify.error(getErrorMessage(error, "Something went wrong.")),
  });
}

export function useResetPassword(role: SelfServeRole) {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(role, input),
    onSuccess: () => notify.success("Password updated."),
    onError: (error) => notify.error(getErrorMessage(error, "Something went wrong.")),
  });
}

export function useLogout(role: AuthRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout(role),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me(role) });
    },
  });
}
