import { Link } from "wouter";
import { CheckCircle2, MapPin } from "lucide-react";
import { Stars } from "./Stars";

type VendorLike = {
  id: number;
  name: string;
  tagline: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  logoUrl: string;
  coverUrl: string;
  verified: boolean;
  badges: string[];
};

export function VendorCard({ vendor }: { vendor: VendorLike }) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="block overflow-hidden rounded-2xl border border-border/70 bg-card group transition-shadow hover:shadow-lg hover:shadow-black/5">
        <div className="relative h-24 bg-muted overflow-hidden">
          <img
            src={vendor.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="-mt-7 px-4 pb-4">
          <div className="flex items-end justify-between gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-card bg-card overflow-hidden shadow-md">
              <img
                src={vendor.logoUrl}
                alt={vendor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pb-1 flex items-center gap-1">
              {vendor.verified && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
              <span className="text-xs text-muted-foreground">
                {vendor.productCount} products
              </span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="font-display font-bold text-base truncate">
              {vendor.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {vendor.tagline}
            </p>
            <div className="flex items-center justify-between pt-1">
              <Stars
                rating={vendor.rating}
                count={vendor.reviewCount}
                size={12}
                showNumber
              />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {vendor.city}
              </span>
            </div>
          </div>
        </div>
      </Link>
  );
}
