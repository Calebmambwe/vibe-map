"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Clock, X } from "lucide-react";
import type { Vibe } from "@/types/vibe";

interface TimelapsePlayerProps {
  vibes: Vibe[];
  onActiveVibesChange: (vibes: Vibe[]) => void;
  onClose: () => void;
}

const SPEEDS = [
  { label: "10x", value: 10 },
  { label: "60x", value: 60 },
  { label: "360x", value: 360 },
  { label: "3600x", value: 3600 },
];

export function TimelapsePlayer({ vibes, onActiveVibesChange, onClose }: TimelapsePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2); // default 360x
  const [playheadMs, setPlayheadMs] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  // Sort vibes by timestamp and compute time range
  const sortedVibes = useMemo(
    () => [...vibes].sort((a, b) => a.timestamp - b.timestamp),
    [vibes],
  );

  const timeRange = useMemo(() => {
    if (sortedVibes.length === 0) return { start: 0, duration: 0 };
    const start = sortedVibes[0].timestamp;
    const end = sortedVibes[sortedVibes.length - 1].timestamp;
    const duration = Math.max(end - start, 60_000); // at least 1 minute
    return { start, duration };
  }, [sortedVibes]);

  // Compute active vibes based on playhead position
  const activeVibes = useMemo(() => {
    if (timeRange.duration === 0) return sortedVibes;
    const currentTime = timeRange.start + playheadMs;
    return sortedVibes.filter((v) => v.timestamp <= currentTime);
  }, [sortedVibes, playheadMs, timeRange]);

  // Push active vibes to parent
  useEffect(() => {
    onActiveVibesChange(activeVibes);
  }, [activeVibes, onActiveVibesChange]);

  // Keep refs in sync via effects
  const speedIdxRef = useRef(speedIdx);
  const durationRef = useRef(timeRange.duration);

  useEffect(() => {
    speedIdxRef.current = speedIdx;
  }, [speedIdx]);

  useEffect(() => {
    durationRef.current = timeRange.duration;
  }, [timeRange.duration]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastFrameRef.current = 0;

    function tick(timestamp: number) {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp;
      }
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      const speed = SPEEDS[speedIdxRef.current].value;
      const advance = delta * speed;

      setPlayheadMs((prev) => {
        const next = prev + advance;
        if (next >= durationRef.current) {
          setPlaying(false);
          return durationRef.current;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const handleReset = () => {
    setPlaying(false);
    setPlayheadMs(0);
  };

  const progress = timeRange.duration > 0 ? (playheadMs / timeRange.duration) * 100 : 0;
  const currentTime = new Date(timeRange.start + playheadMs);
  const timeLabel = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-16 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl lg:bottom-8"
      >
        {/* Close */}
        <button onClick={onClose} className="text-white/40 hover:text-white">
          <X size={16} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        {/* Reset */}
        <button onClick={handleReset} className="text-white/40 hover:text-white">
          <RotateCcw size={14} />
        </button>

        {/* Progress bar */}
        <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-white/10 lg:w-48">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-400"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={timeRange.duration}
            value={playheadMs}
            onChange={(e) => setPlayheadMs(Number(e.target.value))}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>

        {/* Time label */}
        <div className="flex items-center gap-1 text-xs text-white/50">
          <Clock size={12} />
          <span>{timeLabel}</span>
        </div>

        {/* Speed selector */}
        <div className="flex overflow-hidden rounded-md border border-white/10">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeedIdx(i)}
              className={`px-2 py-1 text-[10px] transition-colors ${
                i === speedIdx ? "bg-white/15 text-white" : "text-white/30 hover:text-white/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Vibe count */}
        <span className="text-xs text-white/40">
          {activeVibes.length}/{sortedVibes.length}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
