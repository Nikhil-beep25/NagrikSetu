import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { language } = useLanguage();
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('demo'); // 'demo' | 'password' | 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [demoCodeError, setDemoCodeError] = useState('');

  // One-click demo session login
  const handleDemoLogin = () => {
    setSubmitted(true);
    loginDemo({
      displayName: language === 'hi' ? 'डेमो नागरिक' : 'Demo Citizen',
      ward: 'Ward 42, Civil Lines (Agra Municipal Corporation)',
    });
    setTimeout(() => {
      navigate('/complaints');
    }, 350);
  };

  // Optional manual demo code submission
  const handleDemoCodeSubmit = (e) => {
    e.preventDefault();
    const cleanCode = demoCode.trim().toUpperCase();
    if (!cleanCode || cleanCode === 'DEMO' || cleanCode === 'DEMO2026' || cleanCode === 'NAGRIK2026') {
      handleDemoLogin();
    } else {
      setDemoCodeError(
        language === 'hi'
          ? 'अमान्य कोड। कृपया DEMO2026 का उपयोग करें या वन-क्लिक बटन दबाएं।'
          : 'Invalid demo code. Please enter DEMO2026 or click "Continue with Demo Account".'
      );
    }
  };

  // Standard credential / OTP submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    login({ identifier: identifier || 'Citizen User' });
    setTimeout(() => {
      navigate('/complaints');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FFF9F1] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Main Card with Tricolor Ribbon */}
        <div className="rounded-3xl border border-[#E3E8EF] bg-white shadow-xl overflow-hidden">
          {/* Top Tricolor Accent Bar */}
          <div className="h-1.5 w-full flex">
            <div className="w-1/3 bg-[#F47721]" />
            <div className="w-1/3 bg-white border-y border-slate-100" />
            <div className="w-1/3 bg-[#13865B]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* ==============================================================
                LEFT COLUMN (DESKTOP ONLY / HIDDEN ON SMALL MOBILE)
                Bharat Trust, Mission & Citizen Guidance Context
                ============================================================== */}
            <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0B1F50] via-[#09173c] to-[#040c1f] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
              {/* Subtle Ashoka radial watermark */}
              <div
                className="absolute inset-0 bg-watermark-mandala opacity-15 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-6">
                <Link to="/" className="inline-flex items-center gap-2.5 group">
                  <div className="h-12 w-12 rounded-xl bg-white p-1 shadow-md shrink-0">
                    <img
                      src="/assets/nagriksetu_logo.jpg"
                      alt="NagrikSetu Logo"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-xl font-black text-white tracking-tight">
                      Nagrik<span className="text-[#F47721]">Setu</span>
                    </span>
                    <span className="block text-[10px] text-slate-300 font-medium">
                      {language === 'hi' ? 'नागरिक सेवा पोर्टल' : 'Citizen Assistance Portal'}
                    </span>
                  </div>
                </Link>

                <div className="space-y-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F47721]/20 text-amber-300 border border-[#F47721]/30">
                    <span>🏛️</span>
                    <span>{language === 'hi' ? 'नागरिक-सशक्तिकरण' : 'Citizen Empowerment'}</span>
                  </span>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {language === 'hi'
                      ? 'नागरिक समस्याओं का सरल एवं पारदर्शी समाधान'
                      : 'Simpler Civic Grievances & Direct Public Services'}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'hi'
                      ? 'NagrikSetu नागरिकों को अपनी समस्याओं को आसानी से दर्ज करने और संबंधित विभागों तक पहुंचाने में सहायता करता है।'
                      : 'Designed to bridge the gap between Indian citizens and civic authorities through voice, multilingual AI, and structured complaint triage.'}
                  </p>
                </div>

                {/* Feature highlight bullets */}
                <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#13865B] bg-emerald-950 p-1 rounded-md text-xs">✓</span>
                    <span className="text-slate-200">
                      {language === 'hi'
                        ? 'आगरा पायलट: नगर निगम, जल संस्थान व बिजली विभाग'
                        : 'Agra Pilot: Municipal Corporation, Jal Sansthan & DVVNL'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#13865B] bg-emerald-950 p-1 rounded-md text-xs">✓</span>
                    <span className="text-slate-200">
                      {language === 'hi'
                        ? 'हिंदी और बहुभाषी AI मार्गदर्शन'
                        : 'Bilingual Hindi & English citizen triage'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#13865B] bg-emerald-950 p-1 rounded-md text-xs">✓</span>
                    <span className="text-slate-200">
                      {language === 'hi'
                        ? 'मूल्यांकन हेतु 1-क्लिक डेमो एक्सेस'
                        : '1-Click instant demo access for hackathon evaluators'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom security disclaimer note */}
              <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">
                  {language === 'hi' ? 'प्रोटोटाइप मूल्यांकन प्रणाली' : 'Prototype Evaluation Environment'}
                </p>
                <p>
                  {language === 'hi'
                    ? 'यह डेमो सत्र स्थानीय ब्राउज़र में कार्य करता है। किसी आधार या डिजिलॉकर क्रेडेंशियल की आवश्यकता नहीं है।'
                    : 'This demo session operates locally in browser storage. No Aadhaar or DigiLocker credentials required.'}
                </p>
              </div>
            </div>

            {/* ==============================================================
                RIGHT COLUMN: SIGN-IN FORM & 1-CLICK DEMO AUTH
                ============================================================== */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Mobile-only compact logo header */}
                <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-100">
                  <Link to="/" className="inline-flex items-center gap-2">
                    <img
                      src="/assets/nagriksetu_logo.jpg"
                      alt="NagrikSetu Logo"
                      className="h-10 w-10 object-cover rounded-xl border border-slate-200"
                    />
                    <span className="text-lg font-black text-[#0B1F50]">
                      Nagrik<span className="text-[#F47721]">Setu</span>
                    </span>
                  </Link>
                  <span className="text-[11px] font-bold text-[#F47721] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {language === 'hi' ? 'डेमो पोर्टल' : 'Demo Portal'}
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F50] tracking-tight">
                    {language === 'hi' ? 'नागरिक पोर्टल में प्रवेश करें' : 'Citizen Sign In'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {language === 'hi'
                      ? 'अपनी शिकायतों को ट्रैक करने व स्थिति देखने हेतु प्रवेश करें'
                      : 'Sign in to access your civic grievance ledger & track SLA status'}
                  </p>
                </div>

                {/* Prominent Demo Notice Box (Part 11.4 & Security Integrity) */}
                <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🛡️</span>
                  <div className="space-y-0.5">
                    <p className="font-black text-amber-950">
                      {language === 'hi' ? 'प्रदर्शन एवं मूल्यांकन सत्र' : 'Demonstration & Evaluation Access'}
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {language === 'hi'
                        ? 'डेमो खाता: डेटा और पहुंच केवल प्रदर्शन हेतु हैं। यह कोई सत्यापित नागरिक पहचान नहीं है।'
                        : 'Demo account: Data and access are for demonstration only. This is not a verified citizen identity.'}
                    </p>
                  </div>
                </div>

                {/* ==============================================================
                    PRIMARY DEMO BUTTON (PART 11.2 - HIGHEST VISIBILITY FOR JUDGES)
                    ============================================================== */}
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={submitted}
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#F47721] via-[#e56813] to-[#d95d08] hover:from-[#d95d08] hover:to-[#c04e03] text-white font-black text-sm shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer border border-amber-300/40"
                  >
                    {submitted ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>{language === 'hi' ? 'सत्र प्रारंभ हो रहा है...' : 'Launching Demo Session...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">⚡</span>
                        <div className="text-left leading-tight">
                          <span className="block font-black text-sm">
                            {language === 'hi' ? 'डेमो अकाउंट से जारी रखें' : 'Continue with Demo Account'}
                          </span>
                          <span className="block text-[10px] font-medium text-amber-100">
                            {language === 'hi'
                              ? 'तुरंत 1-क्लिक एक्सेस • पासवर्ड रहित'
                              : 'Instant 1-Click Access • No Credentials Needed'}
                          </span>
                        </div>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>⏱️</span>
                    <span>
                      {language === 'hi'
                        ? '2 घंटे का वैध स्थानीय सत्र (sessionStorage)'
                        : '2-Hour Local Demo Session (sessionStorage)'}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'या अन्य विकल्प' : 'or evaluate standard sign-in'}
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('demo')}
                    className={`py-2 rounded-lg transition-all ${
                      loginMethod === 'demo'
                        ? 'bg-white text-[#0B1F50] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? 'डेमो कोड' : 'Demo Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`py-2 rounded-lg transition-all ${
                      loginMethod === 'password'
                        ? 'bg-white text-[#0B1F50] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? 'नागरिक फॉर्म' : 'Citizen Form'}
                  </button>
                </div>

                {/* TAB 1: DEMO ACCESS CODE (PART 11.7) */}
                {loginMethod === 'demo' ? (
                  <form onSubmit={handleDemoCodeSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'hi' ? 'डेमो एक्सेस कोड (वैकल्पिक)' : 'Demo Access Code (Optional)'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={demoCode}
                          onChange={(e) => {
                            setDemoCode(e.target.value);
                            setDemoCodeError('');
                          }}
                          placeholder="e.g. DEMO2026"
                          className="flex-1 h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm font-mono tracking-wider uppercase text-slate-900 placeholder:text-slate-400 focus:border-[#0B1F50] focus:ring-2 focus:ring-amber-200 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 h-11 rounded-xl bg-[#0B1F50] hover:bg-[#071436] text-white font-bold text-xs transition-colors shrink-0"
                        >
                          {language === 'hi' ? 'सत्यापित करें' : 'Apply Code'}
                        </button>
                      </div>
                      {demoCodeError && (
                        <p className="text-[11px] text-red-600 font-medium mt-1">{demoCodeError}</p>
                      )}
                      <p className="text-[10px] text-slate-500 mt-1">
                        {language === 'hi'
                          ? 'सुझाव: कोड "DEMO2026" टाइप करें या सीधे ऊपर दिया गया वन-क्लिक बटन उपयोग करें।'
                          : 'Tip: Type "DEMO2026" or simply use the 1-click button above.'}
                      </p>
                    </div>
                  </form>
                ) : (
                  /* TAB 2: STANDARD PROTOTYPE CREDENTIAL FORM */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mobile Number or Email
                      </label>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="citizen@example.com or 9876543210"
                        className="w-full h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B1F50] focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Password
                        </label>
                        <span className="text-[11px] text-[#F47721]">Any test password</span>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B1F50] focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className="w-full h-11 rounded-xl bg-[#0B1F50] hover:bg-[#071436] text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      {submitted ? 'Signing in...' : 'Sign In with Credentials'}
                    </button>
                  </form>
                )}
              </div>

              {/* Bottom Footer Links */}
              <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <span>
                  {language === 'hi' ? 'नागरिक खाता नहीं है?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="font-bold text-[#F47721] hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'डेमो शुरू करें' : 'Try Demo Mode'}
                  </button>
                </span>
                <Link to="/" className="text-slate-500 hover:text-slate-800 text-[11px]">
                  ← {language === 'hi' ? 'होम पेज पर लौटें' : 'Back to Home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
