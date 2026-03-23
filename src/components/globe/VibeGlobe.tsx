"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Flame, MapPin } from "lucide-react";
import type { GlobeMethods } from "react-globe.gl";
import type { Vibe } from "@/types/vibe";
import { getMood } from "@/types/vibe";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface VibeGlobeProps {
  vibes: Vibe[];
  onGlobeReady?: (methods: GlobeMethods) => void;
}

export function VibeGlobe({ vibes, onGlobeReady }: VibeGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [heatmapMode, setHeatmapMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    onGlobeReady?.(globe);
  }, [onGlobeReady]);

  // Ring pulse data
  const ringsData = useMemo(
    () =>
      heatmapMode
        ? []
        : vibes.map((v) => ({
            lat: v.lat,
            lng: v.lng,
            maxR: 3,
            propagationSpeed: 2,
            repeatPeriod: 1500,
            color: getMood(v.mood).glowColor,
          })),
    [vibes, heatmapMode],
  );

  // Points data (pin mode)
  const pointsData = useMemo(
    () =>
      heatmapMode
        ? []
        : vibes.map((v) => ({
            lat: v.lat,
            lng: v.lng,
            size: 0.4,
            color: getMood(v.mood).color,
            label: `${getMood(v.mood).emoji} ${getMood(v.mood).label}`,
          })),
    [vibes, heatmapMode],
  );

  // Heatmap data
  const heatmapData = useMemo(
    () =>
      heatmapMode
        ? vibes.map((v) => ({
            lat: v.lat,
            lng: v.lng,
            weight: 1,
          }))
        : [],
    [vibes, heatmapMode],
  );

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#6B73FF"
        atmosphereAltitude={0.25}
        // Points layer
        pointsData={pointsData}
        pointAltitude="size"
        pointColor="color"
        pointRadius={0.5}
        pointLabel="label"
        // Rings layer
        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringAltitude={0.01}
        // Heatmap layer
        heatmapsData={heatmapMode ? [heatmapData] : []}
        heatmapPointLat="lat"
        heatmapPointLng="lng"
        heatmapPointWeight="weight"
        heatmapBandwidth={3}
        heatmapColorSaturation={2.5}
        // Performance
        animateIn={true}
        waitForGlobeReady={true}
        onGlobeReady={handleGlobeReady}
      />

      {/* View mode toggle */}
      <div className="absolute right-4 top-4 flex overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
        <button
          onClick={() => setHeatmapMode(false)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${
            !heatmapMode ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          <MapPin size={14} />
          Pins
        </button>
        <button
          onClick={() => setHeatmapMode(true)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${
            heatmapMode ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          <Flame size={14} />
          Heatmap
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-radial from-transparent via-transparent to-black/20" />
    </div>
  );
}
