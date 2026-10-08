"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

type MapProps = {
  lat: number;
  lng: number;
};

export default function Map({ lat, lng }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom: 12,
    });

    new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return (
    <div ref={mapRef} className="h-[400px] w-full rounded-xl overflow-hidden" />
  );
}
