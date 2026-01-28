import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, easeInOut } from 'framer-motion';
import Baton from './Baton';
import { StoryText } from './StoryText';

const Hero = ({ onTimeline, onChart }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const amplifiedProgress = useTransform(scrollYProgress, (value) => Math.min(1, value * 1.35));
  const smoothProgress = useSpring(amplifiedProgress, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001
  });

  const batonRotation = useTransform(smoothProgress, [0, 1], [0, 220], { ease: easeInOut });
  const batonGlow = useTransform(smoothProgress, [0, 0.7, 1], [15, 35, 140]);
  const batonVibration = useTransform(smoothProgress, [0.8, 1], [0, 12]);

  const batonOpacity = useTransform(
    smoothProgress,
    [
      0, 0.04, 0.14, 0.18,
      0.22, 0.26, 0.36, 0.4,
      0.44, 0.48, 0.58, 0.62,
      0.66, 0.7, 0.8, 0.84,
      0.88, 0.94, 1.0
    ],
    [
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 0, 0
    ]
  );

  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();

      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(840, audioCtx.currentTime + 1.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1260, audioCtx.currentTime + 1.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.2);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.5);
      osc2.stop(audioCtx.currentTime + 1.5);

      setTimeout(() => audioCtx.close(), 2000);
    } catch (e) {
      console.warn('Audio Context failed:', e);
    }
  };

  return (
    <section id="home" ref={containerRef} className="relative h-[300vh] md:h-[600vh] bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center">
        <StoryText
          progress={smoothProgress}
          onAction={playClickSound}
          onTimeline={onTimeline}
          onChart={onChart}
        />

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          >
            <Baton
              rotation={batonRotation}
              glowSize={batonGlow}
              vibration={batonVibration}
              opacity={batonOpacity}
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_75%)]" />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-[2px] bg-white/10 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-[#D4AF37]"
            style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
          />
        </div>

      </div>

      
    </section>
  );
};

export default Hero;
