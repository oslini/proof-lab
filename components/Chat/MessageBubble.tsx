"use client";

import { InlineMath, BlockMath } from "react-katex";
import { parseBlocks } from "@/lib/math/parseBlocks";
import { FunctionPlot } from "@/components/Plot/FunctionPlot";
import { AssistantMessage } from "@/components/Chat/AssistantMessage";

interface Props {
  role: "user" | "assistant" | "system";
  text: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, text, isStreaming = false }: Props) {
  const isUser = role === "user";

  if (role === "assistant") {
    return (
      <div className="flex justify-start">
        <AssistantMessage text={text} isStreaming={isStreaming} />
      </div>
    );
  }

  const blocks = parseBlocks(text);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
        }`}
      >
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
              <div key={i} className="my-2 overflow-x-auto">
                <BlockMath math={b.tex} />
              </div>
            );
          }
          return <FunctionPlot key={i} expr={b.expr} />;
        })}
      </div>
    </div>
  );
}
