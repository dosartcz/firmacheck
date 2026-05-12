"use client";

import { useRef, useState } from "react";
import { LANGS, LANG_LABELS, LANG_SHORT, useT, type Lang } from "@/lib/i18n";

export function LanguageSwitch() {
  const { lang, setLang, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleSelect(code: Lang) {
    setLang(code);
    setOpen(false);
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={handleBlur}
      aria-label={t("languageSelect")}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        {LANG_SHORT[lang]}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("languageSelect")}
          className="absolute right-0 z-50 mt-1 w-28 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {LANGS.map((code) => (
            <li
              key={code}
              role="option"
              aria-selected={lang === code}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(code as Lang)}
              className={[
                "flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-medium transition",
                lang === code
                  ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700",
              ].join(" ")}
            >
              <span className="w-5 text-slate-400">{LANG_SHORT[code as Lang]}</span>
              <span>{LANG_LABELS[code as Lang]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
