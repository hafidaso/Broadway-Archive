import React from 'react';
import { useTranslation } from 'react-i18next';

const VinylLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* SVG Vinyl Record */}
        <div className="relative">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="vinyl-spin"
            aria-label={t('loader.preparing')}
            role="img"
          >
            {/* Outer vinyl body - deep black/charcoal */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="#1a1a1a"
              stroke="#0a0a0a"
              strokeWidth="2"
            />
            
            {/* Concentric grooves with gold highlights */}
            {/* Outer grooves */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
            
            {/* Middle grooves */}
            <circle cx="100" cy="100" r="65" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
            
            {/* Inner grooves */}
            <circle cx="100" cy="100" r="40" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="35" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
            
            {/* Central label area - Broadway Gold */}
            <circle
              cx="100"
              cy="100"
              r="25"
              fill="#D4AF37"
              fillOpacity="0.15"
              stroke="#D4AF37"
              strokeWidth="1.5"
              opacity="0.8"
            />
            
            {/* Inner label circle */}
            <circle
              cx="100"
              cy="100"
              r="18"
              fill="#1a1a1a"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            
            {/* Center hole */}
            <circle
              cx="100"
              cy="100"
              r="5"
              fill="#0a0a0a"
            />
            
            {/* Decorative label text area - subtle lines */}
            <circle cx="100" cy="100" r="22" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>
        
        {/* Thematic text */}
        <p className="text-[#D4AF37] font-serif text-xl sm:text-2xl md:text-3xl font-light tracking-wide animate-pulse">
          {t('loader.preparing')}
        </p>
      </div>
    </div>
  );
};

export default VinylLoader;
