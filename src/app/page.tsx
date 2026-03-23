"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Timer } from "lucide-react";
import { VibeGlobe } from "@/components/globe/VibeGlobe";
import { GlobeLoader } from "@/components/globe/GlobeLoader";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { VibeStatsPanel } from "@/components/stats/VibeStats";
import { ShareCard } from "@/components/shared/ShareCard";
import { VibeDropButton } from "@/components/shared/VibeDropButton";
import { ParticleBurst } from "@/components/shared/ParticleBurst";
import { TimelapsePlayer } from "@/components/shared/TimelapsePlayer";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MilestoneToast } from "@/components/shared/MilestoneToast";
import { useVibes } from "@/hooks/useVibes";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useVibeStreak } from "@/hooks/useVibeStreak";
import { getMood } from "@/types/vibe";
import { playVibeDropSound, playSelectSound } from "@/lib/sounds";
import { fadeInUp, slideInRight } from "@/lib/animations";
import type { MoodType, Vibe } from "@/types/vibe";
import type { GlobeMethods } from "react-globe.gl";

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [showShare, setShowShare] = useState<Vibe | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showTimelapse, setShowTimelapse] = useState(false);
  const [timelapseVibes, setTimelapseVibes] = useState<Vibe[] | null>(null);
  const globeMethodsRef = useRef<GlobeMethods | null>(null);
  const { vibes, stats, activeVisitors, submitting, submitVibe } = useVibes();
  const { position, loading: geoLoading, requestLocation } = useGeolocation();
  const { streak, recordVibe } = useVibeStreak();

  const handleMoodSelect = useCallback(
    (mood: MoodType) => {
      setSelectedMood(mood);
      playSelectSound();
      if (!position) {
        requestLocation();
      }
    },
    [position, requestLocation],
  );

  const handleDrop = useCallback(async () => {
    if (!selectedMood || !position) return;

    const vibe = await submitVibe(
      selectedMood,
      position.lat,
      position.lng,
      position.city,
      position.country,
    );
    if (vibe) {
      playVibeDropSound();
      setShowParticles(true);
      recordVibe();

      if (globeMethodsRef.current) {
        globeMethodsRef.current.pointOfView(
          { lat: vibe.lat, lng: vibe.lng, altitude: 1.8 },
          1500,
        );
      }

      setTimeout(() => {
        setShowShare(vibe);
        setSelectedMood(null);
      }, 800);
    }
  }, [selectedMood, position, submitVibe, recordVibe]);

  const handleGlobeReady = useCallback((methods: GlobeMethods) => {
    globeMethodsRef.current = methods;
    setGlobeReady(true);
  }, []);

  const handleTimelapseVibes = useCallback((active: Vibe[]) => {
    setTimelapseVibes(active);
  }, []);

  const handleCloseTimelapse = useCallback(() => {
    setShowTimelapse(false);
    setTimelapseVibes(null);
  }, []);

  const activeColor = selectedMood ? getMood(selectedMood).color : "#6B73FF";
  const displayVibes = showTimelapse && timelapseVibes ? timelapseVibes : vibes;

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-950 text-white lg:flex-row">
      {/* Milestone Toast */}
      <MilestoneToast vibeCount={stats?.total ?? 0} city={position?.city} />

      {/* Globe Section */}
      <div className="relative flex-1">
        <Suspense fallback={<GlobeLoader />}>
          {!globeReady && <GlobeLoader />}
          <div className={globeReady ? "opacity-100 transition-opacity duration-500" : "pointer-events-none absolute inset-0 opacity-0"}>
            <div className="h-[60vh] lg:h-screen">
              <VibeGlobe vibes={displayVibes} onGlobeReady={handleGlobeReady} />
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

        {/* Live Visitor Counter */}
        {activeVisitors > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 backdrop-blur-md lg:bottom-8 lg:left-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Users size={14} className="text-white/50" />
            <span className="text-xs text-white/60">
              {activeVisitors} {activeVisitors === 1 ? "person" : "people"} vibing
            </span>
          </motion.div>
        )}

        {/* Timelapse Player */}
        {showTimelapse && (
          <TimelapsePlayer
            vibes={vibes}
            onActiveVibesChange={handleTimelapseVibes}
            onClose={handleCloseTimelapse}
          />
        )}
      </div>

      {/* Sidebar / Bottom Panel */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col gap-6 border-t border-white/5 bg-gray-950/80 p-6 backdrop-blur-xl lg:w-96 lg:border-l lg:border-t-0"
      >
        {/* Header with theme toggle + timelapse */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
            How are you feeling?
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimelapse((s) => !s)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                showTimelapse
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
              aria-label="Toggle timelapse"
            >
              <Timer size={16} />
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mood Selector */}
        <MoodSelector
          onSelect={handleMoodSelect}
          selectedMood={selectedMood}
          disabled={submitting}
        />

        {/* Drop Button */}
        <div className="relative flex justify-center">
          <VibeDropButton
            onClick={handleDrop}
            disabled={!selectedMood || !position || submitting || geoLoading}
            submitting={submitting}
            color={activeColor}
          />
          <ParticleBurst
            active={showParticles}
            color={activeColor}
            onComplete={() => setShowParticles(false)}
          />
        </div>

        {/* Location + Streak Status */}
        <div className="flex flex-col items-center gap-1">
          {geoLoading && (
            <p className="text-xs text-white/30">Getting your location...</p>
          )}
          {position && !geoLoading && (
            <p className="text-xs text-white/30">
              {position.city && position.country
                ? `${position.city}, ${position.country}`
                : `${position.lat.toFixed(1)}, ${position.lng.toFixed(1)}`}
            </p>
          )}
          {streak > 1 && (
            <p className="text-xs text-amber-400/70">
              {streak} day streak
            </p>
          )}
        </div>

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
