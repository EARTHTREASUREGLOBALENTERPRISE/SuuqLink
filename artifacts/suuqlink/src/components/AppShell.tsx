import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import {
  Home as HomeIcon,
  Search,
  ShoppingBag,
  MessageSquare,
  User,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
} from "lucide-react";
import {
  useGetCart,
  useGetCurrentUser,
  useListConversations,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted transition-colors"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export function TopBar({
  title,
  showBack,
  right,
}: {
  title?: string;
  showBack?: boolean;
  right?: ReactNode;
}) {
  const [, setLocation] = useLocation();
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60 safe-pt">
      <div className="flex items-center gap-3 px-4 h-14">
        {showBack ? (
          <button
            type="button"
            onClick={() => window.history.length > 1 ? window.history.back() : setLocation("/")}
            aria-label="Back"
            className="grid h-10 w-10 -ml-2 place-items-center rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg brand-gradient text-white shadow-md">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <span>SuuqLink</span>
            </Link>
        )}
        {title && (
          <div className="flex-1 text-center font-display font-semibold tracking-tight truncate">
            {title}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {right}
          {!right && (
            <>
              <Link href="/search" aria-label="Search"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted">
                  <Search className="h-4 w-4" />
                </Link>
              <button
                aria-label="Notifications"
                className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card hover:bg-muted relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function TabItem({
  href,
  label,
  icon: Icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link href={href} className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs">
        <span className="relative">
          <Icon
            className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
            strokeWidth={active ? 2.4 : 1.8}
          />
          {badge != null && badge > 0 && (
            <span className="absolute -top-2 -right-3 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        <span
          className={`font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
        >
          {label}
        </span>
        {active && (
          <motion.span
            layoutId="tab-pill"
            className="absolute -top-px h-0.5 w-8 rounded-full bg-primary"
          />
        )}
      </Link>
  );
}

export function BottomTabs() {
  const [location] = useLocation();
  const cart = useGetCart();
  const convs = useListConversations();
  const cartCount = cart.data?.itemCount ?? 0;
  const unread = (convs.data ?? []).reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  const tabs = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/search", label: "Search", icon: Search },
    { href: "/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { href: "/chat", label: "Chat", icon: MessageSquare, badge: unread },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-pb">
      <div className="mx-auto max-w-[560px] px-3 pb-2">
        <div className="flex items-stretch glass rounded-2xl border border-border/70 shadow-lg shadow-black/5">
          {tabs.map((t) => (
            <TabItem
              key={t.href}
              href={t.href}
              label={t.label}
              icon={t.icon}
              badge={t.badge}
              active={
                t.href === "/"
                  ? location === "/"
                  : location === t.href || location.startsWith(t.href + "/")
              }
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

export function PhoneFrame({
  children,
  hideTabs,
  wide,
}: {
  children: ReactNode;
  hideTabs?: boolean;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background grain">
      <div
        className={`mx-auto ${wide ? "max-w-6xl" : "max-w-[560px]"} relative min-h-screen ${wide ? "" : "border-x border-border/40"} bg-background`}
      >
        {children}
        {!hideTabs && <div className="h-24" />}
      </div>
      {!hideTabs && <BottomTabs />}
    </div>
  );
}

export function useCurrentUser() {
  return useGetCurrentUser({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
      queryKey: getGetCurrentUserQueryKey(),
    },
  });
}
