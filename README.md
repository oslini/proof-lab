# Proof Lab

> A Socratic math tutor — the AI asks first and answers last.

Proof Lab is a Next.js application that helps students work through calculus problems and mathematical proofs with an AI tutor that **never volunteers solutions**. The student stays the active problem-solver; the tutor diagnoses, asks, and nudges — one step at a time.

---

## How It Works

1. **Add your API key** — paste an [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com) key into Settings once. It stays in your browser and is never sent to a server.
2. **Open the Lab** — type a problem (LaTeX syntax and a symbol keyboard are supported). The tutor begins by asking what you have already tried.
3. **Work through it** — each turn advances at most one step. Use the hint buttons when you are stuck.

---

## Core Features

| Feature | Description |
|---|---|
| **Show Your Work** | Default mode: the tutor diagnoses your approach first, then asks a guiding question. No solution is volunteered. |
| **Graduated Hints** | L1 names the key idea · L2 points to the relevant theorem · L3 shows one step — then stops. |
| **Decision Points** | When multiple approaches are valid, the tutor names the fork and asks you to choose. Expert reasoning made inspectable. |

---

## Project Structure

```
proof-lab/
├── app/
│   ├── api/chat/          # Next.js route handler — proxies LLM requests
│   ├── lab/               # Main tutor chat interface
│   ├── sessions/          # Past session history
│   ├── settings/          # API key management
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing / home page
├── components/
│   ├── Chat/              # Chat UI components
│   ├── Layout/            # Shared layout components
│   ├── Plot/              # Math / graph visualisation
│   └── ui/                # Generic shadcn-style UI primitives
├── lib/                   # Utility functions and LLM client helpers
├── types/                 # Shared TypeScript type definitions
├── AGENTS.md              # Instructions for AI coding agents working on this repo
└── CLAUDE.md              # Claude-specific agent instructions
```

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

Open [http://localhost:3000](http://localhost:3000) in your browser, then navigate to **Settings** to add your API key before starting a session.

### Other Scripts

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

---

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) for styling
- Bring-your-own API key — supports Anthropic (Claude) and OpenAI (GPT) models
- No database required; session data is stored client-side
