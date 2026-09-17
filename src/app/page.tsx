import { ShortsChecker } from "@/components/ShortsChecker";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a12] text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold">
              ✓
            </div>
            <span className="text-lg font-semibold tracking-tight">ShortsCheck</span>
            <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              open source
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Star on GitHub
          </a>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-6 pt-10 text-center sm:pt-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-1.5 text-xs font-medium text-violet-200">
            🔍 Paste a link. We check the facts.
          </span>
          <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-white">
            Is that YouTube Short telling you the truth?
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Drop in any YouTube Shorts link and ShortsCheck extracts the claims,
            searches the web, and tells you what&apos;s true, false, misleading, or
            still unverified — with sources.
          </p>
        </section>

        <section className="px-6 pb-24">
          <ShortsChecker />
        </section>

        <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-center text-xs text-slate-600">
          <p>
            ShortsCheck is an open-source project. This build ships the frontend
            experience with simulated results — the real fact-checking backend
            (transcription + live web search) is coming next.
          </p>
        </footer>
      </div>
    </main>
  );
}
