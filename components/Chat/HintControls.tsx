"use client";

import { HINT_LABELS, HINT_DESCRIPTIONS, hintTag } from "@/lib/prompts/hintLadder";
import type { HintLevel } from "@/types";

interface Props {
  onRequestHint: (text: string) => void;
  disabled?: boolean;
}

export function HintControls({ onRequestHint, disabled }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-zinc-500">Stuck?</span>
      {([1, 2, 3] as HintLevel[]).map((level) => (
        <button
          key={level}
          type="button"
          disabled={disabled}
          onClick={() => onRequestHint(hintTag(level))}
          title={HINT_DESCRIPTIONS[level]}
          className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
        >
          {HINT_LABELS[level]}
        </button>
      ))}
    </div>
  );
}
