export type Block =
  | { kind: "prose"; text: string }
  | { kind: "inline-math"; tex: string }
  | { kind: "display-math"; tex: string }
  | { kind: "plot"; expr: string };

const PLOT_FENCE = /```plot\s*\n([\s\S]*?)```/g;
const DISPLAY_MATH = /\$\$([\s\S]+?)\$\$/g;
const INLINE_MATH = /\$([^\n$]+?)\$/g;

interface Span {
  start: number;
  end: number;
  block: Block;
}

export function parseBlocks(text: string): Block[] {
  const spans: Span[] = [];

  for (const m of text.matchAll(PLOT_FENCE)) {
    const expr = (m[1] ?? "").trim();
    spans.push({
      start: m.index ?? 0,
      end: (m.index ?? 0) + m[0].length,
      block: { kind: "plot", expr },
    });
  }

  for (const m of text.matchAll(DISPLAY_MATH)) {
    const idx = m.index ?? 0;
    if (overlaps(spans, idx)) continue;
    spans.push({
      start: idx,
      end: idx + m[0].length,
      block: { kind: "display-math", tex: m[1] ?? "" },
    });
  }

  for (const m of text.matchAll(INLINE_MATH)) {
    const idx = m.index ?? 0;
    if (overlaps(spans, idx)) continue;
    spans.push({
      start: idx,
      end: idx + m[0].length,
      block: { kind: "inline-math", tex: m[1] ?? "" },
    });
  }

  spans.sort((a, b) => a.start - b.start);

  const out: Block[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      const prose = text.slice(cursor, span.start);
      if (prose.length > 0) out.push({ kind: "prose", text: prose });
    }
    out.push(span.block);
    cursor = span.end;
  }
  if (cursor < text.length) {
    out.push({ kind: "prose", text: text.slice(cursor) });
  }
  return out;
}

function overlaps(spans: Span[], idx: number): boolean {
  return spans.some((s) => idx >= s.start && idx < s.end);
}
