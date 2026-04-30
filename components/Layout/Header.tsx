import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-tight">∫</span>
          <span className="text-sm font-semibold">Proof Lab</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/lab" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Lab
          </Link>
          <Link href="/sessions" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Sessions
          </Link>
          <Link href="/settings" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
