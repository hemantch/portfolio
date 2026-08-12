"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  IconMessageCircle2,
  IconX,
  IconSend2,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const WORKER_URL = process.env.NEXT_PUBLIC_RAG_API_URL;

interface ChatMatch {
  source: string;
  section: string;
  score: number;
}

interface Inspector {
  model: string;
  retrievalLatencyMs: number;
  totalLatencyMs: number;
  matches: ChatMatch[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "notice";
  text: string;
  sources?: string[];
  inspector?: Inspector;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, debug }: { message: ChatMessage; debug: boolean }) {
  const isUser = message.role === "user";
  const isNotice = message.role === "notice";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm font-inter leading-relaxed",
          isUser && "bg-accent/15 border border-accent/30 text-white",
          !isUser && !isNotice && "bg-white/5 border border-white/10 text-white/90",
          isNotice && "bg-highlight/10 border border-highlight/30 text-highlight"
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {message.sources.map((s, i) => (
              <span
                key={i}
                className="font-inter text-[10px] leading-none px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[#94A3B8]"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {debug && message.inspector && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
            <div className="flex justify-between text-[10px] font-inter text-[#94A3B8]">
              <span>Model</span>
              <span className="text-accent/80">{message.inspector.model}</span>
            </div>
            <div className="flex justify-between text-[10px] font-inter text-[#94A3B8]">
              <span>Retrieval</span>
              <span>{message.inspector.retrievalLatencyMs}ms</span>
            </div>
            <div className="flex justify-between text-[10px] font-inter text-[#94A3B8]">
              <span>Total</span>
              <span>{message.inspector.totalLatencyMs}ms</span>
            </div>
            {message.inspector.matches.length > 0 && (
              <div className="pt-1.5 space-y-1">
                {message.inspector.matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-2 text-[10px] font-inter text-white/30"
                  >
                    <span className="truncate">
                      {m.source} § {m.section}
                    </span>
                    <span className="shrink-0 text-accent/60">{m.score.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskMe() {
  const [open, setOpen] = useState(false);
  const [debug, setDebug] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { id: uid(), role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      if (!WORKER_URL) {
        setMessages((m) => [
          ...m,
          { id: uid(), role: "notice", text: "Chat isn't configured yet — missing API URL." },
        ]);
        return;
      }

      const res = await fetch(`${WORKER_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.status === 429) {
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "notice",
            text: "I'm getting a lot of questions right now — try again in a minute.",
          },
        ]);
        return;
      }

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { id: uid(), role: "notice", text: "Something went wrong on my end. Try again shortly." },
        ]);
        return;
      }

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: data.answer?.trim() || "I don't have an answer for that yet.",
          sources: data.sources,
          inspector:
            typeof data.retrievalLatencyMs === "number"
              ? {
                  model: data.model,
                  retrievalLatencyMs: data.retrievalLatencyMs,
                  totalLatencyMs: data.totalLatencyMs,
                  matches: data.matches ?? [],
                }
              : undefined,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "notice", text: "Couldn't reach the chat service. Check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {!open ? (
        <motion.button
          key="trigger"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setOpen(true)}
          aria-label="Ask me anything"
          style={{ bottom: 24, right: 24 }}
          className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-accent text-[#0A0A0F] shadow-[0_0_25px_rgba(0,212,255,0.35)] cursor-pointer"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-accent"
            animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <IconMessageCircle2 className="relative w-6 h-6" stroke={2} />
        </motion.button>
      ) : (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed z-50 flex flex-col bg-[#111116] border border-[#1a1a2e] shadow-2xl overflow-hidden
                     inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[520px] sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1a1a2e] shrink-0">
            <h3 className="font-syne font-bold text-white text-sm tracking-wide">
              Ask me anything
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDebug((d) => !d)}
                aria-label="Toggle debug inspector"
                aria-pressed={debug}
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  debug ? "text-accent bg-accent/10" : "text-white/40 hover:text-white/70"
                )}
              >
                <IconTerminal2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-md text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {messages.length === 0 && (
              <p className="font-inter text-white/30 text-sm text-center mt-10 px-4">
                Ask about my experience, skills, or projects.
              </p>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} debug={debug} />
            ))}
            {loading && <TypingIndicator />}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 p-3 border-t border-[#1a1a2e] shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 font-inter bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-[#0A0A0F] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0 cursor-pointer"
            >
              <IconSend2 className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
