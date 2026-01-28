import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Wand2, Drama, CalendarDays, Music } from 'lucide-react';
import data from '../assets/data/cleaned_data.json';

const CountUpNumber = ({ value, duration = 1.2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? value : 0;
    const startValue = previousValue.current;
    previousValue.current = target;
    let start = null;
    let rafId = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const current = Math.round(startValue + (target - startValue) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const Stats = ({ onRoleSelect }) => {
  const { t } = useTranslation();
  
  // Helper function to translate role names
  const translateRole = (role) => {
    if (!role) return '';
    return t(`roles.${role}`, { defaultValue: role });
  };
  const stats = useMemo(() => {
    const uniqueConductors = new Set(data.map(item => item?.conductor_info?.name).filter(Boolean)).size;
    const uniqueShows = new Set(data.map(item => item?.show_info?.title).filter(Boolean)).size;
    const decades = new Set(data.map(item => item?.decade).filter(Boolean)).size;
    
    const roleBreakdown = data.reduce((acc, item) => {
      const role = item?.conductor_info?.role;
      if (role) {
        acc[role] = (acc[role] || 0) + 1;
      }
      return acc;
    }, {});

    const firstShow = data.reduce((earliest, item) => {
      if (!item?.show_info?.opening) return earliest;
      const opening = new Date(item.show_info.opening);
      return !earliest || opening < new Date(earliest?.show_info?.opening) ? item : earliest;
    }, null);

    return {
      totalRecords: data.length,
      uniqueConductors,
      uniqueShows,
      decades,
      roleBreakdown,
      firstShow
    };
  }, []);

  // Define role hierarchy and metadata
  const roleHierarchy = useMemo(() => {
    return {
      // Primary Leadership (highest authority)
      'Music Supervisor': { level: 'primary', icon: '🎯', description: 'Oversees overall musical vision and production' },
      'Music Director': { level: 'primary', icon: '🎯', description: 'Leads musical direction and orchestra' },
      'Music Director / Conductor': { level: 'primary', icon: '🎯', description: 'Combined role of musical direction and conducting' },
      
      // Secondary Leadership (operational authority)
      'Conductor': { level: 'secondary', icon: '🎼', description: 'Conducts performances and rehearsals' },
      'Associate Music Director': { level: 'secondary', icon: '🎼', description: 'Supports music director with operational responsibilities' },
      'Associate Music Director / Associate Conductor': { level: 'secondary', icon: '🎼', description: 'Combined associate role' },
      'Associate Conductor': { level: 'secondary', icon: '🎼', description: 'Assists with conducting duties' },
      
      // Supporting Roles (assistive functions)
      'Assistant Conductor': { level: 'supporting', icon: '🎵', description: 'Provides support during rehearsals and performances' },
      'Alternate Conductor': { level: 'supporting', icon: '🎵', description: 'Serves as backup conductor' },
      'Substitute Conductor': { level: 'supporting', icon: '🎵', description: 'Temporary replacement conductor' }
    };
  }, []);

  // Organize roles by hierarchy
  const organizedRoles = useMemo(() => {
    const primary = [];
    const secondary = [];
    const supporting = [];
    
    Object.entries(stats.roleBreakdown || {}).forEach(([role, count]) => {
      const meta = roleHierarchy[role] || { level: 'supporting', icon: '🎵', description: 'Leadership role in musical production' };
      const entry = { role, count, ...meta };
      
      if (meta.level === 'primary') primary.push(entry);
      else if (meta.level === 'secondary') secondary.push(entry);
      else supporting.push(entry);
    });
    
    // Sort each group by count (descending)
    const sortByCount = (a, b) => b.count - a.count;
    primary.sort(sortByCount);
    secondary.sort(sortByCount);
    supporting.sort(sortByCount);
    
    return { primary, secondary, supporting };
  }, [stats.roleBreakdown, roleHierarchy]);

  const roleMax = useMemo(() => {
    const values = Object.values(stats.roleBreakdown || {});
    return values.length ? Math.max(...values) : 1;
  }, [stats.roleBreakdown]);

  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const leadershipInsights = useMemo(() => {
    const supportRoles = new Set(['Assistant Conductor', 'Associate Music Director']);
    const leadRoles = new Set(['Music Supervisor', 'Music Director']);
    const byDecade = {};

    data.forEach(item => {
      const decade = item?.decade;
      const role = item?.conductor_info?.role;
      if (!decade || !role) return;

      let group = null;
      if (supportRoles.has(role)) group = 'support';
      if (leadRoles.has(role)) group = 'lead';
      if (!group) return;

      if (!byDecade[decade]) {
        byDecade[decade] = { lead: 0, support: 0 };
      }
      byDecade[decade][group] += 1;
    });

    return Object.entries(byDecade)
      .map(([decade, counts]) => {
        const total = counts.lead + counts.support;
        const leadPct = total ? Math.round((counts.lead / total) * 100) : 0;
        const supportPct = total ? Math.round((counts.support / total) * 100) : 0;
        return {
          decade: String(decade),
          leadPct,
          supportPct,
          lead: counts.lead,
          support: counts.support,
          total
        };
      })
      .sort((a, b) => Number(a.decade) - Number(b.decade));
  }, []);

  return (
    <motion.section 
      ref={sectionRef}
      className="px-6 sm:px-8 py-8 sm:py-20 md:py-24 md:px-12 lg:px-20 xl:px-24 bg-gradient-to-b from-black via-gray-900 to-black border-y border-yellow-900/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-labelledby="stats-heading"
    >
      <div className="max-w-[1920px] mx-auto">
        <motion.h2 
          id="stats-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-yellow-500 font-bold mb-10 sm:mb-14 md:mb-16 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center" aria-hidden="true">𝄞</span>
          {t('stats.title')}
        </motion.h2>
        
        {/* Main Stats - By The Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-10 sm:mb-14 md:mb-16">
          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-broadway-gold/20 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] hover:border-broadway-gold/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            role="article"
            aria-label={`${stats.uniqueConductors} ${t('stats.womenPlusConductors')}`}
          >
            <div className="flex flex-col items-center">
              <Wand2 className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-500/90 mb-4" strokeWidth={1.5} aria-hidden />
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-500 font-serif drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] mb-3">
                <CountUpNumber value={isInView ? stats.uniqueConductors : 0} />
              </div>
              <div className="text-[14px] text-broadway-gold/80 font-medium uppercase tracking-[0.25em]">
                {t('stats.womenPlusConductors')}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-broadway-gold/20 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] hover:border-broadway-gold/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <Drama className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-500/90 mb-4" strokeWidth={1.5} aria-hidden />
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-500 font-serif drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] mb-3">
                <CountUpNumber value={isInView ? stats.uniqueShows : 0} />
              </div>
              <div className="text-[14px] text-broadway-gold/80 font-medium uppercase tracking-[0.25em]">
                {t('stats.broadwayShows')}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-broadway-gold/20 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] hover:border-broadway-gold/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col items-center">
              <CalendarDays className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-500/90 mb-4" strokeWidth={1.5} aria-hidden />
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-500 font-serif drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] mb-3">
                <CountUpNumber value={isInView ? stats.decades : 0} />
              </div>
              <div className="text-[14px] text-broadway-gold/80 font-medium uppercase tracking-[0.25em]">
                {t('stats.decades')}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md border border-broadway-gold/20 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] hover:border-broadway-gold/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <Music className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-500/90 mb-4" strokeWidth={1.5} aria-hidden />
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-500 font-serif drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] mb-3">
                <CountUpNumber value={isInView ? stats.totalRecords : 0} />
              </div>
              <div className="text-[14px] text-broadway-gold/80 font-medium uppercase tracking-[0.25em]">
                {t('stats.totalProductions')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership Roles - Redesigned with Hierarchy */}
        <motion.div 
          className="bg-black/60 border border-gray-700/60 rounded-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-8 sm:mb-10">
            <h3 className="text-xl md:text-2xl font-serif text-yellow-500 font-bold mb-2">
              {t('stats.leadershipRoles')}
            </h3>
            <p className="text-gray-100 text-xs sm:text-sm text-center">
              {t('stats.hierarchyDescription')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Primary Leadership */}
            {organizedRoles.primary.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/50">
                  <span className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">{t('stats.primaryLeadership')}</span>
                  <span className="text-gray-200 text-xs">({organizedRoles.primary.reduce((sum, r) => sum + r.count, 0)} {t('stats.total')})</span>
                </div>
                <div className="space-y-3">
                  {organizedRoles.primary.map(({ role, count, icon, description }, index) => {
                    const isHovered = hoveredRole === role;
                    const isSelected = selectedRole === role;
                    const widthPercent = (count / roleMax) * 100;
                    const opacity = hoveredRole && hoveredRole !== role ? 0.3 : 1;
                    const handleClick = () => {
                      const nextRole = selectedRole === role ? null : role;
                      setSelectedRole(nextRole);
                      if (onRoleSelect) {
                        onRoleSelect(nextRole);
                      }
                    };
                    
                    return (
                      <motion.div
                        key={role}
                        className={`relative group cursor-pointer rounded px-2 py-1.5 transition-all ${
                          isSelected ? 'bg-yellow-500/10 border border-yellow-500/30' : ''
                        }`}
                        onMouseEnter={() => setHoveredRole(role)}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={handleClick}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        style={{ opacity }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 min-w-[140px] sm:min-w-[180px]">
                            <span className="text-base sm:text-lg">{icon}</span>
                            <span className="text-xs sm:text-sm font-semibold text-gray-100 leading-tight">
                              {translateRole(role)}
                            </span>
                          </div>
                          <div className="flex-1 relative">
                            <div className="h-6 sm:h-7 rounded-sm bg-gray-900/60 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-end pr-2 sm:pr-3"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${widthPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                              >
                                <span className="text-[10px] sm:text-xs font-bold text-black/90">
                                  {count}
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {(isHovered || isSelected) && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-0 right-0 top-full mt-2 z-50 bg-gray-900/95 border border-gray-700/70 rounded px-3 py-2 text-xs text-gray-300 max-w-xs shadow-xl"
                            >
                              <div className="font-semibold text-yellow-400 mb-1">{translateRole(role)}</div>
                              <div className="text-gray-100">{description}</div>
                              <div className="mt-2 pt-2 border-t border-gray-700/50 text-yellow-300">
                                {count} {count === 1 ? t('stats.production') : t('stats.productions')}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Secondary Leadership */}
            {organizedRoles.secondary.length > 0 && (
              <div className="pt-4 border-t border-gray-800/30">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/30">
                  <span className="text-yellow-400/80 text-sm font-semibold uppercase tracking-wider">{t('stats.secondaryLeadership')}</span>
                  <span className="text-gray-200 text-xs">({organizedRoles.secondary.reduce((sum, r) => sum + r.count, 0)} {t('stats.total')})</span>
                </div>
                <div className="space-y-2.5">
                  {organizedRoles.secondary.map(({ role, count, icon, description }, index) => {
                    const isHovered = hoveredRole === role;
                    const isSelected = selectedRole === role;
                    const widthPercent = (count / roleMax) * 100;
                    const opacity = hoveredRole && hoveredRole !== role ? 0.3 : 1;
                    const handleClick = () => {
                      const nextRole = selectedRole === role ? null : role;
                      setSelectedRole(nextRole);
                      if (onRoleSelect) {
                        onRoleSelect(nextRole);
                      }
                    };
                    
                    return (
                      <motion.div
                        key={role}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHoveredRole(role)}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={handleClick}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        style={{ opacity }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 min-w-[140px] sm:min-w-[180px]">
                            <span className="text-sm sm:text-base">{icon}</span>
                            <span className="text-[11px] sm:text-xs font-medium text-gray-100 leading-tight">
                              {translateRole(role)}
                            </span>
                          </div>
                          <div className="flex-1 relative">
                            <div className="h-5 sm:h-6 rounded-sm bg-gray-900/60 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-yellow-500/80 to-yellow-400/80 flex items-center justify-end pr-2 sm:pr-3"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${widthPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.9 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                              >
                                <span className="text-[10px] sm:text-xs font-semibold text-black/90">
                                  {count}
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {(isHovered || isSelected) && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-0 right-0 top-full mt-2 z-50 bg-gray-900/95 border border-gray-700/70 rounded px-3 py-2 text-xs text-gray-300 max-w-xs shadow-xl"
                            >
                              <div className="font-semibold text-yellow-400 mb-1">{translateRole(role)}</div>
                              <div className="text-gray-100">{description}</div>
                              <div className="mt-2 pt-2 border-t border-gray-700/50 text-yellow-300">
                                {count} {count === 1 ? t('stats.production') : t('stats.productions')}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Supporting Roles */}
            {organizedRoles.supporting.length > 0 && (
              <div className="pt-4 border-t border-gray-800/20">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/20">
                  <span className="text-gray-100 text-sm font-medium uppercase tracking-wider">{t('stats.supportingRoles')}</span>
                  <span className="text-gray-200 text-xs">({organizedRoles.supporting.reduce((sum, r) => sum + r.count, 0)} {t('stats.total')})</span>
                </div>
                <div className="space-y-2">
                  {organizedRoles.supporting.map(({ role, count, icon, description }, index) => {
                    const isHovered = hoveredRole === role;
                    const isSelected = selectedRole === role;
                    const widthPercent = (count / roleMax) * 100;
                    const opacity = hoveredRole && hoveredRole !== role ? 0.3 : 1;
                    const handleClick = () => {
                      const nextRole = selectedRole === role ? null : role;
                      setSelectedRole(nextRole);
                      if (onRoleSelect) {
                        onRoleSelect(nextRole);
                      }
                    };
                    
                    return (
                      <motion.div
                        key={role}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHoveredRole(role)}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={handleClick}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.0 + index * 0.05 }}
                        style={{ opacity }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 min-w-[140px] sm:min-w-[180px]">
                            <span className="text-xs sm:text-sm">{icon}</span>
                            <span className="text-[10px] sm:text-[11px] font-normal text-gray-200 leading-tight">
                              {role}
                            </span>
                          </div>
                          <div className="flex-1 relative">
                            <div className="h-4 sm:h-5 rounded-sm bg-gray-900/60 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-yellow-500/60 to-yellow-400/60 flex items-center justify-end pr-2"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${widthPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.1 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                              >
                                <span className="text-[9px] sm:text-[10px] font-medium text-black/90">
                                  {count}
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {(isHovered || isSelected) && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-0 right-0 top-full mt-2 z-50 bg-gray-900/95 border border-gray-700/70 rounded px-3 py-2 text-xs text-gray-300 max-w-xs shadow-xl"
                            >
                              <div className="font-semibold text-yellow-400 mb-1">{translateRole(role)}</div>
                              <div className="text-gray-100">{description}</div>
                              <div className="mt-2 pt-2 border-t border-gray-700/50 text-yellow-300">
                                {count} {count === 1 ? t('stats.production') : t('stats.productions')}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Selected Role Filter Indicator */}
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 pt-6 border-t border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-100">
                    <span className="text-yellow-400 font-semibold">{selectedRole}</span> selected as filter
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-xs text-gray-200 hover:text-yellow-400 transition-colors"
                  >
                    Clear filter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Stats;
