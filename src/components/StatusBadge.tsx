"use client";

import { useT } from "@/lib/i18n";
import type { DataSource } from "@/types";

interface SourceBadgeProps {
  label: string;
  source: DataSource;
}

export function SourceBadge({ label, source }: SourceBadgeProps) {
  const { t } = useT();
  const styles =
    source === "API"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
      : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
      title={source === "API" ? t("badgeApiTooltip") : t("badgeCacheTooltip")}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      <span className="opacity-70">{label}:</span>
      <span>{source === "API" ? t("badgeApi") : t("badgeCache")}</span>
    </span>
  );
}

interface VerificationBadgeProps {
  kind: "found" | "not_found" | "error" | "loading";
  text: string;
}

export function VerificationBadge({ kind, text }: VerificationBadgeProps) {
  const styles = {
    found:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
    not_found:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
    error:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700",
    loading:
      "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700",
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
