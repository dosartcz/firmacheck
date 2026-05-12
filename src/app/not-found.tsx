"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useT();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#d6795b]">
        FirmaCzech
      </p>
      <h1 className="text-[clamp(8rem,30vw,16rem)] font-bold leading-none tracking-tight text-slate-900 dark:text-slate-100">
        404
      </h1>
      <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
        {t("notFoundHeading")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-[#d6795b] px-6 py-3 font-medium text-white shadow-sm transition hover:bg-[#c4684a]"
      >
        {t("notFoundBack")}
      </Link>
    </main>
  );
}
