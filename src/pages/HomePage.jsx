import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ComplaintForm from '../components/ComplaintForm';

export default function HomePage() {
  const { language } = useLanguage();

  // Interactive sample selector for SECTION 6 — AI IN ACTION
  const [activeActionDemo, setActiveActionDemo] = useState('streetlight');

  // SECTION 4: 5 Civic Issue Categories
  const civicCategories = [
    {
      id: 'garbage',
      num: '01',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
      emoji: '🗑️',
      title: language === 'hi' ? 'कचरा' : 'Garbage',
      titleFull: language === 'hi' ? 'कचरा व स्वच्छता' : 'Garbage',
      desc: language === 'hi' ? 'कचरा न उठना व स्वच्छता संबंधी समस्याएं' : 'Missed waste collection and sanitation issues',
      image: '/assets/civic_garbage_issue.jpg',
      tag: language === 'hi' ? 'अपशिष्ट प्रबंधन' : 'Waste Management',
    },
    {
      id: 'roads',
      num: '02',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19L8 5" />
          <path d="M20 19L16 5" />
          <line x1="12" y1="7" x2="12" y2="9" />
          <line x1="12" y1="13" x2="12" y2="15" />
          <line x1="12" y1="19" x2="12" y2="21" />
        </svg>
      ),
      emoji: '🛣️',
      title: language === 'hi' ? 'सड़कें व गड्ढे' : 'Roads & Potholes',
      titleFull: language === 'hi' ? 'सड़कें व गड्ढे' : 'Roads & Potholes',
      desc: language === 'hi' ? 'क्षतिग्रस्त सड़कें और खतरनाक गड्ढे' : 'Damaged roads and dangerous potholes',
      image: '/assets/civic_road_pothole.jpg',
      tag: language === 'hi' ? 'लोक निर्माण' : 'Roads & PWD',
    },
    {
      id: 'streetlights',
      num: '03',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      ),
      emoji: '💡',
      title: language === 'hi' ? 'स्ट्रीट लाइट' : 'Streetlights',
      titleFull: language === 'hi' ? 'स्ट्रीट लाइट' : 'Streetlights',
      desc: language === 'hi' ? 'टूटी या बंद पड़ी स्ट्रीट लाइटें' : 'Broken or non-functional streetlights',
      image: '/assets/civic_streetlight.jpg',
      tag: language === 'hi' ? 'विद्युत विभाग' : 'Street Lighting',
    },
    {
      id: 'water',
      num: '04',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      emoji: '💧',
      title: language === 'hi' ? 'जल आपूर्ति' : 'Water Supply',
      titleFull: language === 'hi' ? 'जल आपूर्ति' : 'Water Supply',
      desc: language === 'hi' ? 'स्थानीय जल आपूर्ति संबंधी समस्याएं' : 'Local water supply problems',
      image: '/assets/civic_water_supply.jpg',
      tag: language === 'hi' ? 'जल बोर्ड' : 'Water Board',
    },
    {
      id: 'drainage',
      num: '05',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18" />
          <path d="M3 6h18" />
          <path d="M3 18h18" />
          <path d="M7 6v12" />
          <path d="M17 6v12" />
        </svg>
      ),
      emoji: '🚰',
      title: language === 'hi' ? 'नालियां' : 'Drainage',
      titleFull: language === 'hi' ? 'नालियां व जलभराव' : 'Drainage',
      desc: language === 'hi' ? 'अवरुद्ध या बहती नालियों की समस्या' : 'Blocked or overflowing drains',
      image: '/assets/civic_drainage.jpg',
      tag: language === 'hi' ? 'जल निकासी' : 'Drainage & Sewage',
    },
  ];

  // SECTION 5: How NagrikSetu Works (4 steps)
  const howSteps = [
    {
      step: '01',
      label: language === 'hi' ? 'बताएं' : 'Tell Us',
      desc: language === 'hi' ? 'अपनी भाषा में अपनी नागरिक समस्या बताएं।' : 'Describe your civic problem in your own words.',
      subtext: language === 'hi' ? 'हिंदी, अंग्रेजी या हिंग्लिश में बोलें या लिखें।' : 'Speak or type naturally without government jargon.',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      step: '02',
      label: language === 'hi' ? 'AI समझ' : 'AI Understands',
      desc: language === 'hi' ? 'नागरिकसेतु समस्या, श्रेणी व प्राथमिकता की पहचान करता है।' : 'NagrikSetu identifies the issue, category and priority.',
      subtext: language === 'hi' ? 'स्वचालित विश्लेषण और जरूरी विवरण निष्कर्षण।' : 'Automatic NLP entity extraction & priority scoring.',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      step: '03',
      label: language === 'hi' ? 'सही विभाग की पहचान' : 'Find the Right Authority',
      desc: language === 'hi' ? 'संबंधित नागरिक प्राधिकरण की दिशा में मार्गदर्शन प्राप्त करें।' : 'Get guidance toward the relevant civic authority.',
      subtext: language === 'hi' ? 'नगर निगम, जल बोर्ड या विद्युत विभाग की मैपिंग।' : 'Direct mapping to the appropriate municipal department.',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      step: '04',
      label: language === 'hi' ? 'ट्रैक करें' : 'Track',
      desc: language === 'hi' ? 'अपनी शिकायत यात्रा पर नज़र रखें।' : 'Follow your complaint journey.',
      subtext: language === 'hi' ? 'शिकायत ड्राफ्ट व संदर्भ आईडी सुरक्षित रखें।' : 'Reference ID and formal complaint draft preserved.',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  // SECTION 6: AI In Action demonstration presets
  const actionDemos = {
    streetlight: {
      citizenText: language === 'hi' ? 'मेरे एरिया की स्ट्रीट लाइट काम नहीं कर रही है।' : 'Mere area ki street light kaam nahi kar rahi hai.',
      problem: language === 'hi' ? 'स्ट्रीट लाइट बंद / खराब' : 'Streetlight not working',
      category: language === 'hi' ? 'स्ट्रीट लाइट' : 'Streetlight',
      priority: language === 'hi' ? 'सामान्य' : 'Normal',
      location: language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh',
      nextStep: language === 'hi' ? 'स्थानीय नगर निकाय को निर्देशित करें' : 'Route to Local Municipal Authority',
    },
    garbage: {
      citizenText: language === 'hi' ? 'हमारे मोहल्ले में ३ दिन से कचरा नहीं उठाया गया।' : 'Mere area mein 3 din se kachra nahi uthaya gaya.',
      problem: language === 'hi' ? 'कचरा संग्रहण में देरी' : 'Missed garbage collection for 3 days',
      category: language === 'hi' ? 'कचरा प्रबंधन' : 'Waste Management',
      priority: language === 'hi' ? 'सामान्य' : 'Normal',
      location: language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh',
      nextStep: language === 'hi' ? 'स्थानीय नगर निकाय स्वच्छता विभाग को निर्देशित करें' : 'Route to Local Municipal Authority',
    },
    drainage: {
      citizenText: language === 'hi' ? 'नाली ब्लॉक होने की वजह से पानी रोड पर जमा हो रहा है।' : 'Nali block hone ki wajah se paani road par jama ho raha hai.',
      problem: language === 'hi' ? 'नाली जाम व जलभराव' : 'Blocked drain & sewage overflow on street',
      category: language === 'hi' ? 'नालियां व जल निकासी' : 'Drainage',
      priority: language === 'hi' ? 'उच्च (सड़क पर जलभराव)' : 'High',
      location: language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh',
      nextStep: language === 'hi' ? 'जल निकासी व सीवरेज सेल को अग्रसारित करें' : 'Assign to Municipal Drainage Cell',
    },
  };

  const currentDemo = actionDemos[activeActionDemo] || actionDemos.streetlight;

  // SECTION 7: Why NagrikSetu (4 feature cards)
  const whyFeatures = [
    {
      title: language === 'hi' ? 'AI-सहायित' : 'AI-Assisted',
      desc: language === 'hi'
        ? 'सरकारी तकनीकी शब्दावली जाने बिना भी नागरिक समस्याओं को समझें।'
        : 'Understand civic problems without knowing government terminology.',
      icon: (
        <svg className="h-6 w-6 text-chakra-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'सरल व सहज' : 'Simple',
      desc: language === 'hi'
        ? 'जटिल श्रेणियों में भटकने के बजाय सामान्य बोलचाल में समस्या बताएं।'
        : 'Describe the problem naturally instead of navigating complicated categories.',
      icon: (
        <svg className="h-6 w-6 text-kesari-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'बहुभाषी' : 'Multilingual',
      desc: language === 'hi'
        ? 'अंग्रेजी, हिंदी और हिंग्लिश भाषा में सहज सहायता।'
        : 'English, Hindi and Hinglish support.',
      icon: (
        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8l6 6" />
          <path d="M4 14l6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="M22 22l-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      ),
    },
    {
      title: language === 'hi' ? 'नागरिक-प्रथम' : 'Citizen-First',
      desc: language === 'hi'
        ? 'शिकायत जमा करने से पहले समीक्षा और पुष्टि करने की पूर्ण स्वतंत्रता।'
        : 'Review and confirm before moving toward submission.',
      icon: (
        <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
    },
  ];

  // SECTION 8: Prototype Capabilities (4 cards — NO fake stats)
  const capabilityCards = [
    {
      metric: '5',
      label: language === 'hi' ? 'नागरिक शिकायत श्रेणियां' : 'Civic complaint categories',
      subtext: language === 'hi' ? 'कचरा, सड़क, स्ट्रीट लाइट, जल व नाली' : 'Garbage, Roads, Lighting, Water, Drainage',
      badge: 'Civic Scope',
    },
    {
      metric: '3',
      label: language === 'hi' ? 'भाषा माध्यम' : 'Language modes',
      subtext: language === 'hi' ? 'अंग्रेजी, हिंदी व बोलचाल की हिंग्लिश' : 'English, Hindi & Hinglish with voice support',
      badge: 'Multilingual',
    },
    {
      metric: 'AI',
      label: language === 'hi' ? 'शिकायत की समझ' : 'Complaint understanding',
      subtext: language === 'hi' ? 'समस्या पहचान, श्रेणी निर्धारण व प्राथमिकीकरण' : 'Issue classification, priority & entity extraction',
      badge: 'NLP Triage',
    },
    {
      metric: 'Guided',
      label: language === 'hi' ? 'शिकायत प्रक्रिया' : 'Complaint journey',
      subtext: language === 'hi' ? 'औपचारिक पत्र ड्राफ्ट और विभाग मार्गदर्शन' : 'Structured complaint draft and official portal advice',
      badge: 'Citizen-First',
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* ================================================================
          SECTION 3 — HERO
          Two-column layout on desktop: 50% content, 50% AI visual
          ================================================================ */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#f6f9ff] via-white to-[#f6f9ff] py-12 sm:py-16 lg:py-20">
        {/* Subtle Ambient Background */}
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-kesari-400/5 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-24 h-96 w-96 rounded-full bg-chakra-600/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* HERO LEFT SIDE (50% on desktop: 6 columns) */}
            <div className="space-y-6 lg:col-span-6">
              {/* Small Badge: "AI-Powered Civic Assistance" + "Agra, UP" */}
              <div className="inline-flex items-center gap-2 rounded-full bg-chakra-50 border border-chakra-200 px-3.5 py-1 text-xs font-bold text-chakra-800 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-kesari-500 animate-pulse" />
                <span>
                  {language === 'hi' ? 'AI-संचालित नागरिक सहायता' : 'AI-Powered Civic Assistance'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-chakra-700">📍 {language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh'}</span>
              </div>

              {/* Main Heading & Second Line */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-chakra-900 tracking-tight leading-[1.15]">
                  {language === 'hi' ? 'अपनी नागरिक समस्या बताएं।' : 'Tell us your civic problem.'}
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-kesari-500 tracking-tight leading-[1.2]">
                  {language === 'hi'
                    ? 'हम आपको सही अगला कदम खोजने में मदद करेंगे।'
                    : "We'll help you find the right next step."}
                </p>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed font-normal max-w-xl">
                {language === 'hi'
                  ? 'अपनी समस्या अंग्रेजी, हिंदी या हिंग्लिश में बताएं। नागरिकसेतु समस्या को समझने, आपकी शिकायत तैयार करने और संबंधित नागरिक प्राधिकरण की पहचान करने में मदद करता है।'
                  : 'Describe your problem in English, Hindi, or Hinglish. NagrikSetu helps understand the issue, prepare your complaint, and identify the relevant civic authority.'}
              </p>

              {/* Action Buttons: Primary & Secondary CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#report-workspace"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white px-7 py-3.5 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>{language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Issue'}</span>
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-dim hover:bg-white border border-border-input text-chakra-900 px-6 py-3.5 text-sm sm:text-base font-bold transition-all shadow-2xs hover:border-chakra-400"
                >
                  <span>{language === 'hi' ? 'प्रक्रिया' : 'How It Works'}</span>
                  <svg className="h-4 w-4 text-chakra-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>

                <Link
                  to="/assistant"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chakra-800 hover:bg-chakra-900 text-white px-6 py-3.5 text-sm sm:text-base font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <span>🤖</span>
                  <span>{language === 'hi' ? 'AI सहायक से पूछें' : 'Ask AI Assistant'}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-text-muted font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'बिना जटिल नौकरशाही के' : 'No government jargon required'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'वॉइस व टेक्स्ट इनपुट' : 'Voice and text input'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'नागरिक प्रोटोटाइप' : 'Citizen-first prototype'}</span>
                </span>
              </div>
            </div>

            {/* HERO RIGHT SIDE (50% on desktop: 6 columns) */}
            {/* Large interactive-looking AI civic analysis card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-border bg-white shadow-elevated overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* 3px Tricolor Accent Ribbon */}
                <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

                {/* Card Header: Title "NagrikSetu AI" */}
                <div className="flex items-center justify-between border-b border-border bg-surface-dim px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg overflow-hidden bg-white border border-border p-0.5 shadow-2xs">
                      <img
                        src="/assets/nagriksetu_logo.jpg"
                        alt="NagrikSetu"
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-chakra-900">
                      NagrikSetu AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>AI Triage Active</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* ========================================================
                      STAGE 1: YOUR COMPLAINT
                      ======================================================== */}
                  <div className="rounded-xl border border-border bg-[#fcfcfd] p-3.5 sm:p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-chakra-800 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-kesari-500" />
                        YOUR COMPLAINT
                      </span>
                      <span className="text-[10px] font-bold text-kesari-700 bg-kesari-50 px-2 py-0.5 rounded border border-kesari-200">
                        Voice / Spoken Hindi
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-chakra-900 leading-snug">
                      “Mere area mein 3 din se kachra nahi uthaya.”
                    </p>
                    <p className="mt-1 text-xs text-text-muted italic">
                      (“Garbage has not been collected in my area for 3 days.”)
                    </p>
                  </div>

                  {/* DOWN ARROW CONNECTOR 1 -> 2 */}
                  <div className="flex items-center justify-center gap-2 py-0.5 text-chakra-600">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-chakra-200 to-transparent" />
                    <div className="h-6 w-6 rounded-full bg-chakra-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      ↓
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-chakra-200 to-transparent" />
                  </div>

                  {/* ========================================================
                      STAGE 2: 🤖 NAGRIKSETU AI UNDERSTANDING
                      ======================================================== */}
                  <div className="rounded-xl border border-chakra-200 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-chakra-900 flex items-center gap-1.5">
                        <span>🤖</span>
                        <span>NAGRIKSETU AI UNDERSTANDING</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Confidence 98%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Category: Garbage */}
                      <div className="p-2 rounded-lg bg-surface-dim border border-border">
                        <span className="text-[10px] font-bold text-text-muted uppercase block">
                          Category
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-chakra-900">
                          <span>🗑️</span>
                          <span className="truncate">Garbage</span>
                        </div>
                      </div>

                      {/* Problem: Waste not collected */}
                      <div className="p-2 rounded-lg bg-surface-dim border border-border">
                        <span className="text-[10px] font-bold text-text-muted uppercase block">
                          Problem
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-chakra-900">
                          <span className="truncate">Waste not collected</span>
                        </div>
                      </div>

                      {/* Priority: Normal */}
                      <div className="p-2 rounded-lg bg-surface-dim border border-border">
                        <span className="text-[10px] font-bold text-text-muted uppercase block">
                          Priority
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-amber-700">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Normal</span>
                        </div>
                      </div>

                      {/* Location: Agra, Uttar Pradesh */}
                      <div className="p-2 rounded-lg bg-surface-dim border border-border">
                        <span className="text-[10px] font-bold text-text-muted uppercase block">
                          Location
                        </span>
                        <div className="flex items-center gap-1 mt-0.5 font-bold text-chakra-900">
                          <span>📍</span>
                          <span className="truncate" title="Agra, Uttar Pradesh">Agra, Uttar Pradesh</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DOWN ARROW CONNECTOR 2 -> 3 */}
                  <div className="flex items-center justify-center gap-2 py-0.5 text-kesari-600">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kesari-200 to-transparent" />
                    <div className="h-6 w-6 rounded-full bg-kesari-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      ↓
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kesari-200 to-transparent" />
                  </div>

                  {/* ========================================================
                      STAGE 3: 📝 GENERATED COMPLAINT
                      ======================================================== */}
                  <div className="rounded-xl border-2 border-kesari-300 bg-gradient-to-b from-[#fffcfb] to-white p-3.5 sm:p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-kesari-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-chakra-900 flex items-center gap-1.5">
                        <span>📝</span>
                        <span>GENERATED COMPLAINT</span>
                      </span>
                      <span className="text-[10px] font-bold text-kesari-700 bg-kesari-50 px-2 py-0.5 rounded border border-kesari-200">
                        Formal Draft
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Subject:
                        </span>
                        <p className="font-bold text-chakra-900 text-sm mt-0.5">
                          Garbage collection issue
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Description:
                        </span>
                        <p className="font-medium text-text-secondary leading-relaxed text-[11px] bg-surface-dim p-2.5 rounded-lg border border-border">
                          Garbage has remained uncollected in the neighborhood for 3 days, causing serious sanitation concerns and bad odor. Kindly arrange prompt waste clearance.
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS: [Edit] [Confirm Complaint] */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <a
                        href="#report-workspace"
                        className="flex-1 text-center py-2 px-3 rounded-lg border border-border-input bg-white hover:bg-chakra-50 text-xs font-bold text-chakra-900 transition-colors shadow-2xs hover:border-chakra-400"
                      >
                        [Edit]
                      </a>

                      <a
                        href="#report-workspace"
                        className="flex-1 text-center py-2 px-3 rounded-lg bg-kesari-500 hover:bg-kesari-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>[Confirm Complaint]</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — CIVIC ISSUE CATEGORIES
          Heading: "What can you report?"
          Subheading: "Start with common problems affecting your neighborhood."
          5 Cards: 01 Garbage, 02 Roads & Potholes, 03 Streetlights, 04 Water Supply, 05 Drainage
          ================================================================ */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2.5 shadow-2xs">
              {language === 'hi' ? 'सामान्य नागरिक समस्याएं' : 'Common Civic Issues'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
              {language === 'hi' ? 'आप क्या शिकायत दर्ज कर सकते हैं?' : 'What can you report?'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {language === 'hi'
                ? 'अपने मोहल्ले को प्रभावित करने वाली सामान्य समस्याओं से शुरुआत करें।'
                : 'Start with common problems affecting your neighborhood.'}
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {civicCategories.map((cat) => (
              <a
                key={cat.id}
                href="#report-workspace"
                className="group flex flex-col rounded-2xl border border-border bg-white shadow-card hover:shadow-card-hover hover:border-chakra-400 transition-all duration-200 overflow-hidden"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.titleFull}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Number Badge & Category Emoji */}
                  <div className="absolute top-2.5 left-2.5 rounded-md bg-black/40 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white font-mono">
                    {cat.num}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 shadow-xs border border-white/50">
                    <span className="text-sm">{cat.emoji}</span>
                    <span className="text-[11px] font-bold text-chakra-900">{cat.title}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-kesari-600 block">
                      {cat.tag}
                    </span>
                    <h3 className="text-sm font-bold text-chakra-900 mt-0.5 group-hover:text-kesari-600 transition-colors">
                      {cat.titleFull}
                    </h3>
                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-chakra-700 group-hover:text-kesari-600 transition-colors">
                    <span>{language === 'hi' ? 'रिपोर्ट करें' : 'Report Issue'}</span>
                    <svg className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — HOW NAGRIKSETU WORKS
          Heading: "From a problem to the right next step."
          Four steps:
          01 — Tell Us
          02 — AI Understands
          03 — Find the Right Authority
          04 — Track
          Horizontal flow on desktop, stack vertically on mobile.
          ================================================================ */}
      <section id="how-it-works" className="py-14 sm:py-20 bg-surface-dim border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'नागरिक समाधान प्रक्रिया' : 'Simple 4-Step Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
              {language === 'hi'
                ? 'समस्या से सही अगले कदम तक।'
                : 'From a problem to the right next step.'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {language === 'hi'
                ? 'नागरिकसेतु कैसे काम करता है'
                : 'How NagrikSetu guides your grievance from voice or text to action.'}
            </p>
          </div>

          {/* Desktop: Horizontal flow with connecting lines/arrows */}
          <div className="hidden lg:grid grid-cols-4 gap-6 relative">
            {howSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-kesari-500 tracking-wider">
                      STEP {step.step}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-chakra-50 text-chakra-700 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-chakra-900">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-chakra-800 leading-snug">
                    “{step.desc}”
                  </p>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed font-normal">
                    {step.subtext}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Guided Journey</span>
                </div>

                {/* Connecting arrow for steps 1, 2, 3 on desktop */}
                {idx < 3 && (
                  <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-7 w-7 rounded-full bg-white border border-border items-center justify-center shadow-xs text-chakra-600">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile / Tablet: Stack vertically with down connecting lines/arrows */}
          <div className="flex flex-col lg:hidden space-y-4">
            {howSteps.map((step, idx) => (
              <div key={step.step} className="space-y-3">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-kesari-500 tracking-wider">
                      STEP {step.step}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-chakra-50 text-chakra-700 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-chakra-900">
                    {step.label}
                  </h3>
                  <p className="mt-1.5 text-xs font-semibold text-chakra-800 leading-snug">
                    “{step.desc}”
                  </p>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                    {step.subtext}
                  </p>
                </div>

                {/* Down connector arrow */}
                {idx < 3 && (
                  <div className="flex justify-center text-chakra-400">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 — AI IN ACTION
          Heading: "See how NagrikSetu understands your complaint."
          LEFT: Citizen message card: "Mere area mein street light kaam nahi kar rahi hai."
          RIGHT: AI analysis card:
            Problem: Streetlight not working
            Category: Streetlight
            Priority: Normal
            Location: Provided by citizen
            Next Step: Identify relevant civic authority
          Visual connection between the two cards.
          ================================================================ */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'नागरिकसेतु AI का प्रत्यक्ष प्रदर्शन' : 'AI In Action'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
              {language === 'hi'
                ? 'देखें नागरिकसेतु आपकी शिकायत को कैसे समझता है।'
                : 'See how NagrikSetu understands your complaint.'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
              {language === 'hi'
                ? 'बोलचाल की भाषा से लेकर सटीक विश्लेषण और अगले कदम तक का सीधा दृश्य।'
                : 'Everyday spoken language transformed into structured civic analysis and clear next steps.'}
            </p>

            {/* Quick interactive topic pills to test different problems */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setActiveActionDemo('streetlight')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeActionDemo === 'streetlight'
                    ? 'bg-chakra-900 text-white shadow-xs'
                    : 'bg-surface-dim text-chakra-800 border border-border hover:border-chakra-400'
                }`}
              >
                💡 Streetlight Demo (Default)
              </button>
              <button
                type="button"
                onClick={() => setActiveActionDemo('garbage')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeActionDemo === 'garbage'
                    ? 'bg-chakra-900 text-white shadow-xs'
                    : 'bg-surface-dim text-chakra-800 border border-border hover:border-chakra-400'
                }`}
              >
                🗑️ Waste Demo
              </button>
              <button
                type="button"
                onClick={() => setActiveActionDemo('drainage')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeActionDemo === 'drainage'
                    ? 'bg-chakra-900 text-white shadow-xs'
                    : 'bg-surface-dim text-chakra-800 border border-border hover:border-chakra-400'
                }`}
              >
                🚰 Drainage Demo
              </button>
            </div>
          </div>

          {/* AI in Action Demonstration Container */}
          <div className="rounded-2xl border border-chakra-200 bg-gradient-to-b from-[#f8fafc] to-[#eef4fb] p-6 sm:p-8 lg:p-10 shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8">
              
              {/* LEFT: Citizen Message Card (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-chakra-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-kesari-500" />
                    Citizen Message Card
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted bg-surface-dim px-2 py-0.5 rounded border border-border">
                    Input: Voice / Text
                  </span>
                </div>

                <div className="rounded-xl bg-[#fbfbf9] border border-border p-4">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Spoken / Typed Text:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-chakra-900 leading-snug">
                    “{currentDemo.citizenText}”
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-text-secondary pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-muted">Language:</span>
                    <span className="font-bold text-chakra-900">Hindi / Hinglish / English</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-muted">Citizen Modality:</span>
                    <span className="font-bold text-chakra-900">Unstructured voice or typing</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Received by NagrikSetu
                  </span>
                </div>
              </div>

              {/* CENTER: Visual Connection Between The Two Cards (2 cols on desktop) */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
                {/* Desktop horizontal connection */}
                <div className="hidden lg:flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-chakra-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-chakra-700 text-center">
                    AI Triage
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    Entity Map
                  </span>
                </div>

                {/* Mobile vertical connection */}
                <div className="flex lg:hidden items-center justify-center gap-2 text-chakra-600 py-1">
                  <div className="h-8 w-8 rounded-full bg-chakra-600 text-white flex items-center justify-center shadow-xs">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-chakra-700">Transforms into Structured Civic Triage</span>
                </div>
              </div>

              {/* RIGHT: AI Analysis Card (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border-2 border-chakra-500 bg-white p-6 shadow-elevated space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-black uppercase tracking-wider text-chakra-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI Analysis Card
                  </span>
                  <span className="text-[10px] font-bold text-kesari-700 bg-kesari-50 px-2 py-0.5 rounded border border-kesari-200">
                    Triage Complete
                  </span>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  {/* Problem */}
                  <div className="rounded-lg bg-surface-dim border border-border p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Problem:</span>
                    <span className="font-bold text-chakra-900 mt-0.5">{currentDemo.problem}</span>
                  </div>

                  {/* Category */}
                  <div className="rounded-lg bg-surface-dim border border-border p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Category:</span>
                    <span className="font-bold text-chakra-900 mt-0.5">{currentDemo.category}</span>
                  </div>

                  {/* Priority */}
                  <div className="rounded-lg bg-surface-dim border border-border p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Priority:</span>
                    <span className="font-bold text-amber-700 mt-0.5">{currentDemo.priority}</span>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg bg-surface-dim border border-border p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Location:</span>
                    <span className="font-bold text-chakra-900 mt-0.5">{currentDemo.location}</span>
                  </div>

                  {/* Next Step */}
                  <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Next Step:</span>
                    <span className="font-bold text-emerald-900 mt-0.5">{currentDemo.nextStep}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#report-workspace"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-kesari-600 hover:text-kesari-700 underline"
                  >
                    <span>Test This Pipeline in Live Workspace</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7 — WHY NAGRIKSETU
          Create four simple feature cards:
          - AI-Assisted: Understand civic problems without knowing government terminology.
          - Simple: Describe the problem naturally instead of navigating complicated categories.
          - Multilingual: English, Hindi and Hinglish support.
          - Citizen-First: Review and confirm before moving toward submission.
          ================================================================ */}
      <section className="py-14 sm:py-20 bg-surface-dim border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'नागरिकसेतु क्यों चुनें' : 'Why NagrikSetu'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
              {language === 'hi'
                ? 'नागरिकों के लिए बनाया गया सरल सेतु'
                : 'Built for Citizens, Powered by Intelligence'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {language === 'hi'
                ? 'आम बोलचाल से लेकर औपचारिक शिकायत तक का सबसे सीधा मार्ग।'
                : 'Removing friction from neighborhood problem reporting.'}
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyFeatures.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-surface-dim border border-border flex items-center justify-center mb-4 shadow-2xs">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-chakra-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 text-[10px] font-mono text-text-muted">
                  FEATURE 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 8 — PROTOTYPE CAPABILITIES
          Label this section: "Prototype Capabilities"
          Cards:
          5 - Civic complaint categories
          3 - Language modes
          AI - Complaint understanding
          Guided - Complaint journey
          Do NOT show fake statistics.
          ================================================================ */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'प्रोटोटाइप क्षमताएं' : 'System Scope'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
              {language === 'hi' ? 'प्रोटोटाइप क्षमताएं' : 'Prototype Capabilities'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted max-w-lg mx-auto">
              {language === 'hi'
                ? 'यह प्रोटोटाइप वास्तविक नागरिक समस्याओं के वर्गीकरण और सही विभाग के चयन की तकनीक प्रदर्शित करता है।'
                : 'A transparent overview of what this AI prototype handles without fabricated metrics.'}
            </p>
          </div>

          {/* 4 Clean Capability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilityCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">0{idx + 1}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-chakra-900 tracking-tight">
                    {item.metric}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-chakra-900">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                    {item.subtext}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Functional Prototype</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          INTERACTIVE PROTOTYPE WORKSPACE
          Users clicking "Report a Civic Issue" can immediately test the pipeline!
          ================================================================ */}
      <section id="report-workspace" className="py-14 sm:py-20 bg-surface-dim border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'लाइव प्रोटोटाइप टेस्ट करें' : 'Try the Prototype'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {language === 'hi' ? 'अपनी सार्वजनिक समस्या दर्ज करें' : 'Report Your Civic Problem'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {language === 'hi'
                ? 'बोलकर या लिखकर बताएं, AI जांच करेगा, औपचारिक पत्र बनाएगा और संबंधित विभाग सुझाएगा।'
                : 'Speak with voice or type in plain language. Test how NagrikSetu triages your grievance in real time.'}
            </p>
          </div>

          {/* Centered Complaint Form */}
          <div className="mx-auto max-w-4xl">
            <ComplaintForm />
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 9 — FINAL CTA
          Heading: "Have a civic problem?"
          Supporting text: "Tell NagrikSetu what happened. We'll help you understand the next step."
          Primary button: "Report a Civic Issue"
          Secondary button: "Learn How It Works"
          Subtle navy / orange visual treatment.
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#001c38] text-white py-16 sm:py-20">
        {/* Subtle Decorative Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-kesari-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="tricolor-ribbon absolute top-0 left-0 w-full" aria-hidden="true" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-12 w-12 rounded-xl bg-white p-0.5 shadow-md overflow-hidden shrink-0">
              <img
                src="/assets/nagriksetu_logo.jpg"
                alt="NagrikSetu Logo"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold text-kesari-300 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-kesari-400 animate-pulse" />
              NagrikSetu AI
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {language === 'hi' ? 'क्या कोई नागरिक समस्या है?' : 'Have a civic problem?'}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            {language === 'hi'
              ? 'नागरिकसेतु को अपनी समस्या बताएं। हम आपको सही विभाग और अगला कदम बताएंगे।'
              : "Tell NagrikSetu what happened. We'll help you understand the next step."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#report-workspace"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white px-8 py-3.5 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Issue'}</span>
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 text-sm sm:text-base font-bold transition-all shadow-xs"
            >
              <span>{language === 'hi' ? 'प्रक्रिया जानें' : 'Learn How It Works'}</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span>• English, Hindi & Hinglish</span>
            <span>• 5 Civic Categories</span>
            <span>• Prototype Guidance</span>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Citizen Helpline Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/9114472"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-[#25D366] text-white p-3.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="WhatsApp Citizen Helpline"
          title="Chat on WhatsApp Citizen Helpline: 14472"
        >
          <svg className="h-7 w-7 fill-white" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.071.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs pr-1">
            Citizen Helpline 14472
          </span>
        </a>
      </div>
    </div>
  );
}
