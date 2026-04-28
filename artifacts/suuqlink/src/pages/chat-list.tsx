import { Link } from "wouter";
import { useListConversations } from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeleton";
import { formatRelativeTime } from "@/lib/format";
import { MessageSquare } from "lucide-react";

export default function ChatListPage() {
  const convs = useListConversations();

  return (
    <PhoneFrame>
      <TopBar title="Messages" />
      <div className="px-4 pt-3 space-y-2">
        {convs.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))
        ) : (convs.data ?? []).length === 0 ? (
          <div className="pt-16 flex flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary mb-3">
              <MessageSquare className="h-8 w-8 text-primary/60" />
            </div>
            <p className="font-display text-lg font-bold">No messages</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Chat with vendors directly to ask questions or negotiate.
            </p>
          </div>
        ) : (
          (convs.data ?? []).map((c) => (
            <Link key={c.id} href={`/chat/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary/40 transition">
                <div className="relative">
                  <img
                    src={c.vendorLogo}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover bg-muted"
                  />
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">
                      {c.vendorName}
                    </p>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatRelativeTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${c.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {c.lastMessage}
                  </p>
                </div>
              </Link>
          ))
        )}
      </div>
    </PhoneFrame>
  );
}
