import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import data from '../assets/data/cleaned_data.json';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const Highlights = ({ onConductorSelect }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate insights and organize featured conductors
  const featured = useMemo(() => {
    const conductorData = data.reduce((acc, item) => {
      const name = item?.conductor_info?.name;
      if (!name) return acc;
      
      if (!acc[name]) {
        acc[name] = {
          name,
          count: 0,
          productions: [],
          roles: new Set(),
          firstDate: null,
          lastDate: null
        };
      }
      
      acc[name].count += 1;
      acc[name].productions.push(item);
      if (item?.conductor_info?.role) {
        acc[name].roles.add(item.conductor_info.role);
      }
      
      const openingDate = item?.show_info?.opening;
      if (openingDate) {
        const date = new Date(openingDate);
        if (!acc[name].firstDate || date < acc[name].firstDate) {
          acc[name].firstDate = date;
        }
        if (!acc[name].lastDate || date > acc[name].lastDate) {
          acc[name].lastDate = date;
        }
      }
      
      return acc;
    }, {});

    // Calculate insights for each conductor
    const conductorsWithInsights = Object.values(conductorData).map(conductor => {
      const spanYears = conductor.lastDate && conductor.firstDate 
        ? conductor.lastDate.getFullYear() - conductor.firstDate.getFullYear()
        : 0;
      
      // Determine primary insight
      let insight = t('highlights.insights.topRecorded');
      let insightPriority = conductor.count;
      
      // Check if historical pioneer (earliest first date)
      const allFirstDates = Object.values(conductorData)
        .map(c => c.firstDate)
        .filter(Boolean)
        .sort((a, b) => a - b);
      
      if (conductor.firstDate && allFirstDates[0] && 
          conductor.firstDate.getTime() === allFirstDates[0].getTime()) {
        insight = t('highlights.insights.historicalPioneer');
        insightPriority = 1000; // Highest priority
      } else if (spanYears > 10) {
        insight = t('highlights.insights.longestSpan');
        insightPriority = spanYears;
      }
      
      return {
        ...conductor,
        spanYears,
        insight,
        insightPriority,
        sample: conductor.productions[0],
        photo: conductor.productions.find(p => p?.conductor_info?.photo)?.conductor_info?.photo || null,
        role: Array.from(conductor.roles)[0] || t('cards.unknownRole')
      };
    });

    // Sort by count (top recorded), then by first date (chronological)
    return conductorsWithInsights
      .sort((a, b) => {
        // First sort by count (descending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Then by first date (ascending - chronological)
        if (a.firstDate && b.firstDate) {
          return a.firstDate - b.firstDate;
        }
        return 0;
      })
      .slice(0, 5) // Show top 5
      .map((conductor, index) => ({
        name: conductor.name,
        role: conductor.role,
        photo: conductor.photo,
        count: conductor.count,
        firstDate: conductor.firstDate,
        insight: conductor.insight,
        insightPriority: conductor.insightPriority
      }));
  }, [t]);

  const handleCardClick = (conductorName) => {
    if (onConductorSelect) {
      onConductorSelect(conductorName);
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  // Auto-scroll carousel on mobile
  useEffect(() => {
    if (isMobile && carouselRef.current) {
      const card = carouselRef.current.children[activeIndex];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIndex, isMobile]);

  const getInsightBadgeColor = (insight) => {
    const historicalPioneer = t('highlights.insights.historicalPioneer');
    const longestSpan = t('highlights.insights.longestSpan');
    
    if (insight === historicalPioneer) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    } else if (insight === longestSpan) {
      return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40';
    } else {
      return 'bg-yellow-600/20 text-yellow-500 border-yellow-600/40';
    }
  };

  return (
    <motion.section
      className="px-6 sm:px-8 lg:px-8 py-8 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900/40 to-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-[1600px] w-full lg:w-[94%] mx-auto">
        <div className="text-center mb-10 sm:mb-14 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-yellow-500 font-bold mb-4">
            {t('highlights.title')}
          </h2>
          <p className="text-gray-100 text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-center">
            {t('highlights.subtitle')}
          </p>
        </div>

        {/* Desktop Grid / Mobile Carousel */}
        <div className="relative">
          {/* Mobile Navigation */}
          {isMobile && featured.length > 1 && (
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 transition-all flex items-center justify-center"
                aria-label={t('highlights.navigation.previous')}
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 transition-all flex items-center justify-center"
                aria-label={t('highlights.navigation.next')}
              >
                →
              </button>
            </div>
          )}

          <div
            ref={carouselRef}
            className={`${
              isMobile 
                ? 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4' 
                : 'grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {featured.map((item, index) => {
              const isActive = isMobile ? activeIndex === index : true;
              const isCenter = isMobile && activeIndex === index;
              
              return (
                <motion.div
                  key={`${item.name}-${index}`}
                  className={`
                    ${isMobile ? 'flex-shrink-0 w-[85vw] snap-center' : ''}
                    bg-gradient-to-br from-gray-900/80 to-black border-2 border-yellow-900/40 
                    rounded-2xl p-6 sm:p-8 shadow-2xl transition-all cursor-pointer group
                    ${isCenter ? 'opacity-100 scale-100' : isMobile ? 'opacity-40 scale-90' : 'opacity-100'}
                    hover:border-yellow-500/60 hover:shadow-yellow-500/20
                  `}
                  onClick={() => handleCardClick(item.name)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: isMobile ? (isCenter ? 1 : 0.4) : 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={isMobile && !isCenter ? {} : { y: -5, scale: 1.02 }}
                >
                  {/* Insight Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getInsightBadgeColor(item.insight)}`}>
                      {item.insight}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6 text-center sm:text-left">
                    {item.photo ? (
                      <div className="relative">
                        <img
                          src={item.photo}
                          alt={t('cards.portraitAlt', { name: item.name })}
                          className={`w-20 h-20 rounded-full object-cover border-2 mx-auto sm:mx-0 transition-all duration-500 ${
                            isCenter || !isMobile
                              ? 'border-yellow-500/80 shadow-[0_0_20px_rgba(212,175,55,0.6)]'
                              : 'grayscale border-yellow-500/40'
                          } group-hover:grayscale-0 group-hover:border-yellow-500/80 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]`}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-yellow-900/30 to-gray-900 border-2 flex items-center justify-center mx-auto sm:mx-0 transition-all duration-500 ${
                        isCenter || !isMobile
                          ? 'border-yellow-500/80 shadow-[0_0_20px_rgba(212,175,55,0.6)]'
                          : 'border-yellow-500/40'
                      } group-hover:border-yellow-500/80 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]`}>
                        <span className="text-lg font-serif text-yellow-400">
                          {getInitials(item.name)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-center sm:items-start">
                      <h3 className="text-xl sm:text-2xl font-serif text-white mb-1">{item.name}</h3>
                      <p className="text-yellow-500 text-xs uppercase tracking-widest">{t(`roles.${item.role}`, { defaultValue: item.role })}</p>
                    </div>
                  </div>

                  {/* Recorded Productions - Most Prominent */}
                  <div className="text-center sm:text-left mb-4">
                    <div className="text-gray-100 text-xs uppercase tracking-wider mb-2">
                      {t('highlights.recordedProductions')}
                    </div>
                    <div className="text-5xl sm:text-6xl md:text-7xl font-black text-yellow-500 font-serif drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      {item.count}
                    </div>
                  </div>

                  {item.fact && (
                    <p className="text-gray-100 text-xs sm:text-sm italic border-l-2 border-yellow-600/40 pl-3 leading-relaxed mt-4">
                      💡 {item.fact}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
};

export default Highlights;
