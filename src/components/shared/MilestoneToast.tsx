"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useEffect, useRef, useReducer } from "react";

interface MilestoneToastProps {
  vibeCount: number;
  city?: string;
}

const MILESTONES = [10, 50, 100, 500, 1000, 5000];

function getMilestoneMessage(count: number, city?: string): string | null {
  if (MILESTONES.includes(count)) {
    return `You're vibe #${count.toLocaleString()}${city ? ` from ${city}` : ""}! Keep the energy flowing!`;
  }
  return null;
}

type State = { visible: boolean };
type Action = { type: "show" } | { type: "hide" };

function reducer(_state: State, action: Action): State {
  if (action.type === "show") return { visible: true };
  if (action.type === "hide") return { visible: false };
  return _state;
}

export function MilestoneToast({ vibeCount, city }: MilestoneToastProps) {
  const [state, dispatch] = useReducer(reducer, { visible: false });
  const prevCountRef = useRef(vibeCount);

  const message = useMemo(() => getMilestoneMessage(vibeCount, city), [vibeCount, city]);

  useEffect(() => {
    if (vibeCount !== prevCountRef.current && message) {
      dispatch({ type: "show" });
      const timer = setTimeout(() => dispatch({ type: "hide" }), 5000);
      prevCountRef.current = vibeCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = vibeCount;
  }, [vibeCount, message]);

  return (
    <AnimatePresence>
      {state.visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-3 text-center backdrop-blur-xl"
        >
          <p className="text-sm font-medium text-yellow-300">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
