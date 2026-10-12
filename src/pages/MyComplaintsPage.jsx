import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useComplaints, STATUS_OPTIONS } from '../context/ComplaintContext';
import ComplaintTimeline from '../components/ComplaintTimeline';
import PageHero from '../components/PageHero';
import { AccentWord } from '../components/Typography';

export default function MyComplaintsPage() {
  const { language } = useLanguage();
  const { currentUser, logout } = useAuth();
  const {
    confirmedComplaints,
    updateComplaintStatus,
    clearComplaints,
    resetToDefaultComplaints,
  } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Category Filter Chips
  const filterChips = useMemo(
    () => [
      { id: 'All', label: language === 'hi' ? 'सभी श्रेणियां' : 'All Categories', categoryKey: null },
      { id: 'Waste', label: language === 'hi' ? 'कचरा' : 'Waste', categoryKey: 'Garbage' },
      { id: 'Roads', label: language === 'hi' ? 'सड़क / गड्ढा' : 'Roads / Pothole', categoryKey: 'Road/Pothole' },
      { id: 'Water', label: language === 'hi' ? 'जल आपूर्ति' : 'Water Supply', categoryKey: 'Water' },
      { id: 'Drainage', label: language === 'hi' ? 'जल निकासी' : 'Drainage', categoryKey: 'Drainage' },
      { id: 'Lighting', label: language === 'hi' ? 'स्ट्रीट लाइट' : 'Streetlight', categoryKey: 'Streetlight' },
    ],
    [language],
  );

  // Status Filter Chips
  const statusFilterChips = useMemo(
    () => [
      { id: 'All', label: language === 'hi' ? 'सभी स्थितियां' : 'All Statuses' },
      { id: 'Under Review', label: language === 'hi' ? 'समीक्षाधीन' : 'Under Review' },
      { id: 'Resolved', label: language === 'hi' ? 'समाधानित' : 'Resolved' },
      { id: 'Created', label: language === 'hi' ? 'लंबित / निर्मित' : 'Pending / Created' },
    ],
    [language],
  );

  // Dynamic calculations from actual application state (Section 2)
  const totalCount = confirmedComplaints.length;
  const activeCount = confirmedComplaints.filter((c) => c.status === 'Under Review').length;
  const resolvedCount = confirmedComplaints.filter((c) => c.status === 'Resolved').length;
  const pendingCount = confirmedComplaints.filter(
    (c) => c.status === 'Created' || c.status === 'Prepared' || c.status === 'Pending',
  ).length;

  // Real-time search & filter matching (Sections 3 & 4)
  const filteredComplaints = useMemo(() => {
    return confirmedComplaints.filter((item) => {
      // Category filter check
      if (selectedCategory !== 'All') {
        const chip = filterChips.find((f) => f.id === selectedCategory);
        if (chip?.categoryKey && item.category !== chip.categoryKey) {
          return false;
        }
      }

      // Status filter check
      if (selectedStatusFilter !== 'All') {
        if (selectedStatusFilter === 'Created') {
          if (item.status === 'Resolved' || item.status === 'Under Review') {
            return false;
          }
        } else if (item.status !== selectedStatusFilter) {
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
  }, [confirmedComplaints, selectedCategory, selectedStatusFilter, searchQuery, filterChips]);

  // Status badge styling per Stitch system
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="font-friendly inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            {language === 'hi' ? 'समाधानित' : 'Resolved'}
          </span>
        );
      case 'Under Review':
        return (
          <span className="font-friendly inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            {language === 'hi' ? 'समीक्षाधीन' : 'Under Review'}
          </span>
        );
      case 'Created':
      case 'Pending':
      default:
        return (
          <span className="font-friendly inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
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

  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'All' || selectedStatusFilter !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatusFilter('All');
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F1] text-[#1D2939] overflow-hidden">
      {/* Subtle Civic Infrastructure Watermark */}
      <div
        className="absolute inset-0 bg-watermark-infra opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      />

      {/* ==================================================
          SECTION 1: DASHBOARD HEADER WITH BHARAT IDENTITY
         ================================================== */}
      <PageHero
        variant="dashboard"
        watermark="infra"
        badge={language === 'hi' ? 'नागरिक शिकायत खाता • आगरा पायलट' : 'Civic Complaint Ledger • Pilot'}
        badgeIcon="📋"
        locationBadge={language === 'hi' ? 'आगरा, उत्तर प्रदेश' : 'Agra, Uttar Pradesh'}
        title={
          language === 'hi' ? (
            <span>
              मेरी <AccentWord color="saffron">शिकायतें</AccentWord>
            </span>
          ) : (
            <span>
              My <AccentWord color="saffron">Complaints</AccentWord>
            </span>
          )
        }
        subtitle={
          language === 'hi'
            ? 'नागरिकसेतु द्वारा तैयार की गई नागरिक समस्याओं को देखें और ट्रैक करें।'
            : 'View and manage the civic issues you have prepared with NagrikSetu.'
        }
        description={
          language === 'hi'
            ? 'अपने क्षेत्र की दर्ज की गई नागरिक समस्याओं का सारांश, AI द्वारा तैयार प्रारूप और संबंधित सरकारी विभागों की सूची यहाँ देखें।'
            : 'Track the status of your prepared complaints, review AI generated citizen grievance drafts, and find direct links to responsible municipal authorities.'
        }
        primaryAction={{
          to: '/report',
          label: language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Create Complaint',
          icon: '✍️',
        }}
      >
        {/* Right Hero Visual Card: Quick Session Stats */}
        <div className="rounded-2xl border border-[#E3E8EF] bg-white/90 backdrop-blur-md p-4 sm:p-5 shadow-md max-w-sm w-full">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{language === 'hi' ? 'सत्र सारांश' : 'Session Summary'}</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {language === 'hi' ? 'स्थानीय लेजर' : 'Local Ledger'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-[#FFF9F1] border border-[#F47721]/20 p-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                {language === 'hi' ? 'कुल दर्ज' : 'Total Filed'}
              </span>
              <span className="text-2xl font-black text-[#0B1F50] tabular-nums">{totalCount}</span>
            </div>
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-2.5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                {language === 'hi' ? 'समाधानित' : 'Resolved'}
              </span>
              <span className="text-2xl font-black text-emerald-800 tabular-nums">{resolvedCount}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>📍 {language === 'hi' ? 'आगरा नगर निगम' : 'Agra Nagar Nigam'}</span>
            <span className="font-bold text-[#F47721]">NagrikSetu AI</span>
          </div>
        </div>
      </PageHero>

      {/* Main Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
        {/* ==================================================
            DEMO ACCOUNT BANNER (PART 11.4)
           ================================================== */}
        {currentUser?.mode === 'demo' && (
          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F47721] to-amber-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                👤
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-[#0B1F50]">
                    {language === 'hi' ? 'स्वागत है, डेमो नागरिक' : 'Welcome, Demo Citizen'}
                  </h2>
                  <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                    Demo Mode 🛡️
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {language === 'hi'
                    ? 'डेमो खाता: डेटा और पहुंच केवल प्रदर्शन हेतु हैं। यह कोई सत्यापित नागरिक पहचान नहीं है।'
                    : 'Demo account: Data and access are for demonstration only. This is not a verified citizen identity.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link
                to="/report"
                className="px-3 py-1.5 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white text-xs font-bold transition-all shadow-xs"
              >
                {language === 'hi' ? '+ शिकायत दर्ज करें' : '+ Report'}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'लॉग आउट' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            SECTION 6: TRACKING DISCLAIMER (PROMINENT & CLEAR)
           ================================================== */}
        <div className="rounded-2xl border-2 border-amber-300/80 bg-amber-50/90 p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-lg shrink-0 shadow-xs">
            ℹ️
          </div>
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
              {language === 'hi' ? 'प्रोटोटाइप ट्रैकिंग सूचना' : 'Prototype Complaint Tracking Notice'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed">
              {language === 'hi'
                ? 'शिकायत ट्रैकिंग यहाँ NagrikSetu प्रोटोटाइप का एक हिस्सा है। वास्तविक सरकारी पोर्टल से लाइव एकीकरण अभी जुड़ा हुआ नहीं है।'
                : 'Complaint tracking shown here is part of the NagrikSetu prototype. Official government tracking is not currently connected.'}
            </p>
          </div>
        </div>

        {/* ==================================================
            SECTION 2: STATISTICS DASHBOARD (4 BHARAT CARDS)
           ================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-2">
              <span>📊</span>
              <span>{language === 'hi' ? 'शिकायत आंकड़े (प्रोटोटाइप)' : 'Complaint Metrics (Prototype Local)'}</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              {language === 'hi' ? 'आगरा, उ.प्र. आधारित डेटा' : 'Agra, UP Pilot Data'}
            </span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* 1. TOTAL CARD */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#0B1F50]/15 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B1F50]">
                  {language === 'hi' ? 'कुल शिकायतें' : 'TOTAL'}
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#0B1F50]/10 flex items-center justify-center text-[#0B1F50]">
                  📁
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl sm:text-4xl font-black text-[#0B1F50] tabular-nums">
                  {totalCount}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'दर्ज' : 'Logged'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#0B1F50] h-full w-full rounded-full" />
              </div>
            </div>

            {/* 2. ACTIVE CARD */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#F47721]/30 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#F47721]">
                  {language === 'hi' ? 'समीक्षाधीन' : 'ACTIVE'}
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#F47721]/15 flex items-center justify-center text-[#F47721]">
                  ⏳
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl sm:text-4xl font-black text-[#F47721] tabular-nums">
                  {activeCount}
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'समीक्षा में' : 'Review'}
                </span>
              </div>
              <div className="w-full bg-amber-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#F47721] h-full rounded-full"
                  style={{ width: `${totalCount ? (activeCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 3. RESOLVED CARD */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#13865B]/30 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#13865B]">
                  {language === 'hi' ? 'समाधानित' : 'RESOLVED'}
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#13865B]/15 flex items-center justify-center text-[#13865B]">
                  ✅
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl sm:text-4xl font-black text-[#13865B] tabular-nums">
                  {resolvedCount}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'पूर्ण' : 'Closed'}
                </span>
              </div>
              <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#13865B] h-full rounded-full"
                  style={{ width: `${totalCount ? (resolvedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 4. PENDING CARD */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  {language === 'hi' ? 'लंबित' : 'PENDING'}
                </span>
                <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  📋
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-800 tabular-nums">
                  {pendingCount}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'प्रतीक्षारत' : 'Queued'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-slate-600 h-full rounded-full"
                  style={{ width: `${totalCount ? (pendingCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            SECTION 3: PROFESSIONAL SEARCH & FILTERS
           ================================================== */}
        <div className="rounded-2xl border border-[#E3E8EF] bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input Field */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-4.5 w-4.5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
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
                    ? 'शिकायत खोजें (ID: CIV-..., शीर्षक, श्रेणी या स्थान)...'
                    : 'Search complaints (ID: CIV-..., title, category, or location)...'
                }
                className="w-full rounded-xl border border-slate-200 bg-[#FFF9F1]/40 py-3 pl-11 pr-11 text-xs sm:text-sm text-[#1D2939] placeholder:text-slate-400 focus:border-[#0B1F50] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B1F50]/15 shadow-2xs transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Clear All Filters Button if active */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#F47721]/30 bg-[#F47721]/10 hover:bg-[#F47721]/20 px-4 py-2.5 text-xs font-black text-[#F47721] transition-colors cursor-pointer shrink-0"
              >
                <span>↺</span>
                <span>{language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All Filters'}</span>
              </button>
            )}
          </div>

          {/* Filter Rows */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                {language === 'hi' ? 'श्रेणी:' : 'Category:'}
              </span>
              {filterChips.map((chip) => {
                const isSelected = selectedCategory === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedCategory(chip.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1F50] text-white shadow-xs'
                        : 'bg-[#FFF9F1] text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-white'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                {language === 'hi' ? 'स्थिति:' : 'Status:'}
              </span>
              {statusFilterChips.map((chip) => {
                const isSelected = selectedStatusFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedStatusFilter(chip.id)}
                    className={`rounded-full px-3.5 py-1 text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F47721] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>
            {language === 'hi'
              ? `${filteredComplaints.length} शिकायतें प्रदर्शित`
              : `Showing ${filteredComplaints.length} of ${totalCount} complaints`}
          </span>
          {isFiltered && (
            <span className="text-[#F47721]">
              {language === 'hi' ? 'फ़िल्टर लागू हैं' : 'Active filters applied'}
            </span>
          )}
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
            SECTION 5: EMPTY STATE — NO COMPLAINTS AT ALL
           ================================================== */}
        {!isLoading && !hasError && totalCount === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-[#E3E8EF] bg-white p-8 sm:p-14 text-center shadow-sm flex flex-col items-center max-w-2xl mx-auto">
            {/* Original Indian Civic Artwork for Empty State */}
            <div className="relative mb-6">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-gradient-to-br from-[#FFF9F1] to-[#EEF4FF] border border-[#E3E8EF] flex items-center justify-center shadow-inner relative">
                {/* Civic Indian Mandala and Document Graphic */}
                <svg
                  className="h-16 w-16 text-[#0B1F50]"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Ledger document */}
                  <rect x="14" y="10" width="36" height="46" rx="4" className="stroke-[#0B1F50] fill-white" />
                  <line x1="22" y1="20" x2="42" y2="20" className="stroke-[#F47721]" />
                  <line x1="22" y1="28" x2="42" y2="28" className="stroke-slate-300" />
                  <line x1="22" y1="36" x2="34" y2="36" className="stroke-slate-300" />
                  {/* Ashoka wheel stamp */}
                  <circle cx="40" cy="42" r="6" className="stroke-[#13865B] fill-emerald-50" />
                  <path d="M40 38v8M36 42h8" className="stroke-[#13865B]" />
                </svg>
                {/* Decorative floating badge */}
                <span className="absolute -top-2 -right-2 text-xl">🇮🇳</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-[#0B1F50] tracking-tight mb-2">
              {language === 'hi' ? 'अभी तक कोई शिकायत नहीं' : 'No Complaints Yet'}
            </h2>

            <p className="text-xs sm:text-sm text-[#596579] leading-relaxed max-w-md mb-8 font-medium">
              {language === 'hi'
                ? 'नागरिक समस्या का विवरण देकर शुरुआत करें। NagrikSetu आपको एक औपचारिक शिकायत पत्र तैयार करने और उचित प्राधिकरण खोजने में मदद करेगा।'
                : 'Start by describing a civic issue. NagrikSetu will help you prepare a structured complaint.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>✍️</span>
                <span>{language === 'hi' ? 'अपनी पहली समस्या दर्ज करें' : 'Report Your First Issue'}</span>
              </Link>

              <button
                type="button"
                onClick={resetToDefaultComplaints}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <span>📂</span>
                <span>{language === 'hi' ? 'डेमो शिकायतें लोड करें' : 'Load Demo Complaints'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            EMPTY SEARCH / FILTER STATE
           ================================================== */}
        {!isLoading && !hasError && totalCount > 0 && filteredComplaints.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF9F1] text-[#F47721] border border-[#F47721]/20 mb-3">
              <svg
                className="h-7 w-7"
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
            <h3 className="text-base sm:text-lg font-black text-[#0B1F50] mb-1">
              {language === 'hi' ? 'कोई मेल खाती शिकायत नहीं मिली' : 'No matching complaints found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-5 font-medium">
              {language === 'hi'
                ? 'वर्तमान खोज या फ़िल्टर के अनुसार कोई शिकायत उपलब्ध नहीं है।'
                : 'No complaints match your current search query or active filters.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#FFF9F1] hover:bg-white px-5 py-2.5 text-xs font-black text-[#0B1F50] transition-colors cursor-pointer shadow-2xs"
            >
              <span>↺</span>
              <span>{language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}</span>
            </button>
          </div>
        )}

        {/* ==================================================
            SECTION 4: REDESIGNED COMPLAINT CARDS
           ================================================== */}
        {!isLoading && !hasError && filteredComplaints.length > 0 && (
          <div className="space-y-4">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedComplaint(item)}
                className="group cursor-pointer rounded-2xl border-2 border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:border-[#F47721]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* CARD TOP ROW: ID, Category, Status badge, AI badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Internal Complaint ID */}
                    <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-[#0B1F50]/10 text-[#0B1F50] border border-[#0B1F50]/20 tabular-nums">
                      {item.id}
                    </span>

                    {/* Category */}
                    <span className="rounded-full border border-slate-200 bg-[#FFF9F1] px-3 py-1 text-xs font-black text-slate-800">
                      {item.category}
                    </span>

                    {/* Photo thumbnail indicator */}
                    {item.imageUrl && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-black text-blue-700">
                        <span>📷</span>
                        <span>{language === 'hi' ? 'फोटो साक्ष्य' : 'Photo'}</span>
                      </span>
                    )}

                    {/* AI Assisted */}
                    {item.aiAssisted !== false && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-[11px] font-black text-purple-700">
                        <span>✨</span>
                        <span>{language === 'hi' ? 'AI सहायित' : 'AI Assisted'}</span>
                      </span>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* CARD BODY: Title, Description, and Responsive Photo Thumbnail */}
                <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-[#0B1F50] group-hover:text-[#F47721] transition-colors mb-2 leading-snug">
                      {item.subject || item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#596579] leading-relaxed line-clamp-2 font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Responsive Photo Thumbnail */}
                  {item.imageUrl && (
                    <div className="relative h-20 w-full sm:w-28 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                      <img
                        src={item.imageUrl}
                        alt="Complaint evidence thumbnail"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* BOTTOM ROW: Location, Date, Authority, View Details Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-semibold">
                    {/* Location with Pin */}
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <span className="text-[#F47721]">📍</span>
                        <span>{item.location}</span>
                      </span>
                    )}

                    {/* Date */}
                    {item.createdAt && (
                      <span className="inline-flex items-center gap-1 tabular-nums text-slate-500">
                        <span>📅</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                    )}

                    {/* Recommended Authority */}
                    {item.recommendedAuthority && (
                      <span className="hidden md:inline-flex items-center gap-1 text-slate-600 truncate max-w-xs">
                        <span>🏛️</span>
                        <span>{item.recommendedAuthority}</span>
                      </span>
                    )}
                  </div>

                  {/* View Details Right Action */}
                  <div className="inline-flex items-center gap-1.5 font-black text-[#0B1F50] group-hover:text-[#F47721] group-hover:translate-x-1 transition-all self-end sm:self-auto shrink-0 text-xs sm:text-sm">
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
