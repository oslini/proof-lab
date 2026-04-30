# Proof Lab

A Socratic AI tutor for calculus and proof construction. Proof Lab guides students through problems one step at a time — it never gives the answer. The tutor asks what you've tried, surfaces decision points where approaches branch, and graduates hints from conceptual nudge to partial worked step. Sessions are stored locally; no account or database required.

---

## Why This Exists

Wolfram Alpha succeeds at displaying math beautifully but fails to scaffold the higher-order skills — analysis, evaluation, construction — that actually build mathematical maturity. It solves problems *for* students rather than *with* them.

Proof Lab encodes a different pedagogy: the learner is an active constructor, not a recipient. Every session enforces the Cognitive Theory of Multimedia Learning (signaling, segmenting) while adding the Socratic layer that tools like Wolfram skip. The core feature — **Show Your Work Mode** — makes expert thinking inspectable and puts metacognitive prompts at every stage.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| AI streaming | Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| Providers | Anthropic (`claude-sonnet-4-6`) · OpenAI (`gpt-4o`) |
| Math rendering | KaTeX via `react-katex` |
| Function plots | `function-plot` (D3-based) |
| Persistence | `localStorage` — no DB, no auth |

---

## Getting Started

**Prerequisites:** Node.js 18+, an Anthropic or OpenAI API key.

```bash
git clone <repo-url>
cd proof-lab
npm install
npm run dev
```

1. Visit `http://localhost:3000/settings`
2. Paste your Anthropic or OpenAI API key and select your preferred model
3. Visit `/lab` and start a problem

Your API key is stored only in your browser's `localStorage`. It is sent to the local `/api/chat` route for that one request and is never logged or persisted server-side.

### Other Scripts

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

---

## Project Structure

```
app/
  page.tsx                # Landing page — intro, "Start a session" CTA, settings link
  lab/page.tsx            # Main tutor interface (chat + math input + plot pane)
  sessions/page.tsx       # List of saved sessions from localStorage
  settings/page.tsx       # Provider, API key, model, and mode configuration
  api/chat/route.ts       # Streaming endpoint — proxies to Anthropic or OpenAI

components/
  Chat/
    ChatPane.tsx          # Streaming message list
    MessageBubble.tsx     # Renders prose + KaTeX + plot blocks
    MathInput.tsx         # LaTeX textarea with live KaTeX preview
    SymbolKeyboard.tsx    # Clickable math symbol palette with cursor templates
    HintControls.tsx      # L1 / L2 / L3 hint buttons + decision-point marker
  Plot/
    FunctionPlot.tsx      # Wraps function-plot for inline graphs
  Layout/
    Header.tsx
    Sidebar.tsx

lib/
  prompts/
    tutorSystemPrompt.ts  # The pedagogical core — all Socratic rules encoded here
    hintLadder.ts         # Prompt fragments for L1 / L2 / L3 hints
  providers/
    selectProvider.ts     # Returns the AI SDK model object based on settings
  storage/
    sessions.ts           # localStorage CRUD for session history
    settings.ts           # localStorage CRUD for provider, key, model, mode
  math/
    parseBlocks.ts        # Splits assistant output into prose / math / plot segments
    symbols.ts            # Symbol palette data table { label, latex, cursorOffset }

types/
  index.ts                # Session, Message, Settings, HintLevel
```

---

## How the App Works

### User Flow

1. **Settings** (`/settings`) — paste an API key, choose provider and model, set mode (Show Your Work or Free).
2. **Lab** (`/lab`) — type or compose a problem using the LaTeX input and symbol keyboard, send, and receive a streamed Socratic response.
3. **Sessions** (`/sessions`) — browse, reopen, or delete past sessions. Each session is auto-titled from the first message.

### API Route

`/api/chat` is a thin, stateless proxy. It receives the student's API key as a request header, calls `selectProvider` to instantiate the correct AI SDK model, invokes `streamText` with the full message history and system prompt, and returns a `toDataStreamResponse()` stream. The Vercel AI SDK's `useChat` hook on the client consumes this stream directly.

The route exists because Anthropic's API does not allow direct browser calls (no CORS opt-in header). It holds the key in memory for the duration of the single request only.

### Math Input

Students compose problems in a LaTeX-aware textarea (`MathInput`). A live KaTeX preview renders below the input as they type. The `SymbolKeyboard` provides a collapsible palette of clickable symbols organized into sections:

- **Operators:** `+ − × ÷ ± ⋅ √ ⁿ√`
- **Relations:** `= ≠ < > ≤ ≥ ≈ ≡ →`
- **Calculus:** `∫ ∬ ∮ ∂ ∇ Σ Π lim` plus templates for `\frac{d}{dx}`, `\int_{a}^{b}`, `\sum_{i=1}^{n}`, `\lim_{x \to}`
- **Greek:** `α β γ δ ε θ λ μ π σ φ ω` (+ uppercase)
- **Sets / Logic:** `∈ ∉ ⊂ ∪ ∩ ∅ ∀ ∃ ¬ ∧ ∨ ⟹ ⟺ ℕ ℤ ℚ ℝ ℂ`
- **Structures:** templates for `\frac{}{}`, `\sqrt{}`, `x^{}`, `x_{}`, matrix, and cases

Each symbol stores a `cursorOffset` so clicking a template (e.g. `\frac{}{}`) lands the cursor inside the first placeholder automatically.

### Math and Plot Rendering

The assistant uses standard `$...$` and `$$...$$` delimiters. `parseBlocks.ts` splits each response into prose segments and math segments; `MessageBubble` renders math via `react-katex`.

A fenced ` ```plot ` block (e.g., ` ```plot\nf(x) = sin(x)\n``` `) is rendered as an inline `FunctionPlot` component. The system prompt teaches the model this convention, so the tutor can draw a graph as part of an explanation.

---

## The Pedagogical Core

All educational logic is encoded in `lib/prompts/tutorSystemPrompt.ts`. The UI is a delivery mechanism for the pedagogy, not the product itself.

### Show Your Work Mode (Default)

The system prompt enforces seven rules on every turn:

1. **Diagnose first.** Before doing anything, ask what the student has tried or what their first instinct is.
2. **One step per turn.** Every response ends with a question that returns control to the student.
3. **Graduated hints.** When the student is stuck, choose the lowest level that could unblock:
   - **L1 — Conceptual nudge:** name the relevant idea without applying it
   - **L2 — Theorem pointer:** state the rule and ask the student to apply it
   - **L3 — Worked partial step:** show exactly one annotated step, then stop
4. **Surface decision points.** When approaches branch, name the options and ask the student to choose.
5. **Metacognitive close.** After a solution is reached, ask a reflective question ("Which step felt riskiest?", "Where could this approach fail?").
6. **Verify student work.** Affirm correct steps and explain *why* they work. For incorrect steps, locate the error without fixing it and ask the student to retry.
7. **Refuse direct answers.** "Just give me the answer" receives an L1 hint and an explanation of the trade-off.

The `HintControls` component appends a fragment from `hintLadder.ts` to the outgoing message when the student clicks L1, L2, or L3 — enforcing the hint level in both the UI and the prompt simultaneously.

### Free Mode

For advanced learners, Free Mode relaxes the Socratic constraints. The tutor still favors questions but will produce full worked solutions on explicit request. This implements the expertise-reversal escape hatch: scaffolding that helps novices can impede experts who already possess the relevant schema.

---

## Persistence

All state lives in `localStorage` via two utility modules:

- `lib/storage/sessions.ts` — a keyed list of sessions, each containing `{ id, title, createdAt, messages[], mode }`. Sessions are auto-titled from the first user message.
- `lib/storage/settings.ts` — `{ provider, apiKey, model, mode }`.

No telemetry. No server-side logging. No accounts. Refreshing mid-session restores the conversation from localStorage.

---

## Verification Checklist

Before shipping, confirm these end-to-end behaviors:

- [ ] `/settings` saves a key; `/lab` streams a response
- [ ] "Find the derivative of f(x) = x² sin(x)" → tutor asks what rule applies before solving
- [ ] "Just give me the answer" → tutor refuses, offers L1 hint
- [ ] L1 hint names a concept without applying it; L3 shows one step and stops
- [ ] "Prove 1+2+…+n = n(n+1)/2 by induction" → tutor separates base case and inductive step
- [ ] `$\frac{d}{dx}[x^2] = 2x$` renders correctly in a response
- [ ] A ` ```plot ` block renders an inline graph
- [ ] Clicking `∫` in the symbol keyboard lands the cursor inside `\int_{}^{}`
- [ ] Refreshing `/lab` mid-session restores the conversation
- [ ] Switching to OpenAI in settings still produces constrained Socratic tutoring
- [ ] Free Mode produces full worked solutions on request

---

## Out of Scope (v1)

- Accounts, multi-device sync, or session sharing
- Server-side learner-progress tracking or analytics
- Voice or handwriting input
- Curriculum sequencing or skill trees
- Cost metering on the user's API key

These are reasonable v2 directions. The v1 goal is to demonstrate that the Socratic system prompt and graduated hint UI produce a learning experience that is measurably different from asking a chatbot for the answer directly.
