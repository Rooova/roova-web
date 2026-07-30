import { z } from "zod";
import { apiGet, apiPost } from "@/lib/api-client";
import { propertySchema, type Property, type PropertyStatus } from "@/features/admin/schemas";

export async function getProperties(status?: PropertyStatus) {
  const query = status ? `?status=${status}` : "";
  const res = await apiGet<unknown[]>(`/admin/properties${query}`);
  return z.array(propertySchema).parse(res);
}

export async function approveProperty(id: string): Promise<Property> {
  const res = await apiPost(`/admin/properties/${id}/approve`);
  return propertySchema.parse(res);
}

export async function rejectProperty(id: string, reason: string): Promise<Property> {
  const res = await apiPost(`/admin/properties/${id}/reject`, { reason });
  return propertySchema.parse(res);
}
