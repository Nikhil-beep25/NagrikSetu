import { useLanguage } from '../i18n/LanguageContext';

/**
 * Category icon mapping — inline SVGs for each complaint type.
 */
const categoryIcons = {
  Garbage: (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  'Road/Pothole': (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  ),
  Streetlight: (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Water: (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  ),
  Drainage: (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M2 19c6.667-6 13.333 0 20-6" />
    </svg>
  ),
  Other: (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
};

export default function AnalysisResultCard({ result, onEdit, onContinue, onRetry }) {
  const { language, t } = useLanguage();

  if (!result) return null;

  const {
    problem,
    category,
    subcategory,
    location,
    priority,
    urgencyReason,
    duration,
    missingInformation,
    detectedLanguage,
    isFallback,
    fallbackNotice,

    fallbackReason,
    safetyNotice,
    modelUsed,
  } = result;

  const durationText = duration?.rawText
    || (duration?.value && duration?.unit ? `${duration.value} ${duration.unit}` : null);

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Symmetrical Diagnostic Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-dim px-6 py-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-xs shrink-0 ${
            isFallback ? 'bg-amber-600' : 'bg-chakra-600'
          }`}>
            {isFallback ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-chakra-900 tracking-tight flex items-center gap-1.5">
              <span>{isFallback ? '⚡' : '🤖'}</span>
              <span>{language === 'hi' ? 'नागरिकसेतु AI समझ' : 'NAGRIKSETU AI UNDERSTANDING'}</span>
            </h3>
            <p className="text-[11px] text-text-muted">
              {isFallback
                ? (language === 'hi' ? 'बैकअप नियम-आधारित इंजन द्वारा विश्लेषित' : 'Rule-Based Resilient Engine')
                : (language === 'hi' ? `Gemini AI (${modelUsed || '2.5-flash'}) द्वारा विश्लेषित` : `Automated Triage by Gemini AI (${modelUsed || '2.5-flash'})`)}
            </p>
          </div>
        </div>

        {/* Engine Status Badge */}
        {isFallback ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t('fallbackBadge')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-harit-50 border border-harit-200 px-3 py-1 text-xs font-bold text-harit-700 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-harit-500 animate-pulse" />
            {t('aiAssistedBadge')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Transparent Fallback Notification Banner */}
        {isFallback && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 flex items-start gap-3 text-xs text-amber-900 animate-fade-slide-up">
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            <div>
              <p className="font-bold">{fallbackNotice || t('fallbackNotice')}</p>
              {fallbackReason && (
                <p className="text-[11px] text-amber-700/90 mt-0.5">{fallbackReason}</p>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Prominent Emergency Safety Warning Alert */}
        {result.isEmergency ? (
          <div className="rounded-2xl border-2 border-red-500 bg-red-50/95 p-5 shadow-sm animate-fade-slide-up space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-red-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <h4 className="text-sm font-extrabold text-red-900 tracking-wide uppercase">
                  {t('emergencyCriticalAlert')}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 border border-red-300 rounded-full px-2.5 py-0.5">
                ⚡ {result.subcategory || 'Immediate Hazard'}
              </span>
            </div>

            {/* Direct Safety Advisory & Safe Distance Notice */}
            <div className="text-xs text-red-950 font-medium leading-relaxed bg-white/85 rounded-xl p-3.5 border border-red-200">
              <p className="font-bold text-red-900 mb-1">
                ⚠️ {result.safetyMessage || t('emergencyStayClear')}
              </p>
              {!result.isSupported && (
                <p className="text-[11px] text-red-800 mt-1.5 leading-normal">
                  ℹ️ {t('emergencyUnsupportedExplanation')}
                </p>
              )}
            </div>

            {/* Emergency Action Helplines (112 & 1912) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-xs transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>{t('emergencyCall112')}</span>
              </a>

              {(result.hazardType === 'electrical_hazard' || (result.subcategory && result.subcategory.toLowerCase().includes('electrical'))) ? (
                <a
                  href="tel:1912"
                  className="flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-xs transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span>{t('emergencyCall1912')}</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-red-100/80 border border-red-200 text-red-900 font-bold text-xs text-center">
                  <span>🚨 Urgent On-Site Hazard</span>
                </div>
              )}
            </div>

            {/* Non-dispatch Disclaimer */}
            <p className="text-[11px] text-red-700/90 italic text-center pt-0.5">
              ⚠️ {t('emergencyDisclaimer')}
            </p>
          </div>
        ) : priority === 'High' ? (
          <div className="rounded-xl border border-red-200 bg-red-50/90 p-3.5 flex items-start gap-3 text-xs text-red-900 animate-fade-slide-up">
            <span className="text-base shrink-0 mt-0.5">🚨</span>
            <div>
              <p className="font-bold text-red-800">{t('safetyNoticeTitle')}</p>
              <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                {safetyNotice || t('safetyNoticeText')}
              </p>
            </div>
          </div>
        ) : null}

        {/* Extracted Problem Statement */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              {t('resultProblem')}
            </p>
            {detectedLanguage && (
              <span className="text-[11px] font-semibold text-chakra-700 bg-chakra-50 border border-chakra-200 rounded-md px-2 py-0.5">
                {t('detectedLanguageLabel')}: {detectedLanguage}
              </span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-surface-dim/70 p-4 text-sm font-medium text-text-primary leading-relaxed">
            {problem}
          </div>
        </div>

        {/* Category & Priority Symmetrical Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Chip */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {t('resultCategory')}
              </p>
              {subcategory && (
                <span className="text-[10px] text-text-muted font-medium truncate max-w-[150px]">
                  {subcategory}
                </span>
              )}
            </div>
            <div className="flex items-center h-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-chakra-200 bg-chakra-50 px-3 py-1">
                <span className="text-chakra-700">
                  {categoryIcons[category] || null}
                </span>
                <span className="text-xs font-bold text-chakra-800 tracking-wide">{category}</span>
              </div>
            </div>
          </div>

          {/* Priority Pill & Rationale */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t('resultPriority')}
            </p>
            <div className="flex items-center justify-between h-8">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                  priority === 'High'
                    ? 'bg-kesari-50 text-kesari-700 border-kesari-200'
                    : 'bg-chakra-50 text-chakra-700 border-chakra-200'
                }`}
              >
                {priority === 'High' && (
                  <svg className="mr-1.5 h-3.5 w-3.5 text-kesari-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                  </svg>
                )}
                {priority === 'High' ? t('urgencyHigh') : t('urgencyNormal')}
              </span>
            </div>
            {urgencyReason && (
              <p className="text-[11px] text-text-muted mt-1 leading-snug">
                <span className="font-semibold text-text-secondary">{t('urgencyReasonLabel')}:</span> {urgencyReason}
              </p>
            )}
          </div>
        </div>

        {/* Duration & Location Symmetrical Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t('resultLocation')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-surface-dim rounded-lg p-2 border border-border">
              <svg className="h-4 w-4 text-chakra-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate">{location || (language === 'hi' ? 'स्थान दर्ज नहीं है' : 'Location not specified')}</span>
            </div>
          </div>

          {/* Extracted Duration */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t('durationLabel')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-surface-dim rounded-lg p-2 border border-border">
              <svg className="h-4 w-4 text-kesari-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="truncate">{durationText || (language === 'hi' ? 'अवधि दर्ज नहीं है' : 'No duration specified')}</span>
            </div>
          </div>
        </div>

        {/* Missing Information Prompt Card */}
        {missingInformation && missingInformation.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">💡</span>
              <p className="text-xs font-bold text-blue-900">
                {t('missingInfoTitle')}
              </p>
            </div>
            <p className="text-[11px] text-blue-800 mb-2 leading-relaxed">
              {t('missingInfoDesc')}
            </p>
            <ul className="space-y-1">
              {missingInformation.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-blue-950 font-medium">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border bg-surface-dim px-6 py-4">
        {/* Outlined Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 h-11 flex items-center justify-center rounded-lg border border-border-input bg-white px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 hover:border-chakra-300 transition-all duration-150 text-center"
        >
          {t('resultEdit')}
        </button>

        {/* Re-analyze with AI button (if onRetry supplied or in fallback mode) */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-lg border border-chakra-300 bg-chakra-50 px-4 text-sm font-bold text-chakra-800 hover:bg-chakra-100 transition-all duration-150 text-center"
          >
            <span>🔄</span>
            <span>{t('retryAnalysisBtn')}</span>
          </button>
        )}

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-bharat-coral hover:bg-[#d84315] px-4 text-sm font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-sm text-center"
        >
          <span>
            {result.isEmergency && !result.isSupported
              ? (language === 'hi' ? 'दस्तावेजीकरण रिकॉर्ड बनाएं' : 'Generate Record for Reference')
              : t('resultContinue')}
          </span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
