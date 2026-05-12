"use client";

import { useState } from "react";
import type { SavedCompany } from "@/types";
import { copyJsonToClipboard, exportCsv, exportJson } from "@/lib/export";
import { useT } from "@/lib/i18n";

interface SavedCompaniesProps {
  companies: SavedCompany[];
  onOpen: (ico: string) => void;
  onRemove: (ico: string) => void;
}

const LOCALE_MAP = { cs: "cs-CZ", en: "en-GB", de: "de-DE" } as const;

export function SavedCompanies({
  companies,
  onOpen,
  onRemove,
}: SavedCompaniesProps) {
  const { t, lang } = useT();
  const [copied, setCopied] = useState(false);
  const locale = LOCALE_MAP[lang];

  async function handleCopy() {
    try {
      await copyJsonToClipboard(companies);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(t("savedCopyError"));
    }
  }

  async function handleShare() {
    const lines = companies.map(
      (c) => `${c.name} · IČO: ${c.ico} · ${c.address}`
    );
    const text = `${t("savedShareBody")}\n\n${lines.join("\n")}`;
    const subject = t("savedShareSubject");

    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: subject, text });
    } else {
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      window.open(mailto, "_blank");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {t("savedHeading")}{" "}
            <span className="text-slate-400 dark:text-slate-500">
              ({companies.length})
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("savedSubheading")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportCsv(companies)}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t("savedExportCsv")}
          </button>
          <button
            onClick={() => exportJson(companies)}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t("savedExportJson")}
          </button>
          <button
            onClick={handleCopy}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {copied ? t("savedCopiedJson") : t("savedCopyJson")}
          </button>
        </div>
      </header>

      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          {t("savedEmpty")}
          <strong className="text-slate-700 dark:text-slate-200">
            {t("savedEmptyCta")}
          </strong>
          .
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {companies.map((c) => (
            <li key={c.ico} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  onClick={() => onOpen(c.ico)}
                  className="text-left"
                  title={t("savedActionDetail")}
                >
                  <p className="font-semibold text-slate-900 transition dark:text-slate-100">
                    {c.name}
                  </p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {t("detailIcoLabel")} {c.ico} · {c.address}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {t("savedVerifiedAt")}{" "}
                    {new Date(c.lastVerifiedAt).toLocaleString(locale)} ·{" "}
                    {t("savedSourceLabel")}:{" "}
                    {c.lastSource === "API" ? t("badgeApi") : t("badgeCache")}
                  </p>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpen(c.ico)}
                    className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-900/50"
                  >
                    {t("savedActionDetail")}
                  </button>
                  <button
                    onClick={() => onRemove(c.ico)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/50"
                  >
                    {t("savedActionDelete")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
