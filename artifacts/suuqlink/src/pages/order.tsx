import { useRoute } from "wouter";
import {
  useGetOrder,
  getGetOrderQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { formatPrice, formatDate, formatTime } from "@/lib/format";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Truck,
  Package,
  MapPin,
  Phone,
} from "lucide-react";

export default function OrderPage() {
  const [, params] = useRoute<{ id: string }>("/orders/:id");
  const id = Number(params?.id ?? 0);
  const order = useGetOrder(id, {
    query: { enabled: id > 0, queryKey: getGetOrderQueryKey(id) },
  });

  if (order.isLoading || !order.data) {
    return (
      <PhoneFrame>
        <TopBar showBack title="Order" />
        <div className="px-4 pt-3 space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
        </div>
      </PhoneFrame>
    );
  }

  const o = order.data;
  return (
    <PhoneFrame>
      <TopBar showBack title={o.reference} />
      <div className="px-4 pt-3 space-y-4 pb-4">
        <div className="rounded-3xl brand-gradient text-white p-5 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-white/80">
              Tracking
            </p>
            <h2 className="font-display text-2xl font-extrabold mt-1">
              {o.status === "delivered" ? "Delivered" : "Arriving soon"}
            </h2>
            <p className="text-sm text-white/90 mt-1">
              Estimated delivery {formatDate(o.estimatedDelivery)}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur text-xs font-semibold">
              <Truck className="h-3.5 w-3.5" />
              {o.items.length} item{o.items.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="font-semibold text-sm mb-3">Timeline</h3>
          <ol className="relative">
            {o.timeline.map((t, i) => (
              <li key={i} className="relative pl-8 pb-5 last:pb-0">
                {i < o.timeline.length - 1 && (
                  <span
                    className={`absolute left-[11px] top-5 bottom-0 w-px ${t.completed ? "bg-primary/40" : "bg-border"}`}
                  />
                )}
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="absolute left-0 top-0.5"
                >
                  {t.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary fill-primary/15" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </motion.span>
                <p
                  className={`text-sm font-semibold ${t.completed ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {t.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.at)} • {formatTime(t.at)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card divide-y divide-border/60">
          {o.items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 p-3">
              <img
                src={it.imageUrl}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug line-clamp-1">
                  {it.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {it.vendorName} • Qty {it.quantity}
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {formatPrice(it.price * it.quantity, it.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Card title="Shipping address" icon={MapPin}>
            <p className="font-semibold text-sm">{o.shippingAddress.fullName}</p>
            <p className="text-sm text-foreground/80">
              {o.shippingAddress.line1}
              {o.shippingAddress.line2 ? `, ${o.shippingAddress.line2}` : ""}
            </p>
            <p className="text-sm text-foreground/80">
              {o.shippingAddress.city}, {o.shippingAddress.region},{" "}
              {o.shippingAddress.country}
            </p>
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              {o.shippingAddress.phone}
            </p>
          </Card>
          <Card title="Payment" icon={Package}>
            <p className="font-semibold text-sm capitalize">
              {o.paymentMethod.replace(/_/g, " ")}
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <Row label="Subtotal" value={formatPrice(o.subtotal, o.currency)} />
              <Row
                label="Shipping"
                value={o.shipping === 0 ? "Free" : formatPrice(o.shipping, o.currency)}
              />
              <Row label="Tax" value={formatPrice(o.tax, o.currency)} />
              <hr className="my-1 border-border" />
              <Row label="Total" value={formatPrice(o.total, o.currency)} big />
            </div>
          </Card>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={big ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={
          big
            ? "font-bold text-primary tabular-nums"
            : "font-semibold tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}
