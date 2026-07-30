import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/features/admin/api";
import type { PropertyStatus } from "@/features/admin/schemas";

export const adminKeys = {
  all: ["admin"] as const,
  properties: (status?: PropertyStatus) =>
    [...adminKeys.all, "properties", status ?? "all"] as const,
};

export function useAdminProperties(status?: PropertyStatus) {
  return useQuery({
    queryKey: adminKeys.properties(status),
    queryFn: () => getProperties(status),
  });
}
