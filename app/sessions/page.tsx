"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listSessions, deleteSession } from "@/lib/storage/sessions";
import type { Session } from "@/types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage on mount
    setSessions(listSessions());
    setHydrated(true);
  }, []);

  function onDelete(id: string) {
    deleteSession(id);
    setSessions(listSessions());
  }

  if (!hydrated) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Sessions</h1>
        <Link
          href="/lab"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          + New session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
          No sessions yet. Head to the{" "}
          <Link href="/lab" className="font-medium underline">
            lab
          </Link>{" "}
          and pose your first problem.
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
            >
              <Link href={`/lab?session=${s.id}`} className="flex-1">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {s.messages.length} messages · {s.mode === "show-your-work" ? "Show Your Work" : "Free"} ·{" "}
                  {new Date(s.updatedAt).toLocaleString()}
                </div>
              </Link>
              <button
                onClick={() => {
                  if (confirm(`Delete session "${s.title}"?`)) onDelete(s.id);
                }}
                className="ml-4 rounded p-1 text-xs text-zinc-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                aria-label="Delete session"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
