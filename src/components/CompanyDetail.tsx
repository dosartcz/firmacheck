"use client";

import dynamic from "next/dynamic";
import type {
  CompanyData,
  Coordinates,
  DataSource,
  NameMatchResult,
} from "@/types";
import { SourceBadge } from "./StatusBadge";
import { useT } from "@/lib/i18n";

const CompanyMap = dynamic(
  () => import("./CompanyMap").then((m) => m.CompanyMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
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
  onClose: () => void;
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
  onClose,
}: CompanyDetailProps) {
  const { t } = useT();
  const isDissolved = Boolean(company.dissolvedDate);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("detailNameLabel")}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {company.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
            {t("detailIcoLabel")} {company.ico}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <SourceBadge label={t("sourceAres")} source={aresSource} />
            {geocodingSource && (
              <SourceBadge label={t("sourceGeocoding")} source={geocodingSource} />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isSaved ? (
              <button
                onClick={onRemove}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/50"
              >
                {t("detailRemoveCta")}
              </button>
            ) : (
              <button
                onClick={onSave}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
              >
                {t("detailSaveCta")}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700/50"
            >
              {t("detailCloseCta")}
            </button>
          </div>
        </div>
      </div>

      {nameMatch && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            nameMatch.kind === "exact"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : nameMatch.kind === "partial"
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          {t(
            nameMatch.kind === "exact"
              ? "nameMatchExact"
              : nameMatch.kind === "partial"
                ? "nameMatchPartial"
                : "nameMatchMismatch",
            { input: nameMatch.inputName, ares: nameMatch.aresName }
          )}
        </div>
      )}

      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Field label={t("detailLegalForm")} value={company.legalForm} />
        <Field
          label={t("detailStatus")}
          value={
            <span
              className={
                isDissolved
                  ? "font-medium text-rose-700 dark:text-rose-400"
                  : "font-medium text-emerald-700 dark:text-emerald-400"
              }
            >
              {isDissolved ? t("detailStatusDissolved") : t("detailStatusActive")}
              {company.dissolvedDate && ` (${company.dissolvedDate})`}
            </span>
          }
        />
        <Field
          label={t("detailEstablished")}
          value={company.establishedDate ?? t("dash")}
        />
        <Field label={t("detailDic")} value={company.dic ?? t("dash")} />
        <Field
          label={t("detailAddress")}
          value={company.address}
          className="sm:col-span-2"
        />
      </dl>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t("detailMapHeading")}
        </h3>
        {coords ? (
          <CompanyMap coords={coords} address={company.address} />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            {geocodingError ?? t("detailNoCoords")}
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
      <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
