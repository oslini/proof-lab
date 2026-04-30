"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_MODELS,
  MODEL_CHOICES,
  type Provider,
  type Settings,
  DEFAULT_SETTINGS,
} from "@/types";
import { loadSettings, saveSettings } from "@/lib/storage/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<null | "ok" | "fail" | "testing">(null);
  const [testError, setTestError] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage on mount
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function changeProvider(p: Provider) {
    setSettings((s) => ({ ...s, provider: p, model: DEFAULT_MODELS[p] }));
    setSaved(false);
  }

  function onSave() {
    saveSettings(settings);
    setSaved(true);
  }

  async function onTestKey() {
    setTestStatus("testing");
    setTestError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "test", role: "user", parts: [{ type: "text", text: "Reply with the single word OK." }] }],
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
          mode: settings.mode,
          probe: true,
        }),
      });
      if (!res.ok) {
        setTestStatus("fail");
        setTestError(`HTTP ${res.status}: ${await res.text()}`);
        return;
      }
      // Drain a few bytes to confirm the stream actually starts.
      const reader = res.body?.getReader();
      const { value } = (await reader?.read()) ?? {};
      if (!value) {
        setTestStatus("fail");
        setTestError("No stream data received.");
        return;
      }
      reader?.cancel();
      setTestStatus("ok");
    } catch (err) {
      setTestStatus("fail");
      setTestError(err instanceof Error ? err.message : String(err));
    }
  }

  if (!hydrated) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          ← Home
        </Link>
      </div>

      <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <label className="mb-2 block text-sm font-medium">AI provider</label>
          <div className="flex gap-2">
            {(["anthropic", "openai"] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => changeProvider(p)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  settings.provider === p
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
                }`}
              >
                {p === "anthropic" ? "Anthropic (Claude)" : "OpenAI"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Model</label>
          <select
            value={settings.model}
            onChange={(e) => update("model", e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            {MODEL_CHOICES[settings.provider].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            API key
            <span className="ml-2 text-xs font-normal text-zinc-500">
              Stored locally in your browser, never on our servers.
            </span>
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => update("apiKey", e.target.value)}
            placeholder={settings.provider === "anthropic" ? "sk-ant-..." : "sk-..."}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Tutor mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => update("mode", "show-your-work")}
              className={`flex-1 rounded-lg border px-4 py-3 text-left transition ${
                settings.mode === "show-your-work"
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
              }`}
            >
              <div className="text-sm font-semibold">Show Your Work</div>
              <div className="mt-1 text-xs text-zinc-500">
                Socratic dialogue. Tutor asks questions, gives graduated hints, never volunteers full solutions.
              </div>
            </button>
            <button
              onClick={() => update("mode", "free")}
              className={`flex-1 rounded-lg border px-4 py-3 text-left transition ${
                settings.mode === "free"
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
              }`}
            >
              <div className="text-sm font-semibold">Free</div>
              <div className="mt-1 text-xs text-zinc-500">
                Relaxed mode. Tutor still favors questions but will produce full solutions on request.
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            onClick={onSave}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Save
          </button>
          <button
            onClick={onTestKey}
            disabled={!settings.apiKey || testStatus === "testing"}
            className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {testStatus === "testing" ? "Testing…" : "Test key"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved.</span>}
          {testStatus === "ok" && <span className="text-sm text-green-600">Key works.</span>}
          {testStatus === "fail" && (
            <span className="text-sm text-red-600">Test failed: {testError}</span>
          )}
        </div>
      </section>
    </div>
  );
}
