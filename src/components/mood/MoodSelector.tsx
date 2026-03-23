"use client";

import { motion } from "framer-motion";
import { MOODS } from "@/types/vibe";
import type { MoodType } from "@/types/vibe";
import { staggerContainer, scaleIn } from "@/lib/animations";

interface MoodSelectorProps {
  onSelect: (mood: MoodType) => void;
  selectedMood: MoodType | null;
  disabled?: boolean;
}

export function MoodSelector({ onSelect, selectedMood, disabled }: MoodSelectorProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-center gap-3"
    >
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.id;
        return (
          <motion.button
            key={mood.id}
            variants={scaleIn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.id)}
            disabled={disabled}
            className={`
              group relative flex flex-col items-center gap-1 rounded-2xl px-4 py-3
              transition-all duration-300
              ${isSelected ? "outline outline-2 outline-offset-2" : "hover:bg-white/5"}
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
            style={{
              outlineColor: isSelected ? mood.color : undefined,
              backgroundColor: isSelected ? `${mood.color}20` : undefined,
            }}
          >
            <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
              {mood.emoji}
            </span>
            <span
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: isSelected ? mood.color : "rgba(255,255,255,0.6)" }}
            >
              {mood.label}
            </span>
            {isSelected && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute -bottom-1 h-0.5 w-8 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
