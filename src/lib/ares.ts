import type { CompanyData } from "@/types";

const LEGAL_FORMS: Record<string, string> = {
  "101": "Fyzická osoba podnikající",
  "105": "Zahraniční fyzická osoba",
  "111": "Veřejná obchodní společnost",
  "112": "Společnost s ručením omezeným",
  "113": "Komanditní společnost",
  "117": "Nadace",
  "118": "Nadační fond",
  "121": "Akciová společnost",
  "141": "Obecně prospěšná společnost",
  "145": "Společenství vlastníků jednotek",
  "161": "Družstvo",
  "205": "Družstvo",
  "301": "Státní podnik",
  "302": "Příspěvková organizace",
  "325": "Organizační složka státu",
  "421": "Odštěpný závod zahraniční právnické osoby",
  "422": "Odštěpný závod tuzemské právnické osoby",
  "601": "Vysoká škola",
  "641": "Školská právnická osoba",
  "661": "Veřejná výzkumná instituce",
  "706": "Spolek",
  "736": "Pobočný spolek",
  "751": "Zájmové sdružení právnických osob",
  "771": "Ústav",
  "801": "Obec, statutární město",
  "804": "Kraj",
  "921": "Mezinárodní organizace",
  "931": "Evropské hospodářské zájmové sdružení",
  "941": "Evropská společnost (SE)",
  "951": "Evropská družstevní společnost",
};

export function describeLegalForm(code: string | number | null | undefined): {
  code: string;
  label: string;
} {
  if (code === null || code === undefined) return { code: "", label: "Neznámá právní forma" };
  const c = String(code);
  return { code: c, label: LEGAL_FORMS[c] ?? `Kód právní formy ${c}` };
}

interface AresRaw {
  ico?: string;
  obchodniJmeno?: string;
  pravniForma?: string | number;
  datumVzniku?: string;
  datumZaniku?: string;
  dic?: string;
  sidlo?: {
    textovaAdresa?: string;
  };
}

export function parseAresResponse(raw: AresRaw): CompanyData {
  const legalForm = describeLegalForm(raw.pravniForma);
  const dissolved = raw.datumZaniku ?? null;
  return {
    ico: raw.ico ?? "",
    name: raw.obchodniJmeno ?? "(bez názvu)",
    legalForm: legalForm.label,
    legalFormCode: legalForm.code,
    establishedDate: raw.datumVzniku ?? null,
    dissolvedDate: dissolved,
    status: dissolved ? "Zaniklá" : "Aktivní",
    address: raw.sidlo?.textovaAdresa ?? "(adresa nedostupná)",
    dic: raw.dic ?? null,
  };
}

export class AresError extends Error {
  constructor(public readonly kind: "not_found" | "network" | "unknown", message: string) {
    super(message);
    this.name = "AresError";
  }
}
