import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getServiceById,
  getStoredChecklist,
  saveStoredChecklist,
  resetStoredChecklist,
} from '../services/governmentServiceNavigator';

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const { t, language } = useLanguage();

  const service = getServiceById(serviceId);

  // Document checklist local persistence state
  const [preparedDocs, setPreparedDocs] = useState(() => (serviceId ? getStoredChecklist(serviceId) : []));
  const [prevServiceId, setPrevServiceId] = useState(serviceId);

  if (prevServiceId !== serviceId) {
    setPrevServiceId(serviceId);
    setPreparedDocs(serviceId ? getStoredChecklist(serviceId) : []);
  }

  const toggleDocument = (docId) => {
    let updated;
    if (preparedDocs.includes(docId)) {
      updated = preparedDocs.filter((id) => id !== docId);
    } else {
      updated = [...preparedDocs, docId];
    }
    setPreparedDocs(updated);
    saveStoredChecklist(serviceId, updated);
  };

  const handleResetChecklist = () => {
    resetStoredChecklist(serviceId);
    setPreparedDocs([]);
  };

  // If service is not found in directory
  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="mx-auto max-w-md bg-white rounded-2xl border border-border p-8 text-center space-y-4 shadow-sm">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-chakra-900">
            {language === 'hi' ? 'सेवा नहीं मिली' : 'Government Service Not Found'}
          </h2>
          <p className="text-xs text-text-secondary">
            {language === 'hi'
              ? 'अनुरोधित सेवा हमारे सत्यापित डेटाबेस में उपलब्ध नहीं है।'
              : 'The requested government service ID does not match any verified record.'}
          </p>
          <Link
            to="/services"
            className="inline-block px-5 py-2.5 rounded-xl bg-chakra-800 hover:bg-chakra-900 text-white text-xs font-bold transition-all shadow-xs"
          >
            ← {t('serviceBackBtn')}
          </Link>
        </div>
      </div>
    );
  }

  // Calculate document progress
  const totalDocs = service.requiredDocuments?.length || 0;
  const preparedCount = preparedDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((preparedCount / totalDocs) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* =========================================================================
            BREADCRUMBS & TOP NAV
            ========================================================================= */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-chakra-800 hover:text-kesari-600 transition-colors"
          >
            <span>←</span>
            <span>{t('serviceBackBtn')}</span>
          </Link>

          <div className="flex items-center gap-2">
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              ✓ {service.verificationStatus}
            </span>
          </div>
        </div>

        {/* =========================================================================
            HERO HEADER
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <span>{service.category}</span>
              <span>•</span>
              <span>{service.state}</span>
              {service.cityScope && (
                <>
                  <span>•</span>
                  <span>{service.cityScope}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B1F50] tracking-tight">
              {language === 'hi' ? service.hiName : service.name}
            </h1>

            <p className="font-body text-xs sm:text-sm font-semibold text-[#0B1F50]">
              🏛️ {t('serviceDepartmentLabel')}: <span className="text-slate-800">{service.department}</span>
            </p>
          </div>

          <p className="font-body text-sm sm:text-base text-[#596579] leading-relaxed pt-1">
            {language === 'hi' ? service.hiDescription : service.description}
          </p>

          {/* Quick Jump Action Pills */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2.5 font-friendly">
            <a
              href="#documents"
              className="px-3.5 py-1.5 rounded-lg bg-surface-dim hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              📋 {language === 'hi' ? 'दस्तावेज चेकलिस्ट' : 'View Documents'}
            </a>
            <a
              href="#steps"
              className="px-3.5 py-1.5 rounded-lg bg-surface-dim hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              📝 {language === 'hi' ? 'आवेदन चरण' : 'Application Steps'}
            </a>
            <a
              href="#appointments"
              className="px-3.5 py-1.5 rounded-lg bg-surface-dim hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              📅 {language === 'hi' ? 'अपॉइंटमेंट' : 'Appointment Info'}
            </a>
            <a
              href={service.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-kesari-500 hover:bg-kesari-600 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ml-auto"
            >
              <span>🌐 {t('servicePortalBtn')}</span>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: ELIGIBILITY CRITERIA
            ========================================================================= */}
        <div id="eligibility" className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <span className="text-xl">✅</span>
            <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
              {t('serviceEligibilityTitle')}
            </h2>
          </div>

          <ul className="space-y-2.5 pt-1">
            {(language === 'hi' && service.hiEligibility ? service.hiEligibility : service.eligibility).map(
              (item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* =========================================================================
            SECTION 2: INTERACTIVE DOCUMENT CHECKLIST
            ========================================================================= */}
        <div id="documents" className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
                  {t('serviceDocumentsTitle')}
                </h2>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {t('serviceDocumentsSubtitle')}
              </p>
            </div>

            {preparedDocs.length > 0 && (
              <button
                type="button"
                onClick={handleResetChecklist}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline self-start sm:self-auto cursor-pointer"
              >
                {t('serviceDocResetBtn')}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-border-card">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-chakra-900">
                {t('serviceDocProgress')}: {preparedCount} / {totalDocs} {t('serviceDocMarked')}
              </span>
              <span className="text-kesari-600">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {service.requiredDocuments?.map((doc) => {
              const isChecked = preparedDocs.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-border hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`doc-check-${doc.id}`}
                    checked={isChecked}
                    onChange={() => {}} // handled by div container
                    className="h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-1 cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label
                        htmlFor={`doc-check-${doc.id}`}
                        className={`text-xs sm:text-sm font-bold cursor-pointer ${
                          isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                        }`}
                      >
                        {language === 'hi' ? doc.hiName : doc.name}
                      </label>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          doc.mandatory
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.mandatory ? t('serviceDocMandatoryBadge') : t('serviceDocOptionalBadge')}
                      </span>
                    </div>
                    {doc.note && (
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        ℹ️ {doc.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <span>🔒</span>
            <p>
              <strong>{language === 'hi' ? 'गोपनीयता सूचना:' : 'Privacy Notice:'}</strong>{' '}
              {language === 'hi'
                ? 'यह चेकलिस्ट केवल आपकी सुविधा के लिए है। नागरिकसेतु पर कोई भी व्यक्तिगत पहचान पत्र (आधार, पैन, जन्म पत्र) अपलोड न करें।'
                : 'This checklist is strictly for informational readiness. Never upload or submit actual Aadhaar, PAN, or identity documents to NagrikSetu.'}
            </p>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: STEP-BY-STEP APPLICATION PROCEDURE
            ========================================================================= */}
        <div id="steps" className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <span className="text-xl">📝</span>
            <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
              {t('serviceStepsTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            {service.applicationSteps?.map((stepItem) => (
              <div
                key={stepItem.step}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface-dim border border-border-card"
              >
                <span className="h-7 w-7 rounded-full bg-kesari-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {stepItem.step}
                </span>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-chakra-900">
                    {language === 'hi' ? stepItem.hiTitle : stepItem.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {language === 'hi' ? stepItem.hiDescription : stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SECTION 4: APPOINTMENT GUIDANCE
            ========================================================================= */}
        <div id="appointments" className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📅</span>
              <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
                {t('serviceAppointmentTitle')}
              </h2>
            </div>
            <div>
              {service.appointmentRequired ? (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  📅 {t('serviceAppointmentRequiredBadge')}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ⚡ {t('serviceAppointmentNotRequiredBadge')}
                </span>
              )}
            </div>
          </div>

          {service.appointmentDetails ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-border text-xs sm:text-sm text-slate-800 leading-relaxed">
                <p className="font-semibold text-chakra-900 mb-1">
                  {language === 'hi' ? 'आधिकारिक प्रक्रिया:' : 'Official Booking Procedure:'}
                </p>
                <p>{language === 'hi' ? service.appointmentDetails.hiProcess : service.appointmentDetails.process}</p>
              </div>

              {service.appointmentDetails.guidance && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-chakra-900">
                    {language === 'hi' ? 'महत्वपूर्ण दिशानिर्देश:' : 'Key Preparation Instructions:'}
                  </h4>
                  <ul className="space-y-1.5">
                    {(language === 'hi' && service.appointmentDetails.hiGuidance
                      ? service.appointmentDetails.hiGuidance
                      : service.appointmentDetails.guidance
                    ).map((guide, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="text-kesari-600 font-bold">•</span>
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.appointmentDetails.bookingUrl && (
                <div className="pt-2">
                  <a
                    href={service.appointmentDetails.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chakra-800 hover:bg-chakra-900 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>📅 {language === 'hi' ? 'आधिकारिक पोर्टल पर अपॉइंटमेंट बुक करें' : 'Schedule on Official Portal'}</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <p className="font-semibold">
                {language === 'hi'
                  ? 'इस सेवा के लिए सामान्यतः भौतिक कार्यालय जाने की आवश्यकता नहीं होती। आवेदन एवं सत्यापन पूरी तरह ऑनलाइन पोर्टल द्वारा किया जाता है।'
                  : 'This service is 100% online through the state e-District portal. A physical visit is not required unless specified by the issuing authority.'}
              </p>
            </div>
          )}

          {/* Strict Safety Advisory */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
            ℹ️ {t('serviceAppointmentNotice')}
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: OFFICIAL PORTAL & VERIFICATION SOURCES
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <span className="text-xl">🌐</span>
            <h2 className="text-lg sm:text-xl font-bold text-chakra-900">
              {t('serviceSourceVerificationTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-dim border border-border-card space-y-1">
              <span className="text-text-muted font-bold">{t('serviceVerificationStatusLabel')}</span>
              <p className="font-extrabold text-emerald-700 flex items-center gap-1">
                <span>✓</span>
                <span>{service.verificationStatus}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-dim border border-border-card space-y-1">
              <span className="text-text-muted font-bold">{t('serviceLastVerifiedLabel')}</span>
              <p className="font-bold text-slate-800">{service.lastVerified}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={service.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-5 rounded-xl bg-kesari-500 hover:bg-kesari-600 text-white font-bold text-xs sm:text-sm text-center shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>🏛️ {t('servicePortalBtn')}</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {service.sourceUrl && (
              <a
                href={service.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl border border-border-input hover:border-slate-400 bg-surface-dim hover:bg-white text-slate-800 font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
              >
                <span>📜 {language === 'hi' ? 'सरकारी स्रोत गजट / नियम' : 'Public Rules / Source'}</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>

        {/* =========================================================================
            DISCLAIMER & TRUST FOOTER
            ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border text-xs text-text-muted space-y-1.5">
          <p className="font-bold text-chakra-900">
            {language === 'hi' ? 'नागरिकसेतु सुरक्षा एवं स्वतंत्रता घोषणा' : 'NagrikSetu Independence & Advisory Notice'}
          </p>
          <p className="leading-relaxed">
            {t('serviceDisclaimerNotice')}
          </p>
        </div>
      </div>
    </div>
  );
}
