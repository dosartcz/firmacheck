"use client";

import { FormEvent, useState } from "react";
import { validateIco } from "@/lib/ico";

interface CompanyFormProps {
  onSubmit: (ico: string, name: string) => void;
  loading: boolean;
}

export function CompanyForm({ onSubmit, loading }: CompanyFormProps) {
  const [ico, setIco] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validateIco(ico);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result.ico, name.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            IČO <span className="text-rose-600">*</span>
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={ico}
            onChange={(e) => setIco(e.target.value)}
            placeholder="02823519"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            maxLength={8}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Název firmy <span className="text-slate-400">(volitelné)</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ideabox"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-5 py-2 font-medium text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Ověřuji…" : "Ověřit firmu"}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
