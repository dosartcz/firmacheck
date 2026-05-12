"use client";

import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <SunIcon className={isDark ? "text-slate-400" : "text-slate-600"} />
      <button
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? t("themeToggleToLight") : t("themeToggleToDark")}
        onClick={toggle}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 bg-slate-300 dark:bg-slate-600"
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${
            isDark ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <MoonIcon className={isDark ? "text-slate-300" : "text-slate-400"} />
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}
