import { useState } from "react";
import { useListVendors } from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { VendorCard } from "@/components/VendorCard";
import { Skeleton } from "@/components/Skeleton";
import { Search } from "lucide-react";

export default function VendorsPage() {
  const [q, setQ] = useState("");
  const vendors = useListVendors({ q: q || undefined });

  return (
    <PhoneFrame>
      <TopBar title="Vendors" />
      <div className="px-4 pt-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vendors, cities..."
            className="w-full h-11 pl-10 pr-3 rounded-2xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          {vendors.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44" />
              ))
            : (vendors.data ?? []).map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
