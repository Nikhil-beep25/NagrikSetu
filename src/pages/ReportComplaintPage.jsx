import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ComplaintForm from '../components/ComplaintForm';
import PageHero from '../components/PageHero';

export default function ReportComplaintPage() {
  const { language } = useLanguage();

  return (
    <div className="relative w-full bg-[#FFF9F1] min-h-[calc(100vh-140px)] overflow-hidden text-[#1D2939]">
      {/* Subtle Civic Infrastructure Watermark Background */}
      <div
        className="absolute inset-0 bg-watermark-infra opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      />

      {/* ==================================================
          SECTION 1: ILLUSTRATED PAGE HERO (LIGHT WARM IVORY)
         ================================================== */}
      <PageHero
        variant="dashboard"
        watermark="infra"
        badge={language === 'hi' ? 'नागरिक शिकायत समाधान' : 'Civic Grievance Assistant'}
        badgeIcon="🇮🇳"
        locationBadge={language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh'}
        title={language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Problem'}
        subtitle={
          language === 'hi'
            ? 'आपकी समस्या। आपकी आवाज़। AI-संचालित सहायता।'
            : 'Your Problem. Your Voice. AI-Powered Assistance.'
        }
        description={
          language === 'hi'
            ? 'अपनी समस्या हिन्दी, अंग्रेज़ी या हिंग्लिश में बताएं। NagrikSetu आपको एक संरचित शिकायत पत्र तैयार करने और उपयुक्त नगर निगम या सरकारी विभाग तक पहुँचाने में मदद करता है।'
            : 'Describe your problem in Hindi, English, or Hinglish. NagrikSetu helps you prepare a structured complaint and routes to the correct authority.'
        }
        primaryAction={{
          to: '/complaints',
          label: language === 'hi' ? 'मेरी शिकायतें देखें' : 'View My Complaints',
          icon: '📋',
        }}
      >
        {/* Right Citizen Illustration Card */}
        <div className="rounded-3xl border border-[#E3E8EF] bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-md max-w-sm w-full">
          <div className="flex items-center gap-4">
            {/* Illustrated Citizen with Smartphone Artwork */}
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-gradient-to-tr from-[#FFF9F1] via-[#EEF4FF] to-white border border-[#E3E8EF] flex items-center justify-center shrink-0 shadow-inner">
              <svg
                className="h-10 w-10 text-[#0B1F50]"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Person */}
                <circle cx="24" cy="14" r="6" className="stroke-[#0B1F50] fill-[#FFF9F1]" />
                <path d="M14 36c0-6 4.5-10 10-10s10 4 10 10" className="stroke-[#0B1F50]" />
                {/* Smartphone with AI beacon */}
                <rect x="30" y="24" width="10" height="18" rx="2" className="stroke-[#F47721] fill-white" />
                <line x1="33" y1="28" x2="37" y2="28" className="stroke-[#F47721]" />
                <circle cx="35" cy="38" r="1" className="fill-[#13865B]" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {language === 'hi' ? 'AI सहायक सक्रिय' : 'AI Assistant Ready'}
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#0B1F50] leading-tight">
                {language === 'hi' ? 'आसान नागरिक आवाज़' : 'Citizen-Centered Flow'}
              </h3>
              <p className="text-[11px] text-[#596579] font-medium leading-snug">
                {language === 'hi'
                  ? 'बोलें, लिखें या फोटो जोड़ें'
                  : 'Voice, text, or photo evidence'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>🛡️ {language === 'hi' ? 'सुरक्षित व स्थानीय' : 'Safe & Client-Side'}</span>
            <span className="text-[#F47721] font-black">NagrikSetu AI</span>
          </div>
        </div>
      </PageHero>

      {/* ==================================================
          SECTION 2 & 3: PROGRESS WORKFLOW & 2-COLUMN FORM
         ================================================== */}
      <section className="relative py-8 sm:py-12 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ComplaintForm />
        </div>
      </section>
    </div>
  );
}

