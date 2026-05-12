"use client";

import dynamic from "next/dynamic";
import type {
  CompanyData,
  Coordinates,
  DataSource,
  NameMatchResult,
} from "@/types";
import { SourceBadge } from "./StatusBadge";

const CompanyMap = dynamic(
  () => import("./CompanyMap").then((m) => m.CompanyMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
  );
}

interface CompanyDetailProps {
  company: CompanyData;
  aresSource: DataSource;
  coords: Coordinates | null;
  geocodingSource: DataSource | null;
  geocodingError: string | null;
  nameMatch: NameMatchResult | null;
  isSaved: boolean;
  onSave: () => void;
  onRemove: () => void;
}

export function CompanyDetail({
  company,
  aresSource,
  coords,
  geocodingSource,
  geocodingError,
  nameMatch,
  isSaved,
  onSave,
  onRemove,
}: CompanyDetailProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Obchodní název
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {company.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-500">
            IČO {company.ico}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <SourceBadge label="ARES data" source={aresSource} />
            {geocodingSource && (
              <SourceBadge label="Geocoding" source={geocodingSource} />
            )}
          </div>
          {isSaved ? (
            <button
              onClick={onRemove}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Odebrat z uložených
            </button>
          ) : (
            <button
              onClick={onSave}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              + Uložit firmu
            </button>
          )}
        </div>
      </div>

      {nameMatch && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            nameMatch.kind === "exact"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : nameMatch.kind === "partial"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {nameMatch.message}
        </div>
      )}

      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Field label="Právní forma" value={company.legalForm} />
        <Field
          label="Stav subjektu"
          value={
            <span
              className={
                company.status === "Aktivní"
                  ? "font-medium text-emerald-700"
                  : "font-medium text-rose-700"
              }
            >
              {company.status}
              {company.dissolvedDate && ` (${company.dissolvedDate})`}
            </span>
          }
        />
        <Field label="Datum vzniku" value={company.establishedDate ?? "—"} />
        <Field label="DIČ" value={company.dic ?? "—"} />
        <Field
          label="Adresa sídla"
          value={company.address}
          className="sm:col-span-2"
        />
      </dl>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Sídlo firmy
        </h3>
        {coords ? (
          <CompanyMap coords={coords} address={company.address} />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {geocodingError ?? "Souřadnice sídla nejsou dostupné."}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  );
}
