import { Link } from "wouter";
import { MapPin, Star, Eye } from "lucide-react";
import type { Listing } from "@/lib/marketplace-api";
import { formatPrice, formatRelativeTime } from "@/lib/format";

const KIND_LABELS: Record<string, string> = {
  vehicle: "Vehicle",
  property: "Property",
  rental: "For Rent",
  used: "Used",
  job: "Job",
  service: "Service",
};

export function ListingCard({
  listing,
  variant = "grid",
}: {
  listing: Listing;
  variant?: "grid" | "row" | "scroll";
}) {
  const kindLabel = KIND_LABELS[listing.kind] ?? listing.kind;

  if (variant === "row") {
    return (
      <Link
        href={`/local/${listing.id}`}
        className="flex gap-3 rounded-2xl border border-border/60 bg-card p-2 hover:border-primary/40 transition group"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {listing.promoted && (
            <span className="absolute left-1 top-1 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-foreground">
              Promoted
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            {kindLabel}
          </div>
          <p className="font-semibold text-[13px] leading-tight line-clamp-2">
            {listing.title}
          </p>
          <p className="font-display text-base font-extrabold text-foreground mt-0.5">
            {formatPrice(listing.price, listing.currency)}
            {listing.negotiable && (
              <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                negotiable
              </span>
            )}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.city}
            </span>
            <span>·</span>
            <span>{formatRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  const widthClass = variant === "scroll" ? "w-56" : "w-full";
  return (
    <Link
      href={`/local/${listing.id}`}
      className={`block ${widthClass} rounded-2xl overflow-hidden border border-border/60 bg-card group`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 p-2 flex items-start justify-between">
          <span className="rounded-md bg-black/55 backdrop-blur px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {kindLabel}
          </span>
          {listing.promoted && (
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
              Promoted
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-1 text-[10px] text-white/90">
            <MapPin className="h-3 w-3" />
            {listing.city}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/90">
            <Eye className="h-3 w-3" />
            {listing.viewCount}
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-[13px] font-semibold leading-tight line-clamp-2 min-h-[34px]">
          {listing.title}
        </p>
        <p className="font-display text-lg font-extrabold text-primary">
          {formatPrice(listing.price, listing.currency)}
        </p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{listing.area || listing.condition}</span>
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span>{(4.6 + (listing.id % 5) * 0.05).toFixed(1)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
