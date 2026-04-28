import { Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { formatPrice, formatDate } from "@/lib/format";
import { Package, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-secondary text-secondary-foreground",
  confirmed: "bg-secondary text-secondary-foreground",
  packed: "bg-secondary text-secondary-foreground",
  shipped: "bg-primary/15 text-primary",
  out_for_delivery: "bg-warning/20 text-warning-foreground",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const orders = useListOrders();

  return (
    <PhoneFrame>
      <TopBar title="My orders" />
      <div className="px-4 pt-3 space-y-2.5">
        {orders.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (orders.data ?? []).length === 0 ? (
          <div className="px-2 pt-12 flex flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary mb-3">
              <Package className="h-8 w-8 text-primary/60" />
            </div>
            <p className="font-display text-lg font-bold">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              When you place your first order, it'll show up here.
            </p>
            <Link href="/" className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl brand-gradient text-white font-semibold">
                Browse products
              </Link>
          </div>
        ) : (
          (orders.data ?? []).map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="block rounded-2xl border border-border bg-card p-3 hover:border-primary/40 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </p>
                    <p className="font-semibold text-sm">{o.reference}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${STATUS_STYLES[o.status] ?? "bg-secondary"}`}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
                <div className="mt-2 flex -space-x-2">
                  {o.items.slice(0, 4).map((it) => (
                    <img
                      key={it.id}
                      src={it.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-lg border-2 border-card object-cover"
                    />
                  ))}
                  {o.items.length > 4 && (
                    <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-card bg-muted text-xs font-semibold">
                      +{o.items.length - 4}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {o.items.length} item{o.items.length === 1 ? "" : "s"} •{" "}
                    {formatPrice(o.total, o.currency)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
          ))
        )}
      </div>
    </PhoneFrame>
  );
}
