import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes in milliseconds (300,000 ms)

export default function FutureVisionPopup() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isHindi = language === 'hi';

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed this notification in the current session
    const isDismissed = sessionStorage.getItem('nagriksetu_vision_popup_dismissed');
    if (isDismissed === 'true') {
      return;
    }

    // 2. Track cumulative session start time
    let startTime = sessionStorage.getItem('nagriksetu_session_start_time');
    if (!startTime) {
      startTime = Date.now().toString();
      sessionStorage.setItem('nagriksetu_session_start_time', startTime);
    }

    const elapsed = Date.now() - parseInt(startTime, 10);
    const delay = Math.max(0, FIVE_MINUTES_MS - elapsed);

    // 3. Set timer for the remaining time until 5 minutes
    const timer = setTimeout(() => {
      // Re-check dismissal before displaying
      if (sessionStorage.getItem('nagriksetu_vision_popup_dismissed') !== 'true') {
        setIsVisible(true);
      }
    }, delay);

    // 4. Custom event listener for instant demonstration / testing
    const handleOpenPopup = () => {
      setIsVisible(true);
    };

    window.addEventListener('open-future-vision-popup', handleOpenPopup);
    // Expose global helper for testing and evaluation
    window.showFutureVisionPopup = handleOpenPopup;

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-future-vision-popup', handleOpenPopup);
      delete window.showFutureVisionPopup;
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('nagriksetu_vision_popup_dismissed', 'true');
    setIsVisible(false);
  };

  const handleExploreVision = () => {
    handleDismiss();
    navigate('/future-vision');
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible || location.pathname === '/future-vision') {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vision-popup-title"
      aria-describedby="vision-popup-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-slide-up"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-kesari-300 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Tricolor Ribbon */}
        <div className="tricolor-ribbon w-full shrink-0" aria-hidden="true" />

        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#001c38] to-[#002D56] text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 pr-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-kesari-500/20 border border-kesari-400/40 px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-kesari-300">
                <span className="h-1.5 w-1.5 rounded-full bg-kesari-400 animate-ping" />
                <span>{isHindi ? 'भविष्य दृष्टि • कमिंग सून' : 'Coming Soon • Future Vision'}</span>
              </div>
              <h2
                id="vision-popup-title"
                className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug"
              >
                {isHindi
                  ? 'नागरिकसेतु का भविष्य: AI-संचालित नागरिक ऑटोमेशन'
                  : 'The Future of NagrikSetu: AI Citizen Automation'}
              </h2>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full h-8 w-8 flex items-center justify-center text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              aria-label={isHindi ? 'पॉप-अप बंद करें' : 'Close notification popup'}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-slate-800">
          {/* Main Vision Statement */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-kesari-50 to-orange-50 border border-kesari-200">
            <p className="text-xs sm:text-sm font-bold text-chakra-900 leading-snug">
              “
              {isHindi
                ? 'अपनी समस्या प्राकृतिक बोलचाल की भाषा में बताएं, और AI समर्थित सरकारी प्रक्रिया को पूरा करने में सहायता करे।'
                : 'An AI-powered citizen automation platform where people describe their problems in natural language, and AI helps complete the complex government service workflow.'}
              ”
            </p>
          </div>

          <p id="vision-popup-desc" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {isHindi
              ? 'बिना किसी जटिल सरकारी वेबसाइट में भटके या विभागीय शब्दावली समझे, आगामी नागरिकसेतु AI सीधे संबंधित पोर्टल की पहचान करेगा और आपकी स्पष्ट सहमति से समर्थित फॉर्म फील्ड भरने में मदद करेगा।'
              : 'Imagine reporting a pothole, requesting a certificate, or accessing a public service without navigating confusing portals. Our upcoming AI Automation understands your request, finds the verified portal, and prepares supported workflows with your permission.'}
          </p>

          {/* 3 Key Pillars Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="rounded-xl border border-border bg-surface-dim p-2.5 flex items-start gap-2">
              <span className="text-base shrink-0">🗣️</span>
              <div>
                <span className="font-bold text-chakra-900 block text-[11px]">
                  {isHindi ? 'संवाद-प्रथम' : 'One Conversation'}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {isHindi ? 'बोलकर या लिखकर बताएं' : 'Natural voice or text'}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-dim p-2.5 flex items-start gap-2">
              <span className="text-base shrink-0">🌐</span>
              <div>
                <span className="font-bold text-chakra-900 block text-[11px]">
                  {isHindi ? 'पोर्टल नेविगेशन' : 'Portal Guidance'}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {isHindi ? 'सटीक .gov.in मैपिंग' : 'Verified endpoints'}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-dim p-2.5 flex items-start gap-2">
              <span className="text-base shrink-0">🛡️</span>
              <div>
                <span className="font-bold text-chakra-900 block text-[11px]">
                  {isHindi ? 'मानव नियंत्रण' : 'Human In Control'}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {isHindi ? 'आपकी स्पष्ट स्वीकृति' : 'Explicit consent only'}
                </span>
              </div>
            </div>
          </div>

          {/* Safeguard Notice */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
            <span className="text-sm shrink-0">🔒</span>
            <span>
              {isHindi
                ? 'संकल्पना पूर्वावलोकन: हम कभी भी CAPTCHA या OTP को बायपास नहीं करेंगे। नागरिक हमेशा पूर्ण नियंत्रण में रहते हैं।'
                : 'Concept Preview: We will never bypass CAPTCHA, SMS OTPs, or submit without your explicit consent.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-border bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isHindi ? 'बाद में देखें (बंद करें)' : 'Remind Me Later'}
          </button>

          <button
            type="button"
            onClick={handleExploreVision}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <span>{isHindi ? 'भविष्य दृष्टि पेज देखें' : 'Explore Future Vision & Roadmap'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
