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
};

export default function AnalysisResultCard({ result, onEdit, onContinue }) {
  const { language, t } = useLanguage();

  if (!result) return null;

  const { problem, category, location, priority } = result;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Symmetrical Diagnostic Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-dim px-6 py-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chakra-600 text-white shadow-xs shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-chakra-900 tracking-tight flex items-center gap-1.5">
              <span>🤖</span>
              <span>{language === 'hi' ? 'नागरिकसेतु AI समझ' : 'NAGRIKSETU AI UNDERSTANDING'}</span>
            </h3>
            <p className="text-[11px] text-text-muted">
              {language === 'hi' ? 'नागरिकसेतु AI द्वारा स्वचालित वर्गीकरण' : 'Automated Triage by NagrikSetu Engine'}
            </p>
          </div>
        </div>

        {/* AI Confidence Pill Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-harit-50 border border-harit-200 px-3 py-1 text-xs font-bold text-harit-700 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-harit-500 animate-pulse" />
          AI Verified: 98% Match
        </span>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Extracted Problem */}
        <div>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            {t('resultProblem')}
          </p>
          <div className="rounded-xl border border-border bg-surface-dim/70 p-4 text-sm font-medium text-text-primary leading-relaxed">
            {problem}
          </div>
        </div>

        {/* Category & Priority Symmetrical Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Chip */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t('resultCategory')}
            </p>
            <div className="flex items-center h-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-chakra-200 bg-chakra-50 px-3 py-1">
                <span className="text-chakra-700">
                  {categoryIcons[category] || null}
                </span>
                <span className="text-xs font-bold text-chakra-800 tracking-wide">{category}</span>
              </div>
            </div>
          </div>

          {/* Priority Pill */}
          <div className="rounded-xl border border-border bg-surface-dim/40 p-3.5">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
              {t('resultPriority')}
            </p>
            <div className="flex items-center h-8">
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
                {priority} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Geotagged Location */}
        <div>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            {t('resultLocation')}
          </p>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-text-secondary bg-surface-dim rounded-xl p-3.5 border border-border">
            <svg className="h-4 w-4 text-chakra-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Symmetrical Action Buttons with matching h-11 */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border bg-surface-dim px-6 py-4">
        {/* Outlined Secondary Button */}
        <button
          onClick={onEdit}
          className="flex-1 h-11 flex items-center justify-center rounded-lg border border-border-input bg-white px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 hover:border-chakra-300 transition-all duration-150 text-center"
        >
          {t('resultEdit')}
        </button>
        {/* Primary Action Button */}
        <button
          onClick={onContinue}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-bharat-coral hover:bg-[#d84315] px-4 text-sm font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-sm text-center"
        >
          <span>{t('resultContinue')}</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
