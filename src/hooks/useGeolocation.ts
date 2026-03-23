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

const DEFAULT_POSITION: GeoPosition = {
  lat: 0,
  lng: 0,
  city: "Unknown",
  country: "Earth",
};

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPosition(DEFAULT_POSITION);
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        // Use a random position if geolocation is denied
        setPosition({
          lat: (Math.random() - 0.5) * 120,
          lng: (Math.random() - 0.5) * 300,
          city: "Somewhere",
          country: "Earth",
        });
        setError("Location access denied — using random location");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  return { position, loading, error, requestLocation };
}
