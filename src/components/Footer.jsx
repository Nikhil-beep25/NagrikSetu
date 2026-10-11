import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import FaqSection from './FaqSection';

export default function Footer() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const currentYear = new Date().getFullYear();

  const handleBackToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <footer className="relative text-white mt-auto select-none print:hidden" role="contentinfo">
      {/* ================================================================
          FAQ SECTION (Preserved immediately above the footer)
          ================================================================ */}
      <FaqSection />

      {/* ================================================================
          LAYER 1: CITIZEN CALL-TO-ACTION (Warm Ivory with subtle accents)
          ================================================================ */}
      <section
        aria-label={isHindi ? 'नागरिक आह्वान' : 'Citizen Call To Action'}
        className="relative bg-[#FFF9F1] text-[#1D2939] pt-12 pb-14 sm:pt-16 sm:pb-20 border-t border-[#E3E8EF] overflow-hidden"
      >
        {/* Subtle Decorative Accents */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#F47721]/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#13865B]/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Saffron & Green Accent Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F47721]/30 px-3.5 py-1 text-xs font-black text-[#F47721] shadow-2xs mb-4">
            <span className="h-2 w-2 rounded-full bg-[#13865B]" />
            <span>{isHindi ? 'नागरिक सेतु • जन संवाद' : 'Citizen Empowerment • Jan Samvaad'}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B1F50] tracking-tight leading-tight max-w-2xl mx-auto">
            {isHindi ? 'आपकी आवाज़ मायने रखती है।' : 'Your Voice Matters. Let NagrikSetu Help.'}
          </h2>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-base text-[#596579] font-medium max-w-xl mx-auto leading-relaxed">
            {isHindi
              ? 'नागरिक शिकायतों से लेकर सरकारी सेवाओं तक, एक AI-संचालित मंच के माध्यम से सरल मार्गदर्शन प्राप्त करें।'
              : 'From civic complaints to government services, get simpler guidance through one AI-powered platform.'}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B1F50] hover:bg-[#071638] text-white px-7 py-3.5 text-xs sm:text-sm font-black shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>🤖</span>
              <span>{isHindi ? 'AI सहायक से बात करें' : 'Talk to AI Assistant'}</span>
              <span className="text-[#F47721]">→</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F47721] to-[#e06616] hover:from-[#e06616] hover:to-[#c8560e] text-white px-7 py-3.5 text-xs sm:text-sm font-black shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>📝</span>
              <span>{isHindi ? 'समस्या रिपोर्ट करें' : 'Report a Problem'}</span>
            </Link>
          </div>
        </div>

        {/* Gentle Curved Wave Transition into Deep Navy */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none" aria-hidden="true">
          <svg
            className="relative block w-full h-6 sm:h-10 text-[#0B1F50]"
            viewBox="0 0 1440 48"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,32 C288,48 720,0 1440,32 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          LAYER 2: MAIN FOOTER (Deep Navy #0B1F50 with Asymmetric Layout)
          ================================================================ */}
      <section
        aria-label={isHindi ? 'मुख्य पादलेख' : 'Main Footer Navigation'}
        className="relative bg-[#0B1F50] pt-12 pb-14 sm:pt-16 sm:pb-20 overflow-hidden"
      >
        {/* Original Bharat Background Graphics (Digital Nodes & Geometric Patterns ~5% opacity) */}
        <div
          className="absolute inset-0 bg-watermark-nodes opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-watermark-mandala opacity-[0.03] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* LEFT SIDE (Asymmetric Brand Identity - 5 Columns) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-white p-1.5 shadow-md border-2 border-white/20 overflow-hidden shrink-0">
                  <img
                    src="/assets/nagriksetu_logo.jpg"
                    alt="NagrikSetu Logo"
                    className="h-full w-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                    Nagrik<span className="text-[#F47721]">Setu</span>
                  </span>
                  <span className="text-xs font-bold text-amber-300 mt-1">
                    {isHindi
                      ? 'तकनीक जो हर नागरिक को समझती है।'
                      : 'Technology That Understands Every Citizen.'}
                  </span>
                </div>
              </div>

              {/* Decorative Tricolor Line */}
              <div className="flex h-1 w-24 rounded-full overflow-hidden" aria-hidden="true">
                <span className="w-1/3 bg-[#F47721]" />
                <span className="w-1/3 bg-white" />
                <span className="w-1/3 bg-[#13865B]" />
              </div>

              {/* Brand Description */}
              <p className="text-xs sm:text-sm text-[#B8C5D8] leading-relaxed max-w-md">
                {isHindi
                  ? 'एक स्वतंत्र AI-संचालित मंच जो नागरिकों को नागरिक शिकायतों और सरकारी सेवाओं को अधिक आसानी से नेविगेट करने में मदद करता है।'
                  : 'An independent AI-powered platform helping citizens navigate civic complaints and government services more easily.'}
              </p>

              {/* Startup-Grade Civic Bridge Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-[#B8C5D8]">
                <span className="h-2 w-2 rounded-full bg-[#13865B] animate-pulse" />
                <span className="font-medium">
                  {isHindi ? 'नागरिक ↔ AI ↔ शासन प्रणाली' : 'Citizen ↔ AI ↔ Governance'}
                </span>
              </div>
            </div>

            {/* RIGHT SIDE (3 Navigation Groups - 7 Columns) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6">
              
              {/* GROUP 1: EXPLORE */}
              <div className="space-y-3.5">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F47721]" aria-hidden="true" />
                  <span>{isHindi ? 'अन्वेषण' : 'Explore'}</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#B8C5D8]">
                  <li>
                    <Link
                      to="/"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/assistant"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'AI नागरिक सहायक' : 'AI Assistant'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/report"
                      className="group relative inline-block text-amber-300 font-semibold hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'शिकायत दर्ज करें' : 'Report Complaint'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'सरकारी सेवाएं' : 'Government Services'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* GROUP 2: DISCOVER */}
              <div className="space-y-3.5">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#13865B]" aria-hidden="true" />
                  <span>{isHindi ? 'खोजें' : 'Discover'}</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#B8C5D8]">
                  <li>
                    <Link
                      to="/how-it-works"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'यह कैसे काम करता है' : 'How It Works'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/complaints"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'मेरी शिकायतें' : 'My Complaints'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/future-vision"
                      className="group relative inline-flex items-center gap-1 text-[#F47721] font-bold hover:text-amber-300 transition-colors duration-150"
                    >
                      <span>🚀</span>
                      <span>{isHindi ? 'भविष्य दृष्टि' : 'Future Vision'}</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'सामान्य प्रश्न (FAQs)' : 'FAQs'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* GROUP 3: TRUST */}
              <div className="space-y-3.5 col-span-2 sm:col-span-1">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                  <span>{isHindi ? 'विश्वास' : 'Trust'}</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#B8C5D8]">
                  <li>
                    <Link
                      to="/privacy"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'उपयोग की शर्तें' : 'Terms of Use'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/accessibility"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150"
                    >
                      <span>{isHindi ? 'सुगमता विवरण' : 'Accessibility'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/disclaimer"
                      className="group relative inline-block hover:text-[#F47721] transition-colors duration-150 text-amber-300 font-semibold"
                    >
                      <span>{isHindi ? 'मंच अस्वीकरण' : 'Disclaimer'}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-[#F47721]" />
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LAYER 3: BOTTOM BAR (Darker Navy #071638)
          ================================================================ */}
      <section
        aria-label={isHindi ? 'कॉपीराइट सूचना' : 'Copyright and Legal'}
        className="bg-[#071638] text-[#B8C5D8] py-6 border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            
            {/* Left: Dynamic Copyright */}
            <div className="text-center sm:text-left">
              <p className="font-bold text-white">
                © {currentYear} NagrikSetu. {isHindi ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
              </p>
            </div>

            {/* Center: Independence Statement */}
            <div className="text-center text-[11px] text-[#B8C5D8] max-w-md">
              <p>
                {isHindi
                  ? 'स्वतंत्र नागरिक सहायता मंच। भारत सरकार से संबद्ध नहीं है।'
                  : 'Independent citizen assistance platform. Not affiliated with the Government of India.'}
              </p>
            </div>

            {/* Right: Quick Links & Back to Top */}
            <div className="flex items-center gap-4 text-xs">
              <Link to="/privacy" className="hover:text-[#F47721] transition-colors">
                {isHindi ? 'गोपनीयता' : 'Privacy'}
              </Link>
              <span className="text-white/30" aria-hidden="true">•</span>
              <Link to="/terms" className="hover:text-[#F47721] transition-colors">
                {isHindi ? 'शर्तें' : 'Terms'}
              </Link>
              <span className="text-white/30" aria-hidden="true">•</span>
              <button
                type="button"
                onClick={handleBackToTop}
                className="inline-flex items-center gap-1 text-white hover:text-[#F47721] font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721] rounded"
                aria-label={isHindi ? 'शीर्ष पर वापस जाएं' : 'Back to top of page'}
              >
                <span>↑</span>
                <span>{isHindi ? 'शीर्ष पर' : 'Top'}</span>
              </button>
            </div>

          </div>
        </div>
      </section>
    </footer>
  );
}
