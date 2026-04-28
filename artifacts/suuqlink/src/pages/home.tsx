import { Link, useLocation } from "wouter";
import {
  useListCategories,
  useListFeaturedProducts,
  useListTrendingProducts,
  useListVendors,
} from "@workspace/api-client-react";
import {
  Search,
  Sparkles,
  Truck,
  ShieldCheck,
  Flame,
  ArrowRight,
  Shirt,
  Smartphone,
  Home as HomeIcon,
  ShoppingBasket,
  Palette,
  Baby,
  Dumbbell,
  ShoppingBag,
} from "lucide-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { VendorCard } from "@/components/VendorCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCardSkeleton, Skeleton } from "@/components/Skeleton";
import { motion } from "framer-motion";

const CATEGORY_ICONS: Record<string, typeof Shirt> = {
  Shirt,
  Smartphone,
  Home: HomeIcon,
  Sparkles,
  ShoppingBasket,
  Palette,
  Baby,
  Dumbbell,
  ShoppingBag,
};

export default function HomePage() {
  const cats = useListCategories();
  const featured = useListFeaturedProducts();
  const trending = useListTrendingProducts();
  const vendors = useListVendors({ featured: true });
  const [, setLocation] = useLocation();

  return (
    <PhoneFrame>
      <TopBar />

      <div className="px-4 pt-4">
        <button
          onClick={() => setLocation("/search")}
          className="w-full h-12 flex items-center gap-3 px-4 rounded-2xl border border-border/70 bg-card text-left text-sm text-muted-foreground hover:border-primary/40 transition"
        >
          <Search className="h-4 w-4" />
          <span>Search "Pixel Pro", "leather tote", "frankincense"...</span>
        </button>
      </div>

      <section className="px-4 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl brand-gradient text-white p-5 shadow-xl shadow-primary/20"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-4 -bottom-12 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Suuq Week
            </span>
            <h2 className="font-display text-2xl font-extrabold leading-tight text-balance">
              Up to 30% off handpicked finds from East Africa
            </h2>
            <p className="text-sm text-white/90 max-w-[80%]">
              Vetted vendors, fast delivery, and prices that move.
            </p>
          </div>
          <div className="relative mt-4 flex items-center justify-between">
            <Link href="/search?sort=popular" className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-md hover:scale-[1.02] transition">
                Shop deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white bg-white/20 backdrop-blur"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-3 gap-2 px-4 pt-4">
        <Trust icon={Truck} label="Fast delivery" sub="Same-day in CBD" />
        <Trust icon={ShieldCheck} label="Buyer protection" sub="On every order" />
        <Trust icon={Flame} label="Hot deals" sub="Daily drops" />
      </section>

      <section className="pt-6 space-y-3">
        <SectionHeader
          title="Browse categories"
          subtitle="Find anything, fast"
          href="/search"
        />
        <div className="grid grid-cols-4 gap-3 px-4">
          {cats.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))
            : (cats.data ?? []).map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl shadow-sm transition-transform group-active:scale-95"
                      style={{
                        backgroundColor: c.accentColor + "1f",
                        color: c.accentColor,
                      }}
                    >
                      <CategoryIcon name={c.icon} />
                    </span>
                    <span className="text-[11px] font-semibold leading-tight text-foreground/80">
                      {c.name}
                    </span>
                  </Link>
              ))}
        </div>
      </section>

      <section className="pt-6 space-y-3">
        <SectionHeader
          title="Trending now"
          subtitle="What people are buying"
          href="/search?sort=popular"
        />
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide px-4">
          {trending.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-44 shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : (trending.data ?? []).slice(0, 8).map((p) => (
                <div key={p.id} className="shrink-0">
                  <ProductCard product={p} variant="scroll" />
                </div>
              ))}
        </div>
      </section>

      <section className="pt-6 space-y-3">
        <SectionHeader
          title="Featured this week"
          href="/search?sort=newest"
        />
        <div className="grid grid-cols-2 gap-3 px-4">
          {featured.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : (featured.data ?? []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      </section>

      <section className="pt-6 space-y-3 pb-4">
        <SectionHeader
          title="Vendor spotlights"
          subtitle="Trusted shops, real people"
          href="/vendors"
        />
        <div className="grid grid-cols-1 gap-3 px-4">
          {vendors.isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-44" />
              ))
            : (vendors.data ?? []).slice(0, 4).map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
        </div>
      </section>
    </PhoneFrame>
  );
}

function Trust({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof Truck;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-2.5 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div className="leading-tight">
        <p className="text-[11px] font-semibold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function CategoryIcon({ name }: { name: string }) {
  const Cmp = CATEGORY_ICONS[name] ?? ShoppingBag;
  return <Cmp className="h-6 w-6" strokeWidth={1.8} />;
}
