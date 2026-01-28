import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Music, Library, Users } from 'lucide-react';
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const PARALLAX_MAX = 18; // 10–20px

const About = () => {
  const { t } = useTranslation();
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

  const parallaxX = useTransform(mouseX, (v) => -v * PARALLAX_MAX);
  const parallaxY = useTransform(mouseY, (v) => -v * PARALLAX_MAX);
  const smoothX = useSpring(parallaxX, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothY = useSpring(parallaxY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scrollToExplore = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  const bgStyle = {
    backgroundImage: 'url(/about.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: isDesktop && reducedMotion ? 'fixed' : 'scroll',
  };

  return (
    <motion.section 
      className="relative min-h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-labelledby="about-heading"
    >
      {/* Background Image: mouse-follow parallax on desktop; fixed on mobile for performance */}
      <motion.div 
        className="absolute inset-0 backdrop-blur-sm about-bg-image"
        style={bgStyle}
        {...(isDesktop && !reducedMotion ? { x: smoothX, y: smoothY } : {})}
      />
      
      {/* Dark Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-black/75" />
      
      {/* Content Container - Two Column Grid */}
      <div className="relative z-10 min-h-screen w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1600px] mx-auto h-full">
          {/* Mobile: Power Statement First */}
          <div className="lg:hidden mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-500/80 mb-4 font-medium">
                {t('about.title')}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {t('about.powerStatement')}
              </h1>
            </motion.div>
          </div>

          {/* Desktop: Two Column Grid */}
          <div className="grid lg:grid-cols-2 lg:items-center gap-8 lg:gap-12 xl:gap-16 h-full">
            
            {/* Left Side - Visual Narrative (Desktop Only) */}
            <motion.div 
              className="hidden lg:flex flex-col justify-center space-y-8 lg:space-y-12"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Small Elegant Label */}
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-500/80 font-medium">
                {t('about.title')}
              </p>

              {/* Huge Power Statement */}
              <h1 className="text-6xl xl:text-7xl font-serif font-bold leading-tight bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {t('about.powerStatement')}
              </h1>

              {/* Explore Button */}
              <motion.button
                onClick={scrollToExplore}
                className="mt-8 lg:mt-12 w-fit px-8 py-4 border-2 border-yellow-500/60 text-yellow-400 font-serif text-sm uppercase tracking-[0.2em] hover:border-yellow-500 hover:text-yellow-300 hover:bg-yellow-500/10 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('about.exploreLegacy')}
              </motion.button>
            </motion.div>

            {/* Right Side - The Data Story */}
            <motion.div 
              className="flex flex-col space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Glassmorphism Card */}
              <div className="bg-black/60 backdrop-blur-xl border border-yellow-900/30 rounded-2xl p-8 sm:p-10 lg:p-12">
                {/* Icons Above Text */}
                <div className="flex justify-center gap-8 mb-8">
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <Music className="w-8 h-8 text-yellow-500/80" strokeWidth={1.5} />
                    <span className="text-xs text-yellow-500/60 uppercase tracking-wider">{t('about.conductors')}</span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <Library className="w-8 h-8 text-yellow-500/80" strokeWidth={1.5} />
                    <span className="text-xs text-yellow-500/60 uppercase tracking-wider">{t('about.directors')}</span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <Users className="w-8 h-8 text-yellow-500/80" strokeWidth={1.5} />
                    <span className="text-xs text-yellow-500/60 uppercase tracking-wider">{t('about.supervisors')}</span>
                  </motion.div>
                </div>

                {/* Main Description Text */}
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-base sm:text-lg md:text-xl text-white leading-[1.9] tracking-wide">
                    {t('about.introLead')} <span className="text-yellow-500 font-semibold">{t('about.introHighlight')}</span> {t('about.introTail')}
                  </p>
                  <p className="text-base sm:text-lg md:text-xl leading-[1.9] tracking-wide">
                    {t('about.introBody')}
                  </p>
                </div>

                {/* Data Credits with Avatars */}
                <div className="mt-10 pt-8 border-t border-yellow-900/20">
                  <p className="text-gray-100 text-xs uppercase tracking-widest mb-6">{t('about.creditsTitle')}</p>
                  <div className="flex flex-row items-center gap-6">
                    {/* Sariva Goetz Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-serif text-yellow-500/80 font-semibold">SG</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">{t('about.creditsCuratedBy')}</p>
                        <p className="text-sm text-yellow-400 font-semibold">Sariva Goetz</p>
                      </div>
                    </div>
                    {/* Hafida Belayd Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-serif text-yellow-500/80 font-semibold">HB</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">{t('about.creditsVisualizationBy')}</p>
                        <p className="text-sm text-yellow-400 font-semibold">Hafida Belayd</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
