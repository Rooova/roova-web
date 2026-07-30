import { useQuery } from "@tanstack/react-query";
import { getMe, type AuthRole } from "@/features/auth/api";

export const authKeys = {
  all: ["auth"] as const,
  me: (role: AuthRole) => [...authKeys.all, "me", role] as const,
};

export function useMe(role: AuthRole) {
  return useQuery({
    queryKey: authKeys.me(role),
    queryFn: () => getMe(role),
    retry: false,
  });
}
