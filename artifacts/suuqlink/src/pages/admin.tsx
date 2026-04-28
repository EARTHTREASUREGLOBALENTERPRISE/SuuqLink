import {
  useGetAdminStats,
  useListAdminVendors,
  useGetAdminRecentActivity,
  useListAdminOrders,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  ShoppingBag,
  Users,
  Store,
  Package,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  placed: "#0ea5e9",
  confirmed: "#06b6d4",
  packed: "#0d9488",
  shipped: "#16a34a",
  out_for_delivery: "#f59e0b",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const STATUS_LABEL: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "OFD",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminPage() {
  const stats = useGetAdminStats();
  const vendors = useListAdminVendors();
  const recent = useGetAdminRecentActivity();
  const orders = useListAdminOrders();

  return (
    <PhoneFrame wide>
      <TopBar title="Admin" />
      <div className="px-4 pt-3 pb-4 space-y-4 mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.isLoading || !stats.data
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))
            : (
                [
                  {
                    label: "Revenue",
                    value: formatPrice(stats.data.totalRevenue, stats.data.currency),
                    change: stats.data.revenueChangePct,
                    icon: Wallet,
                  },
                  {
                    label: "Orders",
                    value: stats.data.ordersCount.toLocaleString(),
                    change: stats.data.ordersChangePct,
                    icon: ShoppingBag,
                  },
                  {
                    label: "Active buyers",
                    value: stats.data.activeBuyers.toLocaleString(),
                    change: stats.data.activeBuyersChangePct,
                    icon: Users,
                  },
                  {
                    label: "Active vendors",
                    value: stats.data.activeVendors.toLocaleString(),
                    change: stats.data.activeVendorsChangePct,
                    icon: Store,
                  },
                ] as const
              ).map((s) => {
                const positive = s.change >= 0;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                        <s.icon className="h-4 w-4 text-primary" />
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${positive ? "text-success" : "text-destructive"}`}
                      >
                        {positive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(s.change).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {s.label}
                    </p>
                    <p className="font-display text-xl font-extrabold mt-0.5">
                      {s.value}
                    </p>
                  </div>
                );
              })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-bold">Revenue trend</h3>
                <p className="text-xs text-muted-foreground">
                  Last 14 days
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                ↑ 12.4%
              </span>
            </div>
            <div className="h-52">
              {stats.data && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.data.revenueByDay}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) =>
                        new Date(d).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      fill="url(#rev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display font-bold mb-3">Orders by status</h3>
            <div className="h-52">
              {stats.data && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.data.ordersByStatus.map((s) => ({
                      name: STATUS_LABEL[s.status] ?? s.status,
                      value: s.count,
                      status: s.status,
                    }))}
                    margin={{ left: -10, right: 5, top: 4 }}
                  >
                    <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {stats.data.ordersByStatus.map((s) => (
                        <Cell
                          key={s.status}
                          fill={STATUS_COLORS[s.status] ?? "#0d9488"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display font-bold mb-3">Top vendors</h3>
            <div className="space-y-2">
              {(stats.data?.topVendors ?? []).map((v) => (
                <div
                  key={v.vendorId}
                  className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/60"
                >
                  <img
                    src={v.logoUrl}
                    alt=""
                    className="h-9 w-9 rounded-lg object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.orders} orders
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">
                    {formatPrice(v.revenue, "USD")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display font-bold mb-3">Top categories</h3>
            <div className="space-y-2.5">
              {(stats.data?.topCategories ?? []).slice(0, 6).map((c) => (
                <div key={c.categorySlug}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatPrice(c.revenue, "USD")}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full brand-gradient"
                      style={{ width: `${Math.min(100, c.share * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display font-bold mb-3">Recent activity</h3>
            <ul className="space-y-2">
              {(recent.data ?? []).map((a) => {
                const Icon =
                  a.kind === "signup"
                    ? UserPlus
                    : a.kind === "message"
                      ? MessageCircle
                      : Package;
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/60"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {a.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {a.detail}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatRelativeTime(a.at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display font-bold mb-3">Vendor health</h3>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left font-semibold py-2 px-1">Vendor</th>
                    <th className="text-left font-semibold py-2 px-1">Country</th>
                    <th className="text-right font-semibold py-2 px-1">Products</th>
                    <th className="text-right font-semibold py-2 px-1">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(vendors.data ?? []).slice(0, 6).map((v) => (
                    <tr key={v.id}>
                      <td className="py-2 px-1 font-medium truncate max-w-[140px]">
                        {v.name}
                      </td>
                      <td className="py-2 px-1 text-muted-foreground">
                        {v.country}
                      </td>
                      <td className="py-2 px-1 text-right tabular-nums">
                        {v.productCount}
                      </td>
                      <td className="py-2 px-1 text-right tabular-nums font-semibold">
                        {v.rating.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="font-display font-bold mb-3">Recent orders</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold py-2 px-1">Ref</th>
                  <th className="text-left font-semibold py-2 px-1">Status</th>
                  <th className="text-left font-semibold py-2 px-1">Items</th>
                  <th className="text-right font-semibold py-2 px-1">Total</th>
                  <th className="text-right font-semibold py-2 px-1 hidden sm:table-cell">
                    Placed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(orders.data ?? []).map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 px-1 font-mono text-xs">{o.reference}</td>
                    <td className="py-2 px-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            (STATUS_COLORS[o.status] ?? "#0d9488") + "26",
                          color: STATUS_COLORS[o.status] ?? "#0d9488",
                        }}
                      >
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-muted-foreground">
                      {o.items.length}
                    </td>
                    <td className="py-2 px-1 text-right font-semibold tabular-nums">
                      {formatPrice(o.total, o.currency)}
                    </td>
                    <td className="py-2 px-1 text-right text-muted-foreground hidden sm:table-cell">
                      {formatRelativeTime(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
