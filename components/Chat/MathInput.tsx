"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { InlineMath, BlockMath } from "react-katex";
import { parseBlocks } from "@/lib/math/parseBlocks";

export interface MathInputHandle {
  insertAtCursor: (latex: string, cursorOffset?: number) => void;
  focus: () => void;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MathInput = forwardRef<MathInputHandle, Props>(function MathInput(
  { value, onChange, onSubmit, placeholder, disabled },
  ref,
) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(true);

  useImperativeHandle(ref, () => ({
    insertAtCursor(latex, cursorOffset = 0) {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart ?? value.length;
      const end = ta.selectionEnd ?? value.length;
      const inMath = isInsideMath(value, start);
      const insertText = inMath ? latex : `$${latex}$`;
      const effectiveOffset = inMath ? cursorOffset : cursorOffset - 1;
      const before = value.slice(0, start);
      const after = value.slice(end);
      const next = before + insertText + after;
      onChange(next);
      const newPos = start + insertText.length + effectiveOffset;
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(newPos, newPos);
      });
    },
    focus() {
      taRef.current?.focus();
    },
  }));

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 240) + "px";
  }, [value]);

  const blocks = parseBlocks(value);
  const hasMath = blocks.some((b) => b.kind === "inline-math" || b.kind === "display-math");

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={taRef}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder ?? "Ask a question, or paste a problem. ⌘/Ctrl+Enter to send."}
        rows={3}
        className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
      />
      {showPreview && hasMath && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Preview</span>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              hide
            </button>
          </div>
          <div className="overflow-x-auto space-y-2 leading-relaxed">
            {blocks.map((b, i) => {
              if (b.kind === "prose") {
                return (
                  <span key={i} className="whitespace-pre-wrap break-words">
                    {b.text}
                  </span>
                );
              }
              if (b.kind === "inline-math") {
                return (
                  <span key={i} className="mx-0.5 inline-block">
                    <InlineMath math={b.tex} />
                  </span>
                );
              }
              if (b.kind === "display-math") {
                return (
                  <div key={i} className="my-1 overflow-x-auto">
                    <BlockMath math={b.tex} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {!showPreview && (
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="self-start text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          show preview
        </button>
      )}
    </div>
  );
});

function isInsideMath(text: string, index: number): boolean {
  const spans: Array<{ start: number; end: number }> = [];

  for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$/g)) {
    const start = m.index ?? 0;
    spans.push({ start, end: start + m[0].length });
  }

  for (const m of text.matchAll(/\$([^\n$]+?)\$/g)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (spans.some((s) => start >= s.start && start < s.end)) continue;
    spans.push({ start, end });
  }

  return spans.some((s) => index > s.start && index < s.end);
}
