"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates } from "@/types";
import { useT } from "@/lib/i18n";

interface CompanyMapProps {
  coords: Coordinates;
  address: string;
}

const MAPY_TILE_URL =
  "https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey={apikey}";

export function CompanyMap({ coords, address }: CompanyMapProps) {
  const { t } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_MAPY_API_KEY ?? "";
  const useMapy = apiKey.length > 0;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 16,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    if (useMapy) {
      L.tileLayer(MAPY_TILE_URL.replace("{apikey}", apiKey), {
        minZoom: 1,
        maxZoom: 19,
        attribution:
          '<a href="https://mapy.com/" target="_blank" rel="noopener">Mapy.com</a>',
      }).addTo(map);

      const logo = new L.Control({ position: "bottomleft" });
      logo.onAdd = () => {
        const div = L.DomUtil.create("div");
        div.innerHTML =
          '<a href="https://mapy.com/" target="_blank" rel="noopener"><img src="https://api.mapy.com/img/api/logo-small.svg" alt="Mapy.com" style="height:18px"/></a>';
        return div;
      };
      logo.addTo(map);
    } else {
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 1,
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map);
    }

    const icon = L.divIcon({
      className: "firmacheck-marker",
      html: `<div style="background:#ef4444;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
    const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(map);
    marker.bindPopup(address);
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], 16);
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      markerRef.current.bindPopup(address);
    }
  }, [coords.lat, coords.lng, address]);

  const mapyUrl = `https://mapy.com/zakladni?x=${coords.lng}&y=${coords.lat}&z=17&source=coor&id=${coords.lng}%2C${coords.lat}`;

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="h-72 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span className="font-mono">
          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </span>
        <a
          href={mapyUrl}
          target="_blank"
          rel="noopener"
          className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
        >
          {t("mapOpenExternal")}
        </a>
      </div>
      {!useMapy && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          {t("mapNoKey")}
        </p>
      )}
    </div>
  );
}
