import type { DataSource } from "@/types";

interface SourceBadgeProps {
  label: string;
  source: DataSource;
}

export function SourceBadge({ label, source }: SourceBadgeProps) {
  const styles =
    source === "API"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : "bg-amber-100 text-amber-800 border-amber-300";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
      title={source === "API" ? "Načteno přímo z API" : "Načteno ze SQLite cache"}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      <span className="opacity-70">{label}:</span>
      <span>{source === "API" ? "API" : "SQLite cache"}</span>
    </span>
  );
}

interface VerificationBadgeProps {
  kind: "found" | "not_found" | "error" | "loading";
  text: string;
}

export function VerificationBadge({ kind, text }: VerificationBadgeProps) {
  const styles = {
    found: "bg-emerald-100 text-emerald-800 border-emerald-300",
    not_found: "bg-amber-100 text-amber-800 border-amber-300",
    error: "bg-rose-100 text-rose-800 border-rose-300",
    loading: "bg-sky-100 text-sky-800 border-sky-300",
  }[kind];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${styles}`}
    >
      {kind === "loading" && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {text}
    </span>
  );
}
