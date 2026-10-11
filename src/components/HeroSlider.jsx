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

      {/* Slide Container (desktop 540px - 600px height, mobile adaptive with clearance for controls) */}
      <div className="relative min-h-[520px] sm:min-h-[540px] md:min-h-[560px] lg:min-h-[600px] flex items-center">
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
              {/* Background Image with lazy-loading for non-initial slides */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
                />
                {/* Multi-layered cinematic Bharat gradient overlay ensuring WCAG AAA text contrast */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#0B1F50]/95 via-[#0B1F50]/80 to-[#0B1F50]/40 md:to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1F50] via-transparent to-black/30"
                  aria-hidden="true"
                />
                {/* Subtle Ashoka radial watermark overlay within slide */}
                <div
                  className="absolute inset-0 bg-watermark-mandala opacity-20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Content Box with safe bottom clearance so buttons never hit carousel controls */}
              <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-8 pb-20 sm:py-12 md:py-16">
                <div className="max-w-2xl lg:max-w-3xl">
                  {/* Category / Highlight Badge */}
                  <div className="mb-3 sm:mb-4 inline-flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${slide.badge.color}`}
                    >
                      <span>🇮🇳</span>
                      <span>{language === 'hi' ? slide.badge.hiText : slide.badge.text}</span>
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.2] mb-2 sm:mb-3 drop-shadow-md break-words">
                    {language === 'hi' ? slide.hiTitle : slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-[#F47721] mb-2 sm:mb-3 tracking-wide drop-shadow-sm">
                    {language === 'hi' ? slide.hiSubtitle : slide.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed mb-5 sm:mb-8 max-w-2xl font-medium drop-shadow-sm">
                    {language === 'hi' ? slide.hiDescription : slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-4">
                    {slide.buttons.map((btn, btnIdx) => (
                      <Link
                        key={btnIdx}
                        to={btn.to}
                        className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 shadow-md ${
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
      </div>

      {/* Navigation Controls: Arrows and Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Pagination Indicators / Pills */}
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
                    active
                      ? 'w-8 h-2.5 bg-[#F47721]'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={active}
                  role="tab"
                />
              );
            })}
          </div>

          {/* Prev / Next Buttons */}
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
    </section>
  );
}
