import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCart,
  useCreateOrder,
  getGetCartQueryKey,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { formatPrice } from "@/lib/format";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Address", "Payment", "Review"] as const;

const PAYMENTS = [
  { key: "mobile_money", label: "Mobile Money", sub: "M-Pesa, EVC Plus, MTN MoMo", icon: Smartphone },
  { key: "card", label: "Card", sub: "Visa, Mastercard", icon: CreditCard },
  { key: "cash_on_delivery", label: "Cash on Delivery", sub: "Pay when you receive", icon: Banknote },
  { key: "bank_transfer", label: "Bank Transfer", sub: "Direct to vendor", icon: Building2 },
] as const;

export default function CheckoutPage() {
  const cart = useGetCart();
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: "Amina Yusuf",
    phone: "+252 61 234 5678",
    line1: "Hamarweyne District, Plot 14",
    line2: "",
    city: "Mogadishu",
    region: "Banaadir",
    country: "Somalia",
    notes: "",
  });
  const [payment, setPayment] = useState<typeof PAYMENTS[number]["key"]>(
    "mobile_money",
  );

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
        qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        setLocation(`/orders/${data.id}`);
      },
    },
  });

  const c = cart.data;

  return (
    <PhoneFrame hideTabs>
      <TopBar showBack title="Checkout" />
      <div className="px-4 pt-3 pb-32">
        <div className="flex items-center justify-center gap-2 mb-5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-semibold ${i === step ? "text-primary" : "text-muted-foreground"}`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-6 ${i < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="space-y-3"
          >
            {step === 0 && (
              <div className="space-y-3">
                <Field label="Full name">
                  <input
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Address line 1">
                  <input
                    value={address.line1}
                    onChange={(e) =>
                      setAddress({ ...address, line1: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Address line 2 (optional)">
                  <input
                    value={address.line2}
                    onChange={(e) =>
                      setAddress({ ...address, line2: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <input
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Region">
                    <input
                      value={address.region}
                      onChange={(e) =>
                        setAddress({ ...address, region: e.target.value })
                      }
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Country">
                  <input
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Delivery notes (optional)">
                  <textarea
                    value={address.notes}
                    onChange={(e) =>
                      setAddress({ ...address, notes: e.target.value })
                    }
                    rows={2}
                    className="input min-h-[64px] py-2.5"
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                {PAYMENTS.map((p) => {
                  const Icon = p.icon;
                  const active = payment === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setPayment(p.key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${active ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/40"}`}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                        <Icon className="h-4 w-4 text-primary" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.sub}</p>
                      </div>
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? "border-primary" : "border-border"}`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>
                  );
                })}
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground pt-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  All payments are protected by SuuqLink Buyer Guarantee.
                </p>
              </div>
            )}

            {step === 2 && c && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Shipping to
                  </p>
                  <p className="font-semibold mt-1">{address.fullName}</p>
                  <p className="text-sm text-foreground/80">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                    {address.region}, {address.country}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.phone}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment
                  </p>
                  <p className="font-semibold mt-1">
                    {PAYMENTS.find((p) => p.key === payment)?.label}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card divide-y divide-border/60">
                  {c.items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 p-3">
                      <img
                        src={it.imageUrl}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {it.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty {it.quantity} • {formatPrice(it.price, it.currency)}
                        </p>
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {formatPrice(it.lineTotal, it.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-card border border-border p-4 space-y-1.5 text-sm">
                  <Row label="Subtotal" value={formatPrice(c.subtotal, c.currency)} />
                  <Row
                    label="Shipping"
                    value={c.shipping === 0 ? "Free" : formatPrice(c.shipping, c.currency)}
                  />
                  <Row label="Tax" value={formatPrice(c.tax, c.currency)} />
                  <hr className="my-2 border-border" />
                  <Row label="Total" value={formatPrice(c.total, c.currency)} big />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 safe-pb">
        <div className="mx-auto max-w-[560px] px-3 pb-3">
          <div className="glass border border-border/70 rounded-2xl p-3 shadow-lg shadow-black/5 flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-card hover:bg-muted"
                aria-label="Back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 h-12 rounded-xl brand-gradient text-white font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:opacity-95"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() =>
                  createOrder.mutate({
                    data: {
                      shippingAddress: { ...address, line2: address.line2 || null, notes: address.notes || null },
                      paymentMethod: payment,
                    },
                  })
                }
                disabled={createOrder.isPending}
                className="flex-1 h-12 rounded-xl brand-gradient text-white font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:opacity-95 disabled:opacity-60"
              >
                {createOrder.isPending ? "Placing order..." : `Place order • ${c ? formatPrice(c.total, c.currency) : ""}`}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`.input{ width:100%; height:48px; padding-left:14px; padding-right:14px; border-radius:12px; border:1px solid hsl(var(--border)); background:hsl(var(--card)); outline:none; } .input:focus{ border-color:hsl(var(--primary)); box-shadow:0 0 0 3px hsl(var(--primary) / 0.18); }`}</style>
    </PhoneFrame>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
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
      <span className={big ? "font-display font-bold text-base" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={
          big
            ? "font-display text-xl font-extrabold text-primary tabular-nums"
            : "font-semibold tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}
