import type { AuthRole } from "@/features/auth/api";

export interface RoleAuthPaths {
  dashboard: string;
  login: string;
  signup: string | null;
  forgotPassword: string | null;
}

export function roleAuthPaths(role: AuthRole): RoleAuthPaths {
  switch (role) {
    case "AGENCY":
      return {
        dashboard: "/agency",
        login: "/agency/login",
        signup: "/agency/signup",
        forgotPassword: "/agency/forgot-password",
      };
    case "ADMIN":
      return { dashboard: "/admin", login: "/admin/login", signup: null, forgotPassword: null };
    case "INVESTOR":
      return {
        dashboard: "/investor",
        login: "/login",
        signup: "/signup",
        forgotPassword: "/forgot-password",
      };
  }
}
