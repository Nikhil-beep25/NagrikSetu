import { useLanguage } from '../i18n/LanguageContext';

export default function ComplaintTimeline({ currentStatus = 'Under Review' }) {
  const { language } = useLanguage();

  const steps = [
    { id: 'created', label: language === 'hi' ? 'शिकायत दर्ज की गई' : 'Complaint Created' },
    { id: 'ai_analysis', label: language === 'hi' ? 'AI विश्लेषण पूर्ण' : 'AI Analysis Completed' },
    { id: 'prepared', label: language === 'hi' ? 'शिकायत प्रारूप तैयार' : 'Complaint Prepared' },
    { id: 'under_review', label: language === 'hi' ? 'समीक्षाधीन' : 'Under Review' },
    { id: 'resolved', label: language === 'hi' ? 'समाधानित' : 'Resolved' },
  ];

  const getStepState = (index) => {
    switch (currentStatus) {
      case 'Created':
        if (index === 0) return 'completed';
        if (index === 1) return 'active';
        return 'pending';
      case 'Prepared':
        if (index < 2) return 'completed';
        if (index === 2) return 'active';
        return 'pending';
      case 'Under Review':
        if (index < 3) return 'completed';
        if (index === 3) return 'active';
        return 'pending';
      case 'Resolved':
        return 'completed';
      default:
        if (index < 3) return 'completed';
        if (index === 3) return 'active';
        return 'pending';
    }
  };

  return (
    <div className="py-2">
      <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
        {steps.map((step, idx) => {
          const state = getStepState(idx);

          return (
            <div key={step.id} className="relative flex items-center gap-3.5 group">
              {/* Timeline marker */}
              <div className="absolute -left-[24px] sm:-left-[32px] flex items-center justify-center">
                {state === 'completed' && (
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-harit-500 text-white shadow-xs">
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                {state === 'active' && (
                  <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-chakra-600 text-white shadow-sm ring-4 ring-chakra-100">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white" />
                  </div>
                )}
                {state === 'pending' && (
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 border-border-input bg-white text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-border-input" />
                  </div>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    state === 'active'
                      ? 'text-chakra-800'
                      : state === 'completed'
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </p>
                {state === 'active' && (
                  <span className="inline-block mt-0.5 text-[11px] text-kesari-600 font-bold uppercase tracking-wider">
                    ● Current Stage
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
