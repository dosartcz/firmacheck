import Image from "next/image";

/**
 * Placeholder for an AI-generated hero illustration.
 * Replace /public/hero-illustration.png with a real Midjourney / DALL·E / Imagen output.
 * See AI_PROMPTS.md for the prompt used.
 */
export function HeroIllustration() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      <div className="grid items-center gap-6 sm:grid-cols-[2fr_1fr]">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
            FirmaCheck
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ověřte českou firmu za pár sekund.
          </h1>
          <p className="mt-3 max-w-prose text-slate-600">
            Zadejte IČO, případně i název. Aplikace načte aktuální údaje
            z ARESu, zobrazí sídlo firmy na mapě, uloží odpověď do
            SQLite cache a umožní vám firmy hromadně exportovat.
          </p>
        </div>
        <div className="relative mx-auto aspect-square w-44 sm:w-full sm:max-w-[220px]">
          <Image
            src="/hero-illustration.svg"
            alt="Ilustrace ověřování firmy"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
