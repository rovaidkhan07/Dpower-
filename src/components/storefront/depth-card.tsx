"use client";

import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface DepthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DepthCard({ children, className }: DepthCardProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -5);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformPerspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
