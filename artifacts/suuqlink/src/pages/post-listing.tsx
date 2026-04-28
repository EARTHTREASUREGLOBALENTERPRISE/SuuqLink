import { useState } from "react";
import { useLocation } from "wouter";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { useCreateListing } from "@/lib/marketplace-api";
import {
  Car,
  Home as HomeIcon,
  Smartphone,
  Briefcase,
  Wrench,
  Building,
  PackageSearch,
  Camera,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const KINDS = [
  { slug: "used", label: "Used item", icon: Smartphone, category: "phones" },
  { slug: "vehicle", label: "Vehicle", icon: Car, category: "vehicles" },
  { slug: "property", label: "Property", icon: Building, category: "property-sale" },
  { slug: "rental", label: "Rental", icon: HomeIcon, category: "rentals" },
  { slug: "job", label: "Job", icon: Briefcase, category: "jobs" },
  { slug: "service", label: "Service", icon: Wrench, category: "services" },
  { slug: "other", label: "Other", icon: PackageSearch, category: "other" },
];

const CITIES = ["Hargeisa", "Mogadishu", "Berbera", "Burao", "Bosaso", "Kismayo"];

export default function PostListingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const create = useCreateListing();

  const [kind, setKind] = useState("used");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Hargeisa");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("used");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const selectedKind = KINDS.find((k) => k.slug === kind) ?? KINDS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim()) {
      toast({
        title: "Add a title and price",
        description: "These are required to post.",
      });
      return;
    }
    try {
      const created = await create.mutateAsync({
        kind,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency: "USD",
        category: selectedKind.category,
        condition,
        city,
        area,
        imageUrl: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(title)}/800/600`,
        sellerName: "You",
        sellerPhone: phone,
        contactMethods: ["call", "chat"],
      });
      toast({
        title: "Listing posted",
        description: "Buyers in your city can now see it.",
      });
      setLocation(`/local/${created.id}`);
    } catch {
      toast({ title: "Could not post", description: "Try again in a moment." });
    }
  };

  return (
    <PhoneFrame hideTabs>
      <TopBar title="Post a listing" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            What are you posting?
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {KINDS.map((k) => {
              const Icon = k.icon;
              const active = kind === k.slug;
              return (
                <button
                  type="button"
                  key={k.slug}
                  onClick={() => setKind(k.slug)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                    active
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-semibold">{k.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Toyota Vitz 2016 — automatic"
            className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)">
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
            />
          </Field>
          <Field label="Condition">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area / district">
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. 26 June"
              className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell buyers what makes it great..."
            rows={4}
            className="w-full rounded-2xl border border-border bg-card p-3 text-sm focus:outline-none focus:border-primary/50"
          />
        </Field>

        <Field label="Photo URL (optional)">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or leave blank for stock"
              className="flex-1 h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
        </Field>

        <Field label="Phone for buyers">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+252 ..."
            className="w-full h-12 rounded-2xl border border-border bg-card px-3 text-sm focus:outline-none focus:border-primary/50"
          />
        </Field>

        <div className="rounded-2xl bg-primary/8 border border-primary/15 p-3 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
          <p className="text-[12px] leading-relaxed text-foreground/80">
            Your listing will be reviewed automatically and goes live in seconds.
            Boost it later from your seller dashboard for more views.
          </p>
        </div>

        <button
          type="submit"
          disabled={create.isPending}
          className="w-full h-13 py-3.5 rounded-2xl brand-gradient text-white font-bold shadow-lg shadow-primary/25 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {create.isPending ? (
            "Posting..."
          ) : (
            <>
              <Check className="h-4 w-4" />
              Post listing — free
            </>
          )}
        </button>
      </form>
    </PhoneFrame>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
