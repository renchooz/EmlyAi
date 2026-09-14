import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useAI } from "../context/AIContext";
import { cn } from "../lib/utils";

const SUGGESTIONS = [
  "What should I highlight for a senior frontend role?",
  "How do I write a strong subject line for a cold application?",
  "What does the ATS match score actually measure?",
];

/**
 * Shared EmlyAI assistant chat — used both as the dedicated `/chat` page
 * and embedded on the Dashboard. State (`chatMessages`) lives in AIContext
 * so a conversation started in one place is still there in the other.
 */
const EmlyChatPanel = ({ className }) => {
  const { user } = useAuth();
  const { chatMessages, chatLoading, sendChatMessage } = useAI();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim() || chatLoading) return;
    sendChatMessage(draft);
    setDraft("");
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-elevated", className)}>
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
          <Sparkles size={15} />
        </span>
        <div>
          <p
            className="font-medium text-fg"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--heading-sm)", letterSpacing: "-0.012em" }}
          >
            Ask EmlyAI
          </p>
          <p className="text-xs text-fg-muted">Resumes, job descriptions, interview prep — ask anything.</p>
        </div>
      </div>

      <div ref={scrollRef} className="custom-scroll flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-sunken text-fg-muted">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="font-medium text-fg">Hi {user?.name?.split(" ")[0] || "there"}, I'm EmlyAI.</p>
              <p className="mt-1 text-sm text-fg-muted">Ask me about your resume, a job posting, or how to use EmlyAI.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendChatMessage(s)}
                  className="rounded-full border border-border bg-surface-sunken px-3.5 py-2 text-xs text-fg-muted transition hover:bg-elevated hover:text-fg"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg, i) => (
            <div key={i} className={cn("flex items-end gap-2.5", msg.role === "user" && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  msg.role === "user" ? "bg-surface-sunken text-fg" : "bg-brand-500 text-white"
                )}
              >
                {msg.role === "user" ? <User size={13} /> : <Sparkles size={13} />}
              </span>
              <div
                className={cn(
                  "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-br-sm bg-brand-500 text-white"
                    : cn("rounded-bl-sm bg-surface-sunken text-fg", msg.failed && "text-danger")
                )}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}

        {chatLoading && (
          <div className="flex items-end gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
              <Sparkles size={13} />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-subtle" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 border-t border-border p-3.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask EmlyAI anything…"
          className="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-fg outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!draft.trim() || chatLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-400 disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
};

export default EmlyChatPanel;
