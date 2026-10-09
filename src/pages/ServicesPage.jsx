import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getAllServices,
  detectServiceIntent,
} from '../services/governmentServiceNavigator';

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Filtered services
  const filteredServices = useMemo(() => {
    return getAllServices({
      category: selectedCategory,
      state: selectedState,
      query: searchQuery,
    });
  }, [selectedCategory, selectedState, searchQuery]);

  // Handle AI natural language query
  const handleAiSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      // First attempt backend Gemini-powered endpoint
      const res = await fetch('/api/find-government-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          state: selectedState !== 'All' ? selectedState : null,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        // Fallback to client-side deterministic intent detector
        const local = detectServiceIntent(searchQuery, selectedState !== 'All' ? selectedState : null);
        setAiResult(local);
      }
    } catch {
      // Offline / Network fallback
      const local = detectServiceIntent(searchQuery, selectedState !== 'All' ? selectedState : null);
      setAiResult(local);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStateSelectFromPrompt = (stateName) => {
    setSelectedState(stateName);
    // Re-evaluate intent with selected state
    const updated = detectServiceIntent(searchQuery, stateName);
    if (updated.serviceId) {
      navigate(`/services/${updated.serviceId}`);
    } else {
      setAiResult(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
    setAiResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* =========================================================================
            HEADER & HERO SECTION
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kesari-50 border border-kesari-200 text-kesari-700 text-xs sm:text-sm font-bold shadow-2xs">
            <span>🏛️</span>
            <span>{language === 'hi' ? 'सत्यापित सरकारी सेवा मार्गदर्शिका' : 'Verified GovTech Service Navigator'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-chakra-900 tracking-tight">
            {t('servicesTitle')}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            {t('servicesSubtitle')}
          </p>
        </div>

        {/* =========================================================================
            SEARCH & AI QUERY BAR
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm space-y-4">
          <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                id="service-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('servicesSearchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border border-border-input bg-surface-dim hover:bg-white focus:bg-white focus:border-chakra-500 focus:ring-2 focus:ring-chakra-200 focus:outline-hidden transition-all text-text-primary"
              />
            </div>
            <button
              id="ai-search-button"
              type="submit"
              disabled={aiLoading || !searchQuery.trim()}
              className="px-5 py-3 rounded-xl bg-chakra-800 hover:bg-chakra-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {aiLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>{t('servicesAiSearching')}</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>{t('servicesAiSearchPrompt')}</span>
                </>
              )}
            </button>
          </form>

          {/* =========================================================================
              AI FEEDBACK & SPECIAL INTENT BANNERS
              ========================================================================= */}
          {aiResult && (
            <div className="pt-2 animate-fade-slide-up">
              {/* 1. Civic Complaint Redirect Banner */}
              {aiResult.intent === 'civic_complaint' && (
                <div
                  id="civic-redirect-banner"
                  className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        {language === 'hi' ? 'नागरिक शिकायत का पता चला' : 'Civic Grievance Detected'}
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {language === 'hi'
                          ? aiResult.hiMessage || t('servicesCivicRedirectNotice')
                          : aiResult.message || t('servicesCivicRedirectNotice')}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/report"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                  >
                    {t('servicesCivicRedirectBtn')} →
                  </Link>
                </div>
              )}

              {/* 2. Missing State Selection Banner */}
              {aiResult.requiresState && (
                <div
                  id="state-prompt-banner"
                  className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl">📍</span>
                    <div>
                      <h4 className="text-sm font-bold text-blue-950">{t('servicesStatePromptTitle')}</h4>
                      <p className="text-xs text-blue-800 mt-0.5">
                        {language === 'hi'
                          ? aiResult.hiMessage || t('servicesStatePromptDesc')
                          : aiResult.message || t('servicesStatePromptDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStateSelectFromPrompt('Delhi')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🏛️</span>
                      <span>Delhi (e-District Delhi)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStateSelectFromPrompt('Uttar Pradesh')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🏛️</span>
                      <span>Uttar Pradesh / Agra (eDistrict UP)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Direct Matched Service Banner */}
              {aiResult.serviceId && !aiResult.requiresState && (
                <div
                  id="ai-matched-service-banner"
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🎯</span>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        {language === 'hi' ? 'सत्यापित सेवा मिलान' : 'Verified Service Match Found'}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        {language === 'hi' ? aiResult.hiMessage || aiResult.message : aiResult.message}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/services/${aiResult.serviceId}`}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                  >
                    {language === 'hi' ? 'विवरण और चेकलिस्ट देखें' : 'View Requirements & Checklist'} →
                  </Link>
                </div>
              )}

              {/* 4. Unsupported or Not Found Banner */}
              {aiResult.intent === 'unsupported' && (
                <div
                  id="unsupported-service-banner"
                  className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">ℹ️</span>
                    <div>
                      <p className="font-semibold">
                        {language === 'hi' ? aiResult.hiMessage : aiResult.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              FILTERS ROW (Category & State)
              ========================================================================= */}
          <div className="pt-2 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-text-secondary whitespace-nowrap">
                {t('servicesCategoryFilter')}:
              </span>
              {[
                { id: 'All', en: 'All', hi: 'सभी' },
                { id: 'Certificates', en: 'Certificates', hi: 'प्रमाण पत्र' },
                { id: 'Identity & Travel', en: 'Identity & Travel', hi: 'पहचान व यात्रा' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-chakra-800 text-white shadow-2xs'
                      : 'bg-surface-dim hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {language === 'hi' ? cat.hi : cat.en}
                </button>
              ))}
            </div>

            {/* State Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-text-secondary whitespace-nowrap">
                {t('servicesStateFilter')}:
              </span>
              {[
                { id: 'All', en: 'All States / National', hi: 'सभी / राष्ट्रीय' },
                { id: 'Delhi', en: 'Delhi', hi: 'दिल्ली' },
                { id: 'Uttar Pradesh', en: 'UP / Agra', hi: 'उत्तर प्रदेश / आगरा' },
                { id: 'National', en: 'National', hi: 'राष्ट्रीय' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedState(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedState === st.id
                      ? 'bg-kesari-600 text-white shadow-2xs'
                      : 'bg-surface-dim hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {language === 'hi' ? st.hi : st.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RESULTS COUNT & ACTIVE FILTER BADGES
            ========================================================================= */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-chakra-900">{filteredServices.length}</span>
            <span>{t('servicesFoundCount')}</span>
            {(searchQuery || selectedCategory !== 'All' || selectedState !== 'All') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-kesari-600 hover:text-kesari-700 underline ml-2 cursor-pointer"
              >
                {t('servicesClearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SERVICES GRID
            ========================================================================= */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header: Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        service.state === 'Delhi'
                          ? 'bg-blue-100 text-blue-800'
                          : service.state === 'Uttar Pradesh'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      📍 {service.state}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span>✓</span>
                      <span>{service.verificationStatus}</span>
                    </span>
                  </div>

                  {/* Service Title */}
                  <div>
                    <h3 className="text-lg font-bold text-chakra-900 group-hover:text-kesari-600 transition-colors">
                      <Link to={`/services/${service.id}`}>
                        {language === 'hi' ? service.hiName : service.name}
                      </Link>
                    </h3>
                    <p className="text-[11px] font-semibold text-text-muted mt-0.5">
                      {service.department}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                    {language === 'hi' ? service.hiDescription : service.description}
                  </p>

                  {/* Appointment info pill */}
                  <div className="pt-2">
                    {service.appointmentRequired ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <span>📅</span>
                        <span>{t('serviceAppointmentRequiredBadge')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <span>⚡</span>
                        <span>{t('serviceAppointmentNotRequiredBadge')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between gap-2">
                  <a
                    href={service.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-chakra-700 hover:text-chakra-900 hover:underline flex items-center gap-1"
                    title={service.officialPortal}
                  >
                    <span>🌐 {language === 'hi' ? 'पोर्टल' : 'Official Portal'}</span>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>

                  <Link
                    to={`/services/${service.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-kesari-500 hover:bg-kesari-600 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'दस्तावेज व प्रक्रिया' : 'View Checklist'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-chakra-900">{t('servicesNoResults')}</h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया अपने खोज शब्द बदलें अथवा फ़िल्टर रीसेट करें।'
                : 'Try adjusting your search query, or clear your state and category filters.'}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-chakra-800 text-white text-xs font-bold hover:bg-chakra-900 transition-colors cursor-pointer"
            >
              {t('servicesClearFilters')}
            </button>
          </div>
        )}

        {/* =========================================================================
            TRUST, SAFETY & NON-AFFILIATION DISCLAIMER
            ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border-card text-xs text-text-muted space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="font-bold text-chakra-900">
                {language === 'hi' ? 'नागरिक सुरक्षा एवं सूचना सत्यता' : 'Citizen Trust & Verified Advisory'}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {t('serviceDisclaimerNotice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
