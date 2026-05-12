import { NextResponse } from "next/server";
import { isValidIcoChecksum, normalizeIco } from "@/lib/ico";
import { parseAresResponse } from "@/lib/ares";

const ARES_BASE =
  "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const icoRaw = searchParams.get("ico");

  if (!icoRaw) {
    return NextResponse.json({ error: "Chybí parametr ico." }, { status: 400 });
  }
  if (!isValidIcoChecksum(icoRaw)) {
    return NextResponse.json(
      { error: "IČO má neplatný formát nebo kontrolní součet." },
      { status: 400 }
    );
  }

  const ico = normalizeIco(icoRaw);

  try {
    const res = await fetch(`${ARES_BASE}/${ico}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 404) {
      return NextResponse.json(
        { error: "Firma s tímto IČO nebyla v ARES nalezena.", notFound: true },
        { status: 404 }
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `ARES vrátil chybu ${res.status}.` },
        { status: 502 }
      );
    }

    const raw = await res.json();
    const company = parseAresResponse(raw);
    return NextResponse.json({ company });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Neznámá chyba.";
    return NextResponse.json(
      { error: `Selhalo načítání z ARES: ${message}` },
      { status: 502 }
    );
  }
}
