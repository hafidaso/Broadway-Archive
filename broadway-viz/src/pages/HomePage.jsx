import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import Stats from '../components/Stats';
import About from '../components/About';
import MusicChart from '../components/MusicChart';
import Highlights from '../components/Highlights';
import DataTable from '../components/DataTable';
import OrchestralChart from '../components/OrchestralChart';
import GlobalParallaxBg from '../components/GlobalParallaxBg';
import VinylLoader from '../components/VinylLoader';
import data from '../assets/data/cleaned_data.json';

function HomePage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeView, setActiveView] = useState('chart');
  const [selectedConductor, setSelectedConductor] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const storyTimelineRef = useRef(null);

  // Dynamic document title, description, and structured data for SEO
  useEffect(() => {
    const lang = i18n.language || 'en';
    let title = 'Maestras of Broadway | Interactive Data Archive (1915–2025)';
    let description =
      'An interactive data archive celebrating Women+ conductors on Broadway from 1915 to 2025, with timelines, charts, and searchable records.';

    if (lang === 'fr') {
      title = 'Maestras de Broadway | Archives interactives (1915–2025)';
      description =
        'Archive de données interactive célébrant les cheffes d’orchestre Women+ à Broadway de 1915 à 2025, avec chronologies, graphiques et table de données.';
    } else if (lang === 'ar') {
      title = 'مايستروات برودواي | أرشيف بيانات تفاعلي (1915–2025)';
      description =
        'أرشيف بيانات تفاعلي يحتفي بقائدات الأوركسترا Women+ على برودواي من 1915 إلى 2025، عبر جداول زمنية ورسوم بيانية وجدول بيانات قابل للبحث.';
    }

    if (typeof document !== 'undefined') {
      document.title = title;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;

      // JSON-LD structured data describing the archive as a Dataset
      const ldJson = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'Maestras of Broadway Archive (1915–2025)',
        description:
          'An interactive historical archive of Women+ conductors on Broadway, covering 385 productions from 1915 to 2025 with rich timelines, charts, and tabular data.',
        url: 'https://broadway-archive.vercel.app/',
        inLanguage: ['en', 'fr', 'ar'],
        temporalCoverage: '1915-01-01/2025-12-31',
        numberOfRecords: 385,
        creator: {
          '@type': 'Person',
          name: 'Hafida Belayd'
        },
        isBasedOn: {
          '@type': 'Dataset',
          name: 'Women+ Conductors on Broadway dataset',
          creator: {
            '@type': 'Person',
            name: 'Sariva Goetz'
          }
        }
      };

      let script = document.getElementById('structured-data-dataset');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'structured-data-dataset';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(ldJson);
    }
  }, [i18n.language]);

  // Handle hash navigation when coming from documentation page
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the #
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.hash]);

  // Scroll progress indicator (story + timeline range)
  const { scrollYProgress } = useScroll({
    target: storyTimelineRef,
    offset: ['start start', 'end end']
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadCsv = () => {
    const header = [
      t('labels.conductor'),
      t('labels.role'),
      t('labels.production'),
      t('labels.openingDate'),
      t('labels.decade'),
      t('labels.photo')
    ];
    const rows = data.map(item => ([
      item?.conductor_info?.name || '',
      item?.conductor_info?.role || '',
      item?.show_info?.title || '',
      item?.show_info?.opening || '',
      item?.decade ?? '',
      item?.conductor_info?.photo || ''
    ]));
    const csv = [header, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', t('app.csvFilename'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle data loading - show loader until data is ready
  useEffect(() => {
    // Check if data is loaded (385 records)
    if (data && data.length === 385) {
      // Small delay to ensure all processing is complete
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Mark pioneers: earliest opening date per role
  useMemo(() => {
    const roleToEarliest = new Map();

    data.forEach(item => {
      const role = item?.conductor_info?.role;
      const opening = item?.show_info?.opening;
      if (!role || !opening) return;
      const time = new Date(opening).getTime();
      if (Number.isNaN(time)) return;

      const current = roleToEarliest.get(role);
      if (!current || time < current.time) {
        roleToEarliest.set(role, { time, item });
      }
    });

    data.forEach(item => {
      item.isPioneer = false;
    });

    roleToEarliest.forEach(({ item }) => {
      item.isPioneer = true;
    });
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalShows = data.length;
    const uniqueConductors = [...new Set(data.map(d => d?.conductor_info?.name).filter(Boolean))].length;
    const decades = [...new Set(data.map(d => d?.decade).filter(Boolean))].length;
    return { totalShows, uniqueConductors, decades };
  }, []);

  const { milestone, marqueeTint } = useMemo(() => {
    const safeDate = (value) => {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const withRole = (role) => {
      return data
        .filter(item => item?.conductor_info?.role === role && safeDate(item?.show_info?.opening))
        .sort((a, b) => safeDate(a.show_info.opening) - safeDate(b.show_info.opening))[0];
    };

    const earliestOverall = data
      .filter(item => safeDate(item?.show_info?.opening))
      .sort((a, b) => safeDate(a.show_info.opening) - safeDate(b.show_info.opening))[0];

    const longestRunning = data
      .filter(item => Number.isFinite(Number(item?.show_info?.performances)))
      .sort((a, b) => Number(b?.show_info?.performances) - Number(a?.show_info?.performances))[0];

    const milestones = [
      earliestOverall && {
        id: 'first-recorded',
        title: t('app.milestoneFirstRecorded'),
        show: earliestOverall?.show_info?.title,
        role: earliestOverall?.conductor_info?.role,
        conductor: earliestOverall?.conductor_info?.name,
        date: earliestOverall?.show_info?.opening
      },
      withRole('Assistant Conductor') && {
        id: 'first-assistant',
        title: t('app.milestoneFirstRole', { role: 'Assistant Conductor' }),
        show: withRole('Assistant Conductor')?.show_info?.title,
        role: withRole('Assistant Conductor')?.conductor_info?.role,
        conductor: withRole('Assistant Conductor')?.conductor_info?.name,
        date: withRole('Assistant Conductor')?.show_info?.opening
      },
      withRole('Associate Music Director') && {
        id: 'first-associate',
        title: t('app.milestoneFirstRole', { role: 'Associate Music Director' }),
        show: withRole('Associate Music Director')?.show_info?.title,
        role: withRole('Associate Music Director')?.conductor_info?.role,
        conductor: withRole('Associate Music Director')?.conductor_info?.name,
        date: withRole('Associate Music Director')?.show_info?.opening
      },
      withRole('Conductor') && {
        id: 'first-conductor',
        title: t('app.milestoneFirstRole', { role: 'Conductor' }),
        show: withRole('Conductor')?.show_info?.title,
        role: withRole('Conductor')?.conductor_info?.role,
        conductor: withRole('Conductor')?.conductor_info?.name,
        date: withRole('Conductor')?.show_info?.opening
      },
      withRole('Music Director') && {
        id: 'first-director',
        title: t('app.milestoneFirstRole', { role: 'Music Director' }),
        show: withRole('Music Director')?.show_info?.title,
        role: withRole('Music Director')?.conductor_info?.role,
        conductor: withRole('Music Director')?.conductor_info?.name,
        date: withRole('Music Director')?.show_info?.opening
      },
      withRole('Music Supervisor') && {
        id: 'first-supervisor',
        title: t('app.milestoneFirstRole', { role: 'Music Supervisor' }),
        show: withRole('Music Supervisor')?.show_info?.title,
        role: withRole('Music Supervisor')?.conductor_info?.role,
        conductor: withRole('Music Supervisor')?.conductor_info?.name,
        date: withRole('Music Supervisor')?.show_info?.opening
      },
      longestRunning && {
        id: 'longest-running',
        title: t('app.milestoneLongestRunning'),
        show: longestRunning?.show_info?.title,
        role: longestRunning?.conductor_info?.role,
        conductor: longestRunning?.conductor_info?.name,
        date: longestRunning?.show_info?.opening,
        performances: longestRunning?.show_info?.performances
      }
    ].filter(Boolean);

    const tints = ['#D4AF37', '#B8903B', '#8F6B2A', '#C69C3A'];
    const randomMilestone = milestones[Math.floor(Math.random() * milestones.length)];
    const randomTint = tints[Math.floor(Math.random() * tints.length)];

    return { milestone: randomMilestone, marqueeTint: randomTint };
  }, [t]);

  // Show loader while data is being processed
  if (isLoading) {
    return <VinylLoader />;
  }

  return (
    <div className="App bg-black min-h-screen relative">
      {/* Global mouse-follow parallax (desktop only); does not affect chart hit-testing */}
      <GlobalParallaxBg />
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-main sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:bg-yellow-500 focus:text-black focus:px-6 focus:py-3 focus:rounded-lg focus:font-bold focus:shadow-xl"
      >
        {t('app.skipToMain')}
      </a>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 origin-left z-[100] shadow-md shadow-yellow-500/40"
        style={{ scaleX, top: 'var(--marquee-height)' }}
        role="progressbar"
        aria-label={t('app.scrollProgress')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
      />

      {/* Historical Milestone Banner (Animated Scrolling Band) */}
      <div
        className="marquee-bar fixed top-0 left-0 right-0 z-[90] border-b border-black/10"
        style={{ backgroundColor: marqueeTint }}
      >
        <div className="ticker-band overflow-hidden">
          <div className="ticker-track">
            <div className="ticker-content text-[#282828]">
              <span className="ticker-text">
                {t('app.milestoneHeader')} <span className="font-bold">{milestone?.title}</span> — {t('app.milestoneShowLabel')} <span className="font-bold">{milestone?.show}</span> — {t('app.milestoneRoleLabel')} <span className="font-bold italic">{milestone?.role}</span> — {t('app.milestoneConductorLabel')} <span className="font-bold italic">{milestone?.conductor}</span> — {t('app.milestoneDateLabel')} <span className="font-bold">{milestone?.date}</span>{milestone?.performances ? ` — ${t('app.milestonePerformancesLabel')} ${milestone.performances}` : ''}
              </span>
              <span className="ticker-text">
                {t('app.milestoneHeader')} <span className="font-bold">{milestone?.title}</span> — {t('app.milestoneShowLabel')} <span className="font-bold">{milestone?.show}</span> — {t('app.milestoneRoleLabel')} <span className="font-bold italic">{milestone?.role}</span> — {t('app.milestoneConductorLabel')} <span className="font-bold italic">{milestone?.conductor}</span> — {t('app.milestoneDateLabel')} <span className="font-bold">{milestone?.date}</span>{milestone?.performances ? ` — ${t('app.milestonePerformancesLabel')} ${milestone.performances}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Navigation />

      <div ref={storyTimelineRef}>
        <Hero
          onTimeline={() => {
            setActiveView('timeline');
            setTimeout(() => {
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
          }}
          onChart={() => {
            setActiveView('chart');
            setTimeout(() => {
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
          }}
        />

        <main id="main-content" role="main" tabIndex={-1}>
        {/* About Section */}
        <section id="about">
          <About />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <Highlights 
            onConductorSelect={(conductorName) => {
              setSelectedConductor(conductorName);
              setActiveView('chart');
              setTimeout(() => {
                document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        </section>
        
        {/* Stats Section */}
        <section id="stats">
          <Stats />
        </section>
        
        {/* Explore Section */}
        <section id="explore" className="bg-black">
          <div className="max-w-[1600px] w-full lg:w-[94%] mx-auto px-6 sm:px-8 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10 sm:mb-12 text-center lg:text-left">
              <div className="mx-auto lg:mx-0">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-yellow-500 font-bold mb-3">
                  {t('app.exploreTitle')}
                </h2>
                <p className="text-gray-100 text-sm sm:text-base md:text-lg text-center">
                  {t('app.exploreSubtitle')}
                </p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                <button
                  onClick={() => setActiveView('chart')}
                  className={`button-glow px-6 py-3 text-[10px] sm:text-xs transition-all ${
                    activeView === 'chart'
                      ? 'cta-button'
                      : 'cta-button-outline'
                  }`}
                >
                  {t('app.viewChart')}
                </button>
                <button
                  onClick={() => setActiveView('orchestral')}
                  className={`button-glow px-6 py-3 text-[10px] sm:text-xs transition-all ${
                    activeView === 'orchestral'
                      ? 'cta-button'
                      : 'cta-button-outline'
                  }`}
                >
                  Orchestral Harmony
                </button>
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`button-glow px-6 py-3 text-[10px] sm:text-xs transition-all ${
                    activeView === 'timeline'
                      ? 'cta-button'
                      : 'cta-button-outline'
                  }`}
                >
                  {t('app.viewTimeline')}
                </button>
                <button
                  onClick={() => setActiveView('table')}
                  className={`button-glow px-6 py-3 text-[10px] sm:text-xs transition-all ${
                    activeView === 'table'
                      ? 'cta-button'
                      : 'cta-button-outline'
                  }`}
                >
                  {t('app.viewTable')}
                </button>
                <button
                  onClick={downloadCsv}
                  className="button-glow cta-button-outline px-6 py-3 text-[10px] sm:text-xs transition-all"
                >
                  {t('app.downloadCsv')}
                </button>
              </div>
            </div>

            <div>
              {activeView === 'chart' && (
                <MusicChart 
                  selectedConductor={selectedConductor}
                  setSelectedConductor={setSelectedConductor}
                />
              )}
              {activeView === 'orchestral' && (
                <div className="mt-4 sm:mt-6">
                  <OrchestralChart />
                </div>
              )}
              {activeView === 'timeline' && <Timeline />}
              {activeView === 'table' && <DataTable data={data} />}
            </div>
          </div>
        </section>
        </main>
      </div>

      <footer
        className="py-8 sm:py-20 md:py-24 text-center border-t border-yellow-500/20 bg-black relative overflow-hidden mt-20 sm:mt-24 md:mt-32"
        role="contentinfo"
        style={{
          backgroundImage: 'url("/background-music.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Subtle dark overlay to keep text readable while preserving image richness */}
        <div
          className="absolute inset-0 bg-black/65 sm:bg-black/60 md:bg-black/55 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-24">
          <div className="flex flex-col items-center gap-6 sm:gap-7">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-full border border-yellow-500/40 flex items-center justify-center shadow-[0_0_18px_rgba(212,175,55,0.25)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18V5l10-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">{t('footer.contestEntry')}</p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
              <p className="text-yellow-200 text-sm sm:text-base md:text-lg font-serif tracking-wide">
                One baton, a world of stories.
              </p>
              <p className="text-yellow-200/70 text-xs sm:text-sm md:text-base font-serif tracking-wide">
                Une baguette, un monde d&apos;histoires.
              </p>
              <p className="text-yellow-200/50 text-sm sm:text-base font-arabic">
                عصا واحدة، وعالم من الحكايات.
              </p>
            </div>

            <div className="text-gray-100 text-xs sm:text-sm md:text-base flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-6 sm:gap-8">
                <a
                  href="https://github.com/hafidaso/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-yellow-500/30 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <span className="text-[11px] font-semibold tracking-wide">GH</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/hafida-belayd/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-yellow-500/30 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <span className="text-[11px] font-semibold tracking-wide">in</span>
                </a>
                <a
                  href="mailto:hafidabelaidagnaoui@gmail.com"
                  className="w-10 h-10 rounded-full border border-yellow-500/30 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all"
                  aria-label="Email"
                  title="Email"
                >
                  <span className="text-[11px] font-semibold tracking-wide">@</span>
                </a>
              </div>
              <div className="flex flex-col items-center gap-3">
                <p>{t('footer.copyright')}</p>
                <p className="text-gray-100 text-xs sm:text-sm italic text-center">
                  {t('footer.licenseNote')}
                </p>
                <p className="text-gray-100 text-xs sm:text-sm text-center">
                  {t('footer.dataCredit')}
                </p>
                <a
                  href="/documentation"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm uppercase tracking-wider border-b border-yellow-500/30 hover:border-yellow-500/60"
                >
                  {t('footer.documentation')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20
        }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black p-4 rounded-full shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 cursor-pointer group"
        aria-label={t('app.scrollToTop')}
      >
        <img
          src="/icon nota.svg"
          alt=""
          aria-hidden="true"
          className="w-10 h-10 transform group-hover:-translate-y-1 transition-transform"
        />
      </motion.button>
    </div>
  );
}

export default HomePage;
