"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYoutubeId, thumbnailFor, embedUrlFor } from "@/lib/youtube";
import { runMockAnalysis } from "@/lib/mockAnalysis";
import type { AnalysisResult } from "@/lib/types";
import { VerdictBadge } from "./VerdictBadge";
import { ClaimCard } from "./ClaimCard";

const STEPS = [
  "Fetching video metadata",
  "Transcribing audio & captions",
  "Extracting factual claims",
  "Searching the web for evidence",
  "Weighing sources & generating verdict",
];

const HISTORY_KEY = "shortscheck.history.v1";
const MAX_HISTORY = 8;

type Status = "idle" | "loading" | "done" | "error";

function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalysisResult[];
  } catch {
    return [];
  }
}

function saveHistory(history: AnalysisResult[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
}

export function ShortsChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const videoId = useMemo(() => extractYoutubeId(url), [url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const id = extractYoutubeId(url);
    if (!id) {
      setError("That doesn't look like a valid YouTube link. Try pasting a Shorts URL like https://youtube.com/shorts/XXXXXXXXXXX");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setResult(null);
    setStepIndex(0);

    for (let i = 0; i < STEPS.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 480 + Math.random() * 380));
      setStepIndex(i);
    }

    const analysis = await runMockAnalysis(id, url);
    setResult(analysis);
    setStatus("done");

    setHistory((prev) => {
      const next = [analysis, ...prev.filter((h) => h.videoId !== analysis.videoId)].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }

  function loadFromHistory(item: AnalysisResult) {
    setUrl(item.originalUrl);
    setResult(item);
    setStatus("done");
    setError(null);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setError(null);
    setUrl("");
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-black/30 px-4 py-3">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 fill-rose-500"
          >
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
          </svg>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube Shorts link… e.g. https://youtube.com/shorts/dQw4w9WgXcQ"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none sm:text-base"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || url.trim().length === 0}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Analyzing…
            </>
          ) : (
            <>Check facts</>
          )}
        </button>
      </form>

      {status === "error" && error && (
        <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {status === "idle" && history.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recent checks
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {history.map((item) => (
              <button
                key={item.videoId + item.checkedAt}
                onClick={() => loadFromHistory(item)}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-violet-400/40 hover:bg-white/[0.06]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailFor(item.videoId)}
                  alt=""
                  className="h-14 w-10 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.channel}</p>
                </div>
                <VerdictBadge verdict={item.overallVerdict} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <ol className="space-y-4">
            {STEPS.map((step, i) => {
              const isCurrent = i === stepIndex;
              const isComplete = i < stepIndex;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                      isComplete
                        ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-300"
                        : isCurrent
                          ? "border-violet-400 bg-violet-400/20 text-violet-200"
                          : "border-white/10 text-slate-600"
                    }`}
                  >
                    {isComplete ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-sm transition ${
                      isComplete
                        ? "text-slate-400 line-through decoration-slate-600"
                        : isCurrent
                          ? "font-medium text-slate-100"
                          : "text-slate-600"
                    }`}
                  >
                    {step}
                  </span>
                  {isCurrent && (
                    <span className="ml-1 h-3 w-3 animate-pulse rounded-full bg-violet-400" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {status === "done" && result && (
        <div className="mt-10 space-y-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row">
            <div className="mx-auto w-full max-w-[220px] shrink-0 sm:mx-0">
              <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  className="h-full w-full"
                  src={embedUrlFor(result.videoId)}
                  title={result.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <VerdictBadge verdict={result.overallVerdict} size="lg" />
                <span className="text-sm text-slate-400">{result.overallConfidence}% overall confidence</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">{result.category}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">{result.title}</h2>
              <p className="text-sm text-slate-500">{result.channel}</p>
              <blockquote className="rounded-xl border-l-2 border-violet-400/50 bg-black/20 px-4 py-3 text-sm italic text-slate-400">
                {result.transcriptSnippet}
              </blockquote>
              <p className="text-sm leading-relaxed text-slate-300">{result.summary}</p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                ← Check another Short
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Claims found in this video ({result.claims.length})
            </h3>
            <div className="space-y-3">
              {result.claims.map((claim, i) => (
                <ClaimCard key={claim.id} claim={claim} index={i} />
              ))}
            </div>
          </div>

          <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-relaxed text-amber-200/80">
            <strong className="font-semibold">Demo notice:</strong> This build is a frontend-only
            prototype. Results shown above are simulated for demonstration purposes and do not
            reflect a real transcript or live web search yet. The open-source backend (transcription
            + web search + verdict model) is planned next.
          </p>
        </div>
      )}
    </div>
  );
}
