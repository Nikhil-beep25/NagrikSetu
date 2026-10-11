import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function FaqSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [openIndex, setOpenIndex] = useState(0); // Open first FAQ by default
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 'q1',
      questionEn: 'What is NagrikSetu?',
      questionHi: 'नागरिकसेतु क्या है?',
      answerEn:
        'NagrikSetu is an independent AI-powered citizen assistance platform designed to help citizens understand civic issues, structure formal complaint drafts, and identify relevant local government authorities (such as municipal corporations, jal sansthan, electricity boards, and development authorities).',
      answerHi:
        'नागरिकसेतु एक स्वतंत्र AI-संचालित नागरिक सहायता मंच है, जिसे नागरिकों को अपनी नागरिक समस्याओं को समझने, औपचारिक शिकायत का प्रारूप तैयार करने और संबंधित स्थानीय सरकारी प्राधिकरणों (जैसे नगर निगम, जल संस्थान, विद्युत विभाग, और विकास प्राधिकरण) की पहचान करने में मदद करने के लिए डिज़ाइन किया गया है।',
      categoryEn: 'General',
      categoryHi: 'सामान्य',
    },
    {
      id: 'q2',
      questionEn: 'Is NagrikSetu an official government platform?',
      questionHi: 'क्या नागरिकसेतु कोई आधिकारिक सरकारी मंच है?',
      answerEn:
        'No. NagrikSetu is an independent, non-governmental citizen assistance platform. It is not affiliated with, endorsed by, or operated by the Government of India, any state government, or any municipal corporation. It acts as an assistive bridge to help citizens prepare complaints before approaching official channels.',
      answerHi:
        'नहीं। नागरिकसेतु एक स्वतंत्र, गैर-सरकारी नागरिक सहायता मंच है। यह भारत सरकार, किसी भी राज्य सरकार या किसी नगर निगम से संबद्ध, समर्थित या संचालित नहीं है। यह आधिकारिक पोर्टलों पर जाने से पहले नागरिकों की सहायता के लिए एक सेतु के रूप में कार्य करता है।',
      categoryEn: 'Trust & Governance',
      categoryHi: 'विश्वास एवं प्रशासन',
    },
    {
      id: 'q3',
      questionEn: 'How does AI complaint assistance work?',
      questionHi: 'AI शिकायत सहायता कैसे काम करती है?',
      answerEn:
        'You describe your civic problem in natural language (in Hindi, English, or Hinglish) using voice or text. Our AI analyzes the issue to determine its category (roads, sanitation, water, electricity, etc.), assesses urgency, extracts key details, highlights missing information, and formats a structured complaint letter ready for submission.',
      answerHi:
        'आप अपनी नागरिक समस्या को बोलकर या लिखकर सरल भाषा (हिंदी, अंग्रेजी या हिंग्लिश) में बताते हैं। हमारा AI समस्या का विश्लेषण कर श्रेणी (सड़क, स्वच्छता, पानी, बिजली आदि) तय करता है, तात्कालिकता का मूल्यांकन करता है, आवश्यक विवरण निकालता है और एक संरचित शिकायत पत्र तैयार करता है।',
      categoryEn: 'Complaints & AI',
      categoryHi: 'शिकायत एवं AI',
    },
    {
      id: 'q4',
      questionEn: 'Can NagrikSetu submit complaints automatically?',
      questionHi: 'क्या नागरिकसेतु सीधे सरकारी पोर्टल पर शिकायत दर्ज कर सकता है?',
      answerEn:
        'Not currently. Direct and automated government portal submission is part of our future AI Automation vision. In the current prototype, NagrikSetu helps you prepare and copy your complaint letter and provides verified links to official portals (such as CPGRAMS or UP Jansunwai) so you can review and submit it yourself.',
      answerHi:
        'वर्तमान में नहीं। सीधे और स्वचालित सरकारी पोर्टल पर शिकायत दर्ज करना हमारी आगामी AI ऑटोमेशन विजन का हिस्सा है। वर्तमान प्रोटोटाइप में, नागरिकसेतु आपको संरचित पत्र तैयार करके देता है और आधिकारिक पोर्टलों (जैसे CPGRAMS या UP जनसुनवाई) के सत्यापित लिंक प्रदान करता है ताकि आप स्वयं समीक्षा करके सबमिट कर सकें।',
      categoryEn: 'Automation Vision',
      categoryHi: 'ऑटोमेशन विजन',
    },
    {
      id: 'q5',
      questionEn: 'How does complaint tracking work?',
      questionHi: 'शिकायत ट्रैकिंग कैसे काम करती है?',
      answerEn:
        'Complaint tracking displayed within NagrikSetu is local to this prototype for your personal session records and demonstration. It is not currently connected to live government department databases, internal ticket systems, or official government tracking numbers.',
      answerHi:
        'नागरिकसेतु में दिखने वाली शिकायत ट्रैकिंग केवल इस प्रोटोटाइप के व्यक्तिगत सत्र रिकॉर्ड और प्रदर्शन के लिए है। यह वर्तमान में किसी सरकारी विभाग के लाइव डेटाबेस, आंतरिक टिकट प्रणाली या आधिकारिक सरकारी ट्रैकिंग नंबर से नहीं जुड़ी है।',
      categoryEn: 'Tracking',
      categoryHi: 'ट्रैकिंग',
    },
    {
      id: 'q6',
      questionEn: 'What government services can I explore?',
      questionHi: 'मैं किन सरकारी सेवाओं की जानकारी ले सकता हूँ?',
      answerEn:
        'Through our Government Service Navigator, you can explore key administrative civic services across categories like Certificates (Birth/Caste), Water Connections, Trade Licenses, Sanitation, and Property Tax. Each service includes eligibility criteria, required documents, standard timelines, and links to official portals.',
      answerHi:
        'हमारे सरकारी सेवा नेविगेटर के माध्यम से, आप जन्म प्रमाण पत्र, जाति प्रमाण पत्र, नया जल संयोजन, ट्रेड लाइसेंस, स्वच्छता सेवाएं, और संपत्ति कर जैसी नागरिक सेवाओं की जानकारी प्राप्त कर सकते हैं। प्रत्येक सेवा में पात्रता, आवश्यक दस्तावेज, समय-सीमा और आधिकारिक पोर्टल लिंक शामिल हैं।',
      categoryEn: 'Services',
      categoryHi: 'सेवाएं',
    },
    {
      id: 'q7',
      questionEn: 'Can I use NagrikSetu in Hindi?',
      questionHi: 'क्या मैं नागरिकसेतु का उपयोग हिंदी में कर सकता हूँ?',
      answerEn:
        'Yes! NagrikSetu provides complete bilingual support. You can switch between English and Hindi (हिंदी) at any time using the language selector in the navigation bar. You can also speak or type your complaints in Hindi or Hinglish.',
      answerHi:
        'हाँ! नागरिकसेतु में संपूर्ण द्विभाषी सहायता उपलब्ध है। आप नेविगेशन बार में दिए गए भाषा चयनकर्ता से कभी भी हिंदी और अंग्रेजी में बदल सकते हैं। आप हिंदी या हिंग्लिश में बोलकर या लिखकर भी शिकायत दर्ज कर सकते हैं।',
      categoryEn: 'Accessibility',
      categoryHi: 'सुगमता',
    },
    {
      id: 'q8',
      questionEn: 'What is the upcoming AI Automation feature?',
      questionHi: 'आगामी AI ऑटोमेशन फीचर क्या है?',
      answerEn:
        'Our Future Vision explores citizen-authorized AI automation that can assist users with navigating official government portals and pre-filling supported form fields. This will always require explicit human approval and will strictly never bypass CAPTCHA, SMS OTPs, or government authentication protocols.',
      answerHi:
        'हमारा भविष्य विजन नागरिक-स्वीकृत AI ऑटोमेशन की परिकल्पना करता है जो सरकारी पोर्टलों पर समर्थित फॉर्म भरने में सहायता कर सके। इसके लिए हमेशा नागरिक की स्पष्ट सहमति आवश्यक होगी और यह कभी भी CAPTCHA, SMS OTP या सरकारी सुरक्षा नियमों का उल्लंघन नहीं करेगा।',
      categoryEn: 'Automation Vision',
      categoryHi: 'ऑटोमेशन विजन',
    },
    {
      id: 'q9',
      questionEn: 'Is NagrikSetu free to use?',
      questionHi: 'क्या नागरिकसेतु का उपयोग निःशुल्क है?',
      answerEn:
        'Yes. NagrikSetu is currently accessible as a free citizen assistance research prototype. Citizens can freely describe problems, generate formatted complaint drafts, explore service guidelines, and interact with the AI assistant without any usage fee.',
      answerHi:
        'हाँ। नागरिकसेतु वर्तमान में एक निःशुल्क नागरिक सहायता अनुसंधान प्रोटोटाइप के रूप में उपलब्ध है। नागरिक बिना किसी शुल्क के समस्याएं बता सकते हैं, शिकायत पत्र तैयार कर सकते हैं, सरकारी सेवाओं की जानकारी ले सकते हैं और AI सहायक से बात कर सकते हैं।',
      categoryEn: 'General',
      categoryHi: 'सामान्य',
    },
    {
      id: 'q10',
      questionEn: 'How can I report an emergency?',
      questionHi: 'आपातकालीन स्थिति में शिकायत कैसे दर्ज करें?',
      answerEn:
        'NagrikSetu is strictly an administrative grievance triage tool and DOES NOT contact emergency responders. For active emergencies, life-threatening situations, crimes, fires, or acute public hazards, call emergency helplines immediately: 112 (National Emergency), 100 (Police), 101 (Fire), 102/108 (Ambulance), or 1912 (Electricity Emergency).',
      answerHi:
        'नागरिकसेतु केवल प्रशासनिक शिकायतों के लिए है और यह आपातकालीन सेवाओं से संपर्क नहीं करता है। किसी भी आपात स्थिति, अपराध, आग, दुर्घटना या गंभीर खतरे के लिए तुरंत आधिकारिक हेल्पलाइन पर कॉल करें: 112 (राष्ट्रीय आपातकाल), 100 (पुलिस), 101 (दमकल), 102/108 (एम्बुलेंस), या 1912 (विद्युत आपातकाल)।',
      categoryEn: 'Safety & Emergency',
      categoryHi: 'सुरक्षा एवं आपातकाल',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const q = (isHindi ? faq.questionHi : faq.questionEn).toLowerCase();
    const a = (isHindi ? faq.answerHi : faq.answerEn).toLowerCase();
    return q.includes(query) || a.includes(query);
  });

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-heading"
      className="relative bg-gradient-to-b from-[#FFF9F1] via-[#FFFFFF] to-[#FFF9F1] py-14 sm:py-20 border-t border-[#E3E8EF] overflow-hidden"
    >
      {/* Background Subtle Watermark */}
      <div
        className="absolute inset-0 bg-watermark-mandala opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Tricolor Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F47721]/30 px-3.5 py-1 text-xs font-bold text-[#F47721] shadow-2xs mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F47721] animate-ping" />
            <span>{isHindi ? 'नागरिक सहायता ज्ञानकोष' : 'Citizen Assistance Knowledge Base'}</span>
          </div>

          <h2
            id="faq-section-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F50] tracking-tight"
          >
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>

          <p className="mt-2.5 text-sm sm:text-base font-medium text-[#596579]">
            {isHindi
              ? 'नागरिकसेतु के बारे में वो सब कुछ जो आपको जानना आवश्यक है'
              : 'Everything You Need to Know About NagrikSetu'}
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'प्रश्नों में खोजें...' : 'Search questions or topics...'}
              aria-label={isHindi ? 'प्रश्नों में खोजें' : 'Search FAQ questions'}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E3E8EF] rounded-full text-[#1D2939] placeholder-[#596579]/70 focus:outline-none focus:ring-2 focus:ring-[#F47721] focus:border-transparent shadow-xs transition-all"
            />
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              aria-hidden="true"
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                aria-label={isHindi ? 'खोज साफ़ करें' : 'Clear search'}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5" role="region" aria-label="FAQ Accordion">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-[#E3E8EF] text-[#596579] text-sm">
              <p>{isHindi ? 'कोई प्रासंगिक प्रश्न नहीं मिला।' : 'No matching questions found.'}</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-[#F47721] hover:underline"
              >
                {isHindi ? 'सभी प्रश्न देखें' : 'View all questions'}
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const qText = isHindi ? faq.questionHi : faq.questionEn;
              const aText = isHindi ? faq.answerHi : faq.answerEn;
              const catText = isHindi ? faq.categoryHi : faq.categoryEn;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 bg-white shadow-2xs overflow-hidden ${
                    isOpen
                      ? 'border-[#F47721]/60 shadow-md ring-1 ring-[#F47721]/30'
                      : 'border-[#E3E8EF] hover:border-[#0B1F50]/30'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${faq.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${faq.id}`}
                      onClick={() => toggleAccordion(idx)}
                      className="w-full text-left px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721] rounded-2xl"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span
                          className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-black shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#F47721] text-white'
                              : 'bg-[#EEF4FF] text-[#0B1F50]'
                          }`}
                          aria-hidden="true"
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-sm sm:text-base font-bold text-[#0B1F50] leading-snug block">
                            {qText}
                          </span>
                          <span className="text-[10px] font-semibold text-[#596579] uppercase tracking-wider mt-0.5 inline-block">
                            {catText}
                          </span>
                        </div>
                      </div>

                      {/* Expand / Collapse Icon */}
                      <span
                        className={`flex items-center justify-center h-7 w-7 rounded-full border shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'bg-[#FFF9F1] border-[#F47721] text-[#F47721] rotate-180'
                            : 'bg-white border-[#E3E8EF] text-[#596579]'
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                  </h3>

                  {/* Accordion Panel Content */}
                  <div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    hidden={!isOpen}
                    className={`px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#1D2939] leading-relaxed border-t border-[#E3E8EF]/60 bg-[#FFF9F1]/40 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <p className="pt-2">{aText}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Notice */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#E3E8EF] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">💡</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0B1F50]">
                {isHindi ? 'क्या आपका कोई और सवाल है?' : 'Have a different question or need guidance?'}
              </p>
              <p className="text-[11px] sm:text-xs text-[#596579]">
                {isHindi
                  ? 'हमारे एकीकृत AI नागरिक सहायक से अपनी भाषा में कभी भी पूछें।'
                  : 'Ask our Unified AI Citizen Assistant anytime in Hindi, English, or Hinglish.'}
              </p>
            </div>
          </div>
          <a
            href="/assistant"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1F50] text-white text-xs font-bold hover:bg-[#0a2b4c] transition-colors shrink-0 shadow-xs"
          >
            <span>💬</span>
            <span>{isHindi ? 'AI सहायक से पूछें' : 'Chat with AI Assistant'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
