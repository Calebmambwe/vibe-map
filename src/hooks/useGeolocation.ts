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

async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    );
    if (!res.ok) return { city: "Unknown", country: "Earth" };
    const data = (await res.json()) as { city?: string; locality?: string; countryName?: string; countryCode?: string };
    return {
      city: data.city || data.locality || "Unknown",
      country: data.countryCode || data.countryName || "Earth",
    };
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
