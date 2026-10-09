import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import StepsSection from '../components/StepsSection';

export default function HowItWorksPage() {
  const { language, t } = useLanguage();

  return (
    <div className="w-full">
      {/* Symmetrical Page Masthead */}
      <section className="bg-white border-b border-border py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-2.5 py-0.5 text-[10px] font-bold text-chakra-800 uppercase tracking-wider shadow-2xs">
                  {language === 'hi' ? 'नागरिक संदर्शिका' : 'Citizen Workflow Guide'}
                </span>
                <span className="text-xs text-text-muted">
                  Digital Grievance Lifecycle
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-chakra-900 tracking-tight">
                {t('howTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl">
                {language === 'hi'
                  ? 'नागरिक समस्या रिपोर्टिंग से आधिकारिक सरकारी पोर्टल तक ४ सरल चरणों में समाधान।'
                  : 'From natural citizen language to structured formal grievance and verified authority allocation in four simple steps.'}
              </p>
            </div>

            <Link
              to="/report"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bharat-coral hover:bg-[#d84315] px-6 py-2.5 text-sm font-bold text-white active:scale-[0.98] transition-all duration-150 shadow-sm self-start sm:self-auto shrink-0"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ {t('complaintsCreate')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Structured 4-Step Walkthrough */}
      <StepsSection />

      {/* Symmetrical Bottom Call to Action Banner */}
      <section className="bg-white border-t border-border py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-surface-dim p-8 sm:p-10 shadow-card">
            <h2 className="text-lg sm:text-xl font-bold text-chakra-900 mb-2">
              {language === 'hi' ? 'अपनी पहली नागरिक समस्या दर्ज करने के लिए तैयार हैं?' : 'Ready to Report a Civic Issue?'}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mb-6">
              {language === 'hi'
                ? 'बोलकर या लिखकर समस्या बताएं, AI जांच करेगा और संबंधित विभाग को निर्देशित करेगा।'
                : 'Experience voice and photo AI diagnostic triage. No manual bureaucracy, verified municipal departments.'}
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-full bg-bharat-coral hover:bg-[#d84315] px-7 py-3 text-sm font-bold text-white active:scale-[0.98] transition-all duration-150 shadow-md"
            >
              <span>+ {t('complaintsCreate')}</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
