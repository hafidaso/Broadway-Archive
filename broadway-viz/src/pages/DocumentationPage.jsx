import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';
import Documentation from '../components/Documentation';
import GlobalParallaxBg from '../components/GlobalParallaxBg';
import '../App.css';

const DocumentationPage = () => {
  const { t, i18n } = useTranslation();

  // Dynamic document title & description for SEO on documentation page
  useEffect(() => {
    const lang = i18n.language || 'en';
    let title = 'Project Documentation | Methodology & Data Archive';
    let description =
      'Learn about the data sources, methodology, enrichment pipeline, and accessibility foundations behind the Maestras of Broadway interactive archive.';

    if (lang === 'fr') {
      title = 'Documentation du projet | Méthodologie & Archives de données';
      description =
        'Découvrez les sources de données, la méthodologie, le pipeline d’enrichissement et les choix d’accessibilité derrière l’archive interactive Maestras de Broadway.';
    } else if (lang === 'ar') {
      title = 'توثيق مشروع أرشيف المايسترو | المنهجية والبيانات';
      description =
        'تعرف على مصادر البيانات والمنهجية وخط أنابيب إثراء البيانات وأُسس الإتاحة في مشروع أرشيف المايسترو لقائدات الأوركسترا على برودواي.';
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
    }
  }, [i18n.language]);
  
  return (
    <div className="App bg-black min-h-screen relative">
      {/* Global mouse-follow parallax (desktop only) */}
      <GlobalParallaxBg />
      
      {/* Navigation Menu */}
      <Navigation />

      {/* Documentation Content */}
      <Documentation />

      {/* Footer */}
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
                  href="https://www.linkedin.com/in/hafida-belayd/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-yellow-500/30 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <span className="text-[11px] font-semibold tracking-wide">in</span>
                </a>
              </div>
              <p className="text-gray-100 text-xs sm:text-sm italic text-center">
                {t('footer.licenseNote')}
              </p>
              <p className="text-gray-100 text-xs sm:text-sm text-center">
                {t('footer.dataCredit')}
              </p>
              <Link
                to="/"
                className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm uppercase tracking-wider border-b border-yellow-500/30 hover:border-yellow-500/60"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentationPage;
