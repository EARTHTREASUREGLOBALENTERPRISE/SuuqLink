import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProduct,
  useGetRelatedProducts,
  useAddCartItem,
  useStartConversation,
  getGetCartQueryKey,
  getGetProductQueryKey,
  getGetRelatedProductsQueryKey,
  getListConversationsQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { Skeleton } from "@/components/Skeleton";
import { formatPrice, formatDate } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MessageCircle,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";

export default function ProductPage() {
  const [, params] = useRoute<{ id: string }>("/product/:id");
  const id = Number(params?.id ?? 0);
  const product = useGetProduct(id, {
    query: { enabled: id > 0, queryKey: getGetProductQueryKey(id) },
  });
  const related = useGetRelatedProducts(id, {
    query: { enabled: id > 0, queryKey: getGetRelatedProductsQueryKey(id) },
  });
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addItem = useAddCartItem({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setPulse(true);
        setShowSuccess(true);
        setTimeout(() => setPulse(false), 800);
        setTimeout(() => setShowSuccess(false), 2000);
      },
    },
  });

  const startConv = useStartConversation({
    mutation: {
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        setLocation(`/chat/${data.id}`);
      },
    },
  });

  if (product.isLoading || !product.data) {
    return (
      <PhoneFrame>
        <TopBar showBack />
        <div className="px-4 pt-3 space-y-3">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </PhoneFrame>
    );
  }

  const p = product.data;
  const off =
    p.compareAtPrice && p.compareAtPrice > p.price
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : null;

  return (
    <PhoneFrame>
      <TopBar
        showBack
        right={
          <button
            aria-label="Wishlist"
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted"
          >
            <Heart className="h-4 w-4" />
          </button>
        }
      />
      <div className="pb-32">
        <div className="relative bg-muted">
          <div className="aspect-square overflow-hidden">
            <img
              src={p.gallery[imgIdx] ?? p.imageUrl}
              alt={p.title}
              className="h-full w-full object-cover"
            />
          </div>
          {off != null && (
            <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-bold shadow-lg">
              -{off}% OFF
            </span>
          )}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {p.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-6 bg-primary" : "w-1.5 bg-card/80"}`}
              />
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {p.vendor.name}
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight mt-0.5">
              {p.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Stars rating={p.rating} count={p.reviewCount} size={14} showNumber />
            {p.inStock && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" />
                In stock
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              {formatPrice(p.price, p.currency)}
            </span>
            {p.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(p.compareAtPrice, p.currency)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {p.badges.map((b) => (
              <span
                key={b}
                className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-secondary text-secondary-foreground px-2 py-1"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <Trust icon={Truck} title="Ships in" sub={`${p.shippingDays} days`} />
            <Trust icon={ShieldCheck} title="Buyer" sub="Protection" />
            <Trust icon={RefreshCw} title="7-day" sub="Returns" />
          </div>

          <Link href={`/vendor/${p.vendor.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary/40">
              <img
                src={p.vendor.logoUrl}
                alt=""
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.vendor.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.vendor.city} • {p.vendor.productCount} products
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-2">About this product</h3>
            <p className="text-sm leading-relaxed text-foreground/80">
              {p.description}
            </p>
          </div>

          {p.specs.length > 0 && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <h3 className="text-sm font-semibold px-4 pt-3">Specifications</h3>
              <dl className="divide-y divide-border/60 mt-2">
                {p.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {p.reviews.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Reviews</h3>
                <Stars
                  rating={p.rating}
                  count={p.reviewCount}
                  size={12}
                  showNumber
                />
              </div>
              <div className="space-y-3">
                {p.reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                    <Stars rating={r.rating} size={11} />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {r.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-lg font-bold tracking-tight mb-3 mt-2">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(related.data ?? []).slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 z-30 safe-pb">
        <div className="mx-auto max-w-[560px] px-3">
          <div className="glass border border-border/70 rounded-2xl p-3 shadow-lg shadow-black/5 flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-border bg-card">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-10 w-9 place-items-center hover:bg-muted rounded-l-xl"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-10 w-9 place-items-center hover:bg-muted rounded-r-xl"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => startConv.mutate({ data: { vendorId: p.vendor.id } })}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-muted"
              aria-label="Chat with seller"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                addItem.mutate({ data: { productId: p.id, quantity: qty } })
              }
              disabled={addItem.isPending}
              className={`flex-1 h-10 rounded-xl brand-gradient text-white font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 ${pulse ? "pulse-ring" : ""}`}
            >
              <ShoppingBag className="h-4 w-4" />
              {addItem.isPending ? "Adding..." : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold shadow-2xl inline-flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Added to cart
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}

function Trust({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof Truck;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-2 text-center">
      <Icon className="h-4 w-4 mx-auto text-primary" />
      <p className="text-[11px] font-semibold mt-0.5">{title}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
