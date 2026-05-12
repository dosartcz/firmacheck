import type { Coordinates } from "@/types";

const MAPY_GEOCODE_URL = "https://api.mapy.com/v1/geocode";

export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

interface MapyGeocodeItem {
  position?: { lat?: number; lon?: number };
}

interface MapyGeocodeResponse {
  items?: MapyGeocodeItem[];
}

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const apiKey = process.env.NEXT_PUBLIC_MAPY_API_KEY;
  if (!apiKey) {
    throw new GeocodingError(
      "Chybí NEXT_PUBLIC_MAPY_API_KEY. Doplňte ho do .env.local."
    );
  }

  const url = new URL(MAPY_GEOCODE_URL);
  url.searchParams.set("lang", "cs");
  url.searchParams.set("query", address);
  url.searchParams.set("limit", "1");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new GeocodingError(`Mapy.cz vrátilo chybu ${res.status}.`);
  }
  const data = (await res.json()) as MapyGeocodeResponse;
  const item = data.items?.[0];
  if (!item || item.position?.lat == null || item.position?.lon == null) {
    throw new GeocodingError("Adresu se nepodařilo nalézt v mapě.");
  }
  return { lat: item.position.lat, lng: item.position.lon };
}
