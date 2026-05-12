import type { SavedCompany } from "@/types";

const CSV_HEADERS = [
  "IČO",
  "Obchodní název",
  "Právní forma",
  "Stav subjektu",
  "Adresa sídla",
  "Datum vzniku",
  "Datum posledního ověření",
  "Zdroj posledního načtení",
  "Zeměpisná šířka",
  "Zeměpisná délka",
];

function escapeCsv(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(ms: number): string {
  return new Date(ms).toISOString();
}

export function buildCsv(companies: SavedCompany[]): string {
  const lines = [CSV_HEADERS.map(escapeCsv).join(",")];
  for (const c of companies) {
    lines.push(
      [
        c.ico,
        c.name,
        c.legalForm,
        c.status,
        c.address,
        c.establishedDate ?? "",
        formatDate(c.lastVerifiedAt),
        c.lastSource,
        c.lat ?? "",
        c.lng ?? "",
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function buildJson(companies: SavedCompany[]): string {
  return JSON.stringify(companies, null, 2);
}

export function downloadFile(filename: string, content: string, mime: string): void {
  // ﻿ BOM so Excel opens UTF-8 CSV with diacritics correctly.
  const blob = new Blob([mime.startsWith("text/csv") ? "﻿" + content : content], {
    type: `${mime};charset=utf-8`,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCsv(companies: SavedCompany[]): void {
  const csv = buildCsv(companies);
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`firmacheck-${stamp}.csv`, csv, "text/csv");
}

export function exportJson(companies: SavedCompany[]): void {
  const json = buildJson(companies);
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`firmacheck-${stamp}.json`, json, "application/json");
}

export async function copyJsonToClipboard(companies: SavedCompany[]): Promise<void> {
  await navigator.clipboard.writeText(buildJson(companies));
}
