import { useRoute, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetVendor,
  useStartConversation,
  getGetVendorQueryKey,
  getListConversationsQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { Skeleton } from "@/components/Skeleton";
import { CheckCircle2, MapPin, Clock, ShieldCheck, MessageCircle } from "lucide-react";

export default function VendorPage() {
  const [, params] = useRoute<{ id: string }>("/vendor/:id");
  const id = Number(params?.id ?? 0);
  const vendor = useGetVendor(id, {
    query: { enabled: id > 0, queryKey: getGetVendorQueryKey(id) },
  });
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const startConv = useStartConversation({
    mutation: {
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        setLocation(`/chat/${data.id}`);
      },
    },
  });

  if (vendor.isLoading || !vendor.data) {
    return (
      <PhoneFrame>
        <TopBar showBack />
        <div className="px-4 pt-3 space-y-3">
          <Skeleton className="h-44" />
          <Skeleton className="h-32" />
        </div>
      </PhoneFrame>
    );
  }

  const v = vendor.data;
  return (
    <PhoneFrame>
      <TopBar showBack title={v.name} />
      <div className="relative h-44 bg-muted overflow-hidden">
        <img
          src={v.coverUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>
      <div className="px-4 -mt-12 relative">
        <div className="flex items-end gap-3">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-background bg-card overflow-hidden shadow-xl">
            <img
              src={v.logoUrl}
              alt={v.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pb-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xl font-bold truncate">
                {v.name}
              </h1>
              {v.verified && (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {v.tagline}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Stat
            icon={<Stars rating={v.rating} size={12} showNumber />}
            sub={`${v.reviewCount} reviews`}
          />
          <Stat
            icon={
              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {v.responseTimeMins}m
              </span>
            }
            sub="Response time"
          />
          <Stat
            icon={
              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {Math.round(v.fulfillmentRate * 100)}%
              </span>
            }
            sub="Fulfillment"
          />
        </div>

        <button
          onClick={() => startConv.mutate({ data: { vendorId: v.id } })}
          disabled={startConv.isPending}
          className="mt-3 w-full h-12 rounded-xl brand-gradient text-white font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
        >
          <MessageCircle className="h-4 w-4" />
          {startConv.isPending ? "Opening chat..." : "Chat with seller"}
        </button>

        <div className="mt-4 flex flex-wrap gap-2">
          {v.badges.map((b) => (
            <span
              key={b}
              className="text-[11px] font-semibold uppercase tracking-wide rounded-full bg-secondary text-secondary-foreground px-2.5 py-1"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            {v.about}
          </p>
          <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {v.city}, {v.country}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-lg font-bold tracking-tight">
            Shop {v.name.split(" ")[0]}
          </h2>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {v.products.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, vendorName: v.name }}
              />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Stat({ icon, sub }: { icon: React.ReactNode; sub: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-2 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}
