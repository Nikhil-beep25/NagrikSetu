import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function ComplaintConfirmedCard({ complaint, onReset }) {
  const { t } = useLanguage();

  if (!complaint) return null;

  return (
    <div className="mt-6 rounded-2xl border border-harit-200 bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Header */}
      <div className="bg-harit-50/80 border-b border-harit-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-harit-500 text-white shadow-xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <span className="inline-block text-xs font-bold text-harit-700 uppercase tracking-wider">
              {t('previewConfirmedBadge')}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-chakra-900">
              {t('previewConfirmedTitle')}
            </h3>
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
          {t('previewConfirmedDesc')}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Subject */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
            {t('previewSubject')}
          </p>
          <p className="text-sm font-bold text-chakra-900">
            {complaint.subject}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
            {t('previewDescription')}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line bg-surface-dim p-4 rounded-xl border border-border font-sans">
            {complaint.description}
          </p>
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-border bg-surface-dim p-3">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-0.5">{t('resultCategory')}</p>
            <p className="text-xs sm:text-sm font-semibold text-text-primary truncate">{complaint.category}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-dim p-3">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-0.5">{t('resultLocation')}</p>
            <p className="text-xs sm:text-sm font-semibold text-text-primary truncate">{complaint.location}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-surface-dim p-3">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-0.5">{t('resultPriority')}</p>
            <p className="text-xs sm:text-sm font-semibold text-text-primary truncate">{complaint.priority}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border bg-surface-dim px-6 py-4">
        <Link
          to="/complaints"
          className="flex-1 rounded-lg bg-chakra-600 hover:bg-chakra-700 py-2.5 px-4 text-sm font-bold text-white transition-all duration-150 shadow-sm text-center"
        >
          {t('previewViewComplaints')}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-lg border border-border-input bg-white py-2.5 px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 transition-all duration-150 text-center"
        >
          {t('previewCreateNew')}
        </button>
      </div>
    </div>
  );
}
