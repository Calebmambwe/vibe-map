"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface VibeDropButtonProps {
  onClick: () => void;
  disabled: boolean;
  color?: string;
}

export function VibeDropButton({ onClick, disabled, color = "#6B73FF" }: VibeDropButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white
        shadow-lg transition-all duration-300
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-xl"}
      `}
      style={{
        backgroundColor: color,
        boxShadow: disabled ? undefined : `0 0 30px ${color}40`,
      }}
    >
      <Sparkles size={22} />
      {disabled ? "Dropping..." : "Drop Your Vibe"}

      {/* Animated glow ring */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
