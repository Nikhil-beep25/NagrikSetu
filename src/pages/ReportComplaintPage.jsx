import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ComplaintForm from '../components/ComplaintForm';

export default function ReportComplaintPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-surface-canvas min-h-[calc(100vh-140px)]">
      {/* 1. Page Masthead */}
      <section className="bg-white border-b border-border py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs text-text-muted">
              <li>
                <Link to="/" className="hover:text-chakra-700 transition-colors font-medium">
                  {language === 'hi' ? 'होम' : 'Home'}
                </Link>
              </li>
              <li className="text-slate-400">/</li>
              <li className="font-semibold text-kesari-600" aria-current="page">
                {language === 'hi' ? 'शिकायत दर्ज करें' : 'Report Complaint'}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-0.5 text-xs font-bold text-kesari-700 uppercase tracking-wider">
                  {language === 'hi' ? 'नागरिक शिकायत दर्ज करें' : 'File Civic Grievance'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-text-muted">
                  <span>📍</span>
                  <span>{language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh'}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
                {language === 'hi' ? 'सार्वजनिक समस्या दर्ज करें' : 'Report a Civic Complaint'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-2xl">
                {language === 'hi'
                  ? 'अपनी समस्या बोलकर या लिखकर बताएं। NagrikSetu AI इसे औपचारिक पत्र में बदलकर उपयुक्त आगरा नगर निगम या संबंधित विभाग को सुझाएगा।'
                  : 'Describe your civic problem in plain language using text or voice. NagrikSetu AI structures the grievance, detects urgency, and routes to the correct municipal authority.'}
              </p>
            </div>

            {/* Quick Link to My Complaints */}
            <Link
              to="/complaints"
              className="inline-flex items-center gap-1.5 self-start md:self-auto rounded-full border border-border-input hover:border-chakra-400 bg-surface-dim hover:bg-white px-4 py-2 text-xs sm:text-sm font-bold text-chakra-800 transition-colors shadow-2xs"
            >
              <svg className="h-4 w-4 text-chakra-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>{language === 'hi' ? 'मेरी शिकायतें देखें' : 'View My Complaints'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Reporting Workspace */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ComplaintForm />
        </div>
      </section>

      {/* 3. Helpful Process Guide */}
      <section className="border-t border-border bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
              {language === 'hi' ? 'शिकायत दर्ज करने के बाद क्या होता है?' : 'How NagrikSetu Handles Your Report'}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              {language === 'hi'
                ? 'सरल ४ चरणों में नागरिक शिकायत समाधान'
                : 'Simple 4-step AI workflow bridging citizens and government'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl border border-border bg-surface-dim">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-kesari-100 text-kesari-700 font-bold text-xs">
                  1
                </span>
                <h3 className="text-xs font-bold text-chakra-900">
                  {language === 'hi' ? 'AI श्रेणी पहचान' : 'AI Classification'}
                </h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {language === 'hi'
                  ? 'कचरा, सड़क, स्ट्रीट लाइट, जल आपूर्ति या जलभराव की सटीक पहचान।'
                  : 'Automatically categorizes into Waste, Roads, Lighting, Water, or Drainage.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface-dim">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-chakra-100 text-chakra-800 font-bold text-xs">
                  2
                </span>
                <h3 className="text-xs font-bold text-chakra-900">
                  {language === 'hi' ? 'औपचारिक प्रारूप' : 'Formal Grievance'}
                </h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {language === 'hi'
                  ? 'नागरिक भाषा से अधिकारी स्तर की स्पष्ट और तथ्यात्मक शिकायत पत्र तैयार करता है।'
                  : 'Creates a concise, grounded description ready for government filing.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface-dim">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  3
                </span>
                <h3 className="text-xs font-bold text-chakra-900">
                  {language === 'hi' ? 'आधिकारिक विभाग लिंक' : 'Official Authority'}
                </h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {language === 'hi'
                  ? 'आगरा नगर निगम, जल संस्थान, या CPGRAMS का सीधा लिंक उपलब्ध कराता है।'
                  : 'Provides direct portal links to Agra Nagar Nigam, Jal Sansthan, or CPGRAMS.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
