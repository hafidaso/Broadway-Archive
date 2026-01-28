import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import data from '../assets/data/cleaned_data.json';
import ShowCard from './ShowCard';

const Timeline = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get unique roles and decades
  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(data.map(item => item?.conductor_info?.role).filter(Boolean))];
    return uniqueRoles.sort();
  }, []);

  const decades = useMemo(() => {
    const uniqueDecades = [...new Set(data.map(item => item?.decade).filter(Boolean))];
    return uniqueDecades.sort();
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    const filtered = data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item?.conductor_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.show_info?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || item?.conductor_info?.role === selectedRole;
      // Convert both to string for comparison since select value is always string
      const matchesDecade = selectedDecade === 'all' || String(item?.decade) === String(selectedDecade);
      
      return matchesSearch && matchesRole && matchesDecade;
    });
    
    console.log('Filter Results:', {
      selectedRole,
      selectedDecade,
      totalData: data.length,
      filteredCount: filtered.length,
      sample: filtered.slice(0, 2).map(i => ({ 
        name: i?.conductor_info?.name, 
        role: i?.conductor_info?.role, 
        decade: i?.decade 
      }))
    });
    
    return filtered;
  }, [searchTerm, selectedRole, selectedDecade]);

  // Group filtered data by decade
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const decade = item?.decade || t('timeline.unknownDecade');
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(item);
      return acc;
    }, {});
  }, [filteredData, t]);

  const earliestShow = useMemo(() => {
    return data.reduce((earliest, item) => {
      if (!item?.show_info?.opening) return earliest;
      const opening = new Date(item.show_info.opening);
      if (Number.isNaN(opening.getTime())) return earliest;
      return !earliest || opening < new Date(earliest?.show_info?.opening)
        ? item
        : earliest;
    }, null);
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedDecade('all');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="timeline-container bg-black text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div 
            className="mb-8 sm:mb-12 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 border-2 border-yellow-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-10 bg-gray-800/50 rounded-xl mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-3 h-12 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`timeline-container bg-black text-white ${compactMode ? 'py-8 sm:py-12' : 'py-16 sm:py-20 md:py-24'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
        {/* Filter Section */}
        <motion.div 
          className={`${compactMode ? 'mb-6 sm:mb-8' : 'mb-10 sm:mb-14 md:mb-16'} bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 border-2 border-yellow-900/50 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`${compactMode ? 'p-4 sm:p-6' : 'p-6 sm:p-8 md:p-10'} flex items-center justify-between border-b border-yellow-900/30`}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-yellow-500 font-bold flex items-center gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl">🔍</span>
              <span>{t('timeline.filterSearch')}</span>
            </h3>
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCompactMode((prev) => !prev)}
                className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.3em] transition-all ${
                  compactMode
                    ? 'border-yellow-400/80 text-yellow-200 shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                    : 'border-yellow-500/30 text-yellow-300/80 hover:border-yellow-500/60 hover:text-yellow-200'
                }`}
              >
                Compact
              </button>
            </div>
            <motion.button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="md:hidden p-2 rounded-lg bg-yellow-900/20 hover:bg-yellow-900/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={showFilterPanel ? t('timeline.toggleFiltersHide') : t('timeline.toggleFiltersShow')}
            >
              <motion.svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: showFilterPanel ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
          </div>
          
          <AnimatePresence>
            {(showFilterPanel || isDesktop) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={`${compactMode ? 'p-4 sm:p-6 pt-4' : 'p-6 sm:p-8 md:p-10 lg:p-12 pt-6 sm:pt-8'}`}>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${compactMode ? 'gap-4 sm:gap-5 mb-4' : 'gap-6 sm:gap-7 md:gap-8 mb-8'}`}>
            {/* Search Bar */}
            <div className="md:col-span-2 lg:col-span-3">
              <label 
                htmlFor="search-input"
                className={`block text-xs sm:text-sm md:text-base font-semibold text-yellow-400 ${compactMode ? 'mb-2' : 'mb-2 sm:mb-3'}`}
              >
                {t('timeline.search')}
              </label>
              <input
                id="search-input"
                type="text"
                placeholder={t('timeline.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 sm:px-5 ${compactMode ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'} bg-black/70 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 transition-all hover:border-gray-600 text-sm sm:text-base`}
                aria-label={t('timeline.searchAria')}
                role="searchbox"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label 
                htmlFor="role-filter"
                className={`block text-xs sm:text-sm md:text-base font-semibold text-yellow-400 ${compactMode ? 'mb-2' : 'mb-2 sm:mb-3'}`}
              >
                🎼 {t('timeline.roleLabel')}
              </label>
              <select
                id="role-filter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`w-full px-4 sm:px-5 ${compactMode ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'} bg-black/70 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 transition-all cursor-pointer hover:border-gray-600 text-sm sm:text-base`}
                aria-label={t('timeline.roleAria')}
              >
                <option value="all">{t('timeline.allRoles')}</option>
                {roles.map(role => (
                  <option key={role} value={role}>{t(`roles.${role}`, { defaultValue: role })}</option>
                ))}
              </select>
            </div>

            {/* Decade Filter */}
            <div>
              <label 
                htmlFor="decade-filter"
                className={`block text-xs sm:text-sm md:text-base font-semibold text-yellow-400 ${compactMode ? 'mb-2' : 'mb-2 sm:mb-3'}`}
              >
                📅 {t('timeline.decadeLabel')}
              </label>
              <select
                id="decade-filter"
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className={`w-full px-4 sm:px-5 ${compactMode ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'} bg-black/70 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 transition-all cursor-pointer hover:border-gray-600 text-sm sm:text-base`}
                aria-label={t('timeline.decadeAria')}
              >
                <option value="all">{t('timeline.allDecades')}</option>
                {decades.map(decade => (
                  <option key={decade} value={decade}>
                    {t('timeline.decadeOption', { decade })}
                  </option>
                ))}
              </select>
            </div>

            {/* Results and Clear Button */}
            <div className="flex items-center md:col-span-2 lg:col-span-1">
              {(searchTerm || selectedRole !== 'all' || selectedDecade !== 'all') ? (
                <motion.button
                  onClick={resetFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cta-button w-full ${compactMode ? 'px-4 py-2.5' : 'px-6 py-4'} flex items-center justify-center gap-2 text-xs sm:text-sm`}
                >
                  <span>✕</span> {t('timeline.clearFilters')}
                </motion.button>
              ) : (
                <div className="w-full flex items-center justify-center h-full opacity-70">
                  <span className="text-gray-200 text-xs sm:text-sm text-center">{t('timeline.noFilters')}</span>
                </div>
              )}
            </div>
                </div>

                {/* Results Summary */}
                <div className={`bg-black/60 rounded-xl ${compactMode ? 'p-4 sm:p-5' : 'p-6 sm:p-7 md:p-8'} border-2 border-gray-800`}>
                  <div className="text-sm sm:text-base md:text-lg text-gray-300 text-center">
                    {t('timeline.showing')} <motion.span 
                      key={filteredData.length}
                      initial={{ scale: 1.2, color: '#FFD700' }}
                      animate={{ scale: 1, color: '#D4AF37' }}
                      transition={{ duration: 0.3 }}
                      className="text-yellow-500 font-bold text-xl sm:text-2xl md:text-3xl font-serif mx-1 sm:mx-2"
                    >
                      {filteredData.length}
                    </motion.span> {t('timeline.of')} <span className="text-white font-semibold text-lg sm:text-xl">{data.length}</span> {t('timeline.results')}
                  </div>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        {Object.keys(groupedData).length === 0 ? (
          <motion.div 
            className="text-center py-32 px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-8xl md:text-9xl mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >🎭</motion.div>
            <h3 className="text-4xl md:text-5xl font-serif text-gray-100 mb-5">{t('timeline.noResultsTitle')}</h3>
            <p className="text-gray-100 text-lg mb-10 max-w-lg mx-auto text-center">{t('timeline.noResultsText')}</p>
            <motion.button
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button px-10 py-5 text-sm sm:text-base"
            >
              {t('timeline.resetFilters')}
            </motion.button>
          </motion.div>
        ) : (
          Object.entries(groupedData)
            .sort(([a], [b]) => String(a).localeCompare(String(b)))
            .map(([decade, shows], index) => (
            <motion.section 
              key={decade} 
              className={`${compactMode ? 'mt-12 sm:mt-16 mb-10 sm:mb-14' : 'mt-20 sm:mt-28 md:mt-36 mb-16 sm:mb-20 md:mb-28'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-10 sm:mb-12 md:mb-16 border-b border-white/5 pb-4 sm:pb-5 md:pb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                {t('timeline.decadeHeading', { decade })}
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                {shows?.map((item, idx) => (
                  <ShowCard key={item?.id || `show-${decade}-${idx}`} item={item} />
                ))}
              </div>
            </motion.section>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;
