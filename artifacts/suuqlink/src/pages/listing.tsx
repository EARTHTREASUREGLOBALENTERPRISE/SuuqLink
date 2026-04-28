import { useParams, Link } from "wouter";
import { useState } from "react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { useListing } from "@/lib/marketplace-api";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import {
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Heart,
  Share2,
  Eye,
  Tag,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const listing = useListing(id ? Number(id) : undefined);
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  const data = listing.data;

  if (!data) {
    return (
      <PhoneFrame hideTabs>
        <TopBar showBack />
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <TopBar
        showBack
        right={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-label="Save"
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted"
            >
              <Heart
                className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`}
              />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={data.gallery[active] ?? data.imageUrl}
            alt={data.title}
            className="h-full w-full object-cover"
          />
          {data.promoted && (
            <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground shadow">
              Promoted
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3 text-white text-[11px]">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {data.viewCount} views
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {data.saveCount + (saved ? 1 : 0)} saves
              </span>
            </div>
          </div>
        </div>
        {data.gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pt-2">
            {data.gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative shrink-0 h-14 w-14 overflow-hidden rounded-xl border-2 ${
                  active === i ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Tag className="h-3 w-3" />
          {data.kind} · {data.category.replace("-", " ")}
        </div>
        <h1 className="font-display text-2xl font-extrabold leading-tight">
          {data.title}
        </h1>
        <div className="flex items-baseline justify-between">
          <p className="font-display text-3xl font-extrabold text-primary">
            {formatPrice(data.price, data.currency)}
          </p>
          {data.negotiable && (
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Negotiable
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {data.area ? `${data.area}, ` : ""}
            {data.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(data.createdAt)}
          </span>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-border/60 bg-card p-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full brand-gradient text-white font-bold">
            {data.sellerName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold leading-tight truncate">
              {data.sellerName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>Verified seller</span>
              <span>·</span>
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>4.8</span>
            </div>
          </div>
          <Link
            href={`/chat/1`}
            className="text-[11px] font-semibold text-primary"
          >
            Visit shop
          </Link>
        </div>
      </div>

      {Object.keys(data.attributes).length > 0 && (
        <div className="px-4 pt-4">
          <h3 className="font-display font-bold text-sm mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.attributes).map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-border/60 bg-card p-2.5"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {k.replace(/_/g, " ")}
                </p>
                <p className="text-[13px] font-semibold mt-0.5">{String(v)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <h3 className="font-display font-bold text-sm mb-2">Description</h3>
        <p className="text-[13px] leading-relaxed text-foreground/85 whitespace-pre-line">
          {data.description}
        </p>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/20 p-3 flex gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[12px] leading-relaxed">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Stay safe when meeting in person
            </p>
            <p className="text-amber-800/80 dark:text-amber-300/80">
              Meet in a busy public place. Inspect the item before paying. Never
              send money in advance to strangers.{" "}
              <Link href="/safety" className="underline font-medium">
                Read more
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="h-28" />

      <div className="fixed bottom-0 inset-x-0 z-30 safe-pb">
        <div className="mx-auto max-w-[560px] px-3 pb-3 pt-2 bg-background/85 backdrop-blur border-t border-border/60">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${data.sellerPhone.replace(/\s/g, "")}`}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl border border-primary/30 bg-card text-primary font-semibold"
            >
              <Phone className="h-4 w-4" />
              Call seller
            </a>
            <Link
              href={`/chat/1`}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl brand-gradient text-white font-semibold shadow-md shadow-primary/30"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
