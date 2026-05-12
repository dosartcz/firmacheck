"use client";

import { useState } from "react";
import type { SavedCompany } from "@/types";
import { copyJsonToClipboard, exportCsv, exportJson } from "@/lib/export";

interface SavedCompaniesProps {
  companies: SavedCompany[];
  onOpen: (ico: string) => void;
  onRemove: (ico: string) => void;
}

export function SavedCompanies({
  companies,
  onOpen,
  onRemove,
}: SavedCompaniesProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await copyJsonToClipboard(companies);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Kopírování do schránky se nezdařilo.");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Uložené firmy{" "}
            <span className="text-slate-400">({companies.length})</span>
          </h2>
          <p className="text-sm text-slate-500">
            Data zůstávají v lokální SQLite/IndexedDB i po obnovení stránky.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportCsv(companies)}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportJson(companies)}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export JSON
          </button>
          <button
            onClick={handleCopy}
            disabled={companies.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "✓ Zkopírováno" : "Kopírovat JSON"}
          </button>
        </div>
      </header>

      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Zatím nemáte žádnou uloženou firmu. Po ověření klikněte na{" "}
          <strong>+ Uložit firmu</strong>.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {companies.map((c) => (
            <li key={c.ico} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  onClick={() => onOpen(c.ico)}
                  className="text-left"
                  title="Zobrazit detail"
                >
                  <p className="font-semibold text-slate-900 transition group-hover:text-sky-700">
                    {c.name}
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    IČO {c.ico} · {c.address}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Ověřeno {new Date(c.lastVerifiedAt).toLocaleString("cs-CZ")}{" "}
                    · zdroj: {c.lastSource === "API" ? "API" : "cache"}
                  </p>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpen(c.ico)}
                    className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => onRemove(c.ico)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    Smazat
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
