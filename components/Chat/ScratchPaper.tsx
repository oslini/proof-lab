"use client";

import "mathlive";
import type { MathfieldElement } from "mathlive";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { useEffect, useRef } from "react";

import type { ScratchValue } from "@/types";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"math-field": DetailedHTMLProps<HTMLAttributes<MathfieldElement>, MathfieldElement>;
		}
	}
}

interface Props {
	value: ScratchValue;
	onChange: (value: ScratchValue) => void;
	readOnly?: boolean;
	className?: string;
	onCheck?: () => void;
	checkDisabled?: boolean;
}

export function ScratchPaper({
	value,
	onChange,
	readOnly = false,
	className,
	onCheck,
	checkDisabled,
}: Props) {
	const fieldRef = useRef<MathfieldElement | null>(null);
	// Mirror the latest value so the math-field input listener (bound once) reads fresh notes.
	const valueRef = useRef(value);
	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	useEffect(() => {
		const field = fieldRef.current;
		if (!field) return;
		field.smartMode = true;
		(field as unknown as { virtualKeyboardMode: string }).virtualKeyboardMode = "manual";
		field.readOnly = readOnly;
		field.placeholder = "Current expression (renders as math)";
	}, [readOnly]);

	useEffect(() => {
		const field = fieldRef.current;
		if (!field) return;
		if (field.value !== value.math) {
			field.value = value.math;
		}
	}, [value.math]);

	useEffect(() => {
		const field = fieldRef.current;
		if (!field) return;
		const handler = () => {
			onChange({ notes: valueRef.current.notes, math: field.value });
		};
		field.addEventListener("input", handler);
		return () => field.removeEventListener("input", handler);
	}, [onChange]);

	const canCheck =
		Boolean(onCheck) &&
		!checkDisabled &&
		(value.notes.trim().length > 0 || value.math.trim().length > 0);

	return (
		<div className={`flex h-full flex-col rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900 ${className ?? ""}`}>
			<div className="mb-2 flex items-center justify-between gap-2">
				<div className="text-xs font-medium text-zinc-500">Scratch Paper</div>
				{onCheck && (
					<button
						type="button"
						onClick={onCheck}
						disabled={!canCheck}
						className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
					>
						Check my work
					</button>
				)}
			</div>
			<textarea
				value={value.notes}
				onChange={(event) => onChange({ notes: event.target.value, math: value.math })}
				readOnly={readOnly}
				placeholder="Notes — work things out here."
				className={`mb-2 w-full flex-1 resize-none whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 ${
					readOnly ? "opacity-70" : ""
				}`}
			/>
			<math-field
				ref={fieldRef}
				className={`w-full min-h-[3rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 ${
					readOnly ? "opacity-70" : ""
				}`}
			/>
		</div>
	);
}
