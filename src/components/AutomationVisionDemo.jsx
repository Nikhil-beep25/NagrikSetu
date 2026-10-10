import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AutomationVisionDemo() {
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Understanding, 2: Preparing, 3: Finding Portal, 4: Filling Fields, 5: Citizen Review, 6: Completed
  const [isRunning, setIsRunning] = useState(false);
  const [citizenApproved, setCitizenApproved] = useState(false);

  const sampleInputs = [
    {
      id: 'pothole',
      label: isHindi ? 'सड़क का गड्ढा (हिंदी)' : 'Road Pothole (Hinglish)',
      text: isHindi
        ? 'मेरे गांव की मुख्य सड़क पर बहुत गहरा गड्ढा है, वाहन चालकों को खतरा है।'
        : 'Mere area mein main sadak par bohot bada gaddha hai, accident ka khatra hai.',
    },
    {
      id: 'garbage',
      label: isHindi ? 'कचरा ढेर (हिंदी)' : 'Garbage Dump (English)',
      text: isHindi
        ? 'गली नंबर 4 में 3 दिन से कचरा नहीं उठा है, बदबू फैल रही है।'
        : 'Rotting garbage has been piling up outside our colony gate for three days in Agra.',
    },
    {
      id: 'income',
      label: isHindi ? 'आय प्रमाण पत्र (हिंदी)' : 'Income Certificate (Hinglish)',
      text: isHindi
        ? 'मुझे स्कॉलरशिप के लिए आय प्रमाण पत्र बनवाना है, प्रक्रिया समझाइए।'
        : 'Mujhe college scholarship ke liye income certificate banwana hai UP mein.',
    },
  ];

  const [selectedPrompt, setSelectedPrompt] = useState(sampleInputs[0].text);

  // Auto-advance through stages 1 to 4 when running
  useEffect(() => {
    let timer;
    if (isRunning && activeStep >= 1 && activeStep < 5) {
      timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [isRunning, activeStep]);

  const handleStartSimulation = () => {
    setCitizenApproved(false);
    setActiveStep(1);
    setIsRunning(true);
  };

  const handleApprove = () => {
    setCitizenApproved(true);
    setActiveStep(6);
    setIsRunning(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsRunning(false);
    setCitizenApproved(false);
  };

  const stages = [
    {
      number: 1,
      title: isHindi ? 'समस्या समझना' : 'Understanding Your Problem',
      desc: isHindi
        ? 'AI प्राकृतिक भाषा से समस्या, स्थान और तात्कालिकता पहचानता है।'
        : 'AI analyzes natural language to extract civic category, location, and severity.',
      badge: isHindi ? 'प्राकृतिक भाषा विश्लेषण' : 'Natural Language Understanding',
    },
    {
      number: 2,
      title: isHindi ? 'शिकायत का प्रारूप तैयार करना' : 'Preparing Formal Grievance',
      desc: isHindi
        ? 'कच्चे विवरण को आधिकारिक, गरिमापूर्ण प्रशासनिक प्रारूप में बदलना।'
        : 'Drafting structured administrative complaint with legal and civic clarity.',
      badge: isHindi ? 'औपचारिक प्रारूप' : 'Draft Generation',
    },
    {
      number: 3,
      title: isHindi ? 'आधिकारिक पोर्टल की पहचान' : 'Finding Government Portal',
      desc: isHindi
        ? 'संबंधित विभाग और आधिकारिक .gov.in पोर्टल की सटीक मैपिंग।'
        : 'Matching jurisdiction to official portal (e.g. PWD, MCD, or UP e-District).',
      badge: isHindi ? 'सरकारी पोर्टल मैपिंग' : 'Verified Portal Match',
    },
    {
      number: 4,
      title: isHindi ? 'फॉर्म के फील्ड तैयार करना' : 'Preparing Form Fields',
      desc: isHindi
        ? 'स्वीकृत नागरिक विवरण से आवश्यक फॉर्म फील्ड स्वतः तैयार करना।'
        : 'Preparing required input fields using citizen-provided information.',
      badge: isHindi ? 'असिस्टेड फॉर्म प्रिपरेशन' : 'Field Preparation',
    },
    {
      number: 5,
      title: isHindi ? 'नागरिक समीक्षा व अनुमति' : 'Waiting for Citizen Approval',
      desc: isHindi
        ? 'नागरिक विवरण की समीक्षा करता है। बिना स्पष्ट अनुमति कोई कार्य नहीं।'
        : 'Citizen reviews all prepared data. No submission occurs without explicit consent.',
      badge: isHindi ? 'मानव नियंत्रण में' : 'Human in the Loop',
    },
    {
      number: 6,
      title: isHindi ? 'प्रतीकात्मक प्रदर्शन पूर्ण' : 'Demonstration Complete',
      desc: isHindi
        ? 'सिमुलेशन समाप्त। भविष्य में आधिकारिक API के माध्यम से सुरक्षित प्रविष्टि।'
        : 'Simulation complete. In the future roadmap, authorized submission completes via official APIs.',
      badge: isHindi ? 'संकल्पना पूर्वावलोकन' : 'Concept Preview Complete',
    },
  ];

  return (
    <div className="rounded-3xl border-2 border-kesari-200 bg-white p-5 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Prominent Concept Preview Warning Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">🔬</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-amber-200 text-amber-900 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
                {isHindi ? 'संकल्पना पूर्वावलोकन' : 'Concept Preview'}
              </span>
              <span className="text-xs font-bold text-amber-950">
                {isHindi ? 'भविष्य की तकनीक का सिमुलेशन' : 'No Government Submission'}
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-900 leading-relaxed font-medium">
              {isHindi
                ? 'यह भविष्य के AI ऑटोमेशन का एक इंटरैक्टिव सिमुलेशन है। यह वास्तविक सरकारी पोर्टलों पर कोई शिकायत दर्ज नहीं करता और न ही कोई नकली संदर्भ संख्या बनाता है।'
                : 'This interactive simulation illustrates the future product experience. It does NOT connect to live government portals, submit complaints, or fabricate tracking numbers.'}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[11px] font-mono font-bold text-amber-800 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-300 self-start sm:self-auto">
          SIMULATION MODE
        </span>
      </div>

      {/* Step 0: Input Prompt Selector */}
      <div className="space-y-3 mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          {isHindi ? 'नमूना नागरिक समस्या चुनें या लिखें:' : 'Select or Customize Citizen Prompt:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleInputs.map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={isRunning}
              onClick={() => {
                setSelectedPrompt(sample.text);
                if (activeStep > 0) handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPrompt === sample.text
                  ? 'bg-chakra-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={selectedPrompt}
            onChange={(e) => {
              setSelectedPrompt(e.target.value);
              if (activeStep > 0) handleReset();
            }}
            disabled={isRunning}
            rows={2}
            className="w-full rounded-xl border border-border-input bg-surface-dim p-3.5 text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:border-chakra-500 focus:outline-hidden transition-all resize-none"
            placeholder={isHindi ? 'अपनी समस्या यहाँ लिखें...' : 'Type citizen issue here...'}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {activeStep === 0 && (
          <button
            type="button"
            onClick={handleStartSimulation}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-kesari-500 to-kesari-600 hover:from-kesari-600 hover:to-kesari-700 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
          >
            <span>▶</span>
            <span>{isHindi ? 'AI ऑटोमेशन सिमुलेशन शुरू करें' : 'Run Automation Simulation'}</span>
          </button>
        )}

        {activeStep > 0 && activeStep < 5 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chakra-50 border border-chakra-200 text-chakra-900 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
            <span>
              {isHindi ? 'AI प्रक्रिया प्रगति पर है...' : `Processing Step ${activeStep} of 6...`}
            </span>
          </div>
        )}

        {activeStep === 5 && !citizenApproved && (
          <button
            type="button"
            onClick={handleApprove}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer animate-pulse"
          >
            <span>✓</span>
            <span>{isHindi ? 'नागरिक अनुमति दें (सिमुलेशन)' : 'Simulate Citizen Approval'}</span>
          </button>
        )}

        {activeStep > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-border text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'रीसेट करें' : 'Reset Demo'}
          </button>
        )}
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {stages.map((stage) => {
          const isDone = activeStep > stage.number || (activeStep === 6 && stage.number === 6);
          const isCurrent = activeStep === stage.number;
          return (
            <div
              key={stage.number}
              className={`rounded-xl p-3 border transition-all ${
                isCurrent
                  ? 'bg-chakra-900 text-white border-chakra-900 shadow-md ring-2 ring-kesari-400'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-black">
                  STEP 0{stage.number}
                </span>
                {isDone && <span className="text-xs font-black text-emerald-600">✓</span>}
                {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-kesari-400 animate-ping" />}
              </div>
              <div className="text-xs font-bold truncate">{stage.title}</div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Simulated Stage Details Panel */}
      <div className="rounded-2xl border border-border bg-slate-50/70 p-5 sm:p-6 transition-all min-h-[220px] flex flex-col justify-between">
        {activeStep === 0 && (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <span className="text-3xl block">⚙️</span>
            <div className="text-sm font-bold text-slate-700">
              {isHindi ? 'सिमुलेशन तैयार है' : 'Interactive Concept Demo Ready'}
            </div>
            <p className="text-xs max-w-md mx-auto">
              {isHindi
                ? 'ऊपर दिए गए बटन पर क्लिक करें और देखें कि भविष्य में NagrikSetu जटिल सरकारी प्रक्रिया को कैसे सुगम बनाएगा।'
                : 'Click "Run Automation Simulation" above to witness the envisioned 6-step agentic citizen workflow.'}
            </p>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold text-chakra-800">
              <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
              <span>{stages[0].title}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-slate-500">{isHindi ? 'नागरिक इनपुट:' : 'Citizen Input:'}</span>
                <span className="font-semibold text-slate-800">"{selectedPrompt.slice(0, 70)}..."</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-slate-500">{isHindi ? 'पहचानी गई श्रेणी:' : 'Extracted Category:'}</span>
                <span className="font-bold text-kesari-700">Roads & Potholes / Civic Infrastructure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'तात्कालिकता:' : 'Assessed Urgency:'}</span>
                <span className="font-bold text-emerald-700">Normal / Public Safety Concern</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold text-chakra-800">
              <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
              <span>{stages[1].title}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border space-y-2 text-xs">
              <div className="font-mono text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <strong>Subject:</strong> Urgent repair requested for damaged road section causing safety hazard.
                <br />
                <strong>Addressed To:</strong> Executive Engineer / Chief Municipal Officer
                <br />
                <strong>Context:</strong> Deep potholes reported by resident with pedestrian safety implications.
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">
                ✓ Formal bureaucratic draft prepared with factual clarity.
              </span>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold text-chakra-800">
              <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
              <span>{stages[2].title}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <span>🏛️</span>
                <span>Public Works Department (PWD) / Municipal Corporation of Delhi (MCD)</span>
              </div>
              <div className="text-slate-500 flex items-center gap-2">
                <span>🌐 Verified Portal:</span>
                <span className="font-mono text-chakra-800">https://mcdonline.nic.in/</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Official .gov.in Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Road ownership matched based on locality road width (&lt;60ft colony street assigned to Municipal Local Body).
              </p>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold text-chakra-800">
              <span className="h-2 w-2 rounded-full bg-kesari-500 animate-ping" />
              <span>{stages[3].title}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-border grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">PORTAL FIELD 1</span>
                <span className="font-bold text-slate-800">Department: Engineering / Road Maintenance</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">PORTAL FIELD 2</span>
                <span className="font-bold text-slate-800">Sub-Category: Pothole / Surface Depression</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">PORTAL FIELD 3</span>
                <span className="font-bold text-slate-800">Location: Ward / Locality Identified</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">PORTAL FIELD 4</span>
                <span className="font-bold text-slate-800">Citizen Description: Formal Text Mapped</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>{isHindi ? 'नागरिक समीक्षा आवश्यक (ह्यूमन-इन-द-लूप)' : 'Citizen Review Required (Human in Control)'}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Authorization Pending
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-border text-xs space-y-2">
              <p className="text-slate-700 leading-relaxed">
                {isHindi
                  ? 'भविष्य की प्रणाली में, फॉर्म का हर विवरण नागरिक को पूर्व-समीक्षा के लिए दिखाया जाएगा। कोई भी सरकारी फॉर्म आपकी स्पष्ट अनुमति के बिना सबमिट नहीं होगा।'
                  : 'In NagrikSetu’s envisioned automation, the citizen retains full control. Review the prepared fields before granting authorization to simulate submission.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Form Data: Ready for Citizen Consent</span>
                <span className="font-bold text-chakra-800">Status: Paused for Approval</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div className="space-y-3 animate-fade-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <span>🎉</span>
              <span>{isHindi ? 'सिमुलेशन सफलतापूर्वक पूर्ण!' : 'Simulation Successfully Completed!'}</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-border space-y-3 text-xs">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1">
                <div className="text-xs font-extrabold text-slate-800">
                  {isHindi ? 'भविष्य का अंतिम चरण: आधिकारिक ट्रैकिंग' : 'Future Milestone: Official Status Tracking'}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isHindi
                    ? 'वास्तविक कार्यान्वयन में, सरकारी पोर्टल से आधिकारिक संदर्भ संख्या प्राप्त होने पर ही रसीद और लाइव स्थिति ट्रैकिंग प्रदर्शित की जाएगी।'
                    : 'In the long-term roadmap, official complaint tracking IDs and resolution timelines will only be shown after official portal verification. Zero fabricated tracking numbers.'}
                </p>
              </div>

              <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                ⚠️ Notice: This was a simulated demonstration for hackathon presentation. No government data was modified.
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            {isHindi
              ? 'आगामी AI ऑटोमेशन • नागरिक नियंत्रण व गोपनीयता सर्वोपरि'
              : 'Upcoming AI Automation • Citizen Consent & Portal Compliance Prioritized'}
          </span>
          <span className="font-mono text-kesari-600 font-bold">
            STAGE {activeStep}/6
          </span>
        </div>
      </div>
    </div>
  );
}
