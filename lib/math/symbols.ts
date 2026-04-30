export interface SymbolEntry {
  /** What the user sees on the button (often the rendered glyph). */
  label: string;
  /** LaTeX inserted at the cursor. */
  latex: string;
  /**
   * Where the caret should land relative to the *end* of the inserted
   * `latex` string (negative = move left from end). 0 = land at end.
   */
  cursorOffset?: number;
  /** Optional hint shown on hover. */
  title?: string;
}

export interface SymbolGroup {
  name: string;
  symbols: SymbolEntry[];
}

export const SYMBOL_GROUPS: SymbolGroup[] = [
  {
    name: "Operators",
    symbols: [
      { label: "+", latex: "+" },
      { label: "−", latex: "-" },
      { label: "×", latex: "\\times " },
      { label: "÷", latex: "\\div " },
      { label: "±", latex: "\\pm " },
      { label: "·", latex: "\\cdot " },
      { label: "∘", latex: "\\circ " },
      { label: "√", latex: "\\sqrt{}", cursorOffset: -1 },
      { label: "ⁿ√", latex: "\\sqrt[]{}", cursorOffset: -3, title: "nth root" },
      { label: "a/b", latex: "\\frac{}{}", cursorOffset: -3, title: "fraction" },
      { label: "xⁿ", latex: "^{}", cursorOffset: -1, title: "superscript" },
      { label: "xₙ", latex: "_{}", cursorOffset: -1, title: "subscript" },
    ],
  },
  {
    name: "Relations",
    symbols: [
      { label: "=", latex: "=" },
      { label: "≠", latex: "\\neq " },
      { label: "<", latex: "<" },
      { label: ">", latex: ">" },
      { label: "≤", latex: "\\leq " },
      { label: "≥", latex: "\\geq " },
      { label: "≈", latex: "\\approx " },
      { label: "≡", latex: "\\equiv " },
      { label: "∝", latex: "\\propto " },
      { label: "→", latex: "\\to " },
      { label: "↦", latex: "\\mapsto " },
    ],
  },
  {
    name: "Calculus",
    symbols: [
      { label: "∫", latex: "\\int_{}^{}", cursorOffset: -4, title: "definite integral" },
      { label: "∫dx", latex: "\\int  \\, dx", cursorOffset: -5, title: "indefinite integral" },
      { label: "∬", latex: "\\iint " },
      { label: "∮", latex: "\\oint " },
      { label: "∂", latex: "\\partial " },
      { label: "∇", latex: "\\nabla " },
      { label: "Σ", latex: "\\sum_{i=1}^{n}", cursorOffset: 0 },
      { label: "Π", latex: "\\prod_{i=1}^{n}", cursorOffset: 0 },
      { label: "lim", latex: "\\lim_{x \\to }", cursorOffset: -1 },
      { label: "d/dx", latex: "\\frac{d}{dx}" },
      { label: "f'(x)", latex: "f'(x)" },
      { label: "∞", latex: "\\infty " },
    ],
  },
  {
    name: "Greek",
    symbols: [
      { label: "α", latex: "\\alpha " },
      { label: "β", latex: "\\beta " },
      { label: "γ", latex: "\\gamma " },
      { label: "δ", latex: "\\delta " },
      { label: "ε", latex: "\\varepsilon " },
      { label: "θ", latex: "\\theta " },
      { label: "λ", latex: "\\lambda " },
      { label: "μ", latex: "\\mu " },
      { label: "π", latex: "\\pi " },
      { label: "ρ", latex: "\\rho " },
      { label: "σ", latex: "\\sigma " },
      { label: "τ", latex: "\\tau " },
      { label: "φ", latex: "\\phi " },
      { label: "ω", latex: "\\omega " },
      { label: "Δ", latex: "\\Delta " },
      { label: "Θ", latex: "\\Theta " },
      { label: "Λ", latex: "\\Lambda " },
      { label: "Π", latex: "\\Pi " },
      { label: "Σ", latex: "\\Sigma " },
      { label: "Φ", latex: "\\Phi " },
      { label: "Ω", latex: "\\Omega " },
    ],
  },
  {
    name: "Sets & Logic",
    symbols: [
      { label: "∈", latex: "\\in " },
      { label: "∉", latex: "\\notin " },
      { label: "⊂", latex: "\\subset " },
      { label: "⊆", latex: "\\subseteq " },
      { label: "∪", latex: "\\cup " },
      { label: "∩", latex: "\\cap " },
      { label: "∅", latex: "\\emptyset " },
      { label: "∀", latex: "\\forall " },
      { label: "∃", latex: "\\exists " },
      { label: "¬", latex: "\\neg " },
      { label: "∧", latex: "\\wedge " },
      { label: "∨", latex: "\\vee " },
      { label: "⟹", latex: "\\implies " },
      { label: "⟺", latex: "\\iff " },
      { label: "ℕ", latex: "\\mathbb{N} " },
      { label: "ℤ", latex: "\\mathbb{Z} " },
      { label: "ℚ", latex: "\\mathbb{Q} " },
      { label: "ℝ", latex: "\\mathbb{R} " },
      { label: "ℂ", latex: "\\mathbb{C} " },
    ],
  },
  {
    name: "Structures",
    symbols: [
      { label: "( )", latex: "\\left(  \\right)", cursorOffset: -8, title: "auto-sized parens" },
      { label: "[ ]", latex: "\\left[  \\right]", cursorOffset: -8 },
      { label: "{ }", latex: "\\left\\{  \\right\\}", cursorOffset: -9 },
      { label: "| |", latex: "\\left|  \\right|", cursorOffset: -8 },
      {
        label: "cases",
        latex: "\\begin{cases}  \\\\  \\end{cases}",
        cursorOffset: -16,
        title: "piecewise",
      },
      {
        label: "matrix",
        latex: "\\begin{pmatrix}  \\\\  \\end{pmatrix}",
        cursorOffset: -18,
      },
      {
        label: "system",
        latex: "\\begin{aligned}  &= \\\\  &= \\end{aligned}",
        cursorOffset: -22,
        title: "aligned system",
      },
    ],
  },
];

export const PLOT_TEMPLATE = "```plot\nf(x) = \n```";
