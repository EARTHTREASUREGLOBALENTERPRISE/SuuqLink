import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { formatPrice } from "@/lib/format";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ChevronRight,
} from "lucide-react";

export default function CartPage() {
  const cart = useGetCart();
  const qc = useQueryClient();
  const [, setLocation] = useLocation();

  const update = useUpdateCartItem({
    mutation: {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    },
  });
  const remove = useRemoveCartItem({
    mutation: {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    },
  });
  const clear = useClearCart({
    mutation: {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    },
  });

  if (cart.isLoading || !cart.data) {
    return (
      <PhoneFrame>
        <TopBar title="Cart" />
        <div className="px-4 pt-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </PhoneFrame>
    );
  }

  const c = cart.data;

  if (c.items.length === 0) {
    return (
      <PhoneFrame>
        <TopBar title="Cart" />
        <div className="px-6 pt-16 flex flex-col items-center text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary mb-4">
            <ShoppingBag className="h-10 w-10 text-primary/60" />
          </div>
          <h2 className="font-display text-xl font-bold">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Find something you love from our trusted vendors.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl brand-gradient text-white font-semibold shadow-lg shadow-primary/20">
              Start shopping
            </Link>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <TopBar
        title="Cart"
        right={
          <button
            onClick={() => clear.mutate()}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive"
          >
            Clear all
          </button>
        }
      />
      <div className="px-4 pt-3 pb-32 space-y-2.5">
        {c.items.map((it) => (
          <div
            key={it.id}
            className="flex gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <Link href={`/product/${it.productId}`} className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img
                  src={it.imageUrl}
                  alt={it.title}
                  className="h-full w-full object-cover"
                />
              </Link>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
                {it.vendorName}
              </p>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                {it.title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center rounded-lg border border-border bg-card">
                  <button
                    onClick={() =>
                      update.mutate({
                        id: it.id,
                        data: { quantity: it.quantity - 1 },
                      })
                    }
                    className="grid h-7 w-7 place-items-center hover:bg-muted"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-semibold tabular-nums">
                    {it.quantity}
                  </span>
                  <button
                    onClick={() =>
                      update.mutate({
                        id: it.id,
                        data: { quantity: it.quantity + 1 },
                      })
                    }
                    className="grid h-7 w-7 place-items-center hover:bg-muted"
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(it.lineTotal, it.currency)}
                </span>
              </div>
            </div>
            <button
              onClick={() => remove.mutate({ id: it.id })}
              aria-label="Remove"
              className="grid h-8 w-8 place-items-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button className="w-full mt-3 inline-flex items-center justify-between gap-2 h-11 px-4 rounded-2xl border border-dashed border-border bg-card text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground">
          <span className="inline-flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Add a promo code
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="rounded-2xl bg-card border border-border p-4 mt-3 space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatPrice(c.subtotal, c.currency)} />
          <Row
            label="Shipping"
            value={c.shipping === 0 ? "Free" : formatPrice(c.shipping, c.currency)}
            highlight={c.shipping === 0}
          />
          <Row label="Tax" value={formatPrice(c.tax, c.currency)} />
          <hr className="my-2 border-border" />
          <Row
            label="Total"
            value={formatPrice(c.total, c.currency)}
            big
          />
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 z-30 safe-pb">
        <div className="mx-auto max-w-[560px] px-3">
          <button
            onClick={() => setLocation("/checkout")}
            className="w-full h-12 rounded-2xl brand-gradient text-white font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition"
          >
            Checkout • {formatPrice(c.total, c.currency)}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({
  label,
  value,
  highlight,
  big,
}: {
  label: string;
  value: string;
  highlight?: boolean;
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
            : highlight
              ? "font-semibold text-success tabular-nums"
              : "font-semibold tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}
