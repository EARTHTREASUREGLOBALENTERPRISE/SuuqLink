import { useRoute } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetConversation,
  useSendMessage,
  getGetConversationQueryKey,
  getListConversationsQueryKey,
} from "@workspace/api-client-react";
import { TopBar, PhoneFrame } from "@/components/AppShell";
import { formatTime } from "@/lib/format";
import { Send, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatThreadPage() {
  const [, params] = useRoute<{ id: string }>("/chat/:id");
  const id = Number(params?.id ?? 0);
  const conv = useGetConversation(id, {
    query: {
      enabled: id > 0,
      refetchInterval: 3000,
      queryKey: getGetConversationQueryKey(id),
    },
  });
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const send = useSendMessage({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetConversationQueryKey(id) });
        qc.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        setBody("");
      },
    },
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [conv.data?.messages.length]);

  return (
    <PhoneFrame hideTabs>
      <TopBar
        showBack
        title={conv.data?.conversation.vendorName ?? "Chat"}
      />
      <div
        ref={scrollRef}
        className="px-4 pt-3 pb-32 min-h-[calc(100vh-160px)] overflow-y-auto space-y-2"
      >
        {(conv.data?.messages ?? []).map((m, i) => {
          const mine = m.author === "me";
          const showAvatar =
            !mine &&
            (i === 0 || conv.data!.messages[i - 1].author !== m.author);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine &&
                (showAvatar ? (
                  <img
                    src={conv.data?.conversation.vendorLogo}
                    alt=""
                    className="h-7 w-7 rounded-full bg-muted shrink-0"
                  />
                ) : (
                  <div className="w-7 shrink-0" />
                ))}
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${mine ? "brand-gradient text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}
              >
                <p className="text-sm leading-snug whitespace-pre-wrap">
                  {m.body}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${mine ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
        {conv.data?.messages.length === 0 && (
          <div className="pt-12 text-center text-sm text-muted-foreground">
            <ArrowDown className="h-4 w-4 mx-auto mb-2" />
            Say hi to start the conversation.
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 safe-pb">
        <div className="mx-auto max-w-[560px] px-3 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (body.trim().length > 0) {
                send.mutate({ id, data: { body: body.trim() } });
              }
            }}
            className="glass border border-border/70 rounded-2xl p-2 shadow-lg shadow-black/5 flex items-center gap-2"
          >
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 h-10 px-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!body.trim() || send.isPending}
              className="grid h-10 w-10 place-items-center rounded-xl brand-gradient text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </PhoneFrame>
  );
}
