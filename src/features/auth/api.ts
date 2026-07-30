import { apiGet, apiPost } from "@/lib/api-client";
import type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/features/auth/schemas";

export type AuthRole = "AGENCY" | "ADMIN" | "INVESTOR";
export type SelfServeRole = "AGENCY" | "INVESTOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

function rolePath(role: AuthRole) {
  return role.toLowerCase();
}

export async function login(role: AuthRole, input: LoginInput): Promise<AuthUser> {
  return apiPost(`/auth/${rolePath(role)}/login`, {
    email: input.email,
    password: input.password,
  });
}

export async function signup(role: SelfServeRole, input: SignupInput): Promise<AuthUser> {
  return apiPost(`/auth/${rolePath(role)}/register`, {
    name: input.name,
    email: input.email,
    password: input.password,
  });
}

export async function requestPasswordReset(role: AuthRole, input: ForgotPasswordInput) {
  return apiPost<{ message: string }>(`/auth/${rolePath(role)}/forgot-password`, input);
}

export async function resetPassword(role: SelfServeRole, input: ResetPasswordInput) {
  return apiPost<{ message: string }>(`/auth/${rolePath(role)}/reset-password`, {
    token: input.token,
    password: input.password,
  });
}

export async function getMe(role: AuthRole): Promise<AuthUser> {
  return apiGet(`/auth/${rolePath(role)}/me`);
}

export async function logout(role: AuthRole): Promise<{ message: string }> {
  return apiPost(`/auth/${rolePath(role)}/logout`);
}
