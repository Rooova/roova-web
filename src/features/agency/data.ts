import type {
  OverviewStats,
  FundingPoint,
  EarningsPoint,
  Payout,
  Notification,
  AgencySettings,
} from "@/features/agency/schemas";

export const agencyProfile: AgencySettings = {
  name: "Adunni Properties",
  email: "hello@adunniproperties.com",
  phone: "+234 801 234 5678",
  payoutBank: "GTBank",
  payoutAccount: "0123456789",
};

// Overview/Earnings/Notifications have no backend model yet (no payout or
// notification model exists) — these stay mock data until that's built.
export const overviewStats: OverviewStats = {
  totalRaised: 638_000_000,
  activeListings: 2,
  totalInvestors: 312,
  commissionEarned: 18_795_000,
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHLY_FUNDING = [
  18_000_000, 22_500_000, 31_000_000, 27_000_000, 42_000_000, 38_500_000, 51_000_000, 47_000_000,
  63_000_000, 58_000_000, 71_000_000, 68_000_000,
];

export const fundingSeries: FundingPoint[] = MONTHS.map((month, index) => ({
  month,
  amount: MONTHLY_FUNDING[index],
}));

export const earningsSeries: EarningsPoint[] = MONTHS.map((month, index) => ({
  month,
  commission: Math.round(MONTHLY_FUNDING[index] * 0.035),
}));

export const payouts: Payout[] = [
  { id: "po_1", date: "2026-02-28", amount: 1_645_000, status: "paid" },
  { id: "po_2", date: "2026-03-31", amount: 2_205_000, status: "paid" },
  { id: "po_3", date: "2026-04-30", amount: 2_030_000, status: "paid" },
  { id: "po_4", date: "2026-05-31", amount: 2_485_000, status: "paid" },
  { id: "po_5", date: "2026-06-30", amount: 2_380_000, status: "paid" },
  { id: "po_6", date: "2026-07-31", amount: 2_450_000, status: "pending" },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "funding_milestone",
    title: "Lekki Phase 1 Residences hit 75% funded",
    message: "Your listing has crossed 75% of its ₦240M target.",
    timestamp: "2026-07-01T09:12:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "new_investor",
    title: "New investor in Ikeja Heights Apartments",
    message: "Grace Okonkwo invested ₦250,000 (5 shares).",
    timestamp: "2026-06-30T16:40:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "commission_payout",
    title: "Payout sent",
    message: "₦2,485,000 commission was paid out to your account.",
    timestamp: "2026-06-28T11:00:00Z",
    read: false,
  },
  {
    id: "n4",
    type: "kyc_alert",
    title: "Action needed: KYC document expiring",
    message: "Your business registration document expires in 14 days.",
    timestamp: "2026-06-27T08:00:00Z",
    read: false,
  },
  {
    id: "n5",
    type: "system",
    title: "Scheduled maintenance",
    message: "Roova will undergo maintenance on 2026-07-05 from 1-2am WAT.",
    timestamp: "2026-06-25T18:30:00Z",
    read: true,
  },
  {
    id: "n6",
    type: "new_investor",
    title: "New investor in Surulere Court Residences",
    message: "David Okoro invested ₦500,000 (10 shares).",
    timestamp: "2026-06-24T14:15:00Z",
    read: true,
  },
  {
    id: "n7",
    type: "funding_milestone",
    title: "Ajah Garden Estate fully funded",
    message: "Congratulations — your listing reached 100% of its ₦210M target.",
    timestamp: "2026-06-20T10:05:00Z",
    read: true,
  },
  {
    id: "n8",
    type: "commission_payout",
    title: "Payout sent",
    message: "₦2,030,000 commission was paid out to your account.",
    timestamp: "2026-05-31T11:00:00Z",
    read: true,
  },
  {
    id: "n9",
    type: "system",
    title: "Welcome to Roova for Agencies",
    message: "Your agency account is now Gold tier — enjoy priority placement.",
    timestamp: "2026-05-20T09:00:00Z",
    read: true,
  },
  {
    id: "n10",
    type: "new_investor",
    title: "New investor in Lekki Phase 1 Residences",
    message: "Fatima Bello invested ₦150,000 (3 shares).",
    timestamp: "2026-05-18T13:22:00Z",
    read: true,
  },
];
