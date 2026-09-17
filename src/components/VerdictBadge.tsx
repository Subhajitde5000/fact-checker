import type { Verdict } from "@/lib/types";

const VERDICT_STYLES: Record<
  Verdict,
  { label: string; icon: string; classes: string }
> = {
  true: {
    label: "Likely True",
    icon: "✓",
    classes: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  },
  false: {
    label: "False",
    icon: "✕",
    classes: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
  },
  misleading: {
    label: "Misleading",
    icon: "⚠",
    classes: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  },
  unverified: {
    label: "Unverified",
    icon: "?",
    classes: "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-400/30",
  },
};

export function VerdictBadge({ verdict, size = "md" }: { verdict: Verdict; size?: "sm" | "md" | "lg" }) {
  const style = VERDICT_STYLES[verdict];
  const sizeClasses =
    size === "lg"
      ? "px-4 py-2 text-base gap-2"
      : size === "sm"
        ? "px-2 py-0.5 text-xs gap-1"
        : "px-3 py-1 text-sm gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses} ${style.classes}`}
    >
      <span aria-hidden>{style.icon}</span>
      {style.label}
    </span>
  );
}

export { VERDICT_STYLES };
