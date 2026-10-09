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
    recommendedAuthority,
    category,
    location,
    city,
    state,
    jurisdiction,
    confidence = 'High',
    reason,
    disclaimer,
    officialWebsite,
    officialPortalUrl,
    portalName,
    verificationStatus = 'Verified',
    lastVerified = '2026-10-09',
    requiresConfirmation = false,
    alternativeAuthorities = [],
    emergencyNumbers = [],
  } = recommendation;

  const displayAuthorityName = recommendedAuthority || authority;

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

  const getConfidenceBadge = (level) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {t('confidenceHigh') || 'High Confidence'}
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-bold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            {t('confidenceMedium') || 'Medium Confidence'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-300 px-3 py-0.5 text-xs font-bold text-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            {t('confidenceLow') || 'Low Confidence'}
          </span>
        );
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Masthead Header with Verified Channel Badge */}
      <div className="border-b border-border bg-surface-dim px-6 py-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chakra-600 text-white shadow-xs shrink-0">
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
                {language === 'hi'
                  ? 'सत्यापित सरकारी अधिकार क्षेत्र व शिकायत निवारण पोर्टल'
                  : 'Verified Government Department & Public Redressal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {getConfidenceBadge(confidence)}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              verificationStatus === 'Verified'
                ? 'bg-harit-50 border border-harit-200 text-harit-700'
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}>
              <span>{verificationStatus === 'Verified' ? '✓' : 'ℹ'}</span>
              <span>{verificationStatus === 'Verified' ? (t('statusVerified') || 'Verified Record') : (t('statusUnverified') || 'Provisional')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Recommended Authority Details Grid */}
        <div className="rounded-xl border border-border bg-surface-dim p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                {t('authorityLabel')}:
              </span>
              {city && (
                <span className="text-xs font-bold text-chakra-700 bg-chakra-50 border border-chakra-200 px-2.5 py-0.5 rounded-md">
                  📍 {city}{state ? `, ${state}` : ''}
                </span>
              )}
            </div>
            <p className="text-base sm:text-xl font-extrabold text-chakra-900 leading-snug">
              {displayAuthorityName}
            </p>
          </div>

          {/* Jurisdiction Information Row */}
          {jurisdiction && (
            <div className="pt-3 border-t border-border">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                {t('authorityJurisdictionLabel') || 'Jurisdiction'}:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-chakra-800">
                {jurisdiction}
              </p>
            </div>
          )}

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
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              &ldquo;{reason || t('authorityReasonText')}&rdquo;
            </p>
          </div>

          {lastVerified && (
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/60">
              <span>{t('authorityLastVerifiedLabel') || 'Last Verified'}: <strong>{lastVerified}</strong></span>
              <span className="font-semibold text-harit-600">✓ Real Official Government Agency</span>
            </div>
          )}
        </div>

        {/* Emergency Helplines Notice if provided */}
        {emergencyNumbers && emergencyNumbers.length > 0 && (
          <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 space-y-2 animate-fade-slide-up">
            <div className="flex items-center gap-2">
              <span className="text-base">🚨</span>
              <h5 className="text-xs font-extrabold text-red-900 uppercase tracking-wider">
                Emergency First Response Numbers
              </h5>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {emergencyNumbers.map((em, idx) => (
                <a
                  key={idx}
                  href={`tel:${em.number}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition-all"
                >
                  <span>📞 {em.label}: {em.number}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Uncertain Jurisdiction Warning Notice */}
        {requiresConfirmation && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Jurisdiction Verification Notice
              </p>
              <p className="text-xs sm:text-sm font-medium text-amber-900/90 mt-0.5 leading-relaxed">
                {t('authorityUncertainNotice') || 'Based on your selected location and complaint category, this authority may be responsible. Please verify the jurisdiction before submitting your complaint.'}
              </p>
            </div>
          </div>
        )}

        {/* Alternative Authorities Notice (e.g. MCD vs PWD road ownership) */}
        {alternativeAuthorities && alternativeAuthorities.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">ℹ️</span>
              <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                {t('authorityAlternativesTitle') || 'Alternative Responsible Authorities'}
              </h5>
            </div>
            <div className="space-y-2">
              {alternativeAuthorities.map((alt, idx) => (
                <div key={idx} className="text-xs text-blue-950 font-medium bg-white/70 rounded-lg p-2.5 border border-blue-200">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <strong className="text-blue-900">{alt.name}</strong>
                    {alt.officialPortalUrl && (
                      <a
                        href={alt.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-chakra-700 underline hover:text-chakra-900"
                      >
                        Official Portal &rsaquo;
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-800 mt-1">{alt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                {/* Safe external government link */}
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

                {officialWebsite && officialWebsite !== officialPortalUrl && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-input bg-surface-dim hover:bg-white px-4 py-2.5 text-sm font-semibold text-chakra-800 hover:text-chakra-900 transition-all duration-150 text-center"
                  >
                    <span>🏛️</span>
                    <span>{t('authorityWebsiteBtn') || 'Official Website'}</span>
                  </a>
                )}

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

        {/* Non-affiliation & Civic Disclaimer */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-3.5 text-[11px] text-text-muted leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> {disclaimer || t('authorityDisclaimer')} {t('authorityNonAffiliationNotice') || 'NagrikSetu is an independent civic assistance platform and is not officially affiliated with any government department.'}
          </p>
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

      {/* Navigation Footer */}
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
