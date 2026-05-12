import type { NameMatchResult } from "@/types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[.,;:!?'"()&\-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LEGAL_FORM_SUFFIXES = [
  "s r o",
  "sro",
  "a s",
  "as",
  "v o s",
  "vos",
  "k s",
  "ks",
  "z s",
  "zs",
  "spol s r o",
  "se",
];

function stripLegalForm(s: string): string {
  let out = s;
  for (const suffix of LEGAL_FORM_SUFFIXES) {
    const re = new RegExp(`\\b${suffix.replace(/ /g, "\\s*")}\\b`, "g");
    out = out.replace(re, " ");
  }
  return out.replace(/\s+/g, " ").trim();
}

export function compareNames(input: string, aresName: string): NameMatchResult {
  const trimmedInput = input.trim();
  const a = normalize(trimmedInput);
  const b = normalize(aresName);
  const aCore = stripLegalForm(a);
  const bCore = stripLegalForm(b);

  if (a === b || aCore === bCore) {
    return {
      kind: "exact",
      inputName: trimmedInput,
      aresName,
      message: `Zadaný název „${trimmedInput}" přesně odpovídá firmě „${aresName}".`,
    };
  }

  if (aCore && bCore && (bCore.includes(aCore) || aCore.includes(bCore))) {
    return {
      kind: "partial",
      inputName: trimmedInput,
      aresName,
      message: `Zadaný název „${trimmedInput}" částečně odpovídá firmě „${aresName}".`,
    };
  }

  return {
    kind: "mismatch",
    inputName: trimmedInput,
    aresName,
    message: `Zadaný název „${trimmedInput}" se liší od názvu v ARES „${aresName}".`,
  };
}
