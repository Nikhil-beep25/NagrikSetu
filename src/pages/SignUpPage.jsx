import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    ward: 'Agra Municipal Ward (Agra, Uttar Pradesh)',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.termsAgreed) {
      setError('Please agree to citizen charter terms.');
      return;
    }

    setSubmitted(true);
    login({
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      ward: formData.ward,
    });
    setTimeout(() => {
      navigate('/complaints');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-surface-dim flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
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
            {language === 'hi' ? 'नागरिक खाता बनाएं' : 'Create Citizen Account'}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            {language === 'hi'
              ? 'AI नागरिक सहायता केंद्र में शामिल हों व आगरा नगर क्षेत्र की समस्याओं का समाधान पाएं'
              : 'Join the AI Civic Redressal portal for Agra, Uttar Pradesh to report issues & track resolutions'}
          </p>
        </div>

        {/* Main Material Card */}
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Nikhil Bhadauriya"
                  className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                  Assigned Ward / Neighborhood
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                >
                  <option value="Agra Municipal Ward (Agra, Uttar Pradesh)">Agra Municipal Ward (Agra, Uttar Pradesh)</option>
                  <option value="Local Ward, Agra">Local Ward, Agra</option>
                  <option value="Tajganj, Agra">Tajganj, Agra</option>
                  <option value="Sanjay Place, Agra">Sanjay Place, Agra</option>
                  <option value="Civil Lines, Agra">Civil Lines, Agra</option>
                  <option value="Kamla Nagar, Agra">Kamla Nagar, Agra</option>
                  <option value="Dayalbagh, Agra">Dayalbagh, Agra</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="mt-0.5 rounded text-chakra-600 focus:ring-kesari-300 h-4 w-4 shrink-0"
                  />
                  <span className="text-xs text-text-secondary leading-relaxed">
                    I agree to the Digital Citizen Governance Charter, accurate factual grievance filing standards, and terms of service.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full h-12 rounded-full bg-kesari-500 hover:bg-kesari-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                {submitted ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Creating Citizen Ledger...</span>
                  </>
                ) : (
                  <span>{language === 'hi' ? 'खाता बनाएं व शुरू करें' : 'Create Account & Access Portal'}</span>
                )}
              </button>
            </form>
          </div>

          <div className="bg-surface-dim p-4 text-center border-t border-border text-xs text-text-muted">
            {language === 'hi' ? 'पहले से खाता है?' : 'Already have a citizen account?'}{' '}
            <Link to="/signin" className="font-bold text-kesari-600 hover:text-kesari-700 underline">
              {language === 'hi' ? 'यहाँ साइन इन करें' : 'Sign In here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
