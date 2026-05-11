"use client";

import { Streamdown } from "streamdown";
import { createMathPlugin } from "@streamdown/math";
import { FunctionPlot } from "@/components/Plot/FunctionPlot";

const math = createMathPlugin({ singleDollarTextMath: true });

interface Props {
  text: string;
  isStreaming: boolean;
}

export function AssistantMessage({ text, isStreaming }: Props) {
  return (
    <div className="max-w-[85%] rounded-2xl bg-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <Streamdown
        plugins={{ math }}
        isAnimating={isStreaming}
        parseIncompleteMarkdown
        components={{
          code({ className, children, ...rest }) {
            if (className === "language-plot") {
              return <FunctionPlot expr={String(children).trim()} />;
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </Streamdown>
    </div>
  );
}
