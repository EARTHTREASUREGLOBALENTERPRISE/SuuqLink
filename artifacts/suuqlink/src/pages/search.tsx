import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  useListProducts,
  useGetSearchSuggestions,
  useListCategories,
  getGetSearchSuggestionsQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { Search as SearchIcon, X, SlidersHorizontal, ChevronDown } from "lucide-react";

const SORTS: Array<{ key: "popular" | "newest" | "price_asc" | "price_desc" | "rating"; label: string }> = [
  { key: "popular", label: "Most popular" },
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: low to high" },
  { key: "price_desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export default function SearchPage() {
  const [location] = useLocation();
  const initial = useMemo(() => {
    const sp = new URLSearchParams(location.split("?")[1] ?? "");
    return {
      q: sp.get("q") ?? "",
      category: sp.get("category") ?? "",
      sort: (sp.get("sort") as "popular" | undefined) ?? "popular",
    };
  }, [location]);

  const [q, setQ] = useState(initial.q);
  const [debouncedQ, setDebouncedQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [sort, setSort] = useState<"popular" | "newest" | "price_asc" | "price_desc" | "rating">(
    initial.sort,
  );
  const [showSuggest, setShowSuggest] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 220);
    return () => clearTimeout(t);
  }, [q]);

  const cats = useListCategories();
  const products = useListProducts({
    q: debouncedQ || undefined,
    category: category || undefined,
    sort,
    limit: 60,
  });
  const suggestions = useGetSearchSuggestions(
    { q },
    {
      query: {
        enabled: showSuggest && q.length > 0,
        queryKey: getGetSearchSuggestionsQueryKey({ q }),
      },
    },
  );

  return (
    <PhoneFrame>
      <TopBar
        right={
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        }
      />

      <div className="px-4 pt-4 space-y-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onFocus={() => setShowSuggest(true)}
            onChange={(e) => {
              setQ(e.target.value);
              setShowSuggest(true);
            }}
            placeholder="Search products, vendors, categories..."
            className="w-full h-12 pl-10 pr-10 rounded-2xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                setShowSuggest(false);
              }}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showSuggest && q && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/60">
            {suggestions.data?.terms.slice(0, 5).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setQ(t);
                  setDebouncedQ(t);
                  setShowSuggest(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2"
              >
                <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {t}
              </button>
            ))}
            {suggestions.data?.terms.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No suggestions yet — try a different word.
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <Chip
            active={!category}
            onClick={() => setCategory("")}
            label="All"
          />
          {(cats.data ?? []).map((c) => (
            <Chip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
              label={c.name}
              color={c.accentColor}
            />
          ))}
        </div>

        {showFilters && (
          <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Sort by
              </p>
              <div className="flex flex-wrap gap-2">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${sort === s.key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {products.data?.total ?? 0} results
          </span>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-1 font-semibold text-primary"
          >
            {SORTS.find((s) => s.key === sort)?.label}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {products.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : (products.data?.items ?? []).length > 0 ? (
            (products.data?.items ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">No matches</p>
              <p>Try a different search or remove filters.</p>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function Chip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 h-9 rounded-full text-sm font-semibold border transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground/80 hover:border-primary/40"}`}
      style={
        active && color ? { backgroundColor: color, borderColor: color } : undefined
      }
    >
      {label}
    </button>
  );
}
