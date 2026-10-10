import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import PageHero from '../components/PageHero';

export default function HowItWorksPage() {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const journeySteps = [
    {
      num: '01',
      title: isHindi ? 'अपनी समस्या बताएं' : 'Describe Your Problem',
      subtitle: isHindi ? 'सरल व स्वाभाविक भाषा में' : 'In Everyday Words',
      desc: isHindi
        ? 'हिंदी, अंग्रेजी या हिंग्लिश में बोलकर या लिखकर अपनी शिकायत दर्ज करें। किसी भी सरकारी शब्दावली या जटिल फॉर्म की आवश्यकता नहीं।'
        : 'Speak or type in everyday Hindi, English, or Hinglish. No government jargon, legal phrasing, or complex forms needed.',
      icon: '🗣️',
      badge: isHindi ? 'वॉइस व टेक्स्ट' : 'Voice & Text',
      color: 'border-t-4 border-[#F47721]',
      bg: 'bg-[#FFF9F1]',
    },
    {
      num: '02',
      title: isHindi ? 'AI समस्या समझता है' : 'AI Understands Your Issue',
      subtitle: isHindi ? 'सटीक डायग्नोस्टिक विश्लेषण' : 'Intelligent Triage',
      desc: isHindi
        ? 'नागरिकसेतु AI समस्या की श्रेणी (कचरा, सड़क, स्ट्रीट लाइट, जल, नाली), तात्कालिकता और स्थान का स्वतः विश्लेषण करता है।'
        : 'NagrikSetu AI extracts issue type, urgency level, priority score, and locality details to structure the grievance.',
      icon: '🧠',
      badge: isHindi ? 'NLP विश्लेषण' : 'NLP Analysis',
      color: 'border-t-4 border-[#0B1F50]',
      bg: 'bg-[#EEF4FF]',
    },
    {
      num: '03',
      title: isHindi ? 'सही विभाग की पहचान' : 'Find the Relevant Authority',
      subtitle: isHindi ? 'सटीक प्रशासनिक मैपिंग' : 'Authority Mapping',
      desc: isHindi
        ? 'सड़क, नाली, बिजली या जल की समस्या के अनुसार सही नगर निगम, जल संस्थान या विद्युत विभाग की पहचान की जाती है।'
        : 'Maps directly to Agra Nagar Nigam, Jal Sansthan, or power utility based on verified departmental jurisdiction.',
      icon: '🏛️',
      badge: isHindi ? 'विभागीय दिशा' : 'Authority Allocation',
      color: 'border-t-4 border-[#13865B]',
      bg: 'bg-[#EDF9F3]',
    },
    {
      num: '04',
      title: isHindi ? 'शिकायत तैयार करें व आगे बढ़ें' : 'Prepare and Continue Your Complaint',
      subtitle: isHindi ? 'औपचारिक पत्र व आधिकारिक पोर्टल' : 'Official Portal Guidance',
      desc: isHindi
        ? 'एक औपचारिक पत्र ड्राफ्ट तैयार होता है। आधिकारिक पोर्टल लिंक और शिकायत संदर्भ आईडी के साथ आगे बढ़ने का स्पष्ट मार्ग मिलता है।'
        : 'A formal grievance letter is structured. Citizens receive direct links to official grievance portals with reference draft.',
      icon: '📝',
      badge: isHindi ? 'नागरिक नियंत्रण' : 'Citizen-In-Control',
      color: 'border-t-4 border-[#7C3AED]',
      bg: 'bg-[#F5F0FF]',
    },
  ];

  const exampleStages = [
    {
      stage: isHindi ? 'नागरिक ने कहा' : 'Citizen Message',
      content: '"Mere gaon ki sadak par bada gaddha hai, accident ho sakta hai."',
      subtext: isHindi ? 'प्राकृतिक बोलचाल की भाषा' : 'Spoken Hindi / Hinglish input',
      icon: '🗣️',
      color: 'bg-white border-slate-200',
    },
    {
      stage: isHindi ? 'AI विश्लेषण' : 'AI Analysis',
      content: isHindi ? 'श्रेणी: सड़क व गड्ढे • तात्कालिकता: उच्च • स्थान: आगरा' : 'Category: Road/Pothole • Priority: High • Location: Agra',
      subtext: isHindi ? 'स्वतः एंटिटी निष्कर्षण' : 'NLP entity extraction completed',
      icon: '🧠',
      color: 'bg-[#EEF4FF] border-[#244A85]/30',
    },
    {
      stage: isHindi ? 'शिकायत पत्र निर्माण' : 'Formal Grievance Draft',
      content: isHindi ? 'विषय: सड़क पर खतरनाक गड्ढे की त्वरित मरम्मत हेतु' : 'Subject: Urgent repair of hazardous road pothole',
      subtext: isHindi ? 'मानक औपचारिक प्रशासनिक प्रारूप' : 'Concise factual administrative draft',
      icon: '📄',
      color: 'bg-[#FFF9F1] border-[#F47721]/30',
    },
    {
      stage: isHindi ? 'प्राधिकरण मार्गदर्शन' : 'Authority Guidance',
      content: isHindi ? 'संबंधित निकाय: लोक निर्माण विभाग / नगर निगम' : 'Authority: Agra Nagar Nigam PWD Cell',
      subtext: isHindi ? 'सत्यापित पोर्टल: CPGRAMS / नगर निगम' : 'Verified Portal: agranagarnigam.in',
      icon: '🏛️',
      color: 'bg-[#EDF9F3] border-[#13865B]/30',
    },
  ];

  return (
    <div className="relative w-full bg-[#FFF9F1] min-h-screen text-[#1D2939] overflow-hidden">
      {/* Subtle Civic Infrastructure Watermark */}
      <div
        className="absolute inset-0 bg-watermark-infra opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      />

      {/* =========================================================================
          SECTION 1: ILLUSTRATED HERO BANNER (PageHero)
          ========================================================================= */}
      <PageHero
        variant="civic"
        watermark="mandala"
        badge={isHindi ? 'नागरिक कार्यप्रवाह मार्गदर्शिका' : 'How NagrikSetu Works'}
        badgeIcon="🧭"
        title={isHindi ? 'नागरिकसेतु कैसे काम करता है' : 'How NagrikSetu Works'}
        subtitle={
          isHindi
            ? 'आपकी समस्या से सही मार्गदर्शन तक — कुछ ही सरल चरणों में।'
            : 'From Your Problem to the Right Guidance — In Just a Few Simple Steps.'
        }
        description={
          isHindi
            ? 'अपनी नागरिक समस्या को अपनी रोजमर्रा की भाषा में बताएं। हमारा AI शिकायत को संरचित करने, संबंधित सरकारी विभाग की पहचान करने और आपको आधिकारिक समाधान तक पहुंचाने में सहायता करता है।'
            : 'Describe your civic problem in your own words. Our AI helps structure your complaint, identify relevant authorities, and guide you toward official channels.'
        }
        primaryAction={{
          label: isHindi ? 'समस्या दर्ज करें' : 'Report a Problem',
          icon: '📝',
          to: '/report',
        }}
        secondaryAction={{
          label: isHindi ? 'सरकारी सेवाएं देखें' : 'Explore Government Services',
          icon: '🏛️',
          to: '/services',
        }}
      >
        {/* Right Hero Visual Card */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 text-white max-w-sm space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <span className="text-xs font-black uppercase text-[#F47721]">Citizen Flow</span>
            <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              100% Guided
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-[#F47721] text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>{isHindi ? 'बोलें या लिखें' : 'Speak or type naturally'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>{isHindi ? 'AI श्रेणी व प्राथमिकता जांच' : 'AI diagnostic analysis'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black">3</span>
              <span>{isHindi ? 'औपचारिक पत्र व विभाग' : 'Structured complaint draft'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-[#13865B] text-white flex items-center justify-center text-[10px] font-black">4</span>
              <span>{isHindi ? 'आधिकारिक पोर्टल लिंक' : 'Official channel guidance'}</span>
            </div>
          </div>
        </div>
      </PageHero>

      {/* =========================================================================
          SECTION 2: FOUR-STEP CITIZEN JOURNEY (Connected Visual Timeline)
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-[#E3E8EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-[#FFF9F1] border border-[#F47721]/30 px-3.5 py-1 text-xs font-black text-[#F47721] uppercase tracking-wider mb-2.5">
              {isHindi ? '४-चरणीय नागरिक यात्रा' : '4-Step Citizen Journey'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B1F50] tracking-tight">
              {isHindi ? 'समस्या से समाधान तक का स्पष्ट मार्ग' : 'From Problem to Action in Four Steps'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#596579]">
              {isHindi
                ? 'बिना किसी बिचौलिए या जटिल तकनीकी ज्ञान के अपने नागरिक अधिकारों का उपयोग करें।'
                : 'Navigate public grievances with dignity, transparency, and complete human control.'}
            </p>
          </div>

          {/* 4 Connected Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {journeySteps.map((step, idx) => (
              <div
                key={step.num}
                className={`rounded-2xl border border-[#E3E8EF] ${step.bg} ${step.color} p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#0B1F50] bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                      STEP {step.num}
                    </span>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0B1F50]">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#F47721] mt-0.5">
                    {step.subtitle}
                  </p>
                  <p className="mt-2.5 text-xs text-[#596579] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#0B1F50] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {step.badge}
                  </span>
                  {idx < 3 && (
                    <span className="hidden lg:inline text-xs font-black text-[#F47721]">→</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer regarding prototype tracking */}
          <div className="mt-10 p-4 rounded-xl bg-[#FFF9F1] border border-[#F47721]/30 max-w-3xl mx-auto text-center text-xs text-[#596579]">
            <p>
              <strong className="text-[#0B1F50]">
                {isHindi ? 'नागरिक सूचना:' : 'Citizen Notice:'}
              </strong>{' '}
              {isHindi
                ? 'नागरिकसेतु शिकायत तैयार करने और सही विभाग खोजने में सहायता करता है। स्थानीय डैशबोर्ड पर स्थिति ट्रैकिंग प्रोटोटाइप का हिस्सा है, यह आधिकारिक सरकारी ट्रैकिंग नहीं है।'
                : 'NagrikSetu prepares formal complaints and guides citizens to official portals. Internal tracking on this platform is a prototype aid and does not constitute official government status tracking.'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: REAL-LIFE EXAMPLE ("See NagrikSetu in Action")
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#E3E8EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-white border border-[#0B1F50]/20 px-3.5 py-1 text-xs font-black text-[#0B1F50] uppercase tracking-wider mb-2.5 shadow-2xs">
              {isHindi ? 'प्रत्यक्ष उदाहरण' : 'Real-Life Walkthrough'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B1F50] tracking-tight">
              {isHindi ? 'देखें नागरिकसेतु कैसे काम करता है' : 'See NagrikSetu in Action'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#596579]">
              {isHindi
                ? 'आम नागरिक की रोजमर्रा की भाषा से लेकर आधिकारिक पोर्टल तक का चरणबद्ध उदाहरण।'
                : 'From everyday spoken citizen frustration to an official municipal action plan.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {exampleStages.map((stg, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${stg.color}`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs border border-slate-100 shrink-0">
                    {stg.icon}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#F47721] tracking-wider block">
                      STAGE 0{i + 1} • {stg.stage}
                    </span>
                    <p className="text-sm sm:text-base font-black text-[#0B1F50] mt-0.5">
                      {stg.content}
                    </p>
                    <p className="text-[11px] text-[#596579] font-medium mt-0.5">
                      {stg.subtext}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-[11px] font-bold text-[#13865B] bg-white px-3 py-1 rounded-full border border-slate-200">
                    ✓ Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMING SOON AUTOMATION
          ========================================================================= */}
      <section className="relative py-16 sm:py-20 bg-[#0B1F50] text-white overflow-hidden">
        {/* Tricolor top strip */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-[#F47721]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#13865B]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#F47721]">
            <span>✨</span>
            <span>COMING SOON</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isHindi
              ? 'जल्द आ रहा है: AI जो प्रक्रिया को पूर्ण करने में सहायता करेगा'
              : 'Coming Soon: AI That Helps Complete the Process'}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
            {isHindi
              ? 'हमारा भविष्य का विजन समर्थित आधिकारिक सरकारी पोर्टलों पर फॉर्म भरने और नागरिक की पूर्व-सहमति से स्वचालित सबमिशन में सहायता करना है। हर कदम पर नागरिक का पूर्ण नियंत्रण रहेगा।'
              : 'Our vision is to help citizens navigate supported official portals, prepare forms, and complete authorized workflows with explicit citizen approval. Zero CAPTCHA or OTP bypass.'}
          </p>

          <div className="pt-3">
            <Link
              to="/future-vision"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-7 py-3 text-sm font-black shadow-lg hover:shadow-xl transition-all"
            >
              <span>🚀</span>
              <span>{isHindi ? 'पूर्ण भविष्य विजन देखें' : 'Explore Future Vision'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FINAL CTA
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-t border-[#E3E8EF] text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1F50]">
            {isHindi ? 'आपकी आवाज महत्वपूर्ण है।' : 'Your Voice Matters.'}
          </h2>
          <p className="text-xs sm:text-sm text-[#596579] max-w-md mx-auto">
            {isHindi
              ? 'नागरिकसेतु के साथ अपनी सार्वजनिक समस्या को सही विभाग तक पहुंचाने के लिए अभी शुरुआत करें।'
              : 'Begin reporting your civic grievance now with AI-assisted diagnosis and authority routing.'}
          </p>
          <div className="pt-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-8 py-3.5 text-sm font-black shadow-md hover:shadow-lg transition-all"
            >
              <span>📝</span>
              <span>{isHindi ? 'शिकायत दर्ज करना शुरू करें' : 'Start Reporting'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
