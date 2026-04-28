import { useRoute } from "wouter";
import {
  useListProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";

export default function CategoryPage() {
  const [, params] = useRoute<{ slug: string }>("/category/:slug");
  const slug = params?.slug ?? "";
  const cats = useListCategories();
  const products = useListProducts({ category: slug, limit: 60 });
  const cat = (cats.data ?? []).find((c) => c.slug === slug);

  return (
    <PhoneFrame>
      <TopBar showBack title={cat?.name ?? "Category"} />
      <div className="px-4 pt-3 space-y-3">
        {cat && (
          <div
            className="rounded-2xl p-4 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${cat.accentColor}, ${cat.accentColor}dd)`,
            }}
          >
            <p className="text-xs uppercase tracking-widest text-white/80">
              Browse
            </p>
            <h1 className="font-display text-2xl font-extrabold">{cat.name}</h1>
            <p className="text-sm text-white/90">
              {cat.productCount} products from trusted vendors
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {products.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : (products.data?.items ?? []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
        {!products.isLoading && (products.data?.items.length ?? 0) === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No products in this category yet.
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
