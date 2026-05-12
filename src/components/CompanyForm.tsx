"use client";

import { FormEvent, useState } from "react";
import { validateIco, type IcoErrorCode } from "@/lib/ico";
import { useT } from "@/lib/i18n";

interface CompanyFormProps {
  onSubmit: (ico: string, name: string) => void;
  loading: boolean;
}

const ICO_ERROR_KEYS: Record<IcoErrorCode, "formErrorIcoRequired" | "formErrorIcoDigits" | "formErrorIcoChecksum"> = {
  required: "formErrorIcoRequired",
  digits: "formErrorIcoDigits",
  checksum: "formErrorIcoChecksum",
};

export function CompanyForm({ onSubmit, loading }: CompanyFormProps) {
  const { t } = useT();
  const [ico, setIco] = useState("");
  const [name, setName] = useState("");
  const [errorCode, setErrorCode] = useState<IcoErrorCode | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validateIco(ico);
    if (!result.ok) {
      setErrorCode(result.code);
      return;
    }
    setErrorCode(null);
    onSubmit(result.ico, name.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("formIcoLabel")} <span className="text-rose-600 dark:text-rose-400">{t("formIcoRequired")}</span>
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={ico}
            onChange={(e) => setIco(e.target.value)}
            placeholder="03299937"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-900/50"
            maxLength={8}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("formNameLabel")} <span className="text-slate-400 dark:text-slate-500">{t("formNameOptional")}</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Media:list s.r.o."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-900/50"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#d6795b] px-5 py-2 font-medium text-white shadow-sm transition hover:bg-[#c4684a] focus:outline-none focus:ring-2 focus:ring-[#d6795b]/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? t("formSubmitting") : t("formSubmit")}
          </button>
        </div>
      </div>
      {errorCode && (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
          {t(ICO_ERROR_KEYS[errorCode])}
        </p>
      )}
    </form>
  );
}
