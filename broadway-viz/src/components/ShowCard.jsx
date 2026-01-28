import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ShowCard = ({ item }) => {
  const { t } = useTranslation();
  const conductorName = item?.conductor_info?.name || t('cards.unknownConductor');
  const initials = getInitials(conductorName);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-black border border-white/5 hover:border-yellow-500/30 rounded-2xl p-6 sm:p-7 md:p-8 lg:p-9 transition-all duration-300 transition-shadow duration-500 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] group flex flex-col h-full relative overflow-hidden cursor-pointer"
      role="article"
      aria-label={t('cards.ariaLabel', {
        production: item?.show_info?.title || t('cards.unknownShow'),
        conductor: conductorName
      })}
      tabIndex={0}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
        animate={{ 
          background: [
            'linear-gradient(135deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0) 100%)',
            'linear-gradient(135deg, rgba(212,175,55,0.03) 0%, rgba(212,175,55,0.01) 100%)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      {/* Conductor Info Section */}
      <div className="flex items-start gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-7 md:mb-8 relative z-10">
        {/* Image Container with PIONEER badge below */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {item?.conductor_info?.photo ? (
            <motion.img 
              src={item.conductor_info.photo} 
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-yellow-500/60 shadow-lg shadow-yellow-500/20"
              alt={t('cards.portraitAlt', { name: conductorName })}
              loading="lazy"
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-900/30 via-yellow-800/20 to-gray-900 border-2 border-yellow-500/60 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20';
                placeholder.innerHTML = `<span class="text-2xl sm:text-3xl font-serif font-medium text-yellow-500/80">${initials}</span>`;
                e.target.parentElement.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-900/30 via-yellow-800/20 to-gray-900 border-2 border-yellow-500/60 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/30 transition-all">
              <span className="text-2xl sm:text-3xl font-serif font-medium text-yellow-500/80 group-hover:text-yellow-400 transition-colors">{initials}</span>
            </div>
          )}
          {/* PIONEER badge below image */}
          {item?.isPioneer && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-900/30 border border-yellow-500/50 text-[10px] uppercase tracking-widest text-yellow-300 whitespace-nowrap"
              title={t('cards.pioneerTooltip')}
              aria-label={t('cards.pioneerTooltip')}
            >
              ✨ {t('cards.pioneer')}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <motion.h3 
            className="text-lg sm:text-xl md:text-2xl font-serif text-white tracking-tight mb-1 line-clamp-2 leading-tight"
            initial={false}
            whileHover={{ color: '#D4AF37', x: 3 }}
            transition={{ duration: 0.2 }}
          >
            {conductorName}
          </motion.h3>
          <motion.p 
            className="role-label text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] font-bold text-gray-100 mt-1 sm:mt-2 block"
            whileHover={{ color: '#F9FAFB' }}
          >
            {item?.conductor_info?.role ? t(`roles.${item.conductor_info.role}`, { defaultValue: item.conductor_info.role }) : t('cards.unknownRole')}
          </motion.p>
          {item?.conductor_info?.lifespan && (
            <p className="text-[10px] sm:text-xs text-gray-200 font-light mt-1 sm:mt-2">{item.conductor_info.lifespan}</p>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <motion.div 
        className="border-t border-white/5 mb-6 sm:mb-7 md:mb-8 relative z-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      
      {/* Show Info Section */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-left flex-1 relative z-10">
        <div>
          <motion.p 
            className="text-base sm:text-lg font-sans text-yellow-500/80 mt-4 sm:mt-6 mb-2 sm:mb-3 leading-relaxed line-clamp-2"
            whileHover={{ color: 'rgba(212,175,55,0.95)', x: 2 }}
            transition={{ duration: 0.2 }}
          >
            {item?.show_info?.title || t('cards.unknownShow')}
          </motion.p>
          {item?.show_info?.type && (
            <span className="inline-block border border-white/10 px-2 py-1 rounded-full text-[8px] sm:text-[9px] text-gray-100 uppercase tracking-widest font-bold">
              {item.show_info.type}
            </span>
          )}
        </div>
        
        <motion.div 
          className="flex items-center gap-2 sm:gap-3"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span 
            className="text-yellow-500/70 text-base sm:text-lg"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            📅
          </motion.span>
          <p className="text-xs sm:text-sm text-gray-200 font-light">{item?.show_info?.opening || t('cards.dateUnknown')}</p>
        </motion.div>
        
        {item?.conductor_info?.fact && (
          <motion.div 
            className="mt-auto pt-4 sm:pt-5 md:pt-6 border-t border-white/5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 3 }}
          >
            <p className="text-[11px] sm:text-xs text-gray-200 font-light italic leading-relaxed line-clamp-3 pl-3 sm:pl-4 border-l-2 border-yellow-600/40 group-hover:border-yellow-500/60 group-hover:text-gray-100 transition-all duration-300" title={item?.conductor_info?.fact || ''}>
              💡 {item.conductor_info.fact}
            </p>
          </motion.div>
        )}
      </div>

      {/* Accessibility: Focus ring */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-yellow-500 ring-offset-2 ring-offset-black opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
    </motion.article>
  );
};

export default ShowCard;
