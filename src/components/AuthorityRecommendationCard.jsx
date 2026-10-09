import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function AuthorityRecommendationCard({
  recommendation,
  complaint,
  onReset,
}) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!recommendation) return null;

  const {
    authority,
    category,
    location,
    reason,
    disclaimer,
    officialPortalUrl,
    portalName,
  } = recommendation;

  const handleCopyText = async () => {
    if (!complaint) return;
    const textToCopy = `SUBJECT: ${complaint.subject}\n\nLOCATION: ${complaint.location}\nCATEGORY: ${complaint.category}\n\nDESCRIPTION:\n${complaint.description}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Stitch Masthead Header with Verified Channel Badge */}
      <div className="border-b border-border bg-surface-dim px-6 py-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chakra-600 text-white shadow-xs">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-6h6v6" />
                <path d="M9 10h0M15 10h0" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-chakra-900 tracking-tight">
                {t('authorityTitle')}
              </h3>
              <p className="text-[11px] text-text-muted">
                {language === 'hi' ? 'नागरिक सेवा नियम व अधिकार क्षेत्र आवंटन' : 'Municipal Department Allocation & Public Redressal'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-harit-50 border border-harit-200 px-3 py-1 text-xs font-bold text-harit-700">
            <span className="h-1.5 w-1.5 rounded-full bg-harit-500" />
            24-48h Citizen Charter SLA
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Recommended Authority Details Grid */}
        <div className="rounded-xl border border-border bg-surface-dim p-5 space-y-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
              {t('authorityLabel')}:
            </span>
            <p className="text-base sm:text-lg font-extrabold text-chakra-800">
              {authority}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                {t('authorityComplaintType')}:
              </span>
              <span className="inline-flex items-center rounded-full border border-chakra-200 bg-chakra-50 px-3 py-0.5 text-xs font-bold text-chakra-800">
                {category}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                {t('authorityLocation')}:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">
                {location}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
              {t('authorityReasonLabel')}:
            </span>
            <p className="text-xs sm:text-sm text-text-secondary italic">
              &ldquo;{reason || t('authorityReasonText')}&rdquo;
            </p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-kesari-200 bg-kesari-50/80 p-4">
          <svg className="h-5 w-5 text-kesari-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-kesari-800">
              Disclaimer
            </p>
            <p className="text-xs sm:text-sm font-medium text-kesari-900 mt-0.5">
              {disclaimer || t('authorityDisclaimer')}
            </p>
          </div>
        </div>

        {/* Official Complaint Channel Card */}
        <div className="rounded-xl border border-border bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-chakra-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <h4 className="text-xs sm:text-sm font-bold text-chakra-900 uppercase tracking-wider">
              {t('channelTitle')}
            </h4>
          </div>

          {officialPortalUrl ? (
            <div className="space-y-3">
              {portalName && (
                <p className="text-xs text-text-muted">
                  Official Portal: <strong className="text-chakra-800">{portalName}</strong>
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href={officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-chakra-600 hover:bg-chakra-700 px-5 py-2.5 text-sm font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-sm text-center"
                >
                  <span>{t('channelOpenBtn')}</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>

                {complaint && (
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-input bg-surface-dim hover:bg-white px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-chakra-700 transition-all duration-150 text-center"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    <span>{copied ? t('copiedFeedback') : t('copyComplaintBtn')}</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                {t('channelCitizenResponsibility')}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface-dim p-4">
              <p className="text-xs sm:text-sm font-medium text-text-muted">
                {t('channelNotConfigured')}
              </p>
            </div>
          )}
        </div>

        {/* Confirmed Complaint Quick Summary */}
        {complaint && (
          <div className="rounded-xl border border-border bg-surface-dim/70 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="font-bold uppercase tracking-wider">Confirmed Ticket ID</span>
              <span className="font-mono font-bold text-chakra-700 bg-chakra-50 border border-chakra-100 px-2 py-0.5 rounded">{complaint.id}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-chakra-900">{complaint.subject}</p>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-sans mt-1">
                  {complaint.description}
                </p>
              </div>
              {complaint.imageUrl && (
                <div className="h-14 w-16 shrink-0 rounded-lg overflow-hidden border border-border bg-slate-100">
                  <img
                    src={complaint.imageUrl}
                    alt="Attached diagnostic"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer (Stitch Specification) */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border bg-surface-dim px-6 py-4">
        {complaint?.id && (
          <Link
            to={`/complaints/${complaint.id}`}
            className="flex-1 rounded-lg bg-chakra-600 hover:bg-chakra-700 py-2.5 px-4 text-sm font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-sm text-center flex items-center justify-center gap-1.5"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{t('trackComplaintBtn') || 'Track Complaint'}</span>
          </Link>
        )}
        <Link
          to="/complaints"
          className="flex-1 rounded-lg border border-border-input bg-white py-2.5 px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 hover:border-chakra-300 transition-all duration-150 text-center"
        >
          {t('previewViewComplaints')}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-lg border border-border-input bg-white py-2.5 px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 hover:border-chakra-300 transition-all duration-150 text-center"
        >
          {t('previewCreateNew')}
        </button>
      </div>
    </div>
  );
}
