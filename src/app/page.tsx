"use client";

import { useState, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VibeGlobe } from "@/components/globe/VibeGlobe";
import { GlobeLoader } from "@/components/globe/GlobeLoader";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { VibeStatsPanel } from "@/components/stats/VibeStats";
import { ShareCard } from "@/components/shared/ShareCard";
import { VibeDropButton } from "@/components/shared/VibeDropButton";
import { useVibes } from "@/hooks/useVibes";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getMood } from "@/types/vibe";
import { fadeInUp, slideInRight } from "@/lib/animations";
import type { MoodType, Vibe } from "@/types/vibe";

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [showShare, setShowShare] = useState<Vibe | null>(null);
  const { vibes, stats, submitting, submitVibe } = useVibes();
  const { position, loading: geoLoading, requestLocation } = useGeolocation();

  const handleMoodSelect = useCallback(
    (mood: MoodType) => {
      setSelectedMood(mood);
      if (!position) {
        requestLocation();
      }
    },
    [position, requestLocation],
  );

  const handleDrop = useCallback(async () => {
    if (!selectedMood || !position) return;

    const vibe = await submitVibe(selectedMood, position.lat, position.lng);
    if (vibe) {
      setShowShare(vibe);
      setSelectedMood(null);
    }
  }, [selectedMood, position, submitVibe]);

  const activeColor = selectedMood ? getMood(selectedMood).color : "#6B73FF";

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-950 text-white lg:flex-row">
      {/* Globe Section */}
      <div className="relative flex-1">
        <Suspense fallback={<GlobeLoader />}>
          {!globeReady && <GlobeLoader />}
          <div className={globeReady ? "opacity-100" : "opacity-0"}>
            <div className="h-[60vh] lg:h-screen">
              <VibeGlobe vibes={vibes} onGlobeReady={() => setGlobeReady(true)} />
            </div>
          </div>
        </Suspense>

        {/* Title Overlay */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="pointer-events-none absolute left-0 top-0 p-6 lg:p-10"
        >
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VibeMap
            </span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-white/50">
            Drop your vibe on the globe. See how the world feels right now.
          </p>
        </motion.div>
      </div>

      {/* Sidebar / Bottom Panel */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col gap-6 border-t border-white/5 bg-gray-950/80 p-6 backdrop-blur-xl lg:w-96 lg:border-l lg:border-t-0"
      >
        {/* Mood Selector */}
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">
            How are you feeling?
          </h2>
          <MoodSelector
            onSelect={handleMoodSelect}
            selectedMood={selectedMood}
            disabled={submitting}
          />
        </div>

        {/* Drop Button */}
        <div className="flex justify-center">
          <VibeDropButton
            onClick={handleDrop}
            disabled={!selectedMood || !position || submitting || geoLoading}
            color={activeColor}
          />
        </div>

        {/* Location Status */}
        {geoLoading && (
          <p className="text-center text-xs text-white/30">Getting your location...</p>
        )}
        {position && !geoLoading && (
          <p className="text-center text-xs text-white/30">
            {position.city || `${position.lat.toFixed(1)}, ${position.lng.toFixed(1)}`}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Stats */}
        <VibeStatsPanel stats={stats} />
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <ShareCard vibe={showShare} onClose={() => setShowShare(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
