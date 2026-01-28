import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Stage = ({ progress, range, content, watermark, isInteractive = false }) => {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const blurValue = useTransform(progress, range, [15, 0, 0, 15]);
  const y = useTransform(progress, range, [30, 0, 0, -30]);
  const scale = useTransform(progress, range, [0.98, 1, 1, 1.02]);

  return (
    <motion.div
      style={{
        opacity,
        filter: useTransform(blurValue, (v) => `blur(${v}px)`),
        y,
        scale,
        pointerEvents: useTransform(opacity, (o) => (o > 0.5 && isInteractive ? 'auto' : 'none'))
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
    >
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {content}
      </div>
      {watermark && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
          style={{
            opacity: useTransform(progress, range, [0, 0.04, 0.04, 0]),
            scale: useTransform(progress, range, [0.8, 1, 1, 1.2])
          }}
        >
          <span className="text-[10rem] md:text-[18rem] lg:text-[24rem] font-bold text-white/[0.02] select-none whitespace-nowrap font-serif">
            {watermark}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export const StoryText = ({ progress, onAction, onTimeline, onChart }) => {
  const { t } = useTranslation();
  
  return (
    <div className="absolute inset-0 z-10">
      <Stage
        progress={progress}
        range={[0.0, 0.04, 0.18, 0.22]}
        content={
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold tracking-[0.25em] text-white leading-tight">
              {t('hero.stage1.title').toUpperCase()}
            </h1>
            <div className="flex justify-center items-center gap-12 mt-6">
              <span className="font-serif text-white/30 tracking-[0.4em] text-[10px] md:text-xs uppercase">
                {t('hero.stage1.subtitleFr')}
              </span>
              <div className="w-8 h-px bg-white/10" />
              <span className="font-serif text-white/30 tracking-[0.4em] text-[10px] md:text-xs">
                {t('hero.stage1.subtitleAr')}
              </span>
            </div>
          </div>
        }
      />

      <Stage
        progress={progress}
        range={[0.18, 0.22, 0.36, 0.4]}
        watermark={t('hero.stage2.hiddenVoices')}
        content={
          <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-white/90 leading-relaxed">
            {t('hero.stage2.text').replace(t('hero.stage2.hiddenVoices'), '').trim()}<span className="text-white"> {t('hero.stage2.hiddenVoices')}</span>
          </p>
        }
      />

      <Stage
        progress={progress}
        range={[0.36, 0.4, 0.56, 0.6]}
        watermark={t('hero.stage3.year')}
        content={
          <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-white/90 leading-relaxed">
            {t('hero.stage3.text')}
          </p>
        }
      />

      <Stage
        progress={progress}
        range={[0.56, 0.6, 0.76, 0.8]}
        watermark={t('hero.stage4.watermark')}
        content={
          <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-light tracking-wide text-white/90 leading-relaxed">
            {t('hero.stage4.text')}
          </p>
        }
      />

      <Stage
        progress={progress}
        range={[0.76, 0.8, 1.0, 1.04]}
        isInteractive={true}
        content={
          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center gap-3 px-6 py-2 border border-[#D4AF37]/40 rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#D4AF37] font-medium">
                {t('hero.archiveBadge')}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-normal text-[#D4AF37] leading-tight drop-shadow-2xl">
                {t('hero.title')}
              </h1>
              <h2 className="text-[12px] md:text-[14px] lg:text-[16px] tracking-[0.6em] uppercase text-white font-medium opacity-90">
                {t('hero.subtitle')}
              </h2>
            </div>

            <p className="font-serif text-white/40 text-sm md:text-lg tracking-wide max-w-2xl leading-relaxed">
              {t('hero.tagline')}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <button
                onClick={() => {
                  onAction?.();
                  onTimeline?.();
                }}
                className="cta-button px-10 py-4 text-[10px] md:text-xs"
              >
                {t('hero.ctaTimeline')}
              </button>
              <button
                onClick={() => {
                  onAction?.();
                  onChart?.();
                }}
                className="cta-button-outline px-10 py-4 text-[10px] md:text-xs"
              >
                {t('hero.ctaChart')}
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
