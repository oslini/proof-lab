"use client";

import "mathlive";
import type { MathfieldElement } from "mathlive";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface MathInputHandle {
  insertAtCursor: (latex: string, cursorOffset?: number) => void;
  focus: () => void;
  toggleVirtualKeyboard: () => void;
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
  const fieldRef = useRef<MathfieldElement | null>(null);

  useImperativeHandle(ref, () => ({
    insertAtCursor(latex, cursorOffset = 0) {
      const field = fieldRef.current;
      if (!field) return;
      field.focus();
      field.insert(latex);
      if (cursorOffset) {
        const command = cursorOffset < 0 ? "moveToPreviousChar" : "moveToNextChar";
        for (let i = 0; i < Math.abs(cursorOffset); i += 1) {
          field.executeCommand(command);
        }
      }
      onChange(field.value);
    },
    focus() {
      fieldRef.current?.focus();
    },
    toggleVirtualKeyboard() {
      const field = fieldRef.current;
      if (!field) return;
      field.focus();
      field.executeCommand("toggleVirtualKeyboard");
    },
  }));

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (field.value !== value) {
      field.value = value;
    }
  }, [value]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.smartMode = true;
    field.virtualKeyboardMode = "manual";
    field.readOnly = Boolean(disabled);
    field.placeholder =
      placeholder ?? "Ask a question, or paste a problem. ⌘/Ctrl+Enter to send.";
  }, [disabled, placeholder]);

  return (
    <div className="flex flex-col gap-2">
      <math-field
        ref={fieldRef}
        onInput={(event) => {
          const target = event.currentTarget as MathfieldElement;
          onChange(target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onSubmit();
          }
        }}
        className={`w-full min-h-[3.5rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 ${
          disabled ? "opacity-50" : ""
        }`}
      />
    </div>
  );
});
