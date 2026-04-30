"use client";

import "mathlive";
import type { MathfieldElement } from "mathlive";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { useEffect, useRef } from "react";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"math-field": DetailedHTMLProps<HTMLAttributes<MathfieldElement>, MathfieldElement>;
		}
	}
}

interface Props {
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}

export function ScratchPaper({
	placeholder = "This space helps you keep your work all in one place.",
	readOnly = true,
	className,
}: Props) {
	const fieldRef = useRef<MathfieldElement | null>(null);

	useEffect(() => {
		const field = fieldRef.current;
		if (!field) return;
		const setOptions = (field as unknown as { setOptions: (opts: Record<string, unknown>) => void })
			.setOptions;
		setOptions?.({
			smartMode: true,
			virtualKeyboardMode: "manual",
			readOnly,
			placeholder,
		});
	}, [placeholder, readOnly]);

	return (
		<div className={`rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900 ${className ?? ""}`}>
			<div className="mb-2 text-xs font-medium text-zinc-500">Scratch Paper</div>
			<math-field
				ref={fieldRef}
				className={`w-full min-h-[6rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 ${
					readOnly ? "opacity-70" : ""
				}`}
			/>
		</div>
	);
}
