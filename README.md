# Proof Lab

> A Socratic math tutor — the AI asks first and answers last.

Proof Lab is a Next.js application that helps students work through calculus problems and mathematical proofs with an AI tutor that **never volunteers solutions**. The student stays the active problem-solver; the tutor diagnoses, asks, and nudges — one step at a time.

## Educational Rationale

The design stems from a core critique of tools like Wolfram Alpha: they succeed at multimedia presentation but fail to scaffold the higher-order cognitive levels — analysis, evaluation, creation — and provide no metacognitive support. Proof Lab takes the **Show Your Work Mode** concept and makes it the default experience, built around four principles:

- **Active construction** — the learner commits to an approach before the tutor responds
- **Graduated hints** at visible decision points, making expert thinking inspectable
- **Metacognitive prompts** at the close of every problem (*"Which step felt riskiest?"*)
- **Expertise-reversal escape hatch** — an optional Free mode for advanced learners who need fewer constraints

---

## How It Works

1. **Add your API key** — paste an [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com) key into Settings once. It stays in your browser; it is never stored server-side.
2. **Open the Lab** — type a problem (LaTeX syntax supported; a symbol keyboard is provided). The tutor begins by asking what you have already tried.
3. **Work through it** — each turn advances at most one step. Use the hint buttons when you are stuck.

---

## Tutor Behavior

The pedagogical logic lives entirely in `lib/prompts/tutorSystemPrompt.ts`. These rules are enforced in every session:

1. **Diagnose before teaching** — the first reply to any new problem asks what the student has tried. No solving begins until the student responds.
2. **One step at a time** — every response advances at most one step and ends with a question that returns control to the student.
3. **Graduated hints** — when the student is stuck, the tutor chooses the lowest level that could unblock:
   - **L1 — Conceptual nudge:** names the relevant idea without applying it (*"this looks like it wants the chain rule"*).
   - **L2 — Theorem pointer:** states the rule and asks the student to apply it.
   - **L3 — Worked partial step:** shows one annotated step, then stops.
4. **Decision points** — when multiple valid approaches exist, the tutor names them and asks the student to choose.
5. **Metacognitive close** — after a solution is reached, the tutor asks a reflective question.
6. **Verify student work** — correct steps are affirmed *and* explained; incorrect steps are located (not corrected) so the student retries.
7. **Refuse to do homework** — a direct request for the answer is redirected to an L1 hint with an explanation of the trade-off.

### Modes

| Mode | Behaviour |
|---|---|
| **Show Your Work** (default) | Full Socratic constraints above. Solution never given unprompted. |
| **Free** | Relaxed mode for advanced learners. Favours questions, but will produce full solutions on explicit request. |

---

## Core Features

| Feature | Description |
|---|---|
| **Show Your Work** | Default mode: tutor diagnoses your approach first, then asks a guiding question. No solution volunteered. |
| **Graduated Hints** | L1 names the key idea · L2 points to the relevant theorem · L3 shows one step — then stops. |
| **Decision Points** | When approaches branch, the tutor names the fork and asks you to pick. Expert reasoning made inspectable. |
| **Math Input** | LaTeX-aware textarea with live KaTeX preview and a clickable symbol keyboard (operators, calculus, Greek, sets, structures). |
| **Function Plots** | Inline graphs rendered from ` ```plot ` code blocks in tutor responses. |
| **Session History** | Past sessions saved to localStorage and accessible from the Sessions page. |

---

## Project Structure

```
proof-lab/
├── app/
│   ├── api/chat/          # Streaming route handler — forwards BYO key to chosen provider
│   ├── lab/               # Main tutor chat interface (chat + math input + plot pane)
│   ├── sessions/          # Past session history from localStorage
│   ├── settings/          # Provider select, API key, model, and mode toggle
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/
│   ├── Chat/
│   │   ├── ChatPane.tsx        # Streaming message list
│   │   ├── MessageBubble.tsx   # Renders prose + KaTeX + plot blocks
│   │   ├── MathInput.tsx       # LaTeX textarea with live preview
│   │   ├── SymbolKeyboard.tsx  # Clickable math symbol palette
│   │   └── HintControls.tsx    # L1 / L2 / L3 hint buttons
│   ├── Plot/
│   │   └── FunctionPlot.tsx    # Wraps function-plot for inline graphs
│   └── Layout/
│       └── Header.tsx, Sidebar.tsx
├── lib/
│   ├── prompts/
│   │   ├── tutorSystemPrompt.ts  # The pedagogical core
│   │   └── hintLadder.ts         # L1/L2/L3 hint prompt fragments
│   ├── providers/
│   │   └── selectProvider.ts     # Anthropic / OpenAI dispatch via AI SDK
│   ├── storage/
│   │   ├── sessions.ts           # localStorage CRUD for sessions
│   │   └── settings.ts           # localStorage CRUD for provider, key, model, mode
│   └── math/
│       ├── parseBlocks.ts        # Splits output into prose / math / plot blocks
│       └── symbols.ts            # Symbol palette data table
├── types/
│   └── index.ts                  # Session, Message, Settings, HintLevel
├── AGENTS.md              # Instructions for AI coding agents working on this repo
└── CLAUDE.md              # Claude-specific agent instructions
```

### Why the API route exists when keys are local

The user's key is stored in localStorage and sent as a request header to `/api/chat`. The route forwards it to the chosen provider and streams tokens back. This sidesteps CORS restrictions on direct browser calls to Anthropic's API and provides a single consistent server-side surface for both providers via the Vercel AI SDK.

---

## Tech Stack

| | |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) — App Router, TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`) — streaming, unified across providers |
| Math rendering | [KaTeX](https://katex.org) via `react-katex` |
| Function plots | [function-plot](https://mauriciopoppe.github.io/function-plot/) (D3-based) |
| Persistence | `localStorage` — no database, no auth in v1 |

Default models: **Claude** `claude-sonnet-4-6` · **OpenAI** `gpt-4o` (both selectable in Settings).

---

## Getting Started

### Prerequisites

- Node.js 18+
- An API key from [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com)

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), go to **Settings**, paste your API key, then open the **Lab** to start a session.

### Other Scripts

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

---

## Out of Scope (v1)

- Accounts, multi-device sync, or session sharing
- Server-side analytics or learner-progress tracking
- Voice or handwriting input
- Curriculum sequencing or skill trees
- Cost metering / rate limiting (the key is yours)

These are reasonable v2 directions, but v1 has one goal: prove that the Socratic system prompt and graduated hint UI produce a learning experience that is meaningfully different from asking a chatbot for the answer.
