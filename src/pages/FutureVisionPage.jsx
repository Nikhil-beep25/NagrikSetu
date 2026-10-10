import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import AutomationVisionDemo from '../components/AutomationVisionDemo';

export default function FutureVisionPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const problems = [
    {
      title: isHindi ? 'जटिल सरकारी वेबसाइटें' : 'Complex Government Portals',
      desc: isHindi
        ? 'सैकड़ों अलग-अलग वेबसाइटें, खंडित लिंक और भ्रामक नेविगेशन मेनू।'
        : 'Hundreds of fragmented municipal and department websites with confusing navigation structures.',
      icon: '🌐',
    },
    {
      title: isHindi ? 'कठिन आवेदन पत्र' : 'Difficult Application Forms',
      desc: isHindi
        ? 'कानूनी और प्रशासनिक शब्दावली जो सामान्य नागरिकों को डराती है।'
        : 'Dense legalistic terminology and multi-page forms that intimidate everyday citizens.',
      icon: '📋',
    },
    {
      title: isHindi ? 'विभाग की अस्पष्ट जिम्मेदारी' : 'Unclear Department Jurisdictions',
      desc: isHindi
        ? 'सड़क, नाली या बिजली किसके अधिकार क्षेत्र में है (MCD, PWD, या DDA), यह पता न होना।'
        : 'Confusion between overlapping bodies (e.g. MCD vs PWD roads, DISCOMs vs Nagar Nigam).',
      icon: '🏛️',
    },
    {
      title: isHindi ? 'भाषा की बाधा' : 'Language & Literacy Barriers',
      desc: isHindi
        ? 'अधिकांश पोर्टल केवल अंग्रेजी में हैं, जबकि आम नागरिक हिंदी या मातृभाषा बोलते हैं।'
        : 'Portals predominantly mandate formal English phrasing, alienating vernacular speakers.',
      icon: '🗣️',
    },
    {
      title: isHindi ? 'अनेक पोर्टलों का बिखराव' : 'Fragmented Multiple Portals',
      desc: isHindi
        ? 'कचरे के लिए अलग पोर्टल, जन्म प्रमाण पत्र के लिए अलग, और बिजली के लिए अलग व्यवस्था।'
        : 'Disjointed logins and siloed procedures across city, state, and central directories.',
      icon: '🔀',
    },
    {
      title: isHindi ? 'बार-बार वही जानकारी भरना' : 'Repetitive Data Entry',
      desc: isHindi
        ? 'हर छोटे आवेदन के लिए नाम, पता और पहचान पत्र बार-बार दर्ज करना पड़ता है।'
        : 'Citizens must repeatedly enter identical personal details and re-upload common identity proofs.',
      icon: '⌨️',
    },
    {
      title: isHindi ? 'सीमित डिजिटल साक्षरता' : 'Limited Digital Literacy',
      desc: isHindi
        ? 'ग्रामीण और बुजुर्ग नागरिकों के पास कंप्यूटर या जटिल ऑनलाइन फॉर्म भरने का अनुभव नहीं होता।'
        : 'Millions of citizens lack smartphone familiarity, CAPTCHA experience, or document resizing skills.',
      icon: '📱',
    },
  ];

  const beneficiaries = [
    {
      title: isHindi ? 'ग्रामीण समुदाय' : 'Rural Communities',
      desc: isHindi
        ? 'गांवों और छोटे कस्बों के नागरिक, जहाँ साइबर कैफे या CSC केंद्र पर लंबी कतारें लगती हैं।'
        : 'Residents of villages and small towns who currently depend on distant cyber cafes or CSC agents.',
      icon: '🌾',
    },
    {
      title: isHindi ? 'वरिष्ठ नागरिक' : 'Senior Citizens',
      desc: isHindi
        ? 'बुजुर्ग जो छोटे फॉन्ट, जटिल पासवर्ड और तकनीकी झंझटों के बिना सीधे बात करके काम चाहते हैं।'
        : 'Elderly citizens who prefer conversational, large-text, or voice guidance over multi-layered websites.',
      icon: '👴',
    },
    {
      title: isHindi ? 'पहली बार इंटरनेट उपयोग करने वाले' : 'First-Time Internet Users',
      desc: isHindi
        ? 'नागरिक जो स्मार्टफोन तो चलाते हैं लेकिन ऑनलाइन सरकारी प्रक्रिया से अपरिचित हैं।'
        : 'Smartphone owners who know voice and chat apps but struggle with complex transactional web forms.',
      icon: '🌱',
    },
    {
      title: isHindi ? 'सीमित डिजिटल साक्षरता वाले लोग' : 'Limited Digital Literacy',
      desc: isHindi
        ? 'श्रमिक, दैनिक वेतनभोगी और छोटे दुकानदार जो प्रशासनिक जटिलता में समय नहीं गंवा सकते।'
        : 'Daily-wage workers and small vendors who cannot afford lost work hours navigating bureaucracy.',
      icon: '🤝',
    },
    {
      title: isHindi ? 'हिंदी व क्षेत्रीय भाषा बोलने वाले' : 'Vernacular & Hindi Speakers',
      desc: isHindi
        ? 'नागरिक जो अपनी सामान्य बोलचाल की भाषा में शिकायत दर्ज करने और समझने की इच्छा रखते हैं।'
        : 'Citizens who express civic needs clearly in colloquial Hindi or Hinglish rather than bureaucratic English.',
      icon: '🇮🇳',
    },
  ];

  const roadmapStages = [
    {
      stage: 'Stage 1: AI Guidance and Complaint Preparation',
      badge: isHindi ? 'वर्तमान MVP — लाइव' : 'Current MVP — Live Now',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: isHindi ? 'AI मार्गदर्शन और शिकायत तैयारी (Current MVP)' : 'AI Guidance and Complaint Preparation (Current MVP)',
      points: isHindi
        ? [
            'प्राकृतिक भाषा में शिकायत विश्लेषण (हिंदी, अंग्रेजी, हिंग्लिश)',
            'औपचारिक प्रशासनिक शिकायत पत्र का स्वतः निर्माण',
            'स्थान-आधारित सटीक सरकारी विभाग की पहचान',
            'आपातकालीन बिजली तार व जानलेवा खतरों की तत्काल पहचान (112 / 1912)',
            'सत्यापित सरकारी सेवाओं की चेकलिस्ट और .gov.in पोर्टल लिंक',
          ]
        : [
            'Natural language complaint analysis across Hindi, English, and Hinglish',
            'Automatic formal grievance drafting with administrative standards',
            'Intelligent location-based municipal authority detection',
            'Immediate pre-flight emergency safety interlock (112 & 1912)',
            'Verified government service navigator with authentic .gov.in links',
          ],
    },
    {
      stage: 'Stage 2: AI-Assisted Government Portal Navigation',
      badge: isHindi ? 'नियोजित' : 'Planned',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      title: isHindi ? 'AI-असिस्टेड सरकारी पोर्टल नेविगेशन' : 'AI-Assisted Government Portal Navigation',
      points: isHindi
        ? [
            'आधिकारिक पोर्टल के सटीक शिकायत फॉर्म तक सीधे ले जाना',
            'नागरिक को पोर्टल पर आवश्यक दस्तावेजों की पूर्व-तैयारी कराना',
            'आधिकारिक पोर्टल API या सहायता प्लगइन के साथ सुरक्षित संयोजन',
            'विभागीय क्षेत्राधिकार में बदलाव होने पर स्वतः अद्यतन',
          ]
        : [
            'Direct deep-linking and guided routing to exact official submission forms',
            'Pre-checking document dimensions and file formats before portal visit',
            'Assisted navigation integration respecting portal access terms',
            'Automated municipal boundary updates across expanding tier-2/3 cities',
          ],
    },
    {
      stage: 'Stage 3: Citizen-Approved Form Automation',
      badge: isHindi ? 'नियोजित (अनुमति अधीन)' : 'Planned (Subject to Permissions)',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      title: isHindi ? 'नागरिक-अनुमोदित फॉर्म ऑटोमेशन' : 'Citizen-Approved Form Automation (Planned, subject to portal permissions)',
      points: isHindi
        ? [
            'नागरिक द्वारा दी गई जानकारी से पोर्टल फॉर्म फील्ड स्वतः तैयार करना',
            'हर फील्ड की नागरिक द्वारा स्पष्ट समीक्षा और मंजूरी (ह्यूमन-इन-द-लूप)',
            'बिना नागरिक सहमति के कोई भी डेटा सबमिट नहीं करना',
            'CAPTCHA और OTP प्रक्रिया में नागरिक का सीधा नियंत्रण',
          ]
        : [
            'Assisted pre-filling of supported portal fields using approved data',
            'Mandatory human-in-the-loop review before any submission step',
            'Strict zero-action policy without explicit citizen authorization',
            'Never bypassing security controls: citizen handles OTP and CAPTCHA directly',
          ],
    },
    {
      stage: 'Stage 4: Authorized Submission and Status Tracking',
      badge: isHindi ? 'दीर्घकालिक विजन' : 'Long-Term Vision',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
      title: isHindi ? 'अधिकृत सबमिशन व लाइव स्थिति ट्रैकिंग' : 'Authorized Submission and Status Tracking (Long-Term Vision)',
      points: isHindi
        ? [
            'सरकारी API के माध्यम से प्रमाणित सुरक्षित शिकायत पंजीकरण',
            'आधिकारिक संदर्भ संख्या के साथ वास्तविक समय स्थिति ट्रैकिंग',
            'समय-सीमा बीतने पर स्वतः एस्केलेशन रिमाइंडर व CPGRAMS अपील',
            'ग्रामीण नागरिकों के लिए पूर्णतः वॉइस-आधारित संवादात्मक अनुभव',
          ]
        : [
            'Certified secure grievance submission via official government open APIs',
            'Real-time status tracking using genuine verified government reference IDs',
            'Automated escalation alerts and citizen appeals under Citizens Charter',
            'Complete voice-first conversational experience for low-literacy citizens',
          ],
    },
  ];

  const uspItems = [
    {
      num: '01',
      title: isHindi ? 'संवाद-प्रथम इंटरफेस' : 'Conversation-First Interface',
      desc: isHindi
        ? 'नागरिक को जटिल ड्रॉपडाउन या पोर्टल समझने की आवश्यकता नहीं; आम बोलचाल में समस्या बताएं।'
        : 'Citizens describe problems in everyday spoken language without learning bureaucratic terminology.',
      icon: '💬',
    },
    {
      num: '02',
      title: isHindi ? 'बहुभाषी पहुंच (हिंदी व हिंग्लिश)' : 'Multilingual Accessibility',
      desc: isHindi
        ? 'हिंदी, अंग्रेजी और हिंग्लिश का सहज समर्थन, जिससे कोई भी भाषा की वजह से पीछे न छूटे।'
        : 'Engineered specifically for Indic linguistic nuances, colloquial code-mixing, and voice.',
      icon: '🗣️',
    },
    {
      num: '03',
      title: isHindi ? 'AI-संचालित शिकायत तैयारी' : 'AI-Powered Complaint Preparation',
      desc: isHindi
        ? 'कच्ची भाषा को कानूनी रूप से मान्य, गरिमापूर्ण प्रशासनिक प्रारूप में बदलना।'
        : 'Translates raw citizen frustration into structured, factual administrative letters that officers respect.',
      icon: '📄',
    },
    {
      num: '04',
      title: isHindi ? 'सटीक सरकारी विभाग मैपिंग' : 'Intelligent Government Navigation',
      desc: isHindi
        ? 'नक्शे और सड़क की चौड़ाई के आधार पर सही विभाग (MCD, PWD, Discom, नगर निगम) का चयन।'
        : 'Deterministic geospatial and jurisdictional routing eliminating cross-departmental ping-pong.',
      icon: '🧭',
    },
    {
      num: '05',
      title: isHindi ? 'भविष्य का एजेंटिक ऑटोमेशन' : 'Future Agentic Automation',
      desc: isHindi
        ? 'नागरिक की अनुमति से सरकारी प्रक्रिया और फॉर्म को पूरा करने में सहायता का विजन।'
        : 'Our long-term roadmap aims to automate supported workflows with explicit citizen consent.',
      icon: '🤖',
    },
    {
      num: '06',
      title: isHindi ? 'मानव नियंत्रण में (ह्यूमन-इन-कंट्रोल)' : 'Human-in-Control Design',
      desc: isHindi
        ? 'नागरिक हर कदम की समीक्षा करता है; कोई भी काम नागरिक की स्पष्ट अनुमति के बिना नहीं होता।'
        : 'The citizen retains full agency. AI assists and drafts, but humans review, authorize, and submit.',
      icon: '🛡️',
    },
  ];

  const ethicalGuarantees = [
    {
      title: isHindi ? 'स्पष्ट नागरिक सहमति' : 'Explicit Citizen Consent',
      desc: isHindi
        ? 'कोई भी फॉर्म या कार्य नागरिक की स्पष्ट अनुमति के बिना शुरू या सबमिट नहीं होगा।'
        : 'Every workflow step pauses for explicit citizen authorization before execution.',
    },
    {
      title: isHindi ? 'पोर्टल नियमों का सम्मान' : 'Respect Official Portal Rules',
      desc: isHindi
        ? 'सभी सरकारी वेबसाइटों की सेवा शर्तों और नियमों का पूर्ण सम्मान।'
        : 'Full adherence to government website terms, API guidelines, and rate limitations.',
    },
    {
      title: isHindi ? 'CAPTCHA या OTP कभी बायपास नहीं' : 'Never bypass CAPTCHA & Never bypass OTP verification',
      desc: isHindi
        ? 'सुरक्षा नियंत्रण नागरिक के हाथ में: OTP और CAPTCHA नागरिक स्वयं भरेंगे।'
        : 'NagrikSetu will Never bypass CAPTCHA and Never bypass OTP verification under any circumstances.',
    },
    {
      title: isHindi ? 'कोई अनधिकृत प्रतिरूपण नहीं' : 'No Unauthorized Impersonation',
      desc: isHindi
        ? 'नागरिक की पहचान का कोई गलत उपयोग नहीं; केवल सहायक के रूप में कार्य।'
        : 'AI acts solely as a citizen-directed assistant, never impersonating users or authorities.',
    },
    {
      title: isHindi ? 'न्यूनतम डेटा संग्रह' : 'Minimal Data Collection',
      desc: isHindi
        ? 'आधार या पासवर्ड जैसे संवेदनशील डेटा का अनावश्यक संग्रह कभी नहीं किया जाता।'
        : 'We never collect or store Aadhaar numbers, biometric data, or banking credentials.',
    },
    {
      title: isHindi ? 'केवल सत्यापित ट्रैकिंग' : 'Verified Official Tracking Only',
      desc: isHindi
        ? 'नकली संदर्भ संख्या नहीं; केवल सरकारी पोर्टल से पुष्टि होने पर ही आधिकारिक आईडी दिखाई जाएगी।'
        : 'Official case numbers are displayed only when genuinely verified by government portals.',
    },
  ];

  return (
    <div className="bg-[#FFF9F1] min-h-screen text-[#1D2939] relative overflow-hidden">
      {/* Subtle Digital Nodes Watermark Background */}
      <div
        className="absolute inset-0 bg-watermark-nodes opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      {/* =========================================================================
          HERO: THE FUTURE OF NAGRIKSETU (Phase 15 Bharat Identity)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0B1F50] text-white py-16 sm:py-24">
        {/* Tricolor top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-[#F47721]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#13865B]" />
        </div>

        {/* Ashoka radial watermark */}
        <div
          className="absolute inset-0 bg-watermark-mandala opacity-[0.08] pointer-events-none"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#F47721] backdrop-blur-md">
            <span>🚀</span>
            <span>{isHindi ? 'नागरिकसेतु विजन' : 'Product Vision & Roadmap'}</span>
            <span className="text-white/60">•</span>
            <span className="text-emerald-300">COMING SOON</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {isHindi ? 'नागरिक सेवाओं का भविष्य संवादात्मक है।' : 'The Future of Citizen Services Is Conversational.'}
          </h1>

          <p className="text-lg sm:text-2xl font-black text-[#F47721] tracking-wide">
            {isHindi ? 'एक बातचीत। सरल सरकारी कार्यप्रवाह।' : 'One Conversation. Simpler Government Workflows.'}
          </p>

          <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed">
            {isHindi
              ? 'एक ऐसा AI-संचालित नागरिक ऑटोमेशन मंच, जहाँ लोग अपनी भाषा में समस्या बता सकें और AI जटिल सरकारी प्रक्रिया को पूरा करने में सहायता करे।'
              : 'An AI-powered citizen automation platform where people describe their problems in natural language, and AI helps complete the complex government service workflow with citizen authorization.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-200">
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              {isHindi ? '✓ ग्रामीण साक्षरता के अनुकूल' : '✓ Built for Low Digital Literacy'}
            </span>
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              {isHindi ? '✓ हिंदी व बोलचाल की भाषा' : '✓ Hindi & Vernacular First'}
            </span>
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              {isHindi ? '✓ मानव नियंत्रण में' : '✓ 100% Human-in-Control'}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: OUR MISSION
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3.5 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider">
            {isHindi ? 'हमारा मिशन' : 'Our Mission'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-chakra-900 tracking-tight">
            "{isHindi
              ? 'डिजिटल साक्षरता की परवाह किए बिना, हर नागरिक के लिए सरकारी सेवाओं को सुलभ बनाना।'
              : 'Making government services accessible to every citizen, regardless of digital literacy.'}"
          </h2>
          <p className="text-xs sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed pt-2">
            {isHindi
              ? 'भारत में करोड़ों नागरिकों के पास स्मार्टफोन है, लेकिन सरकारी पोर्टल की भाषा और प्रक्रिया इतनी जटिल है कि वे मदद के लिए दूसरों पर निर्भर रहते हैं। नागरिकसेतु का लक्ष्य इस खाई को पाटना है।'
              : 'Over 800 million citizens in India interact with civic governance, yet procedural complexity creates an invisible wall. NagrikSetu exists to eliminate this barrier through intelligent language understanding.'}
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM CITIZENS FACE
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
              {isHindi ? 'समस्या: नागरिक चुनौतियां' : 'The Problem'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'नागरिकों की समस्याएं: प्रशासनिक बाधाएं' : 'The Problem: Barriers Citizens Face'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {isHindi
                ? 'सरकारी सेवाओं का लाभ उठाने में आम नागरिक किन सात प्रमुख बाधाओं का सामना करते हैं:'
                : 'Seven fundamental friction points that disconnect citizens from public administration:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((prob, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{prob.icon}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">PROBLEM 0{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-chakra-900">{prob.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUR VISION & WORKFLOW
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider">
              {isHindi ? 'हमारा विजन' : 'Our Vision'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'एक बातचीत। एक सरल सरकारी प्रक्रिया।' : 'One Conversation. A Simpler Government Process.'}
            </h2>
            <p className="text-base sm:text-lg font-bold text-kesari-600 max-w-2xl mx-auto">
              {isHindi
                ? 'एक AI-संचालित सहायक जो नागरिकों को प्राकृतिक भाषा में समर्थित सरकारी प्रक्रियाओं को पूरा करने में मदद करता है।'
                : 'An AI-powered assistant that helps citizens complete supported government workflows through natural-language interaction.'}
            </p>
            <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
              {isHindi
                ? 'नागरिक अपनी भाषा में समस्या बताएंगे, और AI बाकी की जटिल प्रक्रिया में उनका मार्गदर्शन करेगा।'
                : 'How NagrikSetu’s envisioned agentic pipeline turns natural citizen input into authorized outcomes.'}
            </p>
          </div>

          {/* 6-Step Visual Workflow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border-2 border-kesari-200 bg-kesari-50/40 p-6 space-y-3 relative">
              <span className="text-[11px] font-mono font-extrabold text-kesari-700 bg-kesari-100 px-2 py-0.5 rounded">
                STEP 01
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'अपनी समस्या बताएं' : 'Tell Your Problem'}
              </h3>
              <div className="bg-white p-3 rounded-xl border border-kesari-200 text-xs italic text-slate-700">
                🗣️ "{isHindi ? 'मेरे गांव की सड़क पर गड्ढा है।' : 'Mere gaon ki sadak par gaddha hai.'}"
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'नागरिक अपनी साधारण बोलचाल की भाषा या आवाज में समस्या दर्ज करते हैं।'
                  : 'Citizens speak or type in their everyday language without technical forms.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                STEP 02
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'AI समस्या को समझता है' : 'AI Understands'}
              </h3>
              <div className="bg-surface-dim p-3 rounded-xl border border-border text-xs text-slate-700 space-y-1">
                <div>• Road damage classification</div>
                <div>• Relevant ward/locality extraction</div>
                <div>• Emergency safety check</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'AI समस्या की श्रेणी, स्थान और तात्कालिकता को अलग-अलग पहचानता है।'
                  : 'AI extracts civic categories, landmarks, and acute hazard indicators.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                STEP 03
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'AI प्रारूप तैयार करता है' : 'AI Prepares'}
              </h3>
              <div className="bg-surface-dim p-3 rounded-xl border border-border text-xs text-slate-700 space-y-1">
                <div>• Formal grievance letter drafting</div>
                <div>• Competent authority identified</div>
                <div>• Jurisdictional matching matrix</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'AI प्रशासनिक शिकायत पत्र बनाता है और संबंधित विभाग (जैसे PWD/MCD) तय करता है।'
                  : 'AI generates a formal administrative grievance and maps the responsible authority.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                STEP 04
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'AI पोर्टल तक ले जाता है' : 'AI Navigates'}
              </h3>
              <div className="bg-surface-dim p-3 rounded-xl border border-border text-xs text-slate-700 space-y-1">
                <div>• Official portal identified (.gov.in)</div>
                <div>• Exact grievance form located</div>
                <div>• Direct authenticated link</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'भावी ऑटोमेशन सही सरकारी शिकायत पोर्टल को खोजकर उसका लिंक प्रस्तुत करता है।'
                  : 'Future AI automation locates the appropriate official government complaint portal.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-chakra-700 bg-chakra-50 px-2 py-0.5 rounded">
                STEP 05
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'फॉर्म भरने में सहायता' : 'AI Assists Form Filling'}
              </h3>
              <div className="bg-surface-dim p-3 rounded-xl border border-border text-xs text-slate-700 space-y-1">
                <div>• Supported fields prepared</div>
                <div>• Citizen details pre-formatted</div>
                <div>• Document size pre-validated</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'नागरिक द्वारा स्वीकृत विवरण के आधार पर आवश्यक फॉर्म फील्ड तैयार किए जाते हैं।'
                  : 'Future automation prepares and populates supported fields using citizen-approved details.'}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6 space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                STEP 06
              </span>
              <h3 className="text-base font-extrabold text-chakra-900">
                {isHindi ? 'नागरिक समीक्षा व अनुमति' : 'Citizen Approves'}
              </h3>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold space-y-1">
                <div>🛡️ Human in full control</div>
                <div>✓ Explicit authorization required</div>
                <div>✓ Portal confirms submission</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'नागरिक फॉर्म की समीक्षा करता है। पोर्टल की शर्तों के अनुसार नागरिक की स्पष्ट अनुमति के बाद ही सबमिट होता है।'
                  : 'Citizen reviews the completed form. Where portal rules permit, assistant submits only upon explicit authorization.'}
              </p>
            </div>
          </div>

          {/* Step 7 Future Milestone Banner: Track Your Complaint */}
          <div className="rounded-2xl border border-chakra-200 bg-chakra-50/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h4 className="text-base font-extrabold text-chakra-900">
                  {isHindi ? 'भविष्य की अंतिम क्षमता: शिकायत ट्रैकिंग' : 'Future Milestone: Track Your Complaint'}
                </h4>
              </div>
              <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                {isHindi
                  ? 'सरकारी पोर्टल से औपचारिक पावती मिलने पर ही वास्तविक स्थिति ट्रैकिंग उपलब्ध कराई जाएगी। आधिकारिक स्थिति सरकारी पोर्टल के समर्थन पर निर्भर करती है।'
                  : 'Official tracking IDs and resolution status will be displayed only after genuine confirmation from the government portal. Official status tracking depends on government portal support.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-chakra-800 bg-white px-3 py-1.5 rounded-lg border border-chakra-200 self-start sm:self-auto shrink-0">
              ROADMAP MILESTONE
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW FUTURE AUTOMATION WORKS
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider">
              {isHindi ? 'कार्यप्रणाली विश्लेषण' : 'System Mechanics'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'भविष्य का ऑटोमेशन कैसे काम करेगा' : 'How Future Automation Works'}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto">
              {isHindi
                ? 'प्राकृतिक भाषा समझ से लेकर अधिकृत सबमिशन और ट्रैकिंग तक 7 प्रमुख तकनीकी घटक:'
                : 'The seven core technical building blocks powering citizen-authorized government workflows:'}
            </p>
          </div>

          {/* 7 Core Automation Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">🗣️</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'प्राकृतिक भाषा समझ' : 'Natural-language understanding'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'नागरिक की बोलचाल की बोली से मूल समस्या, स्थान, और तात्कालिकता निकालना।'
                  : 'Extracts core civic intent, jurisdiction, and urgency from everyday speech or text.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">🏛️</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'सरकारी प्राधिकरण पहचान' : 'Government authority identification'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'नगर निगम, विकास प्राधिकरण, जल संस्थान या पीडब्ल्यूडी की सटीक पहचान।'
                  : 'Accurately determines responsible governing department, municipal tier, and jurisdiction.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">🌐</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'आधिकारिक पोर्टल नेविगेशन' : 'Official portal navigation'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'संबंधित राज्य व केंद्रीय .gov.in पोर्टल के सटीक सबमिशन पेज तक पहुंच।'
                  : 'Opens the appropriate verified .gov.in endpoint, bypassing confusing navigation menus.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">📋</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'असिस्टेड फॉर्म भरना' : 'Assisted form filling'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'नागरिक द्वारा पूर्व-स्वीकृत विवरणों से आवश्यक पोर्टल फील्ड तैयार करना।'
                  : 'Prepares and fills supported fields using citizen-approved details.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">👁️</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'नागरिक समीक्षा व अनुमोदन' : 'Citizen review and approval'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'प्रत्येक फील्ड की स्पष्ट नागरिक समीक्षा। बिना अनुमति कोई कार्रवाई नहीं।'
                  : 'Mandatory human-in-the-loop review of every populated field before moving forward.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <span className="text-xl">✍️</span>
              <h4 className="text-sm font-bold text-chakra-900">
                {isHindi ? 'अधिकृत सबमिशन' : 'Authorized submission'}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isHindi
                  ? 'पोर्टल नियमों की अनुमति पर स्पष्ट नागरिक सहमति के बाद ही सबमिशन।'
                  : 'Executes submission only with explicit citizen authorization where portal rules permit.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-emerald-50/50 border-emerald-200">
              <span className="text-xl">📊</span>
              <h4 className="text-sm font-bold text-emerald-950">
                {isHindi ? 'आधिकारिक स्थिति ट्रैकिंग' : 'Official status retrieval where supported'}
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {isHindi
                  ? 'आधिकारिक ट्रैकिंग आईडी और स्थिति तभी दिखाना जब सरकारी पोर्टल से औपचारिक पुष्टि मिले।'
                  : 'Official status retrieval where supported by public APIs. Confirmed IDs shown only after portal verification.'}
              </p>
            </div>
          </div>

          {/* Interactive Simulation Demo Container */}
          <div className="space-y-4 pt-4">
            <div className="text-center max-w-xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wider">
                {isHindi ? 'संकल्पना पूर्वावलोकन' : 'Concept Preview — No Government Submission'}
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-black text-chakra-900">
                {isHindi ? 'इंटरैक्टिव सिमुलेशन का अनुभव करें' : 'Experience the Future Automation Workflow'}
              </h3>
            </div>
            <AutomationVisionDemo />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHO BENEFITS?
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2">
              {isHindi ? 'किसे लाभ होगा?' : 'Who Benefits?'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'किसे लाभ होगा? (लक्षित नागरिक)' : 'Who Benefits? Empowering Every Citizen'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {isHindi
                ? 'भारत के उन करोड़ों नागरिकों के लिए जो डिजिटल जटिलताओं से दूर रहना चाहते हैं:'
                : 'Empowering marginalized and non-technical citizens who face procedural barriers:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficiaries.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="text-3xl">{b.icon}</div>
                <h3 className="text-base font-bold text-chakra-900">{b.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FUTURE ROADMAP
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-kesari-50 border border-kesari-200 px-3 py-1 text-xs font-bold text-kesari-700 uppercase tracking-wider mb-2">
              {isHindi ? 'विकास चरण' : 'Future Roadmap'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'नागरिकसेतु की चरणबद्ध प्रगति' : 'From AI Guidance to Authorized Automation'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {isHindi
                ? 'चार स्पष्ट चरणों में हमारी योजना, वर्तमान MVP से लेकर दीर्घकालिक विजन तक:'
                : 'A transparent 4-stage progression distinguishing present capabilities from our long-term vision:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapStages.map((stage, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-400">{stage.stage}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${stage.statusColor}`}
                    >
                      {stage.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-chakra-900">{stage.title}</h3>
                  <ul className="space-y-2 text-xs text-text-secondary pt-2">
                    {stage.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-kesari-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHAT MAKES NAGRIKSETU DIFFERENT? (MAIN USP)
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-chakra-50 border border-chakra-200 px-3 py-1 text-xs font-bold text-chakra-800 uppercase tracking-wider mb-2">
              {isHindi ? 'हमारी विशिष्टता' : 'Our Unique Value'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'नागरिकसेतु दूसरों से अलग क्यों है?' : 'What Makes NagrikSetu Different?'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {isHindi
                ? 'छह मूलभूत स्तंभ जो नागरिकसेतु को वास्तविक नागरिक सशक्तिकरण का साधन बनाते हैं:'
                : 'Six core pillars that distinguish NagrikSetu from traditional civic dashboards:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uspItems.map((usp, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-slate-50/60 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{usp.icon}</span>
                  <span className="text-xs font-mono font-bold text-slate-400">PILAR {usp.num}</span>
                </div>
                <h3 className="text-base font-bold text-chakra-900">{usp.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: SECURITY, ETHICS & CITIZEN CONTROL
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              {isHindi ? 'सुरक्षा और नैतिकता' : 'Security and Ethics'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-chakra-900 tracking-tight">
              {isHindi ? 'सुरक्षा, नैतिकता व नागरिक नियंत्रण' : 'Security, Ethics & Citizen Control'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-muted">
              {isHindi
                ? 'भविष्य के ऑटोमेशन में नागरिक की गोपनीयता और आधिकारिक नियमों का कड़ाई से पालन:'
                : 'Our uncompromising commitment to user consent, portal terms, and ethical GovTech:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ethicalGuarantees.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <span>🛡️</span>
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Legal Non-Affiliation Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 max-w-3xl mx-auto">
            <span>⚖️ <strong>Civic Integrity Disclosure:</strong> NagrikSetu is an independent civic tech prototype. It does not claim official government affiliation, authority partnership, or sovereign delegation. All portal references point exclusively to public .gov.in domains.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: ACCESSIBILITY VISION & BOTTOM CTA
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-chakra-900 to-[#001c38] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-kesari-300 uppercase tracking-wider">
            {isHindi ? 'सुलभता विजन' : 'Accessibility Vision'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isHindi ? 'हर भारतीय के लिए सुलभ शासन' : 'Accessible Governance for Every Indian'}
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'आवाज से शिकायत, सरल हिंदी निर्देश, बड़े स्पष्ट फॉन्ट, और भविष्य में मराठी, तमिल, तेलुगु, बंगाली और गुजराती भाषाओं का विस्तार।'
              : 'Voice-first interaction, clear Hindi and English guidance, large readable typography, and planned expansion to Marathi, Tamil, Telugu, Bengali, and Gujarati.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/report"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white px-8 py-3.5 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <span>{isHindi ? 'वर्तमान प्रोटोटाइप आज़माएं' : 'Try Current Prototype'}</span>
              <span>→</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 text-sm sm:text-base font-bold transition-all"
            >
              <span>{isHindi ? 'सरकारी सेवाएं देखें' : 'Explore Gov Services'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
