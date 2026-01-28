import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ['home', 'about', 'stats', 'chart', 'timeline'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If we're on the documentation page, navigate to home first
    if (location.pathname === '/documentation') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'highlights', label: t('nav.highlights') },
    { id: 'stats', label: t('nav.stats') },
    { id: 'explore', label: t('nav.explore') },
    { id: 'documentation', label: t('nav.documentation') },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/hafida-belayd/', label: 'LinkedIn', icon: 'in' },
    { href: 'https://github.com/hafidaso/', label: 'GitHub', icon: 'GH' },
    { href: 'http://hafida-belayd.me/', label: 'Website', icon: '🌐' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-12 sm:top-14 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 border-b border-yellow-900/20' 
            : 'bg-black/60'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <motion.button
              onClick={() => {
                if (location.pathname === '/documentation') {
                  window.location.href = '/#home';
                } else {
                  scrollToSection('home');
                }
              }}
              className="flex items-center gap-4 lg:gap-5 group cursor-pointer outline-none focus:outline-none focus:ring-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ opacity: [1, 0.4, 1], scale: 0.95, transition: { duration: 0.2 } }}
            >
              <motion.span 
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-900/30 border border-yellow-500/30 shadow-lg shadow-yellow-500/20 overflow-hidden"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                aria-hidden="true"
              >
                <img
                  src="/logo-bro.png"
                  alt=""
                  className="w-10 h-10 object-contain"
                />
              </motion.span>
              <div className="hidden lg:block">
                <h1 className="text-xl lg:text-2xl font-serif font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-yellow-300 group-hover:to-yellow-400 transition-all duration-300 tracking-tight">
                  {t('app.title')}
                </h1>
                <p className="text-xs lg:text-sm text-gray-100 group-hover:text-white transition-colors">{t('app.subtitle')}</p>
              </div>
            </motion.button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-5 px-2 py-2 rounded-2xl bg-black/30">
              {menuItems.map((item, index) => {
                const isActive = item.id === 'documentation' 
                  ? location.pathname === '/documentation'
                  : activeSection === item.id;
                
                if (item.id === 'documentation') {
                  return (
                    <Link
                      key={item.id}
                      to="/documentation"
                      className={`relative px-4 lg:px-6 xl:px-7 py-2.5 lg:py-3 rounded-xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                        isActive
                          ? 'text-yellow-300'
                          : 'text-yellow-300/80'
                      }`}
                    >
                      <span className={`text-xs lg:text-sm relative z-10 font-semibold transition-colors duration-300 tracking-wide ${
                        isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                      }`}>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                          initial={false}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                }
                
                // If we're on documentation page, use Link to navigate to home with hash
                if (location.pathname === '/documentation') {
                  return (
                    <Link
                      key={item.id}
                      to={`/#${item.id}`}
                      className={`relative px-4 lg:px-6 xl:px-7 py-2.5 lg:py-3 rounded-xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                        isActive
                          ? 'text-yellow-300'
                          : 'text-yellow-300/80'
                      }`}
                    >
                      <span className={`text-xs lg:text-sm relative z-10 font-semibold transition-colors duration-300 tracking-wide ${
                        isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                      }`}>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                          initial={false}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                }
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ opacity: [1, 0.4, 1], scale: 0.95, transition: { duration: 0.2 } }}
                    className={`relative px-4 lg:px-6 xl:px-7 py-2.5 lg:py-3 rounded-xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                      isActive
                        ? 'text-yellow-300'
                        : 'text-yellow-300/80'
                    }`}
                  >
                    <span className={`text-xs lg:text-sm relative z-10 font-semibold transition-colors duration-300 tracking-wide ${
                      isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                    }`}>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-2 ml-2 px-2 py-1 rounded-lg bg-black/40 border border-yellow-500/20 text-yellow-300 text-[10px] uppercase tracking-widest">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`transition-colors outline-none focus:outline-none focus:ring-0 ${i18n.language === 'en' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                >
                  EN
                </button>
                <span className="text-yellow-400/40">|</span>
                <button
                  onClick={() => i18n.changeLanguage('fr')}
                  className={`transition-colors outline-none focus:outline-none focus:ring-0 ${i18n.language === 'fr' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                >
                  FR
                </button>
                <span className="text-yellow-400/40">|</span>
                <button
                  onClick={() => i18n.changeLanguage('ar')}
                  className={`transition-colors outline-none focus:outline-none focus:ring-0 ${i18n.language === 'ar' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                >
                  AR
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm border border-yellow-500/40 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40 outline-none focus:outline-none focus:ring-0"
              whileTap={{ opacity: [1, 0.4, 1], scale: 0.95, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.05 }}
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              <div className="w-7 h-6 flex flex-col justify-between">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 11 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-500/50"
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-500/50"
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-500/50"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" />
            <motion.div
              initial={{ x: i18n.language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: i18n.language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`absolute ${i18n.language === 'ar' ? 'left-0 border-r-2' : 'right-0 border-l-2'} top-0 bottom-0 w-80 bg-gradient-to-br from-gray-900 to-black border-yellow-900/40 p-8 overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🎭</span>
                  <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {t('nav.menu')}
                  </h2>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-red-900/30 hover:bg-red-800/40 border border-red-700/50 hover:border-red-500 transition-all duration-300 outline-none focus:outline-none focus:ring-0"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ opacity: [1, 0.4, 1], scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <span className="text-2xl text-red-400">✕</span>
                </motion.button>
              </div>

              <div className="space-y-5">
                {menuItems.map((item, index) => {
                  const isActive = item.id === 'documentation' 
                    ? location.pathname === '/documentation'
                    : activeSection === item.id;
                  
                  if (item.id === 'documentation') {
                    return (
                      <Link
                        key={item.id}
                        to="/documentation"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative w-full px-8 py-6 rounded-2xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                          isActive
                            ? 'text-yellow-300'
                            : 'text-yellow-300/80'
                        }`}
                      >
                        <span className={`text-xl relative z-10 font-bold transition-colors duration-300 ${
                          isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                        }`}>{item.label}</span>
                        <motion.span 
                          className={`ml-auto relative z-10 ${isActive ? 'text-yellow-400' : 'text-yellow-500'}`}
                          initial={{ x: 0 }}
                          whileHover={{ x: i18n.language === 'ar' ? -5 : 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {i18n.language === 'ar' ? '←' : '→'}
                        </motion.span>
                        {isActive && (
                          <motion.div
                            className={`absolute ${i18n.language === 'ar' ? 'right-0 rounded-l' : 'left-0 rounded-r'} top-0 bottom-0 w-1 bg-yellow-400`}
                            layoutId="activeMobileIndicator"
                            initial={false}
                          />
                        )}
                      </Link>
                    );
                  }
                  
                  // If we're on documentation page, use Link to navigate to home with hash
                  if (location.pathname === '/documentation') {
                    return (
                      <Link
                        key={item.id}
                        to={`/#${item.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative w-full px-8 py-6 rounded-2xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                          isActive
                            ? 'text-yellow-300'
                            : 'text-yellow-300/80'
                        }`}
                      >
                        <span className={`text-xl relative z-10 font-bold transition-colors duration-300 ${
                          isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                        }`}>{item.label}</span>
                        <motion.span 
                          className={`ml-auto relative z-10 ${isActive ? 'text-yellow-400' : 'text-yellow-500'}`}
                          initial={{ x: 0 }}
                          whileHover={{ x: i18n.language === 'ar' ? -5 : 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {i18n.language === 'ar' ? '←' : '→'}
                        </motion.span>
                        {isActive && (
                          <motion.div
                            className={`absolute ${i18n.language === 'ar' ? 'right-0 rounded-l' : 'left-0 rounded-r'} top-0 bottom-0 w-1 bg-yellow-400`}
                            layoutId="activeMobileIndicator"
                            initial={false}
                          />
                        )}
                      </Link>
                    );
                  }
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ opacity: [1, 0.4, 1], scale: 0.95, transition: { duration: 0.2 } }}
                      className={`relative w-full px-8 py-6 rounded-2xl bg-black/40 transition-colors duration-200 flex items-center outline-none focus:outline-none focus:ring-0 ${
                        isActive
                          ? 'text-yellow-300'
                          : 'text-yellow-300/80'
                      }`}
                    >
                      <span className={`text-xl relative z-10 font-bold transition-colors duration-300 ${
                        isActive ? 'text-yellow-300' : 'text-yellow-300/80 group-hover:text-yellow-300'
                      }`}>{item.label}</span>
                      <motion.span 
                        className={`ml-auto relative z-10 ${isActive ? 'text-yellow-400' : 'text-yellow-500'}`}
                        initial={{ x: 0 }}
                        whileHover={{ x: i18n.language === 'ar' ? -5 : 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {i18n.language === 'ar' ? '←' : '→'}
                      </motion.span>
                      {isActive && (
                        <motion.div
                          className={`absolute ${i18n.language === 'ar' ? 'right-0 rounded-l' : 'left-0 rounded-r'} top-0 bottom-0 w-1 bg-yellow-400`}
                          layoutId="activeMobileIndicator"
                          initial={false}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-800/50 space-y-6">
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-800/30 rounded-2xl p-6 text-center">
                  <p className="text-sm text-yellow-300/90 font-semibold mb-2">
                    🎭 {t('app.subtitle')}
                  </p>
                  <p className="text-xs text-gray-100">
                    {t('footer.dataCuratedBy', { name: 'Sariva Goetz' })}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-yellow-400/70">
                  <span>{t('language.label')}</span>
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-2 py-1 rounded-lg border border-yellow-500/30 outline-none focus:outline-none focus:ring-0 ${i18n.language === 'en' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('fr')}
                    className={`px-2 py-1 rounded-lg border border-yellow-500/30 outline-none focus:outline-none focus:ring-0 ${i18n.language === 'fr' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('ar')}
                    className={`px-2 py-1 rounded-lg border border-yellow-500/30 outline-none focus:outline-none focus:ring-0 ${i18n.language === 'ar' ? 'text-yellow-200' : 'text-yellow-400/60'}`}
                  >
                    AR
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-black/40 border border-yellow-500/30 text-yellow-300 flex items-center justify-center text-xs font-bold tracking-wide hover:border-yellow-500 hover:text-yellow-200 transition-all outline-none focus:outline-none focus:ring-0"
                      aria-label={link.label}
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className="h-32 sm:h-36" />
    </>
  );
};

export default Navigation;
