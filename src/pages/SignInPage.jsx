import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    login({ identifier: identifier || 'Citizen User' });
    setTimeout(() => {
      navigate('/complaints');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-surface-dim flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Masthead Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center gap-1 group">
            <img
              src="/assets/nagriksetu_logo.jpg"
              alt="NagrikSetu Logo"
              className="h-20 w-auto object-contain rounded-2xl shadow-xs group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
          <h1 className="text-2xl font-extrabold text-chakra-900 tracking-tight">
            {language === 'hi' ? 'नागरिक पोर्टल में प्रवेश करें' : 'Citizen Sign In'}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            {language === 'hi'
              ? 'अपनी शिकायतों को ट्रैक करने के लिए लॉगिन करें'
              : 'Sign in to access your civic grievance ledger & track SLA status'}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <span>🛡️</span>
            <span>
              {language === 'hi'
                ? 'प्रोटोटाइप सत्र: केवल प्रदर्शन हेतु। पासवर्ड या संवेदनशील डेटा एकत्र नहीं होता।'
                : 'Prototype Session: For demonstration only. No real passwords or sensitive data collected.'}
            </span>
          </div>
        </div>

        {/* Main Material Card */}
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Login Method Toggle */}
            <div className="grid grid-cols-2 p-1 bg-surface-dim rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  loginMethod === 'password'
                    ? 'bg-white text-chakra-900 shadow-2xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {language === 'hi' ? 'पासवर्ड द्वारा' : 'Password'}
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  loginMethod === 'otp'
                    ? 'bg-white text-chakra-900 shadow-2xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {language === 'hi' ? 'मोबाइल OTP द्वारा' : 'Mobile OTP'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                  {loginMethod === 'otp' ? 'Mobile Number' : 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginMethod === 'otp' ? 'Enter 10-digit mobile number' : 'citizen@example.com or mobile'}
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-chakra-800">
                      Password
                    </label>
                    <a href="#forgot" className="text-xs font-semibold text-kesari-600 hover:text-kesari-700">
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-chakra-800">
                      One Time Password (OTP)
                    </label>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="text-xs font-bold text-chakra-700 hover:text-chakra-900 underline"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">✓ OTP Sent</span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all font-mono tracking-widest text-center"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-chakra-600 focus:ring-kesari-300 h-4 w-4"
                  />
                  <span className="text-text-secondary font-medium">Remember this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full h-12 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>{language === 'hi' ? 'साइन इन करें' : 'Sign In to Citizen Portal'}</span>
                )}
              </button>
            </form>

            {/* Citizen Digital ID Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-border"></div>
              <span className="shrink mx-4 text-xs font-semibold text-text-muted uppercase">or continue with</span>
              <div className="grow border-t border-border"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="w-full h-11 rounded-xl border border-border-input bg-surface-dim hover:bg-white text-xs font-bold text-chakra-800 transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DigiLocker Citizen Single Sign-On (SSO)</span>
            </button>
          </div>

          <div className="bg-surface-dim p-4 text-center border-t border-border text-xs text-text-muted">
            {language === 'hi' ? 'नया नागरिक खाता चाहिए?' : "Don't have a citizen account yet?"}{' '}
            <Link to="/signup" className="font-bold text-kesari-600 hover:text-kesari-700 underline">
              {language === 'hi' ? 'यहाँ रजिस्टर करें' : 'Sign Up here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
