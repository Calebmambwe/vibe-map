"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import type { Vibe } from "@/types/vibe";
import { getMood } from "@/types/vibe";

// Globe.gl requires browser window — must be client-only
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface VibeGlobeProps {
  vibes: Vibe[];
  onGlobeReady?: () => void;
}

export function VibeGlobe({ vibes, onGlobeReady }: VibeGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
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

  // Auto-rotate and initial view
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Set initial point of view
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

    // Access three.js controls for auto-rotate
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    onGlobeReady?.();
  }, [onGlobeReady]);

  // Ring data for animated pulse effect on each vibe
  const ringsData = useMemo(
    () =>
      vibes.map((v) => ({
        lat: v.lat,
        lng: v.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 1500,
        color: getMood(v.mood).glowColor,
      })),
    [vibes],
  );

  // Points data for each vibe location
  const pointsData = useMemo(
    () =>
      vibes.map((v) => ({
        lat: v.lat,
        lng: v.lng,
        size: 0.4,
        color: getMood(v.mood).color,
        label: `${getMood(v.mood).emoji} ${getMood(v.mood).label}`,
      })),
    [vibes],
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
        // Rings layer (pulse animations)
        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringAltitude={0.01}
        // Performance
        animateIn={true}
        waitForGlobeReady={true}
      />
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-radial from-transparent via-transparent to-black/20" />
    </div>
  );
}
