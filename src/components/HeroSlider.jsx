import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function HeroSlider() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: 1,
      title: 'Har Nagrik Ki Awaaz, Har Samasya Ka Samadhan',
      hiTitle: 'हर नागरिक की आवाज, हर समस्या का समाधान',
      subtitle: 'Your Voice. Your Rights. Simpler Government Access.',
      hiSubtitle: 'आपकी आवाज। आपके अधिकार। सरल सरकारी पहुंच।',
      description:
        'Describe your civic problem in everyday language. NagrikSetu helps you prepare complaints and navigate the appropriate official channels.',
      hiDescription:
        'अपनी रोजमर्रा की सरल भाषा में समस्या बताएं। नागरिकसेतु शिकायत तैयार करने और सही प्रशासनिक विभाग तक पहुंचने में सहायता करता है।',
      image: '/images/hero/slide1_rural_empowerment.jpg',
      alt: 'Indian citizens in a rural village community collaborating and using a smartphone',
      buttons: [
        {
          label: 'Report a Problem',
          hiLabel: 'समस्या दर्ज करें',
          to: '/report',
          primary: true,
          icon: '📝',
        },
        {
          label: 'Talk to AI Assistant',
          hiLabel: 'AI सहायक से बात करें',
          to: '/assistant',
          primary: false,
          icon: '🤖',
        },
      ],
      badge: {
        text: 'AI-Powered Citizen Assistance',
        hiText: 'AI-संचालित नागरिक सहायता',
        color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      },
    },
    {
      id: 2,
      title: 'Government Services, Made Simple.',
      hiTitle: 'सरकारी सेवाएं, अब हर नागरिक के लिए आसान।',
      subtitle: 'Direct Information. Clear Document Checklists.',
      hiSubtitle: 'सटीक जानकारी। दस्तावेजों की स्पष्ट चेकलिस्ट।',
      description:
        'Find relevant government services, understand required documents, and access official application portals without confusion or middlemen.',
      hiDescription:
        'प्रासंगिक सरकारी योजनाएं खोजें, आवश्यक दस्तावेज समझें और बिना किसी बिचौलिए के आधिकारिक पोर्टल तक सीधे पहुंचें।',
      image: '/images/hero/slide2_family_services.jpg',
      alt: 'A multi-generational Indian family accessing digital public services together',
      buttons: [
        {
          label: 'Explore Government Services',
          hiLabel: 'सरकारी सेवाएं देखें',
          to: '/services',
          primary: true,
          icon: '🏛️',
        },
        {
          label: 'How It Works',
          hiLabel: 'यह कैसे काम करता है',
          to: '/how-it-works',
          primary: false,
          icon: '🧭',
        },
      ],
      badge: {
        text: 'Unified Service Navigator',
        hiText: 'एकीकृत सेवा नेविगेटर',
        color: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
      },
    },
    {
      id: 3,
      title: 'AI That Understands Your Language.',
      hiTitle: 'AI जो समझता है आपकी अपनी भाषा।',
      subtitle: 'Voice Input • Hindi • English • Hinglish',
      hiSubtitle: 'आवाज से बोलें • हिन्दी • English • हिंगलिश',
      description:
        'Describe your needs in Hindi, English, or Hinglish via voice or text and receive clear, step-by-step guidance tailored to your local ward.',
      hiDescription:
        'हिन्दी, हिंगलिश या अंग्रेजी में बोलकर या लिखकर समस्या बताएं और अपने स्थानीय वार्ड के अनुसार सटीक चरणबद्ध मार्गदर्शन पाएं।',
      image: '/images/hero/slide3_elderly_accessibility.jpg',
      alt: 'An elderly Indian senior citizen receiving friendly assistance with voice-enabled smartphone',
      buttons: [
        {
          label: 'Try NagrikSetu AI',
          hiLabel: 'नागरिकसेतु AI आजमाएं',
          to: '/assistant',
          primary: true,
          icon: '🎙️',
        },
        {
          label: 'Report Issue',
          hiLabel: 'शिकायत दर्ज करें',
          to: '/report',
          primary: false,
          icon: '⚡',
        },
      ],
      badge: {
        text: 'Voice & Senior Friendly',
        hiText: 'ध्वनि इनपुट और वरिष्ठ नागरिक अनुकूल',
        color: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
      },
    },
    {
      id: 4,
      title: 'Coming Soon: AI-Powered Government Automation',
      hiTitle: 'कमिंग सून: AI-संचालित सरकारी ऑटोमेशन',
      subtitle: 'Citizen-Authorized Autonomous Workflows',
      hiSubtitle: 'नागरिक की पूर्व-सहमति से स्वचालित प्रशासनिक प्रक्रिया',
      description:
        'Our vision is to help citizens navigate supported official portals, prepare forms, and complete authorized workflows with explicit citizen approval.',
      hiDescription:
        'हमारा विजन नागरिकों को आधिकारिक पोर्टल्स पर फॉर्म भरने और उनकी स्पष्ट सहमति से कार्य पूरे करने में सशक्त बनाना है।',
      image: '/images/hero/slide4_future_automation.svg',
      alt: 'Futuristic conceptual illustration showing Indian citizen interacting with digital AI automation workflow',
      buttons: [
        {
          label: 'Explore Our Vision',
          hiLabel: 'हमारा विजन देखें',
          to: '/future-vision',
          primary: true,
          icon: '✨',
        },
        {
          label: 'View Technology Roadmap',
          hiLabel: 'रोडमैप देखें',
          to: '/future-vision#roadmap',
          primary: false,
          icon: '🚀',
        },
      ],
      badge: {
        text: 'COMING SOON — FUTURE VISION',
        hiText: 'जल्द आ रहा है — भविष्य का विजन',
        color: 'bg-amber-400/25 text-amber-300 border-amber-400/50 animate-pulse',
      },
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay with 6 seconds interval
  useEffect(() => {
    if (isPaused) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      // Pause if document tab is hidden
      if (!document.hidden) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0B1F50] text-white focus:outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={language === 'hi' ? 'नागरिकसेतु मुख्य संदेश स्लाइडर' : 'NagrikSetu Hero Highlights'}
    >
      {/* Decorative top saffron-white-green tricolor accent border */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 flex">
        <div className="w-1/3 bg-[#F47721]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#13865B]" />
      </div>

      {/* =========================================================================
          1. AI AUTOMATION ANNOUNCEMENT STRIP (IN-FLOW, COMPACT, ACCESSIBLE)
          Links directly to /future-vision on both mobile and desktop
          ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#001c38] via-[#0b2847] to-[#001c38] border-b border-amber-400/30 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/future-vision"
            className="group py-2 sm:py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-amber-300 hover:text-white transition-colors"
            aria-label={language === 'hi' ? 'भविष्य दृष्टि: AI ऑटोमेशन — कमिंग सून' : 'Future Vision: AI Automation — Coming Soon'}
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-amber-400 animate-pulse shrink-0">✨</span>
              <span className="text-white font-black truncate">
                {language === 'hi' ? 'AI ऑटोमेशन' : 'AI Automation'}
              </span>
              <span className="text-amber-300/60 font-normal shrink-0">—</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0">
                {language === 'hi' ? 'कमिंग सून' : 'Coming Soon'}
              </span>
            </span>
            <span className="text-amber-400 text-xs font-black group-hover:translate-x-1 transition-transform shrink-0">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. MOBILE HERO SECTION (< 768px): CLEAN VERTICAL COMPOSITION
          Order:
          1. Announcement strip (above)
          2. Small AI-powered assistance label
          3. Main heading (fluid typography)
          4. Short supporting description
          5. Primary CTA ("Report a Problem")
          6. Secondary CTA ("Talk to AI Assistant")
          7. Supporting image (Option A: Image below text, faces completely visible)
          8. Carousel controls
          ========================================================================= */}
      <div className="md:hidden relative z-10">
        <div className="px-4 pt-4 pb-2 space-y-3">
          {/* Label Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
            <span>🇮🇳</span>
            <span>{language === 'hi' ? currentSlideData.badge.hiText : currentSlideData.badge.text}</span>
          </div>

          {/* Main Heading with Fluid Typography */}
          <h1
            className="font-black text-white tracking-tight leading-[1.2] break-words"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.4rem)' }}
          >
            {language === 'hi' ? currentSlideData.hiTitle : currentSlideData.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-bold text-[#F47721] tracking-wide">
            {language === 'hi' ? currentSlideData.hiSubtitle : currentSlideData.subtitle}
          </p>

          {/* Short Supporting Description */}
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {language === 'hi' ? currentSlideData.hiDescription : currentSlideData.description}
          </p>

          {/* CTA Buttons: Stacked on < 480px, width 100%, comfortable touch targets */}
          <div className="pt-2 flex flex-col xs:flex-row items-stretch gap-2.5 w-full">
            <Link
              to="/report"
              className="w-full flex-1 h-12 px-5 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            >
              <span>📝</span>
              <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
            </Link>
            <Link
              to="/assistant"
              className="w-full flex-1 h-12 px-5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>🤖</span>
              <span>{language === 'hi' ? 'AI सहायक से बात करें' : 'Talk to AI Assistant'}</span>
            </Link>
          </div>

          {/* Supporting Image (Option A: Image below hero text so citizens' faces are never obscured) */}
          <div className="pt-3">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-black/40">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.alt}
                loading="eager"
                className="h-full w-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F50]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Carousel Controls (Neatly below image, comfortable touch targets, zero overlap) */}
          <div className="pt-2 pb-20 sm:pb-6 flex items-center justify-between">
            <div
              className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15"
              role="tablist"
              aria-label="Mobile carousel pagination"
            >
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47721] ${
                    idx === currentSlide ? 'w-6 h-2 bg-[#F47721]' : 'w-2 h-2 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  role="tab"
                  aria-selected={idx === currentSlide}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="h-10 w-10 rounded-full bg-black/40 hover:bg-[#F47721] text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous slide"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="h-10 w-10 rounded-full bg-black/40 hover:bg-[#F47721] text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next slide"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. DESKTOP / TABLET HERO SECTION (>= 768px): FULL-WIDTH CINEMATIC CAROUSEL
          ========================================================================= */}
      <div className="hidden md:block relative min-h-[540px] lg:min-h-[600px]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}: ${slide.title}`}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#0B1F50]/95 via-[#0B1F50]/80 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1F50] via-transparent to-black/30"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-watermark-mandala opacity-20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Desktop Content Box */}
              <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-8 flex flex-col justify-center py-16">
                <div className="max-w-2xl lg:max-w-3xl">
                  {/* Category / Highlight Badge */}
                  <div className="mb-4 inline-flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${slide.badge.color}`}
                    >
                      <span>🇮🇳</span>
                      <span>{language === 'hi' ? slide.badge.hiText : slide.badge.text}</span>
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1
                    className="font-black text-white tracking-tight leading-[1.2] mb-3 drop-shadow-md break-words"
                    style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)' }}
                  >
                    {language === 'hi' ? slide.hiTitle : slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg font-bold text-[#F47721] mb-3 tracking-wide drop-shadow-sm">
                    {language === 'hi' ? slide.hiSubtitle : slide.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 max-w-2xl font-medium drop-shadow-sm">
                    {language === 'hi' ? slide.hiDescription : slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    {slide.buttons.map((btn, btnIdx) => (
                      <Link
                        key={btnIdx}
                        to={btn.to}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all duration-200 shadow-md ${
                          btn.primary
                            ? 'bg-[#F47721] hover:bg-[#d96617] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md hover:border-white/40'
                        }`}
                      >
                        <span>{btn.icon}</span>
                        <span>{language === 'hi' ? btn.hiLabel : btn.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Desktop Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
            <div
              className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
              role="tablist"
              aria-label="Carousel pagination"
            >
              {slides.map((slide, index) => {
                const active = index === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47721] ${
                      active ? 'w-8 h-2.5 bg-[#F47721]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-selected={active}
                    role="tab"
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="h-10 w-10 rounded-full bg-black/40 hover:bg-[#F47721] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F47721]"
                aria-label="Previous slide"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="h-10 w-10 rounded-full bg-black/40 hover:bg-[#F47721] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F47721]"
                aria-label="Next slide"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
