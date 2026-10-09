import { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ComplaintPreviewCard({
  initialSubject,
  initialDescription,
  category,
  location,
  priority,
  onConfirm,
  onBackToEdit,
}) {
  const { language, t } = useLanguage();
  const [subject, setSubject] = useState(initialSubject || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [validationError, setValidationError] = useState('');
  const subjectInputRef = useRef(null);

  const handleEditClick = () => {
    subjectInputRef.current?.focus();
    if (onBackToEdit) {
      onBackToEdit();
    }
  };

  const handleConfirmClick = () => {
    if (!subject.trim()) {
      setValidationError(t('errorEmptySubject') || 'Subject cannot be empty.');
      return;
    }
    if (!description.trim()) {
      setValidationError(t('errorEmptyDescription') || 'Description cannot be empty.');
      return;
    }
    setValidationError('');
    onConfirm({
      subject: subject.trim(),
      description: description.trim(),
      category,
      location,
      priority,
    });
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-slide-up">
      {/* Symmetrical Masthead Header */}
      <div className="border-b border-border bg-surface-dim px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chakra-600 text-white shadow-xs shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-chakra-900 tracking-tight flex items-center gap-1.5">
                <span>📝</span>
                <span>{language === 'hi' ? 'जनरेटेड शिकायत' : 'GENERATED COMPLAINT'}</span>
              </h3>
              <p className="text-[11px] text-text-muted">
                {language === 'hi' ? 'नागरिक अधिकार पत्र अनुसार औपचारिक प्रारूप' : 'Standard Citizen Charter Formal Grievance Draft'}
              </p>
            </div>
          </div>

          {/* Badges in Symmetrical Stadium Pill Style */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-chakra-200 bg-chakra-50 px-3 py-1 text-xs font-bold text-chakra-800 shadow-2xs">
              {category}
            </span>
            {priority && (
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold shadow-2xs ${
                priority === 'High' ? 'bg-kesari-50 text-kesari-700 border-kesari-200' : 'bg-gray-100 text-text-secondary border-border'
              }`}>
                {priority} Priority
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-4">
        {/* Validation error */}
        {validationError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* Subject */}
        <div>
          <label
            htmlFor="complaint-subject"
            className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5"
          >
            {t('previewSubject')}
          </label>
          <input
            id="complaint-subject"
            ref={subjectInputRef}
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={t('previewSubjectPlaceholder')}
            className="w-full h-11 rounded-lg border border-border-input bg-surface-dim px-4 text-sm font-semibold text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all duration-150"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="complaint-description"
            className="block text-xs font-bold uppercase tracking-wider text-chakra-800 mb-1.5"
          >
            {t('previewDescription')}
          </label>
          <textarea
            id="complaint-description"
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={t('previewDescriptionPlaceholder')}
            className="w-full resize-none rounded-lg border border-border-input bg-surface-dim p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all duration-150 leading-relaxed font-sans"
          />
        </div>

        {/* Location tag */}
        {location && (
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface-dim p-3 rounded-xl border border-border">
            <svg className="h-4 w-4 text-chakra-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">
              <strong className="text-chakra-900">{t('resultLocation')}:</strong> {location}
            </span>
          </div>
        )}
      </div>

      {/* Symmetrical Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border bg-surface-dim px-6 py-4">
        {/* Outlined Secondary */}
        <button
          type="button"
          onClick={handleEditClick}
          className="flex-1 h-11 flex items-center justify-center rounded-lg border border-border-input bg-white px-4 text-sm font-semibold text-chakra-800 hover:bg-chakra-50 hover:border-chakra-300 transition-all duration-150 text-center"
        >
          {t('previewEditBtn')}
        </button>

        {/* Civic Coral Primary Action Button */}
        <button
          type="button"
          onClick={handleConfirmClick}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-bharat-coral hover:bg-[#d84315] px-4 text-sm font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-sm text-center"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{t('previewConfirmBtn')}</span>
        </button>
      </div>
    </div>
  );
}
