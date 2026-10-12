import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useComplaints, STATUS_OPTIONS } from '../context/ComplaintContext';
import ComplaintTimeline from '../components/ComplaintTimeline';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { getComplaintById, updateComplaintStatus } = useComplaints();

  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />
            <div className="p-10 sm:p-14 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chakra-50 border border-chakra-100 text-chakra-600 mb-4">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-chakra-900 mb-2">
                {t('complaintNotFound') || 'Complaint Not Found'}
              </h2>
              <p className="text-sm text-text-muted mb-8 max-w-md">
                No civic grievance matching ID <strong className="font-mono text-chakra-700 font-bold">{id}</strong> was found in your current active session ledger.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/complaints"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-chakra-600 hover:bg-chakra-700 px-6 py-2.5 text-sm font-bold text-white transition-all duration-150 shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>{t('backToComplaints')}</span>
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border-input bg-surface-dim hover:bg-white px-5 py-2.5 text-sm font-semibold text-chakra-800 transition-colors"
                >
                  <span>+ {t('complaintsCreate')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Stitch Status Pill Tokens
  const statusPillStyles = {
    Created: 'bg-slate-100 text-slate-700 border-slate-200',
    Prepared: 'bg-chakra-50 text-chakra-700 border-chakra-200',
    'Under Review': 'bg-kesari-50 text-kesari-700 border-kesari-200',
    Resolved: 'bg-harit-50 text-harit-700 border-harit-200',
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Created':
        return t('statusCreated') || 'Created';
      case 'Prepared':
        return t('statusPrepared') || 'Prepared';
      case 'Under Review':
        return t('statusUnderReview') || 'Under Review';
      case 'Resolved':
        return t('statusResolved') || 'Resolved';
      default:
        return status;
    }
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => navigate('/complaints')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-chakra-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{t('backToComplaints')}</span>
          </button>
        </div>

        {/* Prototype tracking disclaimer banner */}
        <div className="flex items-start gap-3 rounded-xl border border-kesari-200 bg-kesari-50/90 p-4 sm:p-5 shadow-xs">
          <svg className="h-5 w-5 text-kesari-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-kesari-800">
              {language === 'hi' ? 'प्रोटोटाइप ट्रैकिंग' : 'Prototype tracking'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-kesari-900 mt-0.5">
              {language === 'hi'
                ? 'लाइव सरकारी स्थिति एकीकरण अभी जुड़ा हुआ नहीं है।'
                : 'Live government status integration is not connected yet.'}
            </p>
          </div>
        </div>

        {/* Main Details Card with Stitch 3px top tricolor accent */}
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

          <div className="p-6 sm:p-8">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-chakra-50 text-chakra-800 border border-chakra-200">
                    <span className="text-[10px] text-text-muted font-normal mr-1">{language === 'hi' ? 'स्थानीय संदर्भ:' : 'Local Ref:'}</span>
                    {complaint.id}
                  </span>
                  <span className="rounded-full border border-border bg-surface-dim px-3 py-0.5 text-xs font-friendly font-bold text-text-primary">
                    {complaint.category}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-friendly font-bold ${
                      statusPillStyles[complaint.status] || statusPillStyles['Under Review']
                    }`}
                  >
                    {getStatusLabel(complaint.status)}
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-display font-extrabold text-chakra-900 mt-3 tracking-tight">
                  {complaint.subject}
                </h1>
              </div>

              {complaint.createdAt && (
                <div className="text-xs text-text-muted sm:text-right font-body">
                  <p className="font-semibold uppercase tracking-wider">Filed Date</p>
                  <p className="font-bold text-text-primary mt-0.5 tabular-nums">
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Symmetrical Two-column layout: Timeline & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 items-start font-body">
              {/* Left Column (50%): Timeline & Simulator */}
              <div className="border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-8 space-y-6">
                <div>
                  <h2 className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-chakra-900 mb-4 flex items-center gap-2">
                    <svg className="h-4 w-4 text-chakra-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t('prototypeTimelineHeader')}
                  </h2>

                  <ComplaintTimeline currentStatus={complaint.status} />
                </div>

                {/* Status Simulator */}
                <div className="pt-4 border-t border-border bg-surface-dim p-4 rounded-xl">
                  <p className="text-[11px] font-friendly font-bold text-text-muted uppercase tracking-wider mb-2">
                    {t('simulateStatus')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateComplaintStatus(complaint.id, st)}
                        className={`text-xs font-friendly font-bold py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
                          complaint.status === st
                            ? 'bg-chakra-600 text-white border-chakra-600 shadow-xs'
                            : 'bg-white text-text-secondary border-border-input hover:bg-chakra-50'
                        }`}
                      >
                        {getStatusLabel(st)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (50%): Comprehensive Details */}
              <div className="space-y-5">
                {/* Original citizen description if present */}
                {complaint.originalText && (
                  <div className="rounded-xl border border-border bg-surface-dim p-4">
                    <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      {language === 'hi' ? 'मूल नागरिक विवरण' : 'Original Citizen Description'}
                    </h2>
                    <p className="text-xs sm:text-sm font-body text-text-primary italic">
                      "{complaint.originalText}"
                    </p>
                  </div>
                )}

                {/* AI Understanding Breakdown */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-1.5 text-xs font-body">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-chakra-800 block mb-1">
                    🤖 {language === 'hi' ? 'AI समझ' : 'AI Understanding'}
                  </span>
                  <div className="flex justify-between text-slate-700">
                    <span>Category:</span>
                    <strong className="text-slate-900">{complaint.category}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Priority:</span>
                    <strong className="text-slate-900">{complaint.priority || 'Normal'}</strong>
                  </div>
                </div>

                {/* Generated Complaint Description */}
                <div>
                  <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-2">
                    📝 {language === 'hi' ? 'जनरेट की गई शिकायत' : 'Generated Complaint'}
                  </h2>
                  <div className="rounded-xl border border-border bg-surface-dim p-4 text-sm font-body font-medium text-text-primary leading-relaxed whitespace-pre-line">
                    {complaint.description}
                  </div>
                </div>

                {/* Attached Photo Evidence */}
                {complaint.imageUrl && (
                  <div className="rounded-xl border border-border bg-surface-dim p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <h2 className="text-xs font-display font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <svg className="h-4 w-4 text-chakra-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>{language === 'hi' ? 'संलग्न साक्ष्य फोटो' : 'Attached Photo Evidence'}</span>
                      </h2>
                      <span className="text-[10px] font-friendly font-bold px-2 py-0.5 rounded-full bg-harit-50 border border-harit-200 text-harit-700">
                        {language === 'hi' ? 'सत्यापित साक्ष्य' : 'Verified Evidence'}
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-border bg-slate-900 group">
                      <img
                        src={complaint.imageUrl}
                        alt={complaint.subject || 'Complaint Evidence'}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-200 group-hover:scale-102"
                      />
                    </div>
                  </div>
                )}

                {/* Location & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-surface-dim p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      {t('authorityLocation')}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-chakra-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {complaint.location}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-dim p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      {t('authorityComplaintType')}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary">
                      {complaint.category} ({complaint.priority} priority)
                    </p>
                  </div>
                </div>

                {/* Recommended Authority */}
                {complaint.recommendedAuthority && (
                  <div className="rounded-xl border border-chakra-200 bg-chakra-50/50 p-4 space-y-2 font-body">
                    <p className="text-xs font-display font-bold uppercase tracking-wider text-chakra-800">
                      {t('authorityLabel')}
                    </p>
                    <p className="text-sm font-display font-extrabold text-chakra-900">
                      {complaint.recommendedAuthority}
                    </p>
                    <p className="text-xs text-text-muted italic">
                      {t('authorityReasonText')}
                    </p>

                    {complaint.officialPortalUrl && (
                      <div className="pt-2">
                        <a
                          href={complaint.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-friendly font-bold text-chakra-700 hover:text-chakra-900 underline"
                        >
                          {t('channelOpenBtn')} ({complaint.portalName || 'Official Portal'})
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
