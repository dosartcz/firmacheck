export function normalizeIco(input: string): string {
  return input.replace(/\s+/g, "").padStart(8, "0");
}

export function isValidIcoFormat(input: string): boolean {
  const cleaned = input.replace(/\s+/g, "");
  return /^\d{1,8}$/.test(cleaned);
}

/**
 * Validates IČO using the official checksum algorithm.
 * IČO is 8 digits; last digit is a mod-11 checksum of the first 7.
 */
export function isValidIcoChecksum(input: string): boolean {
  const ico = normalizeIco(input);
  if (!/^\d{8}$/.test(ico)) return false;

  const digits = ico.split("").map(Number);
  const weights = [8, 7, 6, 5, 4, 3, 2];
  const sum = digits.slice(0, 7).reduce((acc, d, i) => acc + d * weights[i], 0);
  const remainder = sum % 11;

  let check: number;
  if (remainder === 0) check = 1;
  else if (remainder === 1) check = 0;
  else check = 11 - remainder;

  return digits[7] === check;
}

export function validateIco(input: string): { ok: true; ico: string } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "IČO je povinné." };
  if (!isValidIcoFormat(trimmed)) return { ok: false, error: "IČO smí obsahovat pouze číslice (1–8)." };
  const ico = normalizeIco(trimmed);
  if (!isValidIcoChecksum(ico)) return { ok: false, error: "IČO má neplatný kontrolní součet." };
  return { ok: true, ico };
}
