"use client";

import { useState, useCallback } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

interface UseGeolocationReturn {
  position: GeoPosition | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

// Client-side cache to avoid hammering Nominatim (1 req/sec limit)
const geocodeCache = new Map<string, { city: string; country: string }>();

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
  const key = cacheKey(lat, lng);
  const cached = geocodeCache.get(key);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { "User-Agent": "VibeMap/1.0 (https://github.com/Calebmambwe/vibe-map)" } },
    );
    if (!res.ok) return { city: "Unknown", country: "Earth" };
    const data = (await res.json()) as {
      address?: { city?: string; town?: string; village?: string; county?: string; country?: string; country_code?: string };
    };
    const addr = data.address;
    const result = {
      city: addr?.city || addr?.town || addr?.village || addr?.county || "Unknown",
      country: addr?.country_code?.toUpperCase() || addr?.country || "Earth",
    };
    geocodeCache.set(key, result);
    return result;
  } catch {
    return { city: "Unknown", country: "Earth" };
  }
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPosition({ lat: 0, lng: 0, city: "Unknown", country: "Earth" });
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { city, country } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city,
          country,
        });
        setLoading(false);
      },
      async () => {
        const lat = (Math.random() - 0.5) * 120;
        const lng = (Math.random() - 0.5) * 300;
        const { city, country } = await reverseGeocode(lat, lng);
        setPosition({ lat, lng, city, country });
        setError("Location access denied — using random location");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  return { position, loading, error, requestLocation };
}
