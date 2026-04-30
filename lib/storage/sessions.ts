"use client";

import type { Session, StoredMessage } from "@/types";

const KEY = "proof-lab:sessions";
const SCRATCH_PREFIX = "proof-lab:scratch:";

function readAll(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

function writeAll(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function listSessions(): Session[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id: string): Session | undefined {
  return readAll().find((s) => s.id === id);
}

export function saveSession(session: Session): void {
  const all = readAll().filter((s) => s.id !== session.id);
  all.push({ ...session, updatedAt: Date.now() });
  writeAll(all);
}

export function deleteSession(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function titleFromMessages(messages: StoredMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New session";
  const text = first.text.trim().slice(0, 60);
  return text.length === 0 ? "New session" : text;
}

function scratchKey(id: string): string {
  return `${SCRATCH_PREFIX}${id}`;
}

export function getScratch(id: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(scratchKey(id)) ?? "";
  } catch {
    return "";
  }
}

export function saveScratch(id: string, text: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(scratchKey(id), text);
  } catch {
    // ignore write failures
  }
}

export function clearScratch(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(scratchKey(id));
  } catch {
    // ignore
  }
}
