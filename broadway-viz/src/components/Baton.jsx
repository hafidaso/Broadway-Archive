import React from 'react';
import { motion, useTransform } from 'framer-motion';

const Baton = ({ rotation, glowSize, vibration, opacity }) => {
  return (
    <motion.div
      style={{
        rotate: rotation,
        opacity: opacity
      }}
      animate={{
        x: vibration.get() > 0 ? [0, vibration.get(), -vibration.get(), 0] : 0,
        y: vibration.get() > 0 ? [0, -vibration.get() / 3, vibration.get() / 3, 0] : 0
      }}
      transition={{
        repeat: Infinity,
        duration: 0.07,
        ease: 'linear'
      }}
      className="relative h-[35vh] sm:h-[60vh] lg:h-[70vh] w-3 sm:w-5 lg:w-6 flex flex-col items-center justify-center overflow-visible"
    >
      <motion.div
        style={{
          boxShadow: useTransform(glowSize, (s) => `0 0 ${s}px ${s / 2.5}px rgba(212, 175, 55, 0.12)`),
          opacity: useTransform(glowSize, [15, 140], [0.2, 0.9])
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-[85%] rounded-full blur-md"
      />

      <svg
        width="40"
        height="100%"
        viewBox="0 0 40 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full overflow-visible"
      >
        <defs>
          <linearGradient id="batonLuxGradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#8B6D1E" />
            <stop offset="8%" stopColor="#D4AF37" />
            <stop offset="45%" stopColor="#FFF8E1" />
            <stop offset="92%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
          <filter id="batonSoftGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          d="M12 650C12 630 28 630 28 650V685C28 695 12 695 12 685V650Z"
          fill="#3E2723"
          filter="url(#batonSoftGlow)"
        />

        <path d="M20 15 L22.5 650 L17.5 650 Z" fill="url(#batonLuxGradient)" />

        <circle cx="20" cy="15" r="1.5" fill="#FFF8E1" />
      </svg>

      <div className="absolute top-[8%] bottom-[12%] left-1/2 w-[0.5px] bg-white/30 blur-[0.4px] -translate-x-1/2 mix-blend-overlay" />
    </motion.div>
  );
};

export default Baton;
