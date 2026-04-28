import { Link } from "wouter";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { Stars } from "./Stars";

type ProductLike = {
  id: number;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  imageUrl: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  badges: string[];
};

export function ProductCard({
  product,
  variant = "grid",
}: {
  product: ProductLike;
  variant?: "grid" | "scroll";
}) {
  const off =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null;
  return (
    <Link href={`/product/${product.id}`} className="group block">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className={`overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow group-hover:shadow-lg group-hover:shadow-black/5 ${variant === "scroll" ? "w-44" : ""}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
              <div className="flex flex-wrap gap-1">
                {product.badges.slice(0, 1).map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
              {off != null && (
                <span className="rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold shadow-sm">
                  -{off}%
                </span>
              )}
            </div>
          </div>
          <div className="p-3 space-y-1.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
              {product.vendorName}
            </p>
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              )}
            </div>
            <Stars rating={product.rating} count={product.reviewCount} size={12} />
          </div>
        </motion.div>
      </Link>
  );
}
