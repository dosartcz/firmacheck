"use client";

import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <ThemeToggle />
        <LanguageSwitch />
      </div>
    </header>
  );
}
