import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import PageHero from '../components/PageHero';

export default function LegalInfoPage() {
  const { language } = useLanguage();
  const location = useLocation();
  const isHindi = language === 'hi';

  // Determine active tab from pathname: '/privacy', '/terms', '/accessibility', '/disclaimer'
  const getTabFromPath = (pathname) => {
    if (pathname.includes('/privacy')) return 'privacy';
    if (pathname.includes('/terms')) return 'terms';
    if (pathname.includes('/accessibility')) return 'accessibility';
    if (pathname.includes('/disclaimer')) return 'disclaimer';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const tabs = [
    { id: 'privacy', path: '/privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति' },
    { id: 'terms', path: '/terms', labelEn: 'Terms of Use', labelHi: 'उपयोग की शर्तें' },
    { id: 'accessibility', path: '/accessibility', labelEn: 'Accessibility', labelHi: 'सुगमता' },
    { id: 'disclaimer', path: '/disclaimer', labelEn: 'Disclaimer', labelHi: 'अस्वीकरण' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col">
      <PageHero
        title={
          activeTab === 'privacy'
            ? isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'
            : activeTab === 'terms'
            ? isHindi ? 'उपयोग की शर्तें' : 'Terms of Use'
            : activeTab === 'accessibility'
            ? isHindi ? 'सुगमता विवरण' : 'Accessibility Statement'
            : isHindi ? 'मंच अस्वीकरण' : 'Platform Disclaimer'
        }
        subtitle={
          isHindi
            ? 'नागरिक सुरक्षा, पारदर्शिता और स्वतंत्र नागरिक सहायता की प्रतिबद्धता।'
            : 'Commitment to citizen trust, privacy, accessibility, and transparent civic assistance.'
        }
        description={
          isHindi
            ? 'नागरिकसेतु एक स्वतंत्र AI-संचालित नागरिक सहायता प्रोटोटाइप है। यहाँ हमारे डेटा सुरक्षा सिद्धांत, उपयोग की शर्तें और आधिकारिक अस्वीकरण दिए गए हैं।'
            : 'NagrikSetu is an independent AI-powered citizen assistance research prototype. Review our transparent data practices, terms, accessibility commitments, and non-governmental disclaimer below.'
        }
        variant="civic"
        primaryAction={{
          label: isHindi ? 'समस्या रिपोर्ट करें' : 'Report a Civic Issue',
          to: '/report',
        }}
        secondaryAction={{
          label: isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Read FAQs',
          to: '/#faq',
        }}
      />

      {/* Tabs Bar */}
      <section className="border-b border-[#E3E8EF] bg-white sticky top-16 z-20 shadow-2xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto py-3" aria-label="Legal document tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#0B1F50] text-white shadow-xs'
                      : 'text-[#596579] hover:text-[#0B1F50] hover:bg-[#EEF4FF]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isHindi ? tab.labelHi : tab.labelEn}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl w-full">
        <div className="bg-white rounded-3xl border border-[#E3E8EF] p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed text-[#1D2939]">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <article className="space-y-6">
              <div className="border-b border-[#E3E8EF] pb-4">
                <span className="text-xs font-bold text-[#F47721] uppercase tracking-wider">
                  {isHindi ? 'नागरिक डेटा सुरक्षा' : 'Citizen Data Protection'}
                </span>
                <h2 className="text-2xl font-black text-[#0B1F50] mt-1">
                  {isHindi ? 'नागरिकसेतु गोपनीयता नीति' : 'NagrikSetu Privacy Policy'}
                </h2>
                <p className="text-xs text-[#596579] mt-1">
                  {isHindi ? 'अंतिम अद्यतन: 2026 • प्रोटोटाइप संस्करण' : 'Last updated: 2026 • Prototype Version'}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <h3 className="text-lg font-bold text-[#0B1F50]">
                  1. {isHindi ? 'हम कौन सा डेटा एकत्र करते हैं' : 'Information We Handle'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'नागरिकसेतु एक नागरिक सहायता प्रोटोटाइप है। जब आप अपनी नागरिक समस्या बताते हैं (लिखित या बोलकर), तो हम केवल समस्या का विवरण, चुनी गई लोकेशन, और आपके द्वारा अपलोड की गई फोटो का उपयोग शिकायत पत्र प्रारूप तैयार करने के लिए करते हैं।'
                    : 'NagrikSetu processes information you provide to generate civic grievance drafts: text or voice problem descriptions, selected municipal location, and optional photographic evidence.'}
                </p>

                <h3 className="text-lg font-bold text-[#0B1F50]">
                  2. {isHindi ? 'डेटा संग्रहण और भंडारण' : 'Local Storage & Session Persistence'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'आपकी दर्ज की गई शिकायतें और सत्र विवरण मुख्य रूप से आपके ब्राउज़र के लोकल स्टोरेज (localStorage) में सुरक्षित रहते हैं ताकि आप "मेरी शिकायतें" पृष्ठ पर अपने मसौदे देख सकें। हम आपका व्यक्तिगत डेटा किसी तीसरे पक्ष को नहीं बेचते हैं।'
                    : 'Your generated complaints and tracking entries are primarily stored in your local browser storage (localStorage) for your personal reference under "My Complaints". We do not sell or monetize citizen data.'}
                </p>

                <h3 className="text-lg font-bold text-[#0B1F50]">
                  3. {isHindi ? 'AI प्रसंस्करण' : 'AI Analysis Processing'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'शिकायत विश्लेषण और पत्र निर्माण के लिए विवरण को सुरक्षित रूप से AI इंजन (Gemini AI या स्थानीय नियम-आधारित फॉलबैक) द्वारा संसाधित किया जाता है। संवेदनशील व्यक्तिगत पहचान विवरण साझा करने की आवश्यकता नहीं है।'
                    : 'Problem text is processed via our AI engine (Gemini AI API or local rule-based triage) solely to categorize urgency, identify municipal jurisdiction, and prepare draft letters.'}
                </p>

                <h3 className="text-lg font-bold text-[#0B1F50]">
                  4. {isHindi ? 'सरकारी विभागों के साथ डेटा साझाकरण' : 'Government Data Sharing Notice'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'वर्तमान में नागरिकसेतु किसी सरकारी पोर्टल या विभाग को स्वचालित रूप से आपका डेटा प्रेषित नहीं करता है। आप स्वयं आधिकारिक पोर्टलों (CPGRAMS/जनसुनवाई) पर जाकर समीक्षा के बाद आवेदन करते हैं।'
                    : 'NagrikSetu does not automatically transmit data to any government database. You retain complete ownership and decide when and where to submit your formatted complaint.'}
                </p>
              </div>
            </article>
          )}

          {/* TAB 2: TERMS OF USE */}
          {activeTab === 'terms' && (
            <article className="space-y-6">
              <div className="border-b border-[#E3E8EF] pb-4">
                <span className="text-xs font-bold text-[#F47721] uppercase tracking-wider">
                  {isHindi ? 'उपयोग की शर्तें' : 'Usage Terms'}
                </span>
                <h2 className="text-2xl font-black text-[#0B1F50] mt-1">
                  {isHindi ? 'नागरिकसेतु उपयोग की शर्तें' : 'NagrikSetu Terms of Use'}
                </h2>
                <p className="text-xs text-[#596579] mt-1">
                  {isHindi ? 'प्रोटोटाइप नागरिक सहायता सेवा' : 'Citizen Assistance Research Prototype'}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <h3 className="text-lg font-bold text-[#0B1F50]">
                  1. {isHindi ? 'सेवा का उद्देश्य' : 'Purpose of Service'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'नागरिकसेतु भारतीय नागरिकों को नागरिक समस्याओं को संरचित रूप में व्यक्त करने, उपयुक्त प्राधिकरणों की पहचान करने और सार्वजनिक सेवाओं की प्रक्रियाओं को समझने में सहायता करने के लिए बनाया गया एक गैर-सरकारी अनुसंधान मंच है।'
                    : 'NagrikSetu is an assistive technological prototype designed to assist citizens in articulating civic issues, understanding jurisdictional authorities, and navigating public services.'}
                </p>

                <h3 className="text-lg font-bold text-[#0B1F50]">
                  2. {isHindi ? 'नागरिक की जिम्मेदारी' : 'User Responsibility'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'AI द्वारा तैयार किए गए शिकायत पत्र केवल प्रारूप (ड्राफ्ट) हैं। सरकारी विभाग में प्रस्तुत करने से पहले शिकायत में दी गई जानकारी की सत्यता की जांच करना नागरिक का अपना उत्तरदायित्व है।'
                    : 'Drafts generated by AI are assistive recommendations. Citizens are responsible for reviewing all factual assertions before lodging any petition with statutory authorities.'}
                </p>

                <h3 className="text-lg font-bold text-[#0B1F50]">
                  3. {isHindi ? 'आपातकालीन सेवाएं शामिल नहीं' : 'No Emergency Dispatch'}
                </h3>
                <p className="text-[#596579]">
                  {isHindi
                    ? 'यह मंच किसी भी प्रकार की आपातकालीन कॉल (112/100/101/108) का विकल्प नहीं है। गंभीर खतरे या आपात स्थिति में तुरंत आधिकारिक पुलिस या दमकल हेल्पलाइन पर संपर्क करें।'
                    : 'This platform is not an emergency response system. In case of crime, fire, medical distress, or immediate peril, immediately dial 112 or national emergency helplines.'}
                </p>
              </div>
            </article>
          )}

          {/* TAB 3: ACCESSIBILITY STATEMENT */}
          {activeTab === 'accessibility' && (
            <article className="space-y-6">
              <div className="border-b border-[#E3E8EF] pb-4">
                <span className="text-xs font-bold text-[#13865B] uppercase tracking-wider">
                  {isHindi ? 'सार्वभौमिक सुगमता' : 'Universal Inclusion'}
                </span>
                <h2 className="text-2xl font-black text-[#0B1F50] mt-1">
                  {isHindi ? 'नागरिकसेतु सुगमता विवरण' : 'Accessibility Statement'}
                </h2>
                <p className="text-xs text-[#596579] mt-1">
                  {isHindi ? 'WCAG 2.1 AA मानक अनुपालन' : 'Committed to WCAG 2.1 AA Standards'}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <p className="text-[#596579]">
                  {isHindi
                    ? 'नागरिकसेतु का मूल उद्देश्य प्रत्येक भारतीय नागरिक—विशेष रूप से ग्रामीण, वरिष्ठ और कम डिजिटल साक्षरता वाले नागरिकों—के लिए सरकारी पहुंच को सुगम बनाना है।'
                    : 'NagrikSetu is designed with inclusion at its core, enabling senior citizens, first-time internet users, and rural citizens to access civic assistance without friction.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E3E8EF]">
                    <h4 className="font-bold text-[#0B1F50]">🎙️ {isHindi ? 'आवाज इनपुट' : 'Voice-First Input'}</h4>
                    <p className="text-xs text-[#596579] mt-1">
                      {isHindi ? 'हिंदी, अंग्रेजी और हिंग्लिश में बोलकर समस्या दर्ज करने की सुविधा।' : 'Supports spoken descriptions in Hindi, English, and Hinglish via Web Speech API.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E3E8EF]">
                    <h4 className="font-bold text-[#0B1F50]">🔍 {isHindi ? 'कीबोर्ड एवं स्क्रीन रीडर' : 'Keyboard & Screen Reader'}</h4>
                    <p className="text-xs text-[#596579] mt-1">
                      {isHindi ? 'पूर्ण कीबोर्ड नेविगेशन और स्पष्ट ARIA लेबल।' : 'Full tab sequence navigation, high-contrast focus rings, and accessible ARIA attributes.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E3E8EF]">
                    <h4 className="font-bold text-[#0B1F50]">🌐 {isHindi ? 'द्विभाषी अनुवाद' : 'Bilingual Support'}</h4>
                    <p className="text-xs text-[#596579] mt-1">
                      {isHindi ? 'सहज एक-क्लिक भाषा परिवर्तन (हिंदी और अंग्रेजी)।' : 'One-click instant toggle between English and Hindi across the entire interface.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E3E8EF]">
                    <h4 className="font-bold text-[#0B1F50]">📱 {isHindi ? 'सुलभ मोबाइल अनुभव' : 'Responsive Touch'}</h4>
                    <p className="text-xs text-[#596579] mt-1">
                      {isHindi ? 'किफायती एंड्रॉइड फोन पर 320px से लेकर बड़ी स्क्रीन तक सुचारू प्रदर्शन।' : 'Tested across 320px to 1440px with generous 44px+ touch targets.'}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* TAB 4: DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <article className="space-y-6">
              <div className="border-b border-[#E3E8EF] pb-4">
                <span className="text-xs font-bold text-[#F47721] uppercase tracking-wider">
                  {isHindi ? 'महत्वपूर्ण सूचना' : 'Legal Transparency'}
                </span>
                <h2 className="text-2xl font-black text-[#0B1F50] mt-1">
                  {isHindi ? 'मंच का आधिकारिक अस्वीकरण' : 'Platform Disclaimer'}
                </h2>
                <p className="text-xs text-[#596579] mt-1">
                  {isHindi ? 'स्वतंत्र गैर-सरकारी नागरिक सहायता पहल' : 'Independent Non-Governmental Civic Assistance Initiative'}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="p-4.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold">
                  ⚠️ {isHindi
                    ? 'नागरिकसेतु भारत सरकार, किसी राज्य सरकार या किसी नगर निगम का आधिकारिक पोर्टल या सरकारी अंग नहीं है।'
                    : 'NagrikSetu is NOT an official agency, portal, or department of the Government of India, any state government, or any municipal corporation.'}
                </div>

                <p className="text-[#596579]">
                  {isHindi
                    ? '1. स्वतंत्र मंच: यह मंच एक स्वतंत्र तकनीकी प्रोटोटाइप है, जिसे नागरिकों को अपनी समस्याओं को औपचारिक रूप देने और उचित प्राधिकरण की पहचान करने में सहायता के लिए विकसित किया गया है।'
                    : '1. Independent Platform: This platform is an independent civic technology research prototype developed to assist citizens in preparing structured grievances and discovering public services.'}
                </p>

                <p className="text-[#596579]">
                  {isHindi
                    ? '2. कोई प्रत्यक्ष सरकारी सबमिशन नहीं: प्रोटोटाइप वर्तमान में किसी सरकारी पोर्टल में सीधे शिकायत दर्ज नहीं करता है। नागरिक संबंधित आधिकारिक पोर्टलों (जैसे pgportal.gov.in या jansunwai.up.nic.in) पर जाकर स्वयं शिकायत सबमिट कर सकते हैं।'
                    : '2. No Direct Government Filing: NagrikSetu does not directly file tickets into official government databases. Citizens receive formatted drafts and verified links to lodge their complaints on official portals.'}
                </p>

                <p className="text-[#596579]">
                  {isHindi
                    ? '3. आपातकालीन स्थिति: गंभीर सार्वजनिक खतरे, अपराध, आग या दुर्घटना के लिए नागरिकसेतु का उपयोग न करें। सीधे 112 या संबंधित आपातकालीन सेवा को कॉल करें।'
                    : '3. Emergency Helplines: For immediate public safety hazards, crimes, fires, or medical emergencies, do not rely on NagrikSetu. Call 112 immediately.'}
                </p>
              </div>
            </article>
          )}

          {/* Quick Back to Home Link */}
          <div className="pt-6 border-t border-[#E3E8EF] flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xs font-bold text-[#0B1F50] hover:text-[#F47721] flex items-center gap-1.5 transition-colors"
            >
              <span>←</span>
              <span>{isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}</span>
            </Link>

            <Link
              to="/#faq"
              className="text-xs font-bold text-[#F47721] hover:underline"
            >
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न देखें →' : 'View Frequently Asked Questions →'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
