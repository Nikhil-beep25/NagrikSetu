import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function FutureVisionButton() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isHindi = language === 'hi';

  // Display ONLY on the Home Page ('/'), not on any other page of the site
  if (location.pathname !== '/') {
    return null;
  }

  const handleClick = () => {
    // Directly navigate to the Future Vision page
    navigate('/future-vision');
  };

  return (
    <div
      className="fixed top-24 sm:top-28 left-3 sm:left-5 z-40 select-none"
    >
      <button
        type="button"
        onClick={handleClick}
        className="animate-shine animate-pulse-glow group flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#001c38] via-[#0a2b4c] to-[#001c38] hover:from-[#0a2b4c] hover:to-[#002546] text-white border-2 border-amber-400/90 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label={isHindi ? 'भविष्य विजन: AI ऑटोमेशन कमिंग सून' : 'Future Vision: AI Automation Coming Soon'}
      >
        {/* Glowing Radar Pulse Indicator */}
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300 shadow-sm" />
        </span>

        {/* AI Robot Icon */}
        <span className="text-base sm:text-lg shrink-0 transform group-hover:rotate-12 transition-transform" aria-hidden="true">
          🤖
        </span>

        {/* AI Automation Label */}
        <span className="text-xs sm:text-[13px] font-black text-white tracking-tight">
          {isHindi ? 'AI ऑटोमेशन' : 'AI Automation'}
        </span>

        {/* Coming Soon Badge */}
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-kesari-500 text-chakra-900 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
          <span>✨</span>
          <span>{isHindi ? 'कमिंग सून' : 'Coming Soon'}</span>
        </span>

        {/* Subtle Arrow */}
        <span className="text-amber-300 text-xs font-bold pl-0.5 opacity-80 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
