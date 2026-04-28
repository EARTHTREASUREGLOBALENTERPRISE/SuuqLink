import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${t}`);
  }
  return (await res.json()) as T;
}

// ===== Listings =====
export type Listing = {
  id: number;
  kind: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  negotiable: boolean;
  condition: string;
  category: string;
  city: string;
  area: string;
  imageUrl: string;
  gallery: string[];
  attributes: Record<string, string | number | boolean>;
  sellerId: number;
  sellerName: string;
  sellerPhone: string;
  contactMethods: string[];
  status: string;
  featured: boolean;
  promoted: boolean;
  viewCount: number;
  saveCount: number;
  createdAt: string;
};

export function useListings(
  params: {
    q?: string;
    kind?: string;
    category?: string;
    city?: string;
    sort?: string;
    featured?: boolean;
    promoted?: boolean;
    limit?: number;
  } = {},
  options?: UseQueryOptions<{ items: Listing[]; total: number }>,
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const qs = sp.toString();
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => get<{ items: Listing[]; total: number }>(`/listings${qs ? `?${qs}` : ""}`),
    ...options,
  });
}

export function useListing(id: number | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => get<Listing>(`/listings/${id}`),
    enabled: id != null,
  });
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: ["listings-featured"],
    queryFn: () => get<Listing[]>(`/listings/featured`),
  });
}

export function useListingStats() {
  return useQuery({
    queryKey: ["listings-stats"],
    queryFn: () => get<{ total: number; byKind: Array<{ kind: string; count: number }> }>(`/listings/meta/stats`),
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => post<Listing>(`/listings`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["listings-stats"] });
    },
  });
}

// ===== Requests / Offers =====
export type RequestRow = {
  id: number;
  buyerId: number;
  buyerName: string;
  title: string;
  description: string;
  category: string;
  city: string;
  budget: number | null;
  currency: string;
  status: string;
  offerCount: number;
  createdAt: string;
};

export type Offer = {
  id: number;
  requestId: number;
  sellerId: number;
  sellerName: string;
  sellerRating: number;
  price: number;
  currency: string;
  message: string;
  status: string;
  createdAt: string;
};

export type RequestDetail = RequestRow & { offers: Offer[] };

export function useRequests(params: { category?: string; city?: string } = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, String(v));
  });
  const qs = sp.toString();
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => get<RequestRow[]>(`/requests${qs ? `?${qs}` : ""}`),
  });
}

export function useRequest(id: number | undefined) {
  return useQuery({
    queryKey: ["request", id],
    queryFn: () => get<RequestDetail>(`/requests/${id}`),
    enabled: id != null,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => post<RequestRow>(`/requests`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

export function useCreateOffer(requestId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      post<Offer>(`/requests/${requestId}/offers`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["request", requestId] });
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

// ===== Wallet =====
export type Wallet = {
  userId: number;
  balance: number;
  pending: number;
  lifetimeEarned: number;
  currency: string;
  payoutMethod: string;
  payoutAccount: string;
  updatedAt: string;
};

export type WalletTransaction = {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  refId: string;
  status: string;
  createdAt: string;
};

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => get<{ wallet: Wallet; transactions: WalletTransaction[] }>(`/wallet`),
  });
}

export function useRequestPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { amount: number; method?: string; account?: string }) =>
      post<{ wallet: Wallet }>(`/wallet/payout`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}

// ===== Seller dashboard =====
export type SellerDashboard = {
  user: { id: number; name: string; role: string } | null;
  wallet: Wallet;
  metrics: {
    todayRevenue: number;
    weekRevenue: number;
    orders7d: number;
    views7d: number;
    conversion: number;
    activeListings: number;
    pendingOffers: number;
  };
  revenueSeries: Array<{ day: string; value: number }>;
  recentActivity: WalletTransaction[];
};

export function useSellerDashboard() {
  return useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => get<SellerDashboard>(`/seller/dashboard`),
  });
}

// ===== Referrals =====
export type Referral = {
  id: number;
  userId: number;
  code: string;
  referredName: string;
  reward: number;
  status: string;
  createdAt: string;
};

export type ReferralOverview = {
  code: string;
  invitesUrl: string;
  rewardPerSignup: number;
  rewardPerSale: number;
  totals: {
    joined: number;
    completed: number;
    pending: number;
    earnedUsd: number;
  };
  invites: Referral[];
};

export function useReferrals() {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: () => get<ReferralOverview>(`/referrals`),
  });
}

export function useSimulateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string }) => post<Referral>(`/referrals/simulate`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

// ===== Subscriptions =====
export type SubscriptionTier = {
  slug: string;
  name: string;
  priceMonthly: number;
  tagline: string;
  features: string[];
  popular?: boolean;
};

export type Subscription = {
  id: number;
  userId: number;
  tier: string;
  status: string;
  priceMonthly: number;
  currency: string;
  startedAt: string;
  renewsAt: string | null;
};

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () =>
      get<{ active: Subscription | null; tiers: SubscriptionTier[] }>(`/subscriptions`),
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { tier: "starter" | "growth" | "pro" }) =>
      post<Subscription>(`/subscriptions`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}
