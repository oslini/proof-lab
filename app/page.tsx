import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-20">
      <section>
        <div className="mb-3 inline-block rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          A Socratic math tutor
        </div>
        <h1 className="text-5xl font-semibold tracking-tight">Proof Lab</h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Work through calculus and proofs with an AI that asks first and answers last.
          You stay the active problem-solver. Hints come graduated, not pre-packaged.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/lab"
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Start a session
          </Link>
          <Link
            href="/settings"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Add API key
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature
          title="Show Your Work"
          body="Default mode: tutor diagnoses, then asks. No volunteered solutions; you commit before the model does."
        />
        <Feature
          title="Graduated hints"
          body="Stuck? Pick a level. L1 names the idea, L2 points at the theorem, L3 shows one step — then stops."
        />
        <Feature
          title="Decision points"
          body="When approaches branch, the tutor names the fork and asks you to pick. Expert thinking, made inspectable."
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Bring your own API key from{" "}
            <a className="underline" href="https://console.anthropic.com" target="_blank" rel="noreferrer">
              Anthropic
            </a>{" "}
            or{" "}
            <a className="underline" href="https://platform.openai.com" target="_blank" rel="noreferrer">
              OpenAI
            </a>{" "}
            — paste it once into Settings. Stays in your browser.
          </li>
          <li>
            Open the Lab, type a problem (LaTeX welcome, symbol keyboard provided), and the tutor will start by
            asking what you have tried.
          </li>
          <li>
            Each turn advances at most one step. Use the L1/L2/L3 buttons when you need a nudge.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{body}</div>
    </div>
  );
}
