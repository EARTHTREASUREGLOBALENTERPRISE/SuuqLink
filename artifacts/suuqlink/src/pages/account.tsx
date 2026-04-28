import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCurrentUser,
  useSwitchRole,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";

import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  Globe,
  Sun,
  Moon,
  Package,
  MessageSquare,
  Store,
  Shield,
  HelpCircle,
  LogOut,
  CheckCircle2,
} from "lucide-react";

const LANGS = [
  { code: "en", name: "English" },
  { code: "so", name: "Soomaali" },
  { code: "sw", name: "Kiswahili" },
  { code: "ar", name: "العربية" },
];

export default function AccountPage() {
  const user = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() },
  });
  const qc = useQueryClient();
  const switchRole = useSwitchRole({
    mutation: {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }),
    },
  });
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("suuqlink-lang");
    if (saved) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("suuqlink-lang", lang);
  }, [lang]);

  return (
    <PhoneFrame>
      <TopBar title="Account" />
      <div className="px-4 pt-3 space-y-4">
        {user.isLoading ? (
          <Skeleton className="h-24" />
        ) : user.data ? (
          <div className="rounded-3xl brand-gradient text-white p-5 shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <img
                src={user.data.avatarUrl}
                alt=""
                className="h-14 w-14 rounded-2xl bg-white/20 object-cover"
              />
              <div>
                <p className="font-display text-lg font-extrabold">
                  {user.data.name}
                </p>
                <p className="text-sm text-white/80">{user.data.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-white/15 backdrop-blur px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {user.data.role}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm">Not signed in.</p>
            <Link href="/login" className="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-xl brand-gradient text-white text-sm font-semibold">
                Sign in
              </Link>
          </div>
        )}

        <Section title="Switch persona" subtitle="Demo: jump between roles">
          <div className="grid grid-cols-3 gap-2">
            {(["buyer", "seller", "admin"] as const).map((r) => {
              const active = user.data?.role === r;
              return (
                <button
                  key={r}
                  onClick={() => switchRole.mutate({ data: { role: r } })}
                  disabled={switchRole.isPending}
                  className={`h-12 rounded-xl border text-xs font-bold uppercase tracking-wide transition disabled:opacity-60 ${active ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border hover:border-primary/40"}`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Quick links">
          <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            <Item
              icon={Package}
              label="My orders"
              onClick={() => setLocation("/orders")}
            />
            <Item
              icon={MessageSquare}
              label="Messages"
              onClick={() => setLocation("/chat")}
            />
            {user.data?.role === "seller" && user.data.vendorId && (
              <Item
                icon={Store}
                label="My storefront"
                onClick={() => setLocation(`/vendor/${user.data!.vendorId}`)}
              />
            )}
            {user.data?.role === "admin" && (
              <Item
                icon={Shield}
                label="Admin dashboard"
                onClick={() => setLocation("/admin")}
              />
            )}
          </div>
        </Section>

        <Section title="Preferences">
          <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                  <Globe className="h-4 w-4 text-primary" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Language</p>
                  <p className="text-xs text-muted-foreground">
                    Display language across the app
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 border ${lang === l.code ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                  >
                    {lang === l.code && (
                      <CheckCircle2 className="inline h-3 w-3 mr-1 -mt-px" />
                    )}
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <Item
              icon={theme === "dark" ? Moon : Sun}
              label={theme === "dark" ? "Dark mode" : "Light mode"}
              right={
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
                  aria-label="Toggle theme"
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-card shadow-md transform transition ${theme === "dark" ? "translate-x-5" : ""}`}
                  />
                </button>
              }
            />
            <Item
              icon={HelpCircle}
              label="Help & support"
              onClick={() => {}}
            />
          </div>
        </Section>

        <button
          onClick={() => {
            localStorage.removeItem("suuqlink-onboarded");
            setLocation("/onboarding");
          }}
          className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-destructive/30 text-destructive font-semibold hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          Reset onboarding
        </button>

        <p className="text-center text-[10px] text-muted-foreground pt-2 pb-4">
          SuuqLink • v0.1 • Made with care for emerging markets
        </p>
      </div>
    </PhoneFrame>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="px-1 mb-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground/80">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  onClick,
  right,
}: {
  icon: typeof Package;
  label: string;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  const Cmp: any = onClick ? "button" : "div";
  return (
    <Cmp
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-muted/60 transition text-left"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {right ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </Cmp>
  );
}
