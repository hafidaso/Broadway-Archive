import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Database, 
  Users, 
  Code, 
  Palette, 
  MousePointerClick,
  Filter,
  Search,
  Download,
  BarChart3,
  Calendar,
  Globe,
  Zap,
  Sparkles,
  Layers,
  Flag,
  Gauge,
  TrendingUp,
  ExternalLink,
  Award,
  Shield
} from 'lucide-react';

const Documentation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleExploreClick = () => {
    navigate('/#explore');
  };

  return (
    <motion.section 
      id="documentation"
      className="bg-black min-h-screen py-8 sm:py-10 md:py-12 lg:py-14"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-labelledby="documentation-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 mb-6">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-yellow-500 mb-4">
            {t('documentation.title')}
          </h1>
          <p className="text-gray-100 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-center">
            {t('documentation.subtitle')}
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          className="mb-8 sm:mb-10 bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-serif text-yellow-500 mb-4 sm:mb-6">
            {t('documentation.quickNav')}
          </h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {['overview', 'dataSource', 'howToUse', 'methodology'].map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(`doc-${section}`)}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm font-medium uppercase tracking-wider hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
              >
                {t(`documentation.sections.${section}`)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          id="doc-overview"
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.sections.overview')}
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.overview.paragraph1')}
            </p>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.overview.paragraph2')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
              <div className="text-center p-4 bg-black/40 rounded-lg border border-yellow-500/10">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">385</div>
                <div className="text-xs sm:text-sm text-gray-100 uppercase tracking-wider text-center">{t('documentation.overview.stats.productions')}</div>
              </div>
              <div className="text-center p-4 bg-black/40 rounded-lg border border-yellow-500/10">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">1915</div>
                <div className="text-xs sm:text-sm text-gray-100 uppercase tracking-wider text-center">{t('documentation.overview.stats.startYear')}</div>
              </div>
              <div className="text-center p-4 bg-black/40 rounded-lg border border-yellow-500/10">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">103</div>
                <div className="text-xs sm:text-sm text-gray-100 uppercase tracking-wider text-center">{t('documentation.overview.stats.conductors')}</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Source & Credits */}
        <motion.section
          id="doc-dataSource"
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.sections.dataSource')}
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.dataSource.intro')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/40 flex items-center justify-center">
                    <span className="text-lg font-serif text-yellow-500/80 font-semibold">SG</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">{t('documentation.dataSource.curator')}</p>
                    <p className="text-lg text-yellow-400 font-semibold">Sariva Goetz</p>
                  </div>
                </div>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.dataSource.curatorDesc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/40 flex items-center justify-center">
                    <span className="text-lg font-serif text-yellow-500/80 font-semibold">SW</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">{t('documentation.dataSource.dataEngineer')}</p>
                    <p className="text-lg text-yellow-400 font-semibold">Steve Wexler</p>
                  </div>
                </div>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.dataSource.dataEngineerDesc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/40 flex items-center justify-center">
                    <span className="text-lg font-serif text-yellow-500/80 font-semibold">HB</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">{t('documentation.dataSource.leadDataScientist')}</p>
                    <p className="text-lg text-yellow-400 font-semibold">Hafida Belayd</p>
                  </div>
                </div>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.dataSource.leadDataScientistDesc')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-yellow-500/10">
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
                <span className="text-yellow-500 font-semibold">{t('documentation.dataSource.historicNote')}</span> {t('documentation.dataSource.historicDesc')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* How to Use */}
        <motion.section
          id="doc-howToUse"
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <MousePointerClick className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.sections.howToUse')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Chart View */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h3 className="text-xl sm:text-2xl font-serif text-yellow-400">
                  {t('documentation.howToUse.chart.title')}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.chart.tip1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.chart.tip2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.chart.tip3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.chart.tip4')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.chart.tip5')}</span>
                </li>
              </ul>
            </div>

            {/* Highlights Carousel */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h3 className="text-xl sm:text-2xl font-serif text-yellow-400">
                  {t('documentation.howToUse.highlights.title')}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.highlights.tip1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.highlights.tip2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.highlights.tip3')}</span>
                </li>
              </ul>
            </div>

            {/* Interactive Features */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <MousePointerClick className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h3 className="text-xl sm:text-2xl font-serif text-yellow-400">
                  {t('documentation.howToUse.interactions.title')}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.interactions.tip1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.interactions.tip2')}</span>
                </li>
              </ul>
            </div>

            {/* Timeline View */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h3 className="text-xl sm:text-2xl font-serif text-yellow-400">
                  {t('documentation.howToUse.timeline.title')}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.timeline.tip1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.timeline.tip2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.timeline.tip3')}</span>
                </li>
              </ul>
            </div>

            {/* Table View */}
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h3 className="text-xl sm:text-2xl font-serif text-yellow-400">
                  {t('documentation.howToUse.table.title')}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.table.tip1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.table.tip2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{t('documentation.howToUse.table.tip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Methodology */}
        <motion.section
          id="doc-methodology"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Code className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.sections.methodology')}
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {t('documentation.methodology.intro')}
            </p>
            
            <div className="bg-yellow-500/5 border-l-4 border-yellow-500/40 rounded-r-lg p-4 sm:p-5">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {t('documentation.methodology.dataIntegrity')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mb-4">
                  <Code className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t('documentation.methodology.tech.react')}</h4>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.methodology.tech.reactDesc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t('documentation.methodology.tech.vite')}</h4>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.methodology.tech.viteDesc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t('documentation.methodology.tech.framer')}</h4>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.methodology.tech.framerDesc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t('documentation.methodology.tech.d3')}</h4>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.methodology.tech.d3Desc')}
                </p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mb-4">
                  <Palette className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">{t('documentation.methodology.tech.tailwind')}</h4>
                <p className="text-sm text-gray-100 leading-relaxed text-center">
                  {t('documentation.methodology.tech.tailwindDesc')}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-yellow-500/10">
              <h4 className="text-xl font-serif text-yellow-400 mb-4">{t('documentation.methodology.dataProcessing.title')}</h4>
              <ol className="space-y-3 text-gray-300 text-sm sm:text-base list-decimal list-inside">
                <li>{t('documentation.methodology.dataProcessing.step1')}</li>
                <li>{t('documentation.methodology.dataProcessing.step2')}</li>
                <li>{t('documentation.methodology.dataProcessing.step3')}</li>
                <li>{t('documentation.methodology.dataProcessing.step4')}</li>
              </ol>
            </div>

            {/* Data Enrichment & Analytical Encoding */}
            <div className="mt-8 pt-8 border-t border-yellow-500/10">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
                <h4 className="text-xl font-serif text-yellow-400">{t('documentation.methodology.dataEnrichment.title')}</h4>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                {t('documentation.methodology.dataEnrichment.intro')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                    </div>
                    <h5 className="text-lg font-semibold text-yellow-400">{t('documentation.methodology.dataEnrichment.chronologicalBinning.title')}</h5>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed text-center">
                    {t('documentation.methodology.dataEnrichment.chronologicalBinning.desc')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                      <Flag className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                    </div>
                    <h5 className="text-lg font-semibold text-yellow-400">{t('documentation.methodology.dataEnrichment.pioneerFlagging.title')}</h5>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed text-center">
                    {t('documentation.methodology.dataEnrichment.pioneerFlagging.desc')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                      <Gauge className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                    </div>
                    <h5 className="text-lg font-semibold text-yellow-400">{t('documentation.methodology.dataEnrichment.roleNormalization.title')}</h5>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed text-center">
                    {t('documentation.methodology.dataEnrichment.roleNormalization.desc')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                    </div>
                    <h5 className="text-lg font-semibold text-yellow-400">{t('documentation.methodology.dataEnrichment.metricSynthesis.title')}</h5>
                  </div>
                  <p className="text-sm text-gray-100 leading-relaxed text-center">
                    {t('documentation.methodology.dataEnrichment.metricSynthesis.desc')}
                  </p>
                </div>
              </div>

            <div className="mt-6 pt-6 border-t border-yellow-500/10">
              <p className="text-gray-100 text-xs sm:text-sm italic leading-relaxed text-center">
                  {t('documentation.methodology.dataEnrichment.note')}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Orchestral Harmony Encoding */}
        <motion.section
          id="doc-orchestral-harmony"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.methodology.orchestralHarmony.title')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-5">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.methodology.orchestralHarmony.paragraph1')}
            </p>
            <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
              {t('documentation.methodology.orchestralHarmony.paragraph2')}
            </p>
            <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
              {t('documentation.methodology.orchestralHarmony.paragraph3')}
            </p>
          </div>
        </motion.section>

        {/* Accessibility & Inclusive Storytelling */}
        <motion.section
          id="doc-accessibility"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.methodology.accessibility.title')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.methodology.accessibility.intro')}
            </p>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-yellow-400">
                {t('documentation.methodology.accessibility.harmonizingTitle')}
              </h3>
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
                {t('documentation.methodology.accessibility.harmonizingIntro')}
              </p>

              <div className="space-y-4">
                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                    {t('documentation.methodology.accessibility.gatewayTitle')}
                  </h4>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {t('documentation.methodology.accessibility.gatewayBody')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                    {t('documentation.methodology.accessibility.semanticTitle')}
                  </h4>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {t('documentation.methodology.accessibility.semanticBody')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                    {t('documentation.methodology.accessibility.visualTitle')}
                  </h4>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {t('documentation.methodology.accessibility.visualBody')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                    {t('documentation.methodology.accessibility.svgTitle')}
                  </h4>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {t('documentation.methodology.accessibility.svgBody')}
                  </p>
                </div>

                <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                    {t('documentation.methodology.accessibility.tableTitle')}
                  </h4>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {t('documentation.methodology.accessibility.tableBody')}
                  </p>
                </div>
                </div>
              </div>

            <div className="mt-6 pt-6 border-t border-yellow-500/10">
              <h3 className="text-2xl font-serif text-yellow-400 mb-3">
                {t('documentation.methodology.accessibility.livingTitle')}
              </h3>
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
                {t('documentation.methodology.accessibility.livingBody1')}
              </p>
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed mt-3">
                {t('documentation.methodology.accessibility.livingBody2')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Backstage Technicals: SEO & Infrastructure */}
        <motion.section
          id="doc-backstage-technicals"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Code className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.methodology.backstageTechnicals.title')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.methodology.backstageTechnicals.intro')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {t('documentation.methodology.backstageTechnicals.jsonldTitle')}
                </h3>
                <p className="text-sm text-gray-100 leading-relaxed">
                  {t('documentation.methodology.backstageTechnicals.jsonldBody')}
                </p>
              </div>

              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {t('documentation.methodology.backstageTechnicals.metadataTitle')}
                </h3>
                <p className="text-sm text-gray-100 leading-relaxed">
                  {t('documentation.methodology.backstageTechnicals.metadataBody')}
                </p>
              </div>

              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {t('documentation.methodology.backstageTechnicals.socialTitle')}
                </h3>
                <p className="text-sm text-gray-100 leading-relaxed">
                  {t('documentation.methodology.backstageTechnicals.socialBody')}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Project Credits & Data Attribution */}
        <motion.section
          id="doc-credits"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.credits.title')}
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4">
            {/* Team Credits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-5">
                <p className="text-xs text-gray-100 uppercase tracking-wider mb-2">{t('documentation.credits.visualizationStrategy')}</p>
                <p className="text-base text-yellow-400 font-semibold">{t('documentation.credits.visualizationStrategyName')}</p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-5">
                <p className="text-xs text-gray-100 uppercase tracking-wider mb-2">{t('documentation.credits.dataResearch')}</p>
                <p className="text-base text-yellow-400 font-semibold">{t('documentation.credits.dataResearchName')}</p>
              </div>
              
              <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-5">
                <p className="text-xs text-gray-100 uppercase tracking-wider mb-2">{t('documentation.credits.dataEngineering')}</p>
                <p className="text-base text-yellow-400 font-semibold">{t('documentation.credits.dataEngineeringName')}</p>
              </div>
            </div>

            {/* Original Dataset Link */}
            <div className="bg-yellow-500/5 border-l-4 border-yellow-500/40 rounded-r-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                <p className="text-sm text-gray-100 uppercase tracking-wider">{t('documentation.credits.originalDataset')}</p>
              </div>
              <a
                href="https://docs.google.com/spreadsheets/d/1yTUUKoOhpSiizZNHDZYoPMZL0Jdk7PSw/edit?gid=87507842#gid=87507842"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors text-base sm:text-lg font-medium flex items-center gap-2 group"
              >
                {t('documentation.credits.originalDatasetLink')}
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </a>
              <p className="text-xs text-gray-200 mt-2">
                This link provides research credibility and allows others to verify the results.
              </p>
            </div>

            {/* License */}
            <div className="bg-black/40 border border-yellow-500/10 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                <p className="text-sm text-gray-100 uppercase tracking-wider">{t('documentation.credits.license')}</p>
              </div>
              <p className="text-sm text-gray-100 leading-relaxed">
                {t('documentation.credits.licenseText')}
              </p>
            </div>

            {/* Data Cleaning Methodology */}
            <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-5">
              <h4 className="text-lg font-serif text-yellow-400 mb-3">{t('documentation.credits.dataCleaning')}</h4>
              <p className="text-sm text-gray-100 leading-relaxed">
                {t('documentation.credits.dataCleaningDesc')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Design Philosophy: Broadway Gold & The Data Baton */}
        <motion.section
          id="doc-design-philosophy"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-yellow-500">
              {t('documentation.methodology.designPhilosophy.title')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-yellow-500/20 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {t('documentation.methodology.designPhilosophy.paragraph1')}
            </p>
            <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
              {t('documentation.methodology.designPhilosophy.paragraph2')}
            </p>
            <p className="text-gray-100 text-sm sm:text-base leading-relaxed">
              {t('documentation.methodology.designPhilosophy.paragraph3')}
            </p>
          </div>
        </motion.section>

        {/* Back to Top / Explore */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handleExploreClick}
            className="cta-button px-8 py-4 text-sm sm:text-base uppercase tracking-wider"
          >
            {t('documentation.exploreButton')}
          </button>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Documentation;
