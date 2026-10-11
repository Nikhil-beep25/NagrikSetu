import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ComplaintForm from '../components/ComplaintForm';
import AutomationVisionDemo from '../components/AutomationVisionDemo';
import HeroSlider from '../components/HeroSlider';
import BuiltForBharatSection from '../components/BuiltForBharatSection';

export default function HomePage() {
  const { language } = useLanguage();

  // Interactive sample selector for AI In Action demo
  const [activeActionDemo, setActiveActionDemo] = useState('streetlight');

  // STEP 6: 4 Premium Feature Cards (Saffron, Blue, Green, Purple/Gold)
  const premiumFeatures = [
    {
      id: 'complaint-assistance',
      title: language === 'hi' ? 'AI शिकायत सहायता' : 'AI Complaint Assistance',
      desc:
        language === 'hi'
          ? 'अपनी रोजमर्रा की सरल भाषा या आवाज में समस्या बताएं। AI स्वतः समस्या का विश्लेषण कर औपचारिक प्रशासनिक शिकायत पत्र तैयार करता है।'
          : 'Describe civic problems in everyday words or voice. AI triages issues, extracts key details, and prepares formal complaints.',
      accentColor: 'border-t-4 border-[#F47721]',
      pastelBg: 'bg-[#FFF9F1]',
      badgeColor: 'bg-[#F47721]/15 text-[#F47721]',
      icon: '📝',
      link: '/report',
      btnLabel: language === 'hi' ? 'शिकायत दर्ज करें' : 'Report Complaint',
    },
    {
      id: 'gov-navigator',
      title: language === 'hi' ? 'सरकारी सेवा नेविगेटर' : 'Government Service Navigator',
      desc:
        language === 'hi'
          ? 'आय प्रमाण पत्र, राशन कार्ड, पेंशन और नगर निगम सेवाओं के लिए पात्रता, आवश्यक दस्तावेज व आधिकारिक पोर्टल गाइड खोजें।'
          : 'Discover citizen certificates, welfare schemes, required document checklists, and verified official government portal links.',
      accentColor: 'border-t-4 border-[#244A85]',
      pastelBg: 'bg-[#EEF4FF]',
      badgeColor: 'bg-[#244A85]/15 text-[#0B1F50]',
      icon: '🏛️',
      link: '/services',
      btnLabel: language === 'hi' ? 'सरकारी सेवाएं देखें' : 'Explore Services',
    },
    {
      id: 'authority-guidance',
      title: language === 'hi' ? 'स्मार्ट प्राधिकरण मार्गदर्शन' : 'Intelligent Authority Guidance',
      desc:
        language === 'hi'
          ? 'सड़क, नाली, बिजली या जल की समस्या में सही नगर निगम विभाग या लोक निर्माण विभाग तक बिना किसी बिचौलिए के पहुंचें।'
          : 'Instant routing to the responsible municipal department, Jal Sansthan, or power utility based on your locality.',
      accentColor: 'border-t-4 border-[#13865B]',
      pastelBg: 'bg-[#EDF9F3]',
      badgeColor: 'bg-[#13865B]/15 text-[#13865B]',
      icon: '🧭',
      link: '/how-it-works',
      btnLabel: language === 'hi' ? 'प्रक्रिया जानें' : 'Learn How It Works',
    },
    {
      id: 'unified-assistant',
      title: language === 'hi' ? 'एकीकृत AI नागरिक सहायक' : 'Unified AI Citizen Assistant',
      desc:
        language === 'hi'
          ? 'हिन्दी व अंग्रेजी में 24/7 नागरिक संवादात्मक मार्गदर्शन। आपातकालीन सुरक्षा जांच और भविष्य के एजेंटिक ऑटोमेशन का पूर्वावलोकन।'
          : 'Bilingual voice-ready AI companion answering civic queries, verifying emergency safety, and navigating public workflows.',
      accentColor: 'border-t-4 border-[#7C3AED]',
      pastelBg: 'bg-[#F5F0FF]',
      badgeColor: 'bg-[#7C3AED]/15 text-[#7C3AED]',
      icon: '🤖',
      link: '/assistant',
      btnLabel: language === 'hi' ? 'AI सहायक से पूछें' : 'Talk to AI Assistant',
    },
  ];

  // 5 Civic Issue Categories
  const civicCategories = [
    {
      id: 'garbage',
      num: '01',
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
      emoji: '🚰',
      title: language === 'hi' ? 'नालियां' : 'Drainage',
      titleFull: language === 'hi' ? 'नालियां व जलभराव' : 'Drainage',
      desc: language === 'hi' ? 'अवरुद्ध या बहती नालियों की समस्या' : 'Blocked or overflowing drains',
      image: '/assets/civic_drainage.jpg',
      tag: language === 'hi' ? 'जल निकासी' : 'Drainage & Sewage',
    },
  ];

  // How NagrikSetu Works (4 core steps)
  const howSteps = [
    {
      step: '01',
      label: language === 'hi' ? 'बताएं' : 'Tell Us',
      desc: language === 'hi' ? 'अपनी भाषा में अपनी नागरिक समस्या बताएं।' : 'Describe your civic problem in your own words.',
      subtext: language === 'hi' ? 'हिंदी, अंग्रेजी या हिंग्लिश में बोलें या लिखें।' : 'Speak or type naturally without government jargon.',
      icon: '🗣️',
    },
    {
      step: '02',
      label: language === 'hi' ? 'AI समझ' : 'AI Understands',
      desc: language === 'hi' ? 'नागरिकसेतु समस्या, श्रेणी व प्राथमिकता की पहचान करता है।' : 'NagrikSetu identifies the issue, category and priority.',
      subtext: language === 'hi' ? 'स्वचालित विश्लेषण और जरूरी विवरण निष्कर्षण।' : 'Automatic NLP entity extraction & priority scoring.',
      icon: '🧠',
    },
    {
      step: '03',
      label: language === 'hi' ? 'सही विभाग की पहचान' : 'Find the Right Authority',
      desc: language === 'hi' ? 'संबंधित नागरिक प्राधिकरण की दिशा में मार्गदर्शन प्राप्त करें।' : 'Get guidance toward the relevant civic authority.',
      subtext: language === 'hi' ? 'नगर निगम, जल बोर्ड या विद्युत विभाग की मैपिंग।' : 'Direct mapping to the appropriate municipal department.',
      icon: '🏛️',
    },
    {
      step: '04',
      label: language === 'hi' ? 'ट्रैक करें' : 'Track',
      desc: language === 'hi' ? 'अपनी शिकायत यात्रा पर नज़र रखें।' : 'Follow your complaint journey.',
      subtext: language === 'hi' ? 'शिकायत ड्राफ्ट व संदर्भ आईडी सुरक्षित रखें।' : 'Reference ID and formal complaint draft preserved.',
      icon: '📊',
    },
  ];

  // Action demo presets
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

  // Prototype Capabilities (4 items, no fake stats)
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
    <div className="w-full bg-white text-[#1D2939] selection:bg-[#F47721]/20 selection:text-[#0B1F50]">
      {/* ================================================================
          SECTION 1 — CINEMATIC HERO IMAGE SLIDER
          ================================================================ */}
      <HeroSlider />

      {/* ================================================================
          SECTION 2 — WELCOME TO NAGRIKSETU
          "Technology That Understands Every Citizen"
          With subtle Bharat Ashoka Chakra watermark background
          ================================================================ */}
      <section className="relative py-14 sm:py-20 bg-[#FFF9F1] border-b border-[#E3E8EF] overflow-hidden">
        {/* Subtle Watermark Background */}
        <div
          className="absolute inset-0 bg-watermark-mandala opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F47721]/30 px-3.5 py-1 text-xs font-black text-[#F47721] shadow-xs">
                <span>🇮🇳</span>
                <span>{language === 'hi' ? 'डिजिटल भारत — हर नागरिक के लिए तकनीक' : 'Digital Bharat — Technology for Every Citizen'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight leading-tight">
                {language === 'hi'
                  ? 'तकनीक जो समझती है हर नागरिक को।'
                  : 'Technology That Understands Every Citizen.'}
              </h2>

              <p className="text-base sm:text-lg font-bold text-[#F47721]">
                {language === 'hi'
                  ? 'प्रशासनिक जटिलता और नागरिक के बीच का विश्वसनीय डिजिटल सेतु।'
                  : 'A trustworthy digital bridge between complex administration and everyday citizens.'}
              </p>

              <p className="text-sm sm:text-base text-[#596579] leading-relaxed font-normal">
                {language === 'hi'
                  ? 'नागरिकसेतु एक ऐसा AI-सहायक मंच है जो ग्रामीण, बुजुर्ग और पहली बार इंटरनेट का उपयोग करने वाले नागरिकों को नागरिक समस्याएं समझने, सही विभाग तक शिकायत पहुंचाने और आवश्यक सरकारी सेवाएं खोजने में सशक्त बनाता है।'
                  : 'NagrikSetu is an AI-powered citizen assistance platform designed to help rural residents, senior citizens, and first-time digital users easily understand civic issues, prepare formal complaints, and access public services without intermediaries.'}
              </p>

              {/* Citizen-Centered Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#E3E8EF] shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EEF4FF] text-[#0B1F50] flex items-center justify-center text-lg shrink-0">
                    🗣️
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0B1F50] block">
                      {language === 'hi' ? 'सरल भाषा' : 'Everyday Speech'}
                    </span>
                    <span className="text-[11px] text-[#596579]">
                      {language === 'hi' ? 'बिना किसी तकनीकी ज्ञान के' : 'No government jargon'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E3E8EF] shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#FFF9F1] text-[#F47721] flex items-center justify-center text-lg shrink-0">
                    🎙️
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0B1F50] block">
                      {language === 'hi' ? 'आवाज से इनपुट' : 'Voice-Enabled'}
                    </span>
                    <span className="text-[11px] text-[#596579]">
                      {language === 'hi' ? 'वरिष्ठ नागरिकों के अनुकूल' : 'Senior-friendly accessibility'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E3E8EF] shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EDF9F3] text-[#13865B] flex items-center justify-center text-lg shrink-0">
                    ⚖️
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0B1F50] block">
                      {language === 'hi' ? 'पूर्ण नियंत्रण' : 'Citizen Control'}
                    </span>
                    <span className="text-[11px] text-[#596579]">
                      {language === 'hi' ? 'आपकी सहमति से ही आगे' : '100% human-in-the-loop'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#report-workspace"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-6 py-3 text-sm font-black shadow-md hover:shadow-lg transition-all"
                >
                  <span>📝</span>
                  <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
                </a>
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-[#0B1F50] text-[#0B1F50] px-6 py-3 text-sm font-black transition-all shadow-xs"
                >
                  <span>🤖</span>
                  <span>{language === 'hi' ? 'AI सहायक से पूछें' : 'Talk to AI Assistant'}</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-[#E3E8EF] bg-white p-6 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-bharat-gradient" />
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/nagriksetu_logo.jpg"
                      alt="NagrikSetu"
                      className="h-8 w-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-black text-[#0B1F50] block">NagrikSetu AI</span>
                      <span className="text-[10px] text-[#596579]">Civil Assistance Platform</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#13865B]/15 text-[#13865B]">
                    Active 24x7
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFF9F1] border border-[#F47721]/20">
                    <span className="text-[10px] font-black uppercase text-[#F47721] block mb-0.5">
                      Citizen Spoken Hindi:
                    </span>
                    <p className="font-bold text-[#0B1F50] italic">
                      "Hamare mohalle mein 3 din se kachra nahi uthaya gaya."
                    </p>
                  </div>

                  <div className="flex justify-center text-slate-400">
                    <span className="text-sm">↓ AI Translation & Categorization</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF4FF] border border-[#244A85]/20 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#0B1F50]">
                      <span>Category: Waste Management</span>
                      <span className="text-[#13865B]">Confidence: 98%</span>
                    </div>
                    <p className="font-bold text-[#0B1F50]">
                      Formal Subject: Urgent Clearance of Uncollected Municipal Waste
                    </p>
                    <p className="text-[11px] text-[#596579]">
                      Target Authority: Municipal Corporation Sanitary Inspector / Ward Cell
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#EDF9F3] border border-[#13865B]/20 flex items-center justify-between text-[11px] font-bold text-[#13865B]">
                    <span>✓ Ready for Citizen Confirmation</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#13865B]/30">No Middlemen</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3 — WHAT CAN NAGRIKSETU DO? (4 Premium Feature Cards)
          Saffron: Complaint Assistance
          Blue: Government Services
          Green: Authority Guidance
          Purple/Gold: AI Assistant & Automation
          ================================================================ */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-[#E3E8EF] overflow-hidden">
        {/* Civic infrastructure watermark */}
        <div
          className="absolute inset-0 bg-watermark-infra opacity-[0.04] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-[#EEF4FF] border border-[#244A85]/20 px-3.5 py-1 text-xs font-black text-[#0B1F50] uppercase tracking-wider mb-3">
              {language === 'hi' ? 'नागरिक सुविधाएं' : 'Core Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight">
              {language === 'hi' ? 'नागरिकसेतु क्या कर सकता है?' : 'What Can NagrikSetu Do?'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#596579]">
              {language === 'hi'
                ? 'नागरिक समस्याओं के समाधान और सरकारी सेवाओं तक सीधी पहुंच के चार प्रमुख स्तंभ।'
                : 'Four specialized capabilities built to empower citizens across Bharat.'}
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feat) => (
              <div
                key={feat.id}
                className={`rounded-2xl border border-[#E3E8EF] ${feat.pastelBg} ${feat.accentColor} p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
                      {feat.icon}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${feat.badgeColor}`}>
                      Official Guide
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0B1F50] tracking-tight">
                    {feat.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#596579] leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link
                    to={feat.link}
                    className="inline-flex items-center justify-between w-full text-xs font-black text-[#0B1F50] hover:text-[#F47721] transition-colors group"
                  >
                    <span>{feat.btnLabel}</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — HOW NAGRIKSETU WORKS
          Preserves 4 steps and test contracts
          ================================================================ */}
      <section id="how-it-works" className="relative py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#E3E8EF] overflow-hidden">
        {/* Ashoka radial watermark */}
        <div
          className="absolute inset-0 bg-watermark-mandala opacity-[0.04] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-white border border-[#F47721]/30 px-3.5 py-1 text-xs font-black text-[#F47721] uppercase tracking-wider mb-3 shadow-2xs">
              {language === 'hi' ? '3-चरणीय नागरिक कार्यप्रवाह' : 'Simple 4-Step Process'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight">
              {language === 'hi' ? 'समस्या से सही अगले कदम तक।' : 'From a problem to the right next step.'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#596579]">
              {language === 'hi'
                ? 'नागरिकसेतु कैसे काम करता है — बताएं, समझें, और सही कार्रवाई करें।'
                : 'How NagrikSetu guides your grievance from voice or text to structured action.'}
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-[#E3E8EF] bg-white p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#F47721] tracking-wider bg-[#FFF9F1] px-2.5 py-1 rounded border border-[#F47721]/20">
                      STEP {step.step}
                    </span>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0B1F50]">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-xs font-bold text-[#F47721] leading-snug">
                    “{step.desc}”
                  </p>
                  <p className="mt-2 text-xs text-[#596579] leading-relaxed">
                    {step.subtext}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#13865B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#13865B]" />
                  <span>Guided Journey</span>
                </div>

                {/* Connecting arrow for steps 1, 2, 3 on desktop */}
                {idx < 3 && (
                  <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-7 w-7 rounded-full bg-white border border-[#E3E8EF] items-center justify-center shadow-xs text-[#0B1F50]">
                    <span className="text-xs font-bold">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Common Civic Categories Pill Section */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-[#0B1F50]">
                {language === 'hi' ? 'आप क्या शिकायत दर्ज कर सकते हैं?' : 'What can you report?'}
              </h3>
              <p className="text-xs text-[#596579] mt-1">
                {language === 'hi' ? 'अपने मोहल्ले को प्रभावित करने वाली सामान्य समस्याएं' : 'Start with common problems affecting your neighborhood.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {civicCategories.map((cat) => (
                <a
                  key={cat.id}
                  href="#report-workspace"
                  className="group flex flex-col rounded-xl border border-[#E3E8EF] bg-white p-3.5 shadow-xs hover:border-[#F47721] hover:shadow-md transition-all text-center"
                >
                  <span className="text-2xl mb-1.5">{cat.emoji}</span>
                  <span className="text-xs font-black text-[#0B1F50] group-hover:text-[#F47721] transition-colors">
                    {cat.titleFull}
                  </span>
                  <span className="text-[10px] text-[#596579] mt-1">
                    {cat.tag}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — BUILT FOR EVERY BHARAT CITIZEN
          Rural, Senior, Multilingual, Mobile-First
          ================================================================ */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-[#E3E8EF] overflow-hidden">
        {/* Digital nodes watermark */}
        <div
          className="absolute inset-0 bg-watermark-nodes opacity-[0.04] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-[#EDF9F3] border border-[#13865B]/20 px-3.5 py-1 text-xs font-black text-[#13865B] uppercase tracking-wider mb-3">
              {language === 'hi' ? 'समावेशी डिजिटल भारत' : 'Inclusive By Design'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight">
              {language === 'hi' ? 'हर भारतीय नागरिक के लिए निर्मित।' : 'Built for Every Bharat Citizen.'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#596579]">
              {language === 'hi'
                ? 'डिजिटल साक्षरता की बाधाओं को समाप्त कर हर व्यक्ति तक प्रशासनिक अधिकार पहुंचाना।'
                : 'Removing digital literacy barriers so every citizen can access their civic rights.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#E3E8EF] bg-[#FFF9F1] p-6 shadow-xs space-y-3">
              <div className="h-12 w-12 rounded-xl bg-white text-[#F47721] border border-[#F47721]/30 flex items-center justify-center text-2xl shadow-xs">
                🌾
              </div>
              <h3 className="text-base font-black text-[#0B1F50]">
                {language === 'hi' ? 'ग्रामीण पहुंच' : 'Rural Accessibility'}
              </h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                {language === 'hi'
                  ? 'गांव और कस्बों के नागरिकों के लिए जो सरकारी जटिलताओं या बिचौलियों से दूर रहना चाहते हैं।'
                  : 'Engineered for village and town citizens who need direct, transparent access to panchayat and block authorities.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8EF] bg-[#EEF4FF] p-6 shadow-xs space-y-3">
              <div className="h-12 w-12 rounded-xl bg-white text-[#0B1F50] border border-[#244A85]/30 flex items-center justify-center text-2xl shadow-xs">
                👴
              </div>
              <h3 className="text-base font-black text-[#0B1F50]">
                {language === 'hi' ? 'वरिष्ठ नागरिक सहायता' : 'Senior Citizens'}
              </h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                {language === 'hi'
                  ? 'बड़ा फॉन्ट, उच्च कंट्रास्ट और ध्वनि आधारित इनपुट ताकि वरिष्ठ नागरिक बिना किसी परेशानी के शिकायत दर्ज कर सकें।'
                  : 'Large readable typography, high WCAG contrast, and conversational voice input designed for elderly users.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8EF] bg-[#EDF9F3] p-6 shadow-xs space-y-3">
              <div className="h-12 w-12 rounded-xl bg-white text-[#13865B] border border-[#13865B]/30 flex items-center justify-center text-2xl shadow-xs">
                🇮🇳
              </div>
              <h3 className="text-base font-black text-[#0B1F50]">
                {language === 'hi' ? 'मातृभाषा में समझ' : 'Vernacular First'}
              </h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                {language === 'hi'
                  ? 'हिंदी, हिंग्लिश और अंग्रेजी में सहज संवाद। आधिकारिक कानूनी प्रारूप स्वतः तैयार होता है।'
                  : 'Speak naturally in Hindi, Hinglish, or English. NagrikSetu converts spoken intent into dignified official drafts.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E8EF] bg-[#F5F0FF] p-6 shadow-xs space-y-3">
              <div className="h-12 w-12 rounded-xl bg-white text-[#7C3AED] border border-[#7C3AED]/30 flex items-center justify-center text-2xl shadow-xs">
                📱
              </div>
              <h3 className="text-base font-black text-[#0B1F50]">
                {language === 'hi' ? 'मोबाइल-प्रथम अनुभव' : 'Mobile-First Speed'}
              </h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                {language === 'hi'
                  ? 'धीमे 3G/4G नेटवर्क और सामान्य बजट स्मार्टफोन पर भी तेजी से लोड होने वाला हल्का इंटरफेस।'
                  : 'Optimized lightweight bundle rendering flawlessly on budget smartphones and fluctuating 3G/4G connectivity.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 — COMING SOON: NAGRIKSETU AI AUTOMATION & FUTURE VISION
          Strict preservation of all test contracts from testPhase13FutureVision.mjs
          ================================================================ */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f0f6ff] via-white to-[#f8fafc] border-b border-[#E3E8EF] relative overflow-hidden">
        {/* Decorative Ambient Background */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#F47721]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#0B1F50]/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-kesari-50 border-2 border-kesari-400 px-4 py-1.5 text-xs font-black text-kesari-700 uppercase tracking-widest mb-4 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
              <span>{language === 'hi' ? 'जल्द आ रहा है • कमिंग सून' : 'Coming Soon'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-chakra-900 tracking-tight leading-tight">
              {language === 'hi'
                ? 'जल्द आ रहा है: नागरिकसेतु AI ऑटोमेशन'
                : 'Coming Soon: NagrikSetu AI Automation'}
            </h2>

            <p className="mt-3 text-base sm:text-lg font-bold text-kesari-600">
              {language === 'hi'
                ? 'अपनी समस्या बताने से लेकर सरकारी प्रक्रिया पूर्ण करने तक — AI की सहायता से।'
                : 'From describing your problem to completing government workflows — with AI assistance.'}
            </p>

            <p className="mt-4 text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'कल्पना कीजिए कि गड्ढे की शिकायत करना, प्रमाण पत्र का अनुरोध करना या किसी सरकारी सेवा का उपयोग करना बिना किसी जटिल पोर्टल में भटके संभव हो। नागरिकसेतु का आगामी AI ऑटोमेशन आपके अनुरोध को समझने, सही सरकारी पोर्टल की पहचान करने, आवश्यक जानकारी तैयार करने और आपकी अनुमति के साथ समर्थित सरकारी वर्कफ़्लो को पूरा करने में मदद करने के लिए बनाया जा रहा है।'
                : "Imagine reporting a pothole, requesting a certificate, or accessing a government service without navigating complicated portals. NagrikSetu's upcoming AI Automation aims to understand your request, identify the correct government portal, prepare the necessary information, and help complete supported government workflows with your permission."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/future-vision"
                className="inline-flex items-center gap-2 rounded-full bg-chakra-900 hover:bg-chakra-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>🚀</span>
                <span>{language === 'hi' ? 'पूर्ण विजन व रोडमैप देखें' : 'Explore Dedicated Future Vision Page'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Visual Automation Workflow Section */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-chakra-700 bg-chakra-50 border border-chakra-200 px-3 py-1 rounded-full">
                {language === 'hi' ? '6-चरणीय वर्कफ़्लो' : 'Future Workflow'}
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
                {language === 'hi'
                  ? 'एक बातचीत। एक सरल सरकारी प्रक्रिया।'
                  : 'One Conversation. A Simpler Government Process.'}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-text-muted">
                {language === 'hi'
                  ? 'देखें कि भविष्य का नागरिकसेतु आम नागरिक के लिए जटिल प्रक्रियाओं को कैसे सरल बनाएगा।'
                  : 'How our future citizen-authorized automation simplifies public workflows.'}
              </p>
            </div>

            {/* 6 Connected Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative">
              
              {/* STEP 1 */}
              <div className="rounded-2xl border-2 border-chakra-200 bg-white p-5 shadow-card hover:border-kesari-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-kesari-600 bg-kesari-50 px-2 py-0.5 rounded">
                      STEP 1
                    </span>
                    <span className="text-xl">🗣️</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'समस्या बताएं' : 'TELL YOUR PROBLEM'}
                  </h4>
                  <div className="mt-2 p-2.5 rounded-lg bg-surface-dim border border-border">
                    <span className="text-[10px] font-bold text-text-muted block">
                      {language === 'hi' ? 'नागरिक:' : 'Citizen:'}
                    </span>
                    <p className="text-xs font-semibold text-chakra-900 italic">
                      "Mere gaon ki sadak par gaddha hai."
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-text-secondary leading-snug">
                  {language === 'hi'
                    ? 'रोजमर्रा की प्राकृतिक भाषा में बोलें या टाइप करें।'
                    : 'Natural conversational input without technical jargon.'}
                </div>
              </div>

              {/* STEP 2 */}
              <div className="rounded-2xl border-2 border-chakra-200 bg-white p-5 shadow-card hover:border-kesari-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                      STEP 2
                    </span>
                    <span className="text-xl">🧠</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'AI समझता है' : 'AI UNDERSTANDS'}
                  </h4>
                  <div className="mt-2 space-y-1 p-2.5 rounded-lg bg-chakra-50/50 border border-chakra-100 text-[11px] font-medium text-chakra-900">
                    <p className="font-bold text-[10px] uppercase text-chakra-700">
                      {language === 'hi' ? 'AI पहचानता है:' : 'AI identifies:'}
                    </p>
                    <p>• {language === 'hi' ? 'सड़क क्षति' : 'Road damage'}</p>
                    <p>• {language === 'hi' ? 'प्रासंगिक स्थान' : 'Relevant location'}</p>
                    <p>• {language === 'hi' ? 'शिकायत श्रेणी' : 'Complaint category'}</p>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-text-secondary leading-snug">
                  {language === 'hi'
                    ? 'उन्नत भाषा समझ द्वारा विवरण का विश्लेषण।'
                    : 'Extracts critical civic entities automatically.'}
                </div>
              </div>

              {/* STEP 3 */}
              <div className="rounded-2xl border-2 border-chakra-200 bg-white p-5 shadow-card hover:border-kesari-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                      STEP 3
                    </span>
                    <span className="text-xl">📝</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'AI तैयार करता है' : 'AI PREPARES'}
                  </h4>
                  <div className="mt-2 p-2.5 rounded-lg bg-surface-dim border border-border text-[11px] text-chakra-900 leading-snug font-medium">
                    {language === 'hi'
                      ? 'AI एक औपचारिक शिकायत तैयार करता है और संभावित सरकारी प्राधिकरण की पहचान करता है।'
                      : 'AI generates a formal complaint and identifies the likely government authority.'}
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-text-secondary leading-snug">
                  {language === 'hi'
                    ? 'प्रशासनिक व कानूनी स्पष्टता से युक्त प्रारूप।'
                    : 'Formal administrative complaint generated.'}
                </div>
              </div>

              {/* STEP 4 */}
              <div className="rounded-2xl border-2 border-amber-200 bg-white p-5 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      STEP 4
                    </span>
                    <span className="text-xl">🌐</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'AI नेविगेट करता है' : 'AI NAVIGATES'}
                  </h4>
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-[11px] text-amber-950 leading-snug font-medium">
                    {language === 'hi'
                      ? 'भविष्य का AI ऑटोमेशन उपयुक्त आधिकारिक सरकारी शिकायत पोर्टल खोलता है।'
                      : 'Future AI automation opens the appropriate official government complaint portal.'}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  {language === 'hi' ? 'भविष्य की योजना' : 'Planned Feature'}
                </div>
              </div>

              {/* STEP 5 */}
              <div className="rounded-2xl border-2 border-amber-200 bg-white p-5 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      STEP 5
                    </span>
                    <span className="text-xl">📋</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'फॉर्म भरने में सहायता' : 'AI ASSISTS WITH FORM FILLING'}
                  </h4>
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-[11px] text-amber-950 leading-snug font-medium">
                    {language === 'hi'
                      ? 'भविष्य का AI नागरिक द्वारा स्वीकृत विवरणों का उपयोग करके समर्थित फील्ड तैयार व भरता है।'
                      : 'Future AI automation prepares and fills supported fields using citizen-approved details.'}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  {language === 'hi' ? 'नागरिक-अनुमोदित' : 'Citizen-Approved Details'}
                </div>
              </div>

              {/* STEP 6 */}
              <div className="rounded-2xl border-2 border-emerald-300 bg-white p-5 shadow-card hover:border-emerald-500 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      STEP 6
                    </span>
                    <span className="text-xl">✅</span>
                  </div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'नागरिक स्वीकृति' : 'CITIZEN APPROVES'}
                  </h4>
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-950 leading-snug font-medium">
                    {language === 'hi'
                      ? 'नागरिक भरे गए फॉर्म की समीक्षा करता है। जहां आधिकारिक पोर्टल नियम अनुमति दें, स्पष्ट सहमति के बाद ही सबमिशन होता है।'
                      : 'The citizen reviews the completed form. Where official portal rules permit, the assistant can submit the complaint after explicit citizen authorization.'}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                  {language === 'hi' ? 'मानव नियंत्रण' : 'Explicit Authorization'}
                </div>
              </div>

            </div>

            {/* Track Your Complaint Banner */}
            <div className="mt-6 rounded-2xl bg-white border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-chakra-50 border border-chakra-200 flex items-center justify-center text-chakra-800 text-lg shrink-0">
                  🔍
                </div>
                <div>
                  <h4 className="text-sm font-bold text-chakra-900">
                    {language === 'hi' ? 'भविष्य की क्षमता: अपनी शिकायत ट्रैक करें' : 'Track Your Complaint'}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {language === 'hi'
                      ? 'आधिकारिक स्थिति ट्रैकिंग सरकारी पोर्टल समर्थन पर निर्भर करती है। पुष्टि तभी दिखाई जाएगी जब पोर्टल इसकी पुष्टि करे।'
                      : 'Official status tracking depends on government portal support. Confirmation is displayed only after the government portal actually confirms successful submission.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="text-xs font-bold text-slate-700 bg-surface-dim border border-border px-3 py-1.5 rounded-full">
                  {language === 'hi' ? 'आधिकारिक पुष्टि पर आधारित' : 'Subject to Portal Support'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Demo */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wider mb-2">
                {language === 'hi' ? 'इंटरैक्टिव पूर्वावलोकन' : 'Interactive Concept Demo'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
                {language === 'hi'
                  ? 'भविष्य के ऑटोमेशन का प्रत्यक्ष पूर्वावलोकन'
                  : 'Experience the Future Automation Workflow'}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-text-muted">
                {language === 'hi'
                  ? 'यह एक संकल्पना पूर्वावलोकन है — कोई वास्तविक सरकारी सबमिशन नहीं किया जाता है।'
                  : 'Concept Preview — No Government Submission. A simulated testbed demonstrating the end-to-end vision.'}
              </p>
            </div>

            <AutomationVisionDemo />
          </div>

          {/* What Makes NagrikSetu Different? (Main USP) */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'नागरिकसेतु का मुख्य यूएसपी' : 'Core Differentiators'}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-chakra-900 tracking-tight">
                {language === 'hi' ? 'नागरिकसेतु को क्या अलग बनाता है?' : 'What Makes NagrikSetu Different?'}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-text-muted">
                {language === 'hi'
                  ? 'प्रशासनिक जटिलता को दूर कर प्रत्येक नागरिक को सशक्त बनाने वाले 6 प्रमुख स्तंभ।'
                  : 'Six core pillars bridging citizens, AI, and public administration.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* USP 1 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center text-lg mb-4">
                  💬
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '1. संवाद-प्रथम इंटरफेस' : '1. Conversation-First Interface'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'नागरिक अपनी समस्याएं आम बोलचाल की भाषा में बताते हैं। जटिल फॉर्म या ड्रॉपडाउन समझने की बाध्यता समाप्त।'
                    : 'Citizens describe problems in everyday language without navigating confusing technical dropdowns or departmental jargon.'}
                </p>
              </div>

              {/* USP 2 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-lg mb-4">
                  🇮🇳
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '2. बहुभाषी सुगम्यता' : '2. Multilingual Accessibility'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'हिंदी और अन्य भारतीय भाषाओं को प्राथमिकता देने वाले नागरिकों की सुविधा के लिए विशेष रूप से डिज़ाइन।'
                    : 'Designed to support citizens who prefer Hindi and other Indian languages.'}
                </p>
              </div>

              {/* USP 3 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center text-lg mb-4">
                  📄
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '3. AI-संचालित शिकायत निर्माण' : '3. AI-Powered Complaint Preparation'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'साधारण विवरण को संरचित, गरिमापूर्ण और प्रभावी प्रशासनिक शिकायतों में बदलता है।'
                    : 'Transforms ordinary descriptions into structured complaints.'}
                </p>
              </div>

              {/* USP 4 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg mb-4">
                  🧭
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '4. बुद्धिमान सरकारी नेविगेशन' : '4. Intelligent Government Navigation'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'प्रासंगिक प्राधिकरणों और आधिकारिक सरकारी पोर्टलों की सटीक पहचान में सहायता करता है।'
                    : 'Helps identify relevant authorities and official government portals.'}
                </p>
              </div>

              {/* USP 5 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-lg mb-4">
                  ⚡
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '5. भविष्य का एजेंटिक ऑटोमेशन' : '5. Future Agentic Automation'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'नागरिक की अनुमति से समर्थित सरकारी कार्यप्रवाहों को स्वचालित करने का उद्देश्य।'
                    : 'Aims to automate supported government workflows with citizen authorization.'}
                </p>
              </div>

              {/* USP 6 */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-lg mb-4">
                  🛡️
                </div>
                <h4 className="text-base font-bold text-chakra-900">
                  {language === 'hi' ? '6. मानव नियंत्रण में (ह्यूमन-इन-कंट्रोल)' : '6. Human-in-Control Design'}
                </h4>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {language === 'hi'
                    ? 'नागरिक महत्वपूर्ण कार्यों की समीक्षा और अनुमोदन के लिए सदैव स्वयं उत्तरदायी रहते हैं।'
                    : 'Citizens remain responsible for reviewing and approving important actions.'}
                </p>
              </div>

            </div>

            {/* Bottom link banner to Future Vision */}
            <div className="mt-10 text-center">
              <Link
                to="/future-vision"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B1F50] text-[#0B1F50] hover:bg-[#0B1F50] hover:text-white px-7 py-3 text-sm font-black transition-all shadow-xs"
              >
                <span>{language === 'hi' ? 'पूर्ण तकनीकी रोडमैप और भविष्य दृष्टि पढ़ें' : 'Read Full Technical Roadmap & Future Vision'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================
          SECTION 7 — OUR SOCIAL IMPACT MISSION
          "Built for Bharat. Designed for Everyone."
          ================================================================ */}
      <section className="relative py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#E3E8EF] overflow-hidden">
        {/* Subtle Ashoka radial watermark */}
        <div
          className="absolute inset-0 bg-watermark-mandala opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center rounded-full bg-white border border-[#F47721]/30 px-3.5 py-1 text-xs font-black text-[#F47721] uppercase tracking-wider mb-3 shadow-xs">
              {language === 'hi' ? 'सामाजिक प्रभाव मिशन' : 'Social Impact Mission'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight">
              {language === 'hi' ? 'भारत के लिए निर्मित। सबके लिए सुगम।' : 'Built for Bharat. Designed for Everyone.'}
            </h2>
            <p className="mt-3 text-base text-[#596579] max-w-2xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'डिजिटल जटिलता भारत के लाखों नागरिकों को उनके अधिकारों से वंचित रखती है। नागरिकसेतु इस खाई को पाटने के लिए समर्पित है।'
                : 'Digital complexity creates invisible walls between citizens and public services. NagrikSetu exists to eliminate these barriers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#E3E8EF] bg-white p-7 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🌾</span>
                <h3 className="text-lg font-black text-[#0B1F50]">
                  {language === 'hi' ? 'डिजिटल विभाजन को पाटना' : 'Bridging Digital Divides'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#596579] leading-relaxed">
                  {language === 'hi'
                    ? 'ग्रामीण व अर्ध-शहरी इलाकों में रहने वाले नागरिकों को जटिल पोर्टल लॉगिन, कैप्चा और सरकारी पदानुक्रम समझे बिना सीधे मार्गदर्शन देना।'
                    : 'Providing accessible digital pathways for rural and semi-urban communities without bureaucratic friction.'}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#13865B]">
                ✓ No Intermediaries Required
              </div>
            </div>

            <div className="rounded-2xl border border-[#E3E8EF] bg-white p-7 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🤝</span>
                <h3 className="text-lg font-black text-[#0B1F50]">
                  {language === 'hi' ? 'बुजुर्गों और नव-उपयोगकर्ताओं का सशक्तिकरण' : 'First-Time Internet Users'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#596579] leading-relaxed">
                  {language === 'hi'
                    ? 'आवाज के माध्यम से किसी भी नागरिक को शिकायत दर्ज करने का आत्मविश्वास देना, चाहे उनकी शैक्षणिक पृष्ठभूमि कुछ भी हो।'
                    : 'Allowing citizens of any digital literacy level to describe problems naturally by voice and get immediate procedural clarity.'}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#13865B]">
                ✓ Voice & Vernacular Enabled
              </div>
            </div>

            <div className="rounded-2xl border border-[#E3E8EF] bg-white p-7 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">🔒</span>
                <h3 className="text-lg font-black text-[#0B1F50]">
                  {language === 'hi' ? 'नैतिक व सुरक्षित तकनीक' : 'Ethical & Transparent AI'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#596579] leading-relaxed">
                  {language === 'hi'
                    ? 'कोई फर्जी दावे नहीं। नागरिक की स्पष्ट पूर्व-सहमति के बिना कोई आधिकारिक कार्रवाई नहीं। मानवीय गरिमा सदैव सर्वोपरि।'
                    : 'Zero automated bypasses of security or OTPs. Citizens retain full sovereign ownership and authorization at every step.'}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#13865B]">
                ✓ Citizen-in-Control Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          INTERACTIVE PROTOTYPE WORKSPACE
          Users clicking "Report a Problem" jump straight to testing!
          ================================================================ */}
      <section id="report-workspace" className="py-14 sm:py-20 bg-white border-b border-[#E3E8EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center rounded-full bg-[#FFF9F1] border border-[#F47721]/30 px-3 py-1 text-xs font-black text-[#F47721] uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'लाइव प्रोटोटाइप टेस्ट करें' : 'Try the Prototype'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1F50] tracking-tight">
              {language === 'hi' ? 'अपनी सार्वजनिक समस्या दर्ज करें' : 'Report Your Civic Problem'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#596579]">
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
          SECTION 8 — FINAL CALL TO ACTION
          "Your Problem Matters. Your Voice Deserves to Be Heard."
          Deep Navy background with tricolor top strip
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#0B1F50] text-white py-16 sm:py-24">
        {/* Tricolor Ribbon on top */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-[#F47721]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#13865B]" />
        </div>

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#F47721]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#13865B]/15 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-12 w-12 rounded-xl bg-white p-0.5 shadow-md overflow-hidden shrink-0">
              <img
                src="/assets/nagriksetu_logo.jpg"
                alt="NagrikSetu Logo"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold text-[#F47721] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F47721] animate-pulse" />
              NagrikSetu Bharat
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {language === 'hi'
              ? 'आपकी समस्या महत्वपूर्ण है। आपकी आवाज सुनी जानी चाहिए।'
              : 'Your Problem Matters. Your Voice Deserves to Be Heard.'}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed font-normal">
            {language === 'hi'
              ? 'नागरिकसेतु को अपनी समस्या बताएं। हम आपको सही विभाग और अगला कदम बताएंगे।'
              : "Tell NagrikSetu what happened. We'll help you understand the next step without confusion."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <a
              href="#report-workspace"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-8 py-3.5 text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <span>📝</span>
              <span>{language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Issue'}</span>
            </a>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white px-7 py-3.5 text-sm sm:text-base font-black transition-all shadow-xs"
            >
              <span>🏛️</span>
              <span>{language === 'hi' ? 'सरकारी सेवाएं देखें' : 'Explore Government Services'}</span>
            </Link>

            <Link
              to="/assistant"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#13865B] hover:bg-[#0f6b49] text-white px-7 py-3.5 text-sm sm:text-base font-black transition-all shadow-md active:scale-[0.98]"
            >
              <span>🤖</span>
              <span>{language === 'hi' ? 'AI सहायक से पूछें' : 'Talk to AI Assistant'}</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 font-medium">
            <span>• English, Hindi & Hinglish</span>
            <span>• 5 Civic Categories</span>
            <span>• Direct Authority Guidance</span>
          </div>
        </div>
      </section>

      {/* Built for Bharat — Social Impact and Accessibility Mission Section */}
      <BuiltForBharatSection />

    </div>
  );
}
