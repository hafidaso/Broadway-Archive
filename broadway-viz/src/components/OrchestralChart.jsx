import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import data from '../assets/data/cleaned_data.json';

// Fixed encoding system: map Maestra count → instrument family
// 10+  → Grand Piano (headline shows)
// 5–9  → Strings section
// 2–4  → Brass section
// 1    → Woodwind / single voice
const getInstrumentForCount = (count) => {
  if (count >= 10) {
    return { icon: '🎹', family: 'Grand Piano', bucket: '10+' };
  }
  if (count >= 5) {
    return { icon: '🎻', family: 'Strings', bucket: '5–9' };
  }
  if (count >= 2) {
    return { icon: '🎺', family: 'Brass', bucket: '2–4' };
  }
  return { icon: '🎶', family: 'Woodwind', bucket: '1' };
};

const OrchestralChart = () => {
  const shows = useMemo(() => {
    const counts = new Map();

    data.forEach(item => {
      const title = item?.show_info?.title;
      if (!title) return;
      counts.set(title, (counts.get(title) || 0) + 1);
    });

    const list = Array.from(counts.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16);

    const maxCount = list.length ? Math.max(...list.map(d => d.count)) : 1;

    return list.map((item, index) => {
      const instrument = getInstrumentForCount(item.count);
      const prominence = 0.8 + (item.count / maxCount) * 0.5; // 0.8–1.3
      return {
        ...item,
        instrument,
        prominence
      };
    });
  }, []);

  return (
    <section
      aria-label="Orchestral Harmony Chart — Maestra count by show"
      className="relative rounded-3xl border border-yellow-900/60 bg-gradient-to-b from-[#140b0b] via-black to-[#1a0c0c] overflow-hidden"
    >
      {/* Stage lighting backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-[-10%] top-[-40%] h-[60%] bg-[radial-gradient(circle_at_50%_0%,rgba(252,211,77,0.45),transparent_55%)]" />
        <div className="absolute inset-x-[-10%] bottom-[-30%] h-[40%] bg-[radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.75),transparent_60%)]" />
      </div>

      <div className="relative px-6 sm:px-8 md:px-10 pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-yellow-200 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🎼
              </span>
              Orchestral Harmony Chart
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-yellow-100/80 max-w-xl">
              Each Broadway show becomes an instrument on a classical stage. The size of the instrument
              and the cluster of batons reveal how many Maestra appearances each show has.
            </p>
          </div>
          <p className="text-[11px] sm:text-xs text-yellow-200/80 uppercase tracking-[0.25em] text-right">
            Maestra Count by Show
          </p>
        </div>

        {/* Encoding legend */}
        <div className="mt-3 sm:mt-4 flex justify-end">
          <div className="inline-flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-yellow-100/85">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-yellow-500/70 px-2.5 py-1 backdrop-blur-sm font-semibold">
              <span aria-hidden="true" className="text-base">
                🎹
              </span>
              <span className="uppercase tracking-[0.16em]">
                10+ Maestra credits
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-yellow-400/70 px-2.5 py-1 backdrop-blur-sm font-semibold">
              <span aria-hidden="true" className="text-base">
                🎻
              </span>
              <span className="uppercase tracking-[0.16em]">
                5–9 Maestra credits
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-yellow-300/70 px-2.5 py-1 backdrop-blur-sm font-semibold">
              <span aria-hidden="true" className="text-base">
                🎺
              </span>
              <span className="uppercase tracking-[0.16em]">
                2–4 Maestra credits
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-yellow-200/70 px-2.5 py-1 backdrop-blur-sm font-semibold">
              <span aria-hidden="true" className="text-base">
                🎶
              </span>
              <span className="uppercase tracking-[0.16em]">
                1 Maestra credit
              </span>
            </span>
          </div>
        </div>

        {/* Stage rail */}
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-yellow-700/70 via-yellow-500 to-yellow-800/70 shadow-[0_0_25px_rgba(217,119,6,0.75)]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {shows.map((show, index) => {
            const iconSize = 2.4 + show.prominence * 1.8; // rem
            const maxIcons = 18;
            const iconCount = Math.min(show.count, maxIcons);
            const remainder = show.count - iconCount;

            const isPiano = show.instrument.bucket === '10+';
            const isStrings = show.instrument.bucket === '5–9';
            const isBrass = show.instrument.bucket === '2–4';
            const isWoodwind = show.instrument.bucket === '1';

            const cardBgClass = isPiano
              ? 'bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(252,211,77,0.35),transparent_60%),linear-gradient(to_bottom_right,#020202,#1a130f,#050505)]'
              : isStrings
              ? 'bg-[radial-gradient(circle_at_0%_0%,rgba(248,250,252,0.08),transparent_55%),linear-gradient(to_bottom_right,#11060a,#3b1613,#050307)]'
              : isBrass
              ? 'bg-[radial-gradient(circle_at_90%_0%,rgba(253,224,171,0.35),transparent_60%),linear-gradient(to_bottom_right,#120c05,#3f2609,#050301)]'
              : 'bg-[radial-gradient(circle_at_20%_0%,rgba(209,213,219,0.16),transparent_55%),linear-gradient(to_bottom_right,#05060a,#141522,#020308)]';

            return (
              <motion.article
                key={show.title}
                className={`relative group rounded-2xl border border-yellow-900/60 px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3 shadow-[0_18px_32px_rgba(0,0,0,0.8)] ${cardBgClass}`}
                tabIndex={0}
                role="group"
                aria-label={`${show.title}: ${show.count} Maestra credits`}
                whileHover={{
                  y: -6,
                  boxShadow: '0 0 32px rgba(250, 204, 21, 0.45)',
                  borderColor: 'rgba(250, 204, 21, 0.9)'
                }}
                whileFocus={{
                  y: -6,
                  boxShadow: '0 0 32px rgba(250, 204, 21, 0.6)',
                  borderColor: 'rgba(250, 250, 250, 1)'
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                classNameFocus="outline-none"
              >
                {/* Spotlight halo */}
                <div className="pointer-events-none absolute inset-x-6 top-1 h-10 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.25),transparent_60%)] opacity-60 group-hover:opacity-90 transition-opacity" />

                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200/90">
                      Show
                    </p>
                    <h4 className="text-sm sm:text-base font-serif text-yellow-50 leading-snug">
                      {show.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-200/90">
                      Maestra Count
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-yellow-300 font-serif drop-shadow-[0_0_12px_rgba(250,250,110,0.7)]">
                      {show.count}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-2 mt-1">
                  {/* Instrument (size encodes relative Maestra count) */}
                  <motion.div
                    className="flex flex-col items-center justify-end"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <motion.div
                      className="relative flex items-center justify-center"
                      style={{ fontSize: `${iconSize}rem` }}
                      role="img"
                      aria-label={
                        show.instrument.bucket === '10+'
                          ? `High representation: grand piano icon indicating ${show.count} conductors for the show ${show.title}`
                          : show.instrument.bucket === '5–9'
                          ? `Strong representation: strings icon indicating ${show.count} conductors for the show ${show.title}`
                          : show.instrument.bucket === '2–4'
                          ? `Moderate representation: brass icon indicating ${show.count} conductors for the show ${show.title}`
                          : `Single appearance: woodwind icon indicating ${show.count} conductor for the show ${show.title}`
                      }
                      whileHover={{
                        rotate: [-2, 2, -1, 1, 0],
                        textShadow: [
                          '0 0 0px rgba(250, 204, 21, 0.0)',
                          '0 0 12px rgba(250, 204, 21, 0.9)',
                          '0 0 18px rgba(250, 204, 21, 0.7)',
                          '0 0 10px rgba(250, 204, 21, 0.8)',
                          '0 0 0px rgba(250, 204, 21, 0.0)'
                        ]
                      }}
                      transition={{
                        duration: 0.7,
                        ease: 'easeInOut'
                      }}
                    >
                      {show.instrument.icon}
                    </motion.div>
                  </motion.div>

                  {/* Batons / notes cluster */}
                  <div className="flex-1 flex flex-col items-end gap-1">
                    <div className="flex flex-wrap justify-end gap-[2px] max-w-[9rem]">
                      {Array.from({ length: iconCount }).map((_, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-900/60 text-[0.6rem] text-yellow-200 border border-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                          aria-hidden="true"
                        >
                          🎼
                        </span>
                      ))}
                      {remainder > 0 && (
                        <span className="inline-flex items-center justify-center px-1.5 h-4 rounded-full bg-black/70 border border-yellow-400/60 text-[0.6rem] text-yellow-200">
                          +{remainder}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-yellow-100/70">
                      Conductors on this production
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Stage floor */}
        <div className="h-4 sm:h-5 mt-2 rounded-t-full bg-gradient-to-r from-[#3b1b0f] via-[#4b1f12] to-[#3b1b0f] border-t border-yellow-900/70 shadow-[0_-10px_45px_rgba(0,0,0,0.95)]" />

        {/* Spotify embed for the most represented show (Six) */}
        <div className="mt-8 sm:mt-10">
          <h4 className="text-sm sm:text-base font-serif text-yellow-100 mb-2">
            Sound of the stage — <span className="font-semibold">Six (Original Cast Recording)</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-yellow-100/80 mb-3">
            Listen to the cast recording of one of the most represented shows in this dataset.
          </p>
          <div className="rounded-2xl overflow-hidden border border-yellow-900/60 shadow-[0_18px_40px_rgba(0,0,0,0.9)]">
            <iframe
              title="Six Original Cast Recording on Spotify"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/album/0VEsR6Rw4ApD0jeIlx4gsq?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrchestralChart;

