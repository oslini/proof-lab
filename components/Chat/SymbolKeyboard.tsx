"use client";

import { useState } from "react";
import { SYMBOL_GROUPS, type SymbolEntry } from "@/lib/math/symbols";

interface Props {
  onInsert: (latex: string, cursorOffset?: number) => void;
}

export function SymbolKeyboard({ onInsert }: Props) {
  const [open, setOpen] = useState<string>(SYMBOL_GROUPS[0].name);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap gap-1 border-b border-zinc-200 p-2 dark:border-zinc-800">
        {SYMBOL_GROUPS.map((g) => (
          <button
            key={g.name}
            type="button"
            onClick={() => setOpen(g.name)}
            className={`rounded px-2 py-1 text-xs font-medium transition ${
              open === g.name
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 p-2">
        {SYMBOL_GROUPS.find((g) => g.name === open)?.symbols.map((s, i) => (
          <SymbolButton key={i} entry={s} onInsert={onInsert} />
        ))}
      </div>
    </div>
  );
}

function SymbolButton({
  entry,
  onInsert,
}: {
  entry: SymbolEntry;
  onInsert: Props["onInsert"];
}) {
  return (
    <button
      type="button"
      title={entry.title ?? entry.label}
      onClick={() => onInsert(entry.latex, entry.cursorOffset)}
      className="min-w-[2.25rem] rounded border border-zinc-200 bg-white px-2 py-1 text-sm hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
    >
      {entry.label}
    </button>
  );
}
