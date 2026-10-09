import { useLanguage } from '../i18n/LanguageContext';

const stepIcons = [
  // 01 — Describe Problem
  <svg key="1" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>,
  // 02 — AI Diagnostic Engine
  <svg key="2" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>,
  // 03 — Authority Allocation
  <svg key="3" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 10h0M15 10h0" />
  </svg>,
  // 04 — Public Redressal Tracking
  <svg key="4" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
];

export default function StepsSection() {
  const { language, t } = useLanguage();

  const steps = [
    { num: '01', title: t('howStep1Title'), desc: t('howStep1Desc') },
    { num: '02', title: t('howStep2Title'), desc: t('howStep2Desc') },
    { num: '03', title: t('howStep3Title'), desc: t('howStep3Desc') },
    { num: '04', title: t('howStep4Title'), desc: t('howStep4Desc') },
  ];

  return (
    <section className="py-14 sm:py-20 bg-surface-dim border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2">
            {language === 'hi' ? 'नागरिक प्रक्रिया' : 'Digital Citizen Workflow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-chakra-900 tracking-tight">
            {t('howTitle')}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {language === 'hi'
              ? '४ सरल चरणों में अपनी समस्या को अधिकृत समाधान तक पहुंचाएं'
              : 'Four structured steps from citizen report to verified public grievance'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover hover:border-chakra-300 transition-all duration-200"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-kesari-500 tracking-wider">
                  STEP {step.num}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-chakra-200 group-hover:bg-kesari-400 transition-colors" />
              </div>

              {/* Icon */}
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chakra-50 text-chakra-700 group-hover:bg-chakra-600 group-hover:text-white transition-all duration-200 shadow-xs">
                {stepIcons[i]}
              </div>

              {/* Content */}
              <h3 className="mt-4 text-base font-bold text-chakra-900">
                {step.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
