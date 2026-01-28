import React, { useEffect } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';
import { motion } from 'framer-motion';
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const MAX_OFFSET = 15; // max 10–20px

export default function GlobalParallaxBg() {
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isDesktop, reducedMotion, mouseX, mouseY]);

  const parallaxX = useTransform(mouseX, (v) => -v * MAX_OFFSET);
  const parallaxY = useTransform(mouseY, (v) => -v * MAX_OFFSET);
  const smoothX = useSpring(parallaxX, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothY = useSpring(parallaxY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!isDesktop || reducedMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        x: smoothX,
        y: smoothY,
        background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 55%)',
        backgroundSize: '100% 100%',
      }}
      aria-hidden="true"
    />
  );
}
