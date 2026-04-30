"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  expr: string;
}

export function FunctionPlot({ expr }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fnExpr = useMemo(() => parseFnExpr(expr), [expr]);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!fnExpr) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale error before re-rendering
    setRenderError(null);

    (async () => {
      const mod = await import("function-plot");
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = "";
      try {
        mod.default({
          target: ref.current,
          width: ref.current.clientWidth || 480,
          height: 260,
          grid: true,
          data: [{ fn: fnExpr, sampler: "builtIn", graphType: "polyline" }],
        });
      } catch (e) {
        setRenderError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fnExpr]);

  if (!fnExpr) {
    return (
      <div className="my-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        Could not parse plot expression: {expr}
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="my-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        Plot error: {renderError}
      </div>
    );
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
      <div ref={ref} />
    </div>
  );
}

function parseFnExpr(raw: string): string | null {
  const trimmed = raw.trim();
  const m = trimmed.match(/^[a-zA-Z]+\s*\(\s*[a-zA-Z]+\s*\)\s*=\s*(.+)$/);
  if (m) return m[1].trim();
  if (trimmed.length > 0) return trimmed;
  return null;
}
