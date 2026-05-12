"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";

/**
 * Placeholder for an AI-generated hero illustration.
 * Replace /public/hero-illustration.svg with a real Midjourney / DALL·E / Imagen output.
 * See AI_PROMPTS.md for the prompt used.
 */
export function HeroIllustration() {
  const { t } = useT();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="grid items-center gap-6 sm:grid-cols-[2fr_1fr]">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#d6795b]">
            {t("heroEyebrow")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            <span className="sm:hidden">
              {t("heroHeadingBreak")}<br />{t("heroHeading").slice(t("heroHeadingBreak").length).trim()}
            </span>
            <span className="hidden sm:inline">{t("heroHeading")}</span>
          </h1>
          <p className="mt-3 max-w-prose text-slate-600 dark:text-slate-300">
            {t("heroSubheading")}
          </p>
        </div>
        <div className="relative mx-auto aspect-square w-44 sm:w-full sm:max-w-[220px]">
          <Image
            src="/hero-illustration.webp"
            alt={t("heroIllustrationAlt")}
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
