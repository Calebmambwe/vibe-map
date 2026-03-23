"use client";

import { motion } from "framer-motion";
import { pulseGlow } from "@/lib/animations";

export function GlobeLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        variants={pulseGlow}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
          </div>
        </div>
        <p className="text-sm text-white/50">Loading the globe...</p>
      </motion.div>
    </div>
  );
}
