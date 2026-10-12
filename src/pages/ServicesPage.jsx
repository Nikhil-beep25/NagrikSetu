import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getAllServices,
  detectServiceIntent,
} from '../services/governmentServiceNavigator';
import { getApiEndpoint } from '../utils/apiConfig';

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
      const res = await fetch(getApiEndpoint('/api/find-government-service'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          state: selectedState !== 'All' ? selectedState : null,
          language,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (res.ok && isJson) {
        const json = await res.json();
        if (json.success && json.data) {
          setAiResult(json.data);
        } else if (json.data) {
          setAiResult(json.data);
        } else {
          setAiResult(json);
        }
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
    <div className="relative min-h-screen bg-[#FFF9F1] py-8 sm:py-12 overflow-hidden text-[#1D2939]">
      {/* Subtle Civic Infrastructure Watermark Background */}
      <div
        className="absolute inset-0 bg-watermark-infra opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* =========================================================================
            HEADER & HERO SECTION (Bharat Identity)
            ========================================================================= */}
        <div className="relative rounded-3xl bg-[#0B1F50] text-white p-6 sm:p-10 shadow-xl overflow-hidden">
          {/* Top Tricolor Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="w-1/3 bg-[#F47721]" />
            <div className="w-1/3 bg-white" />
            <div className="w-1/3 bg-[#13865B]" />
          </div>

          {/* Ashoka radial watermark within banner */}
          <div
            className="absolute inset-0 bg-watermark-mandala opacity-[0.08] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#F47721] text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <span>🏛️</span>
              <span>{language === 'hi' ? 'सत्यापित सरकारी सेवा नेविगेटर' : 'Verified GovTech Service Navigator'}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('servicesTitle')}
            </h1>

            <p className="font-body text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {t('servicesSubtitle')}
            </p>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & AI QUERY BAR
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E3E8EF] p-4 sm:p-6 shadow-md space-y-4">
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
                className="font-body w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border border-[#E3E8EF] bg-[#EEF4FF]/50 hover:bg-white focus:bg-white focus:border-[#F47721] focus:ring-2 focus:ring-[#F47721]/20 focus:outline-hidden transition-all text-[#1D2939]"
              />
            </div>
            <button
              id="ai-search-button"
              type="submit"
              disabled={aiLoading || !searchQuery.trim()}
              className="font-friendly px-6 py-3 rounded-xl bg-[#0B1F50] hover:bg-[#18367d] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
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
                  className="p-4 rounded-xl bg-[#FFF9F1] border-2 border-[#F47721] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="text-sm font-black text-[#F47721]">
                        {language === 'hi' ? 'नागरिक शिकायत का पता चला' : 'Civic Grievance Detected'}
                      </h4>
                      <p className="text-xs text-[#1D2939] mt-0.5 font-medium">
                        {language === 'hi'
                          ? aiResult.hiMessage || t('servicesCivicRedirectNotice')
                          : aiResult.message || t('servicesCivicRedirectNotice')}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/report"
                    className="px-4 py-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white text-xs font-black shrink-0 transition-colors shadow-sm"
                  >
                    {t('servicesCivicRedirectBtn')} →
                  </Link>
                </div>
              )}

              {/* 2. Missing State Selection Banner */}
              {aiResult.requiresState && (
                <div
                  id="state-prompt-banner"
                  className="p-4 rounded-xl bg-[#EEF4FF] border border-[#244A85]/30 space-y-3 shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl">📍</span>
                    <div>
                      <h4 className="text-sm font-black text-[#0B1F50]">{t('servicesStatePromptTitle')}</h4>
                      <p className="text-xs text-[#596579] mt-0.5">
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
                      className="px-4 py-2 rounded-xl bg-[#0B1F50] hover:bg-[#18367d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🏛️</span>
                      <span>Delhi (e-District Delhi)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStateSelectFromPrompt('Uttar Pradesh')}
                      className="px-4 py-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
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
                  className="p-4 rounded-xl bg-[#EDF9F3] border border-[#13865B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="text-sm font-black text-[#13865B]">
                        {language === 'hi' ? 'सत्यापित सेवा मिलान' : 'Verified Service Match Found'}
                      </h4>
                      <p className="text-xs text-[#1D2939] mt-0.5 font-medium">
                        {language === 'hi' ? aiResult.hiMessage || aiResult.message : aiResult.message}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/services/${aiResult.serviceId}`}
                    className="px-4 py-2 rounded-xl bg-[#13865B] hover:bg-[#0f6b49] text-white text-xs font-black shrink-0 transition-colors shadow-sm"
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
          <div className="pt-2 border-t border-[#E3E8EF] flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#596579] whitespace-nowrap">
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
                      ? 'bg-[#0B1F50] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {language === 'hi' ? cat.hi : cat.en}
                </button>
              ))}
            </div>

            {/* State Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#596579] whitespace-nowrap">
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
                      ? 'bg-[#F47721] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#596579]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0B1F50]">{filteredServices.length}</span>
            <span>{t('servicesFoundCount')}</span>
            {(searchQuery || selectedCategory !== 'All' || selectedState !== 'All') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#F47721] hover:text-[#d96617] underline ml-2 cursor-pointer"
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
                className="bg-white rounded-2xl border border-[#E3E8EF] p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header: Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        service.state === 'Delhi'
                          ? 'bg-[#EEF4FF] text-[#0B1F50] border border-[#244A85]/20'
                          : service.state === 'Uttar Pradesh'
                          ? 'bg-[#FFF9F1] text-[#F47721] border border-[#F47721]/30'
                          : 'bg-[#F5F0FF] text-[#7C3AED] border border-[#7C3AED]/30'
                      }`}
                    >
                      📍 {service.state}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF9F3] text-[#13865B] border border-[#13865B]/20 flex items-center gap-1">
                      <span>✓</span>
                      <span>{service.verificationStatus}</span>
                    </span>
                  </div>

                  {/* Service Title */}
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-[#0B1F50] group-hover:text-[#F47721] transition-colors">
                      <Link to={`/services/${service.id}`}>
                        {language === 'hi' ? service.hiName : service.name}
                      </Link>
                    </h3>
                    <p className="font-body text-[11px] font-semibold text-[#596579] mt-0.5">
                      {service.department}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-body text-xs text-[#596579] line-clamp-3 leading-relaxed font-normal">
                    {language === 'hi' ? service.hiDescription : service.description}
                  </p>

                  {/* Appointment info pill */}
                  <div className="pt-2">
                    {service.appointmentRequired ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <span>📅</span>
                        <span>{t('serviceAppointmentRequiredBadge')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#13865B] bg-[#EDF9F3] px-2 py-1 rounded-md border border-[#13865B]/20">
                        <span>⚡</span>
                        <span>{t('serviceAppointmentNotRequiredBadge')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-4 border-t border-[#E3E8EF] flex items-center justify-between gap-2">
                  <a
                    href={service.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0B1F50] hover:text-[#F47721] hover:underline flex items-center gap-1"
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
                    className="px-3.5 py-1.5 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1 active:scale-[0.98]"
                  >
                    <span>{language === 'hi' ? 'दस्तावेज व प्रक्रिया' : 'View Checklist'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E3E8EF] p-12 text-center space-y-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-[#0B1F50]">{t('servicesNoResults')}</h3>
            <p className="text-xs text-[#596579] max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया अपने खोज शब्द बदलें अथवा फ़िल्टर रीसेट करें।'
                : 'Try adjusting your search query, or clear your state and category filters.'}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-[#0B1F50] text-white text-xs font-black hover:bg-[#18367d] transition-colors cursor-pointer"
            >
              {t('servicesClearFilters')}
            </button>
          </div>
        )}

        {/* =========================================================================
            TRUST, SAFETY & NON-AFFILIATION DISCLAIMER
            ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3E8EF] text-xs text-[#596579] space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="font-bold text-[#0B1F50]">
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
