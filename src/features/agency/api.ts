import { z } from "zod";
import { simulateNetwork } from "@/lib/simulate";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import {
  agencyPropertySchema,
  investorRowSchema,
  overviewStatsSchema,
  fundingPointSchema,
  earningsPointSchema,
  payoutSchema,
  notificationSchema,
  agencySettingsSchema,
  type AgencyProperty,
  type CreatePropertyInput,
  type AgencySettings,
} from "@/features/agency/schemas";
import {
  overviewStats,
  fundingSeries,
  earningsSeries,
  payouts,
  notifications,
  agencyProfile,
} from "@/features/agency/data";

// --- Property — real backend calls ---

export async function getProperties() {
  const res = await apiGet<unknown[]>("/properties/mine");
  return z.array(agencyPropertySchema).parse(res);
}

export async function getProperty(id: string) {
  const res = await apiGet<{ property: unknown; investors: unknown[] }>(
    `/properties/${id}/full`,
  );
  return {
    property: agencyPropertySchema.parse(res.property),
    investors: z.array(investorRowSchema).parse(res.investors),
  };
}

export async function createProperty(input: CreatePropertyInput): Promise<AgencyProperty> {
  const res = await apiPost("/properties", input);
  return agencyPropertySchema.parse(res);
}

export async function updateProperty(
  id: string,
  input: Partial<CreatePropertyInput> & { description?: string },
): Promise<AgencyProperty> {
  const res = await apiPatch(`/properties/mine/${id}`, input);
  return agencyPropertySchema.parse(res);
}

export async function submitProperty(id: string): Promise<AgencyProperty> {
  const res = await apiPost(`/properties/mine/${id}/submit`);
  return agencyPropertySchema.parse(res);
}

// --- Overview / earnings / notifications / settings — still simulated:
// no payout or notification model exists on the backend yet. ---

export async function getOverview() {
  const res = await simulateNetwork(overviewStats);
  return overviewStatsSchema.parse(res);
}

export async function getFundingSeries() {
  const res = await simulateNetwork(fundingSeries);
  return z.array(fundingPointSchema).parse(res);
}

export async function getEarnings() {
  const res = await simulateNetwork({ series: earningsSeries, payouts });
  return {
    series: z.array(earningsPointSchema).parse(res.series),
    payouts: z.array(payoutSchema).parse(res.payouts),
  };
}

export async function getNotifications() {
  const res = await simulateNetwork(notifications);
  return z.array(notificationSchema).parse(res);
}

export async function markNotificationRead(id: string) {
  const notification = notifications.find((n) => n.id === id);
  if (notification) notification.read = true;
  return simulateNetwork({ ok: true as const }, 250);
}

export async function markAllNotificationsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  return simulateNetwork({ ok: true as const }, 250);
}

export async function getAgencySettings() {
  const res = await simulateNetwork(agencyProfile);
  return agencySettingsSchema.parse(res);
}

export async function updateAgencySettings(input: AgencySettings) {
  Object.assign(agencyProfile, input);
  const res = await simulateNetwork(agencyProfile);
  return agencySettingsSchema.parse(res);
}
