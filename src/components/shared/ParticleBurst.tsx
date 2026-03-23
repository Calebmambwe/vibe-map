"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface ParticleBurstProps {
  active: boolean;
  color: string;
  onComplete?: () => void;
}

function generateParticles(): Particle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.1,
    };
  });
}

export function ParticleBurst({ active, color, onComplete }: ParticleBurstProps) {
  const particles = useMemo(() => (active ? generateParticles() : []), [active]);

  useEffect(() => {
    if (!active || !onComplete) return;
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" as const }}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
    </AnimatePresence>
  );
}
