import type { HintLevel } from "@/types";

export const HINT_LABELS: Record<HintLevel, string> = {
  1: "L1 — Concept nudge",
  2: "L2 — Theorem pointer",
  3: "L3 — One worked step",
};

export const HINT_DESCRIPTIONS: Record<HintLevel, string> = {
  1: "Name the relevant idea without applying it.",
  2: "State the rule and ask me to apply it.",
  3: "Show one step, then stop.",
};

export function hintTag(level: HintLevel): string {
  return `[HINT_LEVEL=${level}] Please give me a Level ${level} hint on the current problem.`;
}
