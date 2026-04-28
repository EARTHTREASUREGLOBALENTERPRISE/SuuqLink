import { useState } from "react";
import { Link, useLocation } from "wouter";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { Skeleton } from "@/components/Skeleton";
import {
  useListings,
  useFeaturedListings,
  useListingStats,
} from "@/lib/marketplace-api";
import {
  Car,
  Home as HomeIcon,
  Smartphone,
  Briefcase,
  Wrench,
  Building,
  PackageSearch,
  Plus,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";

const KINDS = [
  { slug: "all", label: "All", icon: PackageSearch },
  { slug: "vehicle", label: "Vehicles", icon: Car },
  { slug: "property", label: "Property", icon: Building },
  { slug: "rental", label: "Rentals", icon: HomeIcon },
  { slug: "used", label: "Used items", icon: Smartphone },
  { slug: "job", label: "Jobs", icon: Briefcase },
  { slug: "service", label: "Services", icon: Wrench },
];

export default function LocalPage() {
  const [, setLocation] = useLocation();
  const [kind, setKind] = useState<string>("all");
  const [city, setCity] = useState<string>("");

  const featured = useFeaturedListings();
  const stats = useListingStats();
  const listings = useListings({
    kind: kind === "all" ? undefined : kind,
    city: city || undefined,
    sort: "newest",
    limit: 30,
  });

  return (
    <PhoneFrame>
      <TopBar
        title="Local marketplace"
        right={
          <Link
            href="/post"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25"
          >
            <Plus className="h-3.5 w-3.5" />
            Post
          </Link>
        }
      />

      <section className="px-4 pt-4">
        <button
          onClick={() => setLocation("/search")}
          className="w-full h-12 flex items-center gap-3 px-4 rounded-2xl border border-border/70 bg-card text-left text-sm text-muted-foreground hover:border-primary/40 transition"
        >
          <Search className="h-4 w-4" />
          <span>Search local listings, cars, homes, jobs...</span>
        </button>
      </section>

      <section className="px-4 pt-3">
        <div className="rounded-2xl bg-primary/8 border border-primary/15 p-3 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-tight">
              Meet safely. Check items before you pay.
            </p>
            <Link
              href="/safety"
              className="text-[11px] font-medium text-primary underline-offset-2 hover:underline"
            >
              Read meetup safety tips
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
          {KINDS.map((k) => {
            const Icon = k.icon;
            const active = kind === k.slug;
            const count =
              k.slug === "all"
                ? stats.data?.total ?? 0
                : stats.data?.byKind.find((b) => b.kind === k.slug)?.count ?? 0;
            return (
              <button
                key={k.slug}
                onClick={() => setKind(k.slug)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {k.label}
                <span
                  className={`ml-1 rounded-full px-1.5 text-[10px] ${active ? "bg-white/20" : "bg-muted"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-2 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {["", "Hargeisa", "Mogadishu", "Berbera"].map((c) => (
            <button
              key={c || "any"}
              onClick={() => setCity(c)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium border transition ${
                city === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {c || "All cities"}
            </button>
          ))}
        </div>
      </section>

      {(featured.data?.length ?? 0) > 0 && (
        <section className="pt-4 space-y-3">
          <div className="px-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Featured & promoted
              </p>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Hot listings near you
              </h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1">
            {featured.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-56 h-60 shrink-0" />
                ))
              : (featured.data ?? []).slice(0, 8).map((l) => (
                  <div key={l.id} className="shrink-0">
                    <ListingCard listing={l} variant="scroll" />
                  </div>
                ))}
          </div>
        </section>
      )}

      <section className="pt-4 pb-4 space-y-3">
        <div className="px-4">
          <h2 className="font-display text-lg font-bold tracking-tight">
            Newest in {city || "your area"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {listings.data?.total ?? 0} listings updated today
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 px-4">
          {listings.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))
            : (listings.data?.items ?? []).map((l) => (
                <ListingCard key={l.id} listing={l} variant="row" />
              ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <Link
          href="/post"
          className="block rounded-2xl brand-gradient text-white p-4 shadow-lg shadow-primary/20"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Plus className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-display font-extrabold text-base leading-tight">
                Sell something today
              </p>
              <p className="text-[12px] text-white/80">
                Free posting · reach thousands of buyers near you
              </p>
            </div>
          </div>
        </Link>
      </section>
    </PhoneFrame>
  );
}
