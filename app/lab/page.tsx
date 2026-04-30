"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { MessageBubble } from "@/components/Chat/MessageBubble";
import { MathInput, type MathInputHandle } from "@/components/Chat/MathInput";
import { SymbolKeyboard } from "@/components/Chat/SymbolKeyboard";
import { HintControls } from "@/components/Chat/HintControls";
import { loadSettings } from "@/lib/storage/settings";
import {
  getSession,
  saveSession,
  titleFromMessages,
} from "@/lib/storage/sessions";
import { DEFAULT_SETTINGS, type Mode, type Settings, type StoredMessage } from "@/types";

function uiToStored(messages: UIMessage[]): StoredMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role as StoredMessage["role"],
    text: extractText(m),
    createdAt: Date.now(),
  }));
}

function storedToUI(messages: StoredMessage[]): UIMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.text }],
  })) as UIMessage[];
}

function extractText(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function LabPage() {
  return (
    <Suspense fallback={null}>
      <LabPageInner />
    </Suspense>
  );
}

function LabPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromUrl = searchParams.get("session");

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<MathInputHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
    const s = loadSettings();
    setSettings(s);

    let id = sessionIdFromUrl;
    if (id) {
      const existing = getSession(id);
      if (existing) {
        setInitialMessages(storedToUI(existing.messages));
      }
    } else {
      id = crypto.randomUUID();
      router.replace(`/lab?session=${id}`);
    }
    setSessionId(id ?? crypto.randomUUID());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
          mode: settings.mode,
        }),
      }),
    [settings.provider, settings.model, settings.apiKey, settings.mode],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: sessionId,
    transport,
    messages: initialMessages,
  });

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    if (messages.length === 0) return;
    const stored = uiToStored(messages);
    saveSession({
      id: sessionId,
      title: titleFromMessages(stored),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: settings.mode,
      messages: stored,
    });
  }, [messages, sessionId, hydrated, settings.mode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function send(text: string) {
    if (!text.trim()) return;
    if (!settings.apiKey) {
      alert("Please configure your API key in Settings first.");
      return;
    }
    sendMessage({ text });
    setDraft("");
  }

  function onModeChange(mode: Mode) {
    const next = { ...settings, mode };
    setSettings(next);
    // Persist to localStorage so the next /api/chat call uses the new mode.
    if (typeof window !== "undefined") {
      window.localStorage.setItem("proof-lab:settings", JSON.stringify(next));
    }
  }

  function newSession() {
    const id = crypto.randomUUID();
    setMessages([]);
    setSessionId(id);
    router.replace(`/lab?session=${id}`);
  }

  if (!hydrated) return null;

  const noKey = !settings.apiKey;

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ModeBadge mode={settings.mode} onChange={onModeChange} />
          <span className="text-xs text-zinc-500">
            {settings.provider === "anthropic" ? "Claude" : "OpenAI"} · {settings.model}
          </span>
        </div>
        <button
          onClick={newSession}
          className="rounded border border-zinc-200 px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          + New session
        </button>
      </div>

      {noKey && (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
          Add an API key in{" "}
          <Link href="/settings" className="font-medium underline">
            Settings
          </Link>{" "}
          to start a session.
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {messages.length === 0 && (
          <div className="mx-auto max-w-md py-12 text-center text-sm text-zinc-500">
            <p className="mb-2 text-base font-medium text-zinc-700 dark:text-zinc-300">
              Pose a problem.
            </p>
            <p>
              Try: <em>&ldquo;Find the derivative of $f(x) = x^2 \sin(x)$.&rdquo;</em> or{" "}
              <em>&ldquo;Prove $1 + 2 + \cdots + n = \frac{"{n(n+1)}"}{"{2}"}$ by induction.&rdquo;</em>
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={extractText(m)} />
        ))}
        {status === "submitted" && (
          <div className="text-xs text-zinc-500">Tutor is thinking…</div>
        )}
        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-xs text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            Error: {error.message}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <HintControls
          onRequestHint={(t) => send(t)}
          disabled={noKey || status === "streaming" || status === "submitted" || messages.length === 0}
        />
        <MathInput
          ref={inputRef}
          value={draft}
          onChange={setDraft}
          onSubmit={() => send(draft)}
          disabled={noKey}
        />
        {settings.showSymbolKeyboard && (
          <SymbolKeyboard
            onInsert={(latex, offset) => inputRef.current?.insertAtCursor(latex, offset)}
          />
        )}
        <div className="flex justify-end">
          <button
            onClick={() => send(draft)}
            disabled={noKey || !draft.trim() || status === "streaming" || status === "submitted"}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeBadge({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-zinc-300 text-xs dark:border-zinc-700">
      <button
        onClick={() => onChange("show-your-work")}
        className={`px-2 py-1 ${
          mode === "show-your-work"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-white dark:bg-zinc-950"
        }`}
      >
        Show Your Work
      </button>
      <button
        onClick={() => onChange("free")}
        className={`px-2 py-1 ${
          mode === "free"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-white dark:bg-zinc-950"
        }`}
      >
        Free
      </button>
    </div>
  );
}
