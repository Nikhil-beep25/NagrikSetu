import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useComplaints, STATUS_OPTIONS } from '../context/ComplaintContext';
import ComplaintTimeline from '../components/ComplaintTimeline';

export default function MyComplaintsPage() {
  const { language } = useLanguage();
  const {
    confirmedComplaints,
    updateComplaintStatus,
    clearComplaints,
    resetToDefaultComplaints,
  } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Category Filter Chips
  const filterChips = useMemo(
    () => [
      { id: 'All', label: language === 'hi' ? 'सभी' : 'All', categoryKey: null },
      { id: 'Waste', label: language === 'hi' ? 'कचरा' : 'Waste', categoryKey: 'Garbage' },
      { id: 'Roads', label: language === 'hi' ? 'सड़क' : 'Roads', categoryKey: 'Road/Pothole' },
      { id: 'Water', label: language === 'hi' ? 'जल' : 'Water', categoryKey: 'Water' },
      { id: 'Drainage', label: language === 'hi' ? 'नाली' : 'Drainage', categoryKey: 'Drainage' },
      { id: 'Lighting', label: language === 'hi' ? 'लाइटिंग' : 'Lighting', categoryKey: 'Streetlight' },
    ],
    [language],
  );

  // Dynamic calculations from actual application state (Section 5)
  const totalCount = confirmedComplaints.length;
  const activeCount = confirmedComplaints.filter((c) => c.status === 'Under Review').length;
  const resolvedCount = confirmedComplaints.filter((c) => c.status === 'Resolved').length;
  const pendingCount = confirmedComplaints.filter(
    (c) => c.status === 'Created' || c.status === 'Prepared' || c.status === 'Pending',
  ).length;

  // Real-time search & filter matching (Sections 7 & 8)
  const filteredComplaints = useMemo(() => {
    return confirmedComplaints.filter((item) => {
      // Category filter check
      if (selectedCategory !== 'All') {
        const chip = filterChips.find((f) => f.id === selectedCategory);
        if (chip?.categoryKey && item.category !== chip.categoryKey) {
          return false;
        }
      }

      // Search query check: ID, title, category, location, description
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = (item.id || '').toLowerCase().includes(query);
        const titleMatch = (item.subject || item.title || '').toLowerCase().includes(query);
        const categoryMatch = (item.category || '').toLowerCase().includes(query);
        const locationMatch = (item.location || '').toLowerCase().includes(query);
        const descMatch = (item.description || '').toLowerCase().includes(query);
        return idMatch || titleMatch || categoryMatch || locationMatch || descMatch;
      }

      return true;
    });
  }, [confirmedComplaints, selectedCategory, searchQuery, filterChips]);

  // Status badge styling per Stitch system (Section 10)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {language === 'hi' ? 'समाधानित' : 'Resolved'}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            {language === 'hi' ? 'समीक्षाधीन' : 'Under Review'}
          </span>
        );
      case 'Created':
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            {language === 'hi' ? 'निर्मित' : status || 'Created'}
          </span>
        );
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ==================================================
            3. PAGE CONTEXT — Simple Breadcrumb (Section 3)
           ================================================== */}
        <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:text-kesari-600 font-medium transition-colors flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'होम' : 'Home'}</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-[#001c38]">
            {language === 'hi' ? 'मेरी शिकायतें' : 'My Complaints'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-chakra-800 bg-chakra-50 border border-chakra-200 px-2 py-0.5 rounded-full">
            📍 {language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh'}
          </span>
        </nav>

        {/* ==================================================
            4. PAGE TITLE & CREATE BUTTON (Section 4)
           ================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-chakra-50 border border-chakra-200 px-2.5 py-0.5 text-[10px] font-bold text-chakra-800 uppercase tracking-wider shadow-2xs">
                <span>📍</span>
                <span>{language === 'hi' ? 'आगरा नागरिक शिकायत खाता' : 'Agra Civic Complaint Ledger'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001c38] tracking-tight">
              {language === 'hi' ? 'मेरी शिकायतें' : 'My Complaints'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'hi'
                ? 'आगरा, उत्तर प्रदेश में अपनी दर्ज की गई नागरिक समस्याओं को ट्रैक और प्रबंधित करें।'
                : 'Track and manage your reported civic issues in Agra, Uttar Pradesh.'}
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-kesari-500 hover:bg-kesari-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] w-full sm:w-auto shrink-0"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ {language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Create Complaint'}</span>
          </Link>
        </div>

        {/* ==================================================
            5. COMPLAINT SUMMARY CARDS (Section 5)
            Generated directly from application state
           ================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* TOTAL CARD */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'hi' ? 'कुल' : 'TOTAL'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#001c38] tabular-nums">
                {totalCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {language === 'hi' ? 'दर्ज' : 'Logged'}
              </span>
            </div>
          </div>

          {/* ACTIVE CARD */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {language === 'hi' ? 'सक्रिय' : 'ACTIVE'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-800 tabular-nums">
                {activeCount}
              </span>
              <span className="text-[10px] font-semibold text-amber-700">
                {language === 'hi' ? 'समीक्षा में' : 'Review'}
              </span>
            </div>
          </div>

          {/* RESOLVED CARD */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              {language === 'hi' ? 'समाधानित' : 'RESOLVED'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
                {resolvedCount}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {language === 'hi' ? 'पूर्ण' : 'Closed'}
              </span>
            </div>
          </div>

          {/* PENDING CARD */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              {language === 'hi' ? 'लंबित' : 'PENDING'}
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums">
                {pendingCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {language === 'hi' ? 'प्रतीक्षारत' : 'Queued'}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            6. PROTOTYPE NOTICE (Section 6)
            Subtle and non-intrusive
           ================================================== */}
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/90 px-3.5 py-2.5 text-xs text-slate-700 shadow-2xs">
          <svg
            className="h-4 w-4 text-kesari-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-bold text-slate-900">
              {language === 'hi' ? 'प्रोटोटाइप ट्रैकिंग:' : 'Prototype tracking:'}
            </span>
            <span className="text-slate-600">
              {language === 'hi'
                ? 'आगरा, उत्तर प्रदेश केंद्रित प्रोटोटाइप। लाइव सरकारी स्थिति एकीकरण अभी जुड़ा हुआ नहीं है।'
                : 'Prototype focused on Agra, Uttar Pradesh. Live government status integration is not connected yet.'}
            </span>
          </div>
        </div>

        {/* ==================================================
            7 & 8. SEARCH & CATEGORY FILTERS (Sections 7 & 8)
           ================================================== */}
        <div className="space-y-3">
          {/* SEARCH FIELD */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'शिकायतें खोजें (आईडी, शीर्षक, श्रेणी या स्थान)...'
                  : 'Search complaints...'
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-chakra-600 focus:outline-hidden focus:ring-2 focus:ring-chakra-100 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 text-xs"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* CATEGORY FILTERS (HORIZONTAL SCROLL ON MOBILE) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterChips.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#001c38] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            14. LOADING STATE SKELETON (Section 14)
           ================================================== */}
        {isLoading && (
          <div className="space-y-3.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs animate-pulse space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="h-5 w-2/3 bg-slate-200 rounded" />
                <div className="h-3 w-5/6 bg-slate-100 rounded" />
                <div className="h-4 w-1/3 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* ==================================================
            15. ERROR STATE (Section 15)
           ================================================== */}
        {hasError && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-xs">
            <p className="text-sm font-bold text-red-800">
              {language === 'hi'
                ? 'आपकी शिकायतें लोड करने में असमर्थ।'
                : 'Unable to load your complaints.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsLoading(false);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
            </button>
          </div>
        )}

        {/* ==================================================
            13. EMPTY STATE — NO COMPLAINTS AT ALL (Section 13)
           ================================================== */}
        {!isLoading && !hasError && totalCount === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-card flex flex-col items-center max-w-xl mx-auto">
            {/* Civic Complaint / Document Illustration */}
            <div className="relative mb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-[#001c38] shadow-xs">
                <svg
                  className="h-10 w-10 text-chakra-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#001c38] tracking-tight mb-2">
              {language === 'hi' ? 'अभी तक कोई शिकायत नहीं' : 'No complaints yet'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mb-6">
              {language === 'hi'
                ? 'जब आप किसी नागरिक समस्या की रिपोर्ट करते हैं, तो आपकी शिकायत यहाँ दिखाई देगी।'
                : 'When you report a civic issue, your complaint will appear here.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-kesari-500 hover:bg-kesari-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Civic Issue'}</span>
              </Link>

              <button
                type="button"
                onClick={resetToDefaultComplaints}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <span>{language === 'hi' ? 'नमूना डेटा लोड करें' : 'Load Demo Complaints'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            EMPTY SEARCH / FILTER STATE
           ================================================== */}
        {!isLoading && !hasError && totalCount > 0 && filteredComplaints.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 mb-3">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#001c38] mb-1">
              {language === 'hi' ? 'कोई मेल खाती शिकायत नहीं मिली' : 'No matching complaints found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
              {language === 'hi'
                ? 'आपके खोज या फ़िल्टर मानदंड से कोई परिणाम नहीं मिला।'
                : 'No complaints match your current search query or category filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>{language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}</span>
            </button>
          </div>
        )}

        {/* ==================================================
            9. COMPLAINT LIST & CARDS (Sections 9, 10, 11)
           ================================================== */}
        {!isLoading && !hasError && filteredComplaints.length > 0 && (
          <div className="space-y-4">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedComplaint(item)}
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-chakra-400 hover:shadow-md transition-all duration-150 flex flex-col justify-between"
              >
                {/* CARD TOP ROW: ID, Category, Status badge, AI Assisted badge */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-[#001c38] border border-slate-200 tabular-nums">
                      {item.id}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {item.category}
                    </span>
                    {item.imageUrl && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        <span>📷</span>
                        <span>{language === 'hi' ? 'फोटो' : 'Photo'}</span>
                      </span>
                    )}
                    {item.aiAssisted !== false && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        <span>✨</span>
                        <span>{language === 'hi' ? 'AI सहायित' : 'AI Assisted'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* CARD BODY: Title, Short Description, and Evidence Thumbnail */}
                <div className="flex gap-4 items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#001c38] group-hover:text-chakra-700 transition-colors mb-2">
                      {item.subject || item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 font-sans">
                      {item.description}
                    </p>
                  </div>
                  {item.imageUrl && (
                    <div className="relative h-16 w-20 sm:h-18 sm:w-24 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                      <img
                        src={item.imageUrl}
                        alt="Evidence thumbnail"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                </div>

                {/* BOTTOM ROW: Location, Date, Authority, View Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* Location with Pin */}
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <svg
                          className="h-3.5 w-3.5 text-kesari-600 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{item.location}</span>
                      </span>
                    )}

                    {/* Date */}
                    {item.createdAt && (
                      <span className="tabular-nums font-medium text-slate-500">
                        {formatDate(item.createdAt)}
                      </span>
                    )}

                    {/* Authority */}
                    {item.recommendedAuthority && (
                      <span className="hidden md:inline-block font-medium text-slate-500 truncate max-w-xs">
                        • {item.recommendedAuthority}
                      </span>
                    )}
                  </div>

                  {/* View Details Right Action */}
                  <div className="flex items-center gap-1 font-bold text-chakra-700 group-hover:text-kesari-600 group-hover:translate-x-0.5 transition-all self-end sm:self-auto shrink-0">
                    <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prototype demo reset bar (Clean utility) */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200">
          <span>
            {language === 'hi'
              ? 'आगरा नागरिक शिकायत खाता प्रोटोटाइप • स्थानीय सत्र'
              : 'Agra Civic Complaint Ledger Prototype • Local Session'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetToDefaultComplaints}
              className="hover:text-slate-600 underline cursor-pointer"
            >
              {language === 'hi' ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset Demo Data'}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={clearComplaints}
              className="hover:text-red-600 underline cursor-pointer"
            >
              {language === 'hi' ? 'सभी हटाएं (खाली स्थिति)' : 'Clear All (Empty State)'}
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          12. COMPLAINT DETAILS VIEW MODAL (Section 12)
          Opens when clicking any complaint card
         ================================================== */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Tricolor Ribbon */}
            <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-[#001c38] border border-slate-200">
                    {selectedComplaint.id}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {selectedComplaint.category}
                  </span>
                  {getStatusBadge(selectedComplaint.status)}
                  {selectedComplaint.aiAssisted !== false && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      ✨ {language === 'hi' ? 'AI सहायित' : 'AI Assisted'}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#001c38]">
                  {selectedComplaint.subject || selectedComplaint.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Subtle Prototype Notice (Section 12 requirement) */}
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700">
                <svg
                  className="h-4 w-4 text-kesari-600 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  <strong>Prototype tracking:</strong> Live government status integration is not connected yet.
                </span>
              </div>

              {/* Two Column Layout: Timeline vs Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left: Prototype Timeline */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#001c38] flex items-center gap-1.5">
                    <span>⏱️</span>
                    <span>{language === 'hi' ? 'प्रोटोटाइप समयरेखा' : 'Prototype Timeline'}</span>
                  </h3>

                  <ComplaintTimeline currentStatus={selectedComplaint.status} />

                  {/* Status Simulator for Demonstration */}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {language === 'hi' ? 'स्थिति का अनुकरण करें:' : 'Simulate Prototype Status:'}
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {STATUS_OPTIONS.filter((s) => s !== 'Prepared').map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            updateComplaintStatus(selectedComplaint.id, st);
                            setSelectedComplaint((prev) => ({ ...prev, status: st }));
                          }}
                          className={`text-xs font-bold py-1 px-2 rounded border transition-all ${
                            selectedComplaint.status === st
                              ? 'bg-[#001c38] text-white border-[#001c38] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Details & Breakdown */}
                <div className="space-y-4">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        {language === 'hi' ? 'स्थान' : 'Location'}
                      </span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        📍 {selectedComplaint.location}
                      </span>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        {language === 'hi' ? 'दर्ज तिथि' : 'Filed Date'}
                      </span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {formatDate(selectedComplaint.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Original citizen description if present */}
                  {selectedComplaint.originalText && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        {language === 'hi' ? 'मूल नागरिक विवरण' : 'Original Citizen Description'}
                      </span>
                      <p className="text-xs text-slate-800 italic">
                        "{selectedComplaint.originalText}"
                      </p>
                    </div>
                  )}

                  {/* AI Understanding Breakdown */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-1 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-chakra-800 block mb-1">
                      🤖 {language === 'hi' ? 'AI समझ' : 'AI Understanding'}
                    </span>
                    <div className="flex justify-between text-slate-700">
                      <span>Category:</span>
                      <strong className="text-slate-900">{selectedComplaint.category}</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Priority:</span>
                      <strong className="text-slate-900">{selectedComplaint.priority || 'Normal'}</strong>
                    </div>
                  </div>

                  {/* Generated Complaint */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      📝 {language === 'hi' ? 'जनरेट की गई शिकायत' : 'Generated Complaint'}
                    </span>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                      {selectedComplaint.description}
                    </div>
                  </div>

                  {/* Attached Evidence Photo */}
                  {selectedComplaint.imageUrl && (
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        📷 {language === 'hi' ? 'संलग्न फोटो साक्ष्य' : 'Attached Photo Evidence'}
                      </span>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Complaint Evidence"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Recommended Authority */}
                  {selectedComplaint.recommendedAuthority && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        🏛️ {language === 'hi' ? 'अनुशंसित प्राधिकरण' : 'Recommended Authority'}
                      </span>
                      <p className="text-xs font-extrabold text-[#001c38]">
                        {selectedComplaint.recommendedAuthority}
                      </p>
                      {selectedComplaint.officialPortalUrl && (
                        <a
                          href={selectedComplaint.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-chakra-700 hover:text-kesari-600 underline pt-1"
                        >
                          <span>
                            {language === 'hi' ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Portal'} (
                            {selectedComplaint.portalName || 'Portal'})
                          </span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to={`/complaints/${selectedComplaint.id}`}
                className="text-xs font-bold text-chakra-700 hover:text-kesari-600 underline"
              >
                {language === 'hi' ? 'पूर्ण पृष्ठ दृश्य खोलें →' : 'Open Full Page View →'}
              </Link>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="w-full sm:w-auto rounded-lg bg-[#001c38] hover:bg-[#00284f] text-white px-5 py-2 text-xs font-bold transition-colors"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
