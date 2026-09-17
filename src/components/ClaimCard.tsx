"use client";

import { useState } from "react";
import type { Claim } from "@/lib/types";
import { VerdictBadge } from "./VerdictBadge";

export function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Claim {index + 1}
          </span>
          <p className="text-sm font-medium leading-relaxed text-slate-100 sm:text-base">
            {claim.text}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <VerdictBadge verdict={claim.verdict} size="sm" />
          <span className="text-xs text-slate-400">{claim.confidence}% confidence</span>
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-white/10 px-5 py-4">
          <div>
            <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                style={{ width: `${claim.confidence}%` }}
              />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">{claim.explanation}</p>

          {claim.sources.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sources found on the web
              </p>
              <ul className="flex flex-wrap gap-2">
                {claim.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-200"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                      {source.title}
                      <span className="text-slate-500">· {source.domain}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
