import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useComplaints } from '../context/ComplaintContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { analyzeComplaint } from '../services/complaintAnalyzer';
import { generateComplaint } from '../services/complaintGenerator';
import { recommendAuthority } from '../services/authorityService';
import { SUPPORTED_CITIES } from '../data/authorityDirectory';
import { detectEmergencyHazard } from '../services/emergencySafetyDetector';
import AnalysisResultCard from './AnalysisResultCard';
import ComplaintPreviewCard from './ComplaintPreviewCard';
import AuthorityRecommendationCard from './AuthorityRecommendationCard';

export default function ComplaintForm() {
  const { language, t } = useLanguage();
  const { saveConfirmedComplaint } = useComplaints();
  const routeLocation = useLocation();
  const prefill = routeLocation?.state || {};

  // Voice recognition
  const {
    isSupported: isVoiceSupported,
    isListening,
    error: voiceError,
    startListening,
    stopListening,
  } = useSpeechRecognition();
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Form input states (supports prefill from AI Assistant)
  const [text, setText] = useState(prefill.text || prefill.complaintText || '');
  const [location, setLocation] = useState(prefill.location || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Phase 6 Intelligent Location States
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [locality, setLocality] = useState('');
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsNotice, setGpsNotice] = useState(null);
  const [showManualLocation, setShowManualLocation] = useState(false);

  // Workflow states: 'input' | 'understanding' | 'preview' | 'authority'
  const [workflowStep, setWorkflowStep] = useState('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStage, setAnalyzingStage] = useState(1);
  const [error, setError] = useState(null);

  // Data states
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [authorityRecommendation, setAuthorityRecommendation] = useState(null);
  const [confirmedComplaint, setConfirmedComplaint] = useState(null);

  const fileInputRef = useRef(null);
  const flowCardRef = useRef(null);

  const scrollToFlowCard = () => {
    setTimeout(() => {
      flowCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Voice Input handler - Bol Nagrik
   */
  const handleToggleVoice = () => {
    if (!isVoiceSupported) {
      setVoiceNotice('voice_not_supported');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setVoiceNotice(null);
      const speechLang = language === 'hi' ? 'hi-IN' : 'en-IN';

      startListening({
        lang: speechLang,
        onResult: (transcript) => {
          setText(transcript);
          if (workflowStep !== 'input') {
            setWorkflowStep('input');
            setAnalysisResult(null);
            setGeneratedDraft(null);
            setAuthorityRecommendation(null);
            setConfirmedComplaint(null);
            setError(null);
          }
        },
      });
    }
  };

  const updateFullLocation = (newLocality, newCity, newState) => {
    const parts = [];
    if (newLocality && newLocality.trim()) parts.push(newLocality.trim());
    if (newCity && newCity.trim() && !newLocality?.toLowerCase().includes(newCity.toLowerCase())) {
      parts.push(newCity.trim());
    }
    if (newState && newState.trim() && !parts.some((p) => p.toLowerCase().includes(newState.toLowerCase()))) {
      parts.push(newState.trim());
    }
    const combined = parts.join(', ');
    setLocation(combined);
    if (combined && error === 'missing_location') setError(null);
    return combined;
  };

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    let matchedState = '';
    if (['Agra', 'Noida', 'Greater Noida', 'Ghaziabad'].includes(cityName)) {
      matchedState = 'Uttar Pradesh';
    } else if (['Delhi', 'New Delhi'].includes(cityName)) {
      matchedState = 'Delhi';
    } else if (['Gurugram', 'Faridabad'].includes(cityName)) {
      matchedState = 'Haryana';
    }
    if (matchedState) setSelectedState(matchedState);
    updateFullLocation(locality, cityName, matchedState || selectedState);
  };

  const handleLocalityChange = (val) => {
    setLocality(val);
    updateFullLocation(val, selectedCity, selectedState);
  };

  /**
   * Optional browser GPS location detector.
   * Permission-based, non-automatic. Uses browser Geolocation API.
   */
  const handleRequestGPS = () => {
    if (!('geolocation' in navigator)) {
      setGpsNotice(t('locationGpsUnavailable'));
      return;
    }

    setIsLocatingGPS(true);
    setGpsNotice(t('locationLocating'));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingGPS(false);
        const { latitude, longitude } = position.coords;

        // Approximate geofencing for verified pilot regions
        let detectedCity = null;
        let detectedState = null;

        if (latitude >= 27.05 && latitude <= 27.30 && longitude >= 77.85 && longitude <= 78.15) {
          detectedCity = 'Agra';
          detectedState = 'Uttar Pradesh';
        } else if (latitude >= 28.40 && latitude <= 28.90 && longitude >= 76.85 && longitude <= 77.38) {
          detectedCity = 'Delhi';
          detectedState = 'Delhi';
        } else if (latitude >= 28.48 && latitude <= 28.64 && longitude >= 77.30 && longitude <= 77.44) {
          detectedCity = 'Noida';
          detectedState = 'Uttar Pradesh';
        } else if (latitude >= 28.38 && latitude <= 28.52 && longitude >= 77.45 && longitude <= 77.58) {
          detectedCity = 'Greater Noida';
          detectedState = 'Uttar Pradesh';
        } else if (latitude >= 28.60 && latitude <= 28.75 && longitude >= 77.38 && longitude <= 77.55) {
          detectedCity = 'Ghaziabad';
          detectedState = 'Uttar Pradesh';
        } else if (latitude >= 28.38 && latitude <= 28.55 && longitude >= 76.92 && longitude <= 77.12) {
          detectedCity = 'Gurugram';
          detectedState = 'Haryana';
        } else if (latitude >= 28.30 && latitude <= 28.48 && longitude >= 77.25 && longitude <= 77.40) {
          detectedCity = 'Faridabad';
          detectedState = 'Haryana';
        }

        if (detectedCity) {
          setSelectedCity(detectedCity);
          setSelectedState(detectedState);
          updateFullLocation(locality, detectedCity, detectedState);
          setGpsNotice(
            `${t('locationGpsDetected')}: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E ~ ${detectedCity} (${detectedState})`
          );
        } else {
          const coordStr = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
          setGpsNotice(`${t('locationGpsDetected')}: ${coordStr}`);
          if (!locality) {
            setLocality(coordStr);
            updateFullLocation(coordStr, selectedCity, selectedState);
          }
        }
      },
      () => {
        setIsLocatingGPS(false);
        setGpsNotice(t('locationGpsError'));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  /**
   * Quick fill location with sample pilot location (Agra, UP)
   */
  const handleUseCurrentWard = () => {
    setSelectedCity('Agra');
    setSelectedState('Uttar Pradesh');
    setLocality(language === 'hi' ? 'सिकंदरा' : 'Sikandra');
    const sampleLoc = language === 'hi' ? 'सिकंदरा, आगरा, उत्तर प्रदेश' : 'Sikandra, Agra, Uttar Pradesh';
    setLocation(sampleLoc);
    if (error === 'missing_location') setError(null);
  };

  /**
   * Core Complaint Analysis runner with progressive status indicators
   */
  const executeAnalysis = async (targetText, targetLocation) => {
    if (!targetText.trim()) return;

    if (isListening) stopListening();

    setError(null);
    setIsAnalyzing(true);
    setAnalyzingStage(1);

    // Progressive loading indicator timers
    const timer1 = setTimeout(() => setAnalyzingStage(2), 800);
    const timer2 = setTimeout(() => setAnalyzingStage(3), 1600);

    try {
      const result = await analyzeComplaint(targetText, targetLocation, { language });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (result.success) {
        setAnalysisResult(result.data);
        setError(null);
        setWorkflowStep('understanding');
        scrollToFlowCard();
      } else {
        setError(result.error);
        setAnalysisResult(null);
        setWorkflowStep('input');
      }
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setError('analysis_failed');
      setAnalysisResult(null);
      setWorkflowStep('input');
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStage(1);
    }
  };

  /**
   * Step 1 -> Step 2: Citizen triggers analysis
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setAnalysisResult(null);
    setGeneratedDraft(null);
    setAuthorityRecommendation(null);
    setConfirmedComplaint(null);

    // Pre-flight check: never block acute emergency hazards from receiving safety instructions
    const emergencyHazard = detectEmergencyHazard(text);
    if (!emergencyHazard && !location.trim()) {
      setError('missing_location');
      return;
    }

    await executeAnalysis(text, location);
  };

  /**
   * Re-run analysis with AI (Retry button)
   */
  const handleRetryAnalysis = async () => {
    if (!text.trim()) return;
    await executeAnalysis(text, location);
  };

  const handleEditUnderstanding = () => {
    setWorkflowStep('input');
    setError(null);
  };


  const handleContinueToGeneration = () => {
    if (!analysisResult) return;

    try {
      const draft = generateComplaint(analysisResult);
      setGeneratedDraft({
        ...draft,
        category: analysisResult.category,
        location: analysisResult.location,
        priority: analysisResult.priority,
        originalText: analysisResult.originalText,
      });
      setWorkflowStep('preview');
      scrollToFlowCard();
    } catch {
      setError('analysis_failed');
    }
  };

  const handleBackToInput = () => {
    setWorkflowStep('input');
  };

  const handleConfirmComplaint = (finalData) => {
    const category = analysisResult?.category || finalData.category;
    const finalLocation = analysisResult?.location || finalData.location || location;

    const rec = recommendAuthority(category, finalLocation, {
      city: selectedCity || undefined,
      state: selectedState || undefined,
      locality: locality || undefined,
      isEmergency: Boolean(analysisResult?.isEmergency),
      hazardType: analysisResult?.hazardType,
      intelligent: true,
    });
    setAuthorityRecommendation(rec);

    const saved = saveConfirmedComplaint({
      ...finalData,
      originalText: text,
      category,
      priority: analysisResult?.priority || finalData.priority,
      recommendedAuthority: rec.recommendedAuthority || rec.authority,
      officialPortalUrl: rec.officialPortalUrl,
      portalName: rec.portalName,
      imageUrl: imagePreview || null,
    });

    setConfirmedComplaint(saved);
    setWorkflowStep('authority');
    scrollToFlowCard();
  };

  const handleResetAll = () => {
    if (isListening) stopListening();
    setText('');
    setLocation('');
    setSelectedCity('');
    setSelectedState('');
    setLocality('');
    setIsLocatingGPS(false);
    setGpsNotice(null);
    setShowManualLocation(false);
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setGeneratedDraft(null);
    setAuthorityRecommendation(null);
    setConfirmedComplaint(null);
    setError(null);
    setVoiceNotice(null);
    setWorkflowStep('input');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isSubmitDisabled = !text.trim() || isAnalyzing;

  const getErrorMessage = () => {
    switch (error) {
      case 'missing_location':
        return t('errorMissingLocation');
      case 'unsupported_category':
        return t('errorUnsupportedCategory');
      case 'empty_complaint':
        return t('errorEmptyComplaint');
      case 'analysis_failed':
        return t('errorAnalysisFailed');
      default:
        return t('errorAnalysisFailed');
    }
  };

  return (
    <div className="w-full">
      {/* Stitch Diagnostic Header Sub-bar */}
      <div className="flex items-center justify-between text-xs text-text-muted mb-3.5 px-0.5 flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <img
            src="/assets/nagriksetu_logo.jpg"
            alt="NagrikSetu"
            className="h-5 w-auto object-contain rounded shadow-2xs"
          />
          <span className="text-chakra-700 font-bold">NagrikSetu</span>
          <span className="text-text-muted/60">&rsaquo;</span>
          <span className="text-text-secondary">{language === 'hi' ? 'नागरिक डायग्नोस्टिक स्टूडियो' : 'AI Civic Diagnostic Studio'}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 font-semibold text-harit-600 bg-harit-50 border border-harit-100 rounded-full px-3 py-0.5 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-harit-500 animate-pulse" />
          NagrikSetu Vision v3.2 Active
        </div>
      </div>

      {/* Main Form Card with Stitch 3px Top Tricolor Accent */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          {/* Subtle Tricolor Top Accent Line */}
          <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

          <div className="p-6 sm:p-8">
            {/* Form Title & Bol Nagrik Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <label
                  htmlFor="complaint-text"
                  className="block text-base font-bold text-chakra-900 tracking-tight"
                >
                  {t('formLabel')}
                </label>
                <p className="text-xs text-text-muted mt-0.5">
                  {language === 'hi'
                    ? 'अपनी भाषा में समस्या लिखें या बोलकर दर्ज करें'
                    : 'Describe your issue in plain English, Hindi, or Hinglish'}
                </p>
              </div>

              {/* Accessible "Bol Nagrik" Speech Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-xs font-bold transition-all shadow-xs self-start sm:self-auto shrink-0 ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-200'
                    : 'bg-bharat-cream text-[#333] border border-bharat-creamborder hover:bg-[#f5ede6] active:scale-95'
                }`}
                aria-label={isListening ? t('voiceStopBtn') : t('voiceSpeakBtn')}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0014 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
                <span>{isListening ? t('voiceListening') : `बोल नागरिक / Speak`}</span>
              </button>
            </div>

            {/* Listening Indicator Banner */}
            {isListening && (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 animate-pulse">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  {t('voiceListening')} ({language === 'hi' ? 'हिन्दी/हिंग्लिश' : 'English/Hinglish'})
                </span>
                <button
                  type="button"
                  onClick={stopListening}
                  className="font-bold underline hover:text-red-900"
                >
                  {t('voiceStopBtn')}
                </button>
              </div>
            )}

            {/* Voice Notice */}
            {(voiceNotice === 'voice_not_supported' || (!isVoiceSupported && voiceError === 'not_supported')) && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
                <svg className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{t('voiceNotSupported')}</span>
              </div>
            )}

            {voiceError === 'permission_denied' && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700">
                <svg className="h-4 w-4 shrink-0 mt-0.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{t('voicePermissionError')}</span>
              </div>
            )}

            {/* Main Textarea */}
            <div className="relative">
              <textarea
                id="complaint-text"
                rows={4}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (workflowStep !== 'input') {
                    setWorkflowStep('input');
                    setAnalysisResult(null);
                    setGeneratedDraft(null);
                    setAuthorityRecommendation(null);
                    setConfirmedComplaint(null);
                    setError(null);
                  }
                }}
                placeholder={t('formPlaceholder')}
                disabled={isAnalyzing}
                className="w-full resize-none rounded-lg border border-border-input bg-surface-dim px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all duration-150 disabled:opacity-60 leading-relaxed font-sans"
              />
              <button
                type="button"
                onClick={handleToggleVoice}
                title={isListening ? t('voiceStopBtn') : t('formMicTooltip')}
                className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-text-muted hover:bg-chakra-50 hover:text-chakra-700'
                }`}
                aria-label={isListening ? t('voiceStopBtn') : t('formMicTooltip')}
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0014 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </button>
            </div>

            {/* Phase 6: Verified Pilot Cities & Location Section */}
            <div className="mt-4 pt-3 border-t border-border-dim">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-[11px] font-bold text-chakra-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-kesari-600">🏛️</span>
                  <span>{t('locationSelectPilotCity')}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowManualLocation(!showManualLocation)}
                  className="text-[11px] font-semibold text-chakra-600 hover:text-chakra-900 underline transition-colors"
                >
                  {showManualLocation
                    ? (language === 'hi' ? 'स्मार्ट शहर चयनकर्ता' : 'Use Smart City Selector')
                    : (language === 'hi' ? 'कस्टम पता दर्ज करें' : 'Manual Address Entry')}
                </button>
              </div>

              {/* Pilot City Quick Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {SUPPORTED_CITIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => (c.name === 'Agra' ? handleUseCurrentWard() : handleSelectCity(c.name))}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                      selectedCity === c.name
                        ? 'bg-chakra-700 text-white border-chakra-800 shadow-2xs'
                        : 'bg-white text-text-secondary border-border-input hover:border-chakra-400 hover:bg-chakra-50'
                    }`}
                  >
                    {c.name === 'Agra' ? '📍 Agra (Pilot)' : c.name}
                  </button>
                ))}
              </div>

              {/* Smart City & State Dropdowns (if not in single-field manual mode) */}
              {!showManualLocation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="city-select" className="block text-[11px] font-bold text-text-secondary mb-1">
                      {t('locationCitySelect')}
                    </label>
                    <select
                      id="city-select"
                      value={selectedCity}
                      onChange={(e) => handleSelectCity(e.target.value)}
                      disabled={isAnalyzing}
                      className="w-full h-10 rounded-lg border border-border-input bg-surface-dim px-3 text-xs text-text-primary focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                    >
                      <option value="">{t('locationCitySelect')}</option>
                      {SUPPORTED_CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                      <option value="Other">{language === 'hi' ? 'अन्य / कस्टम' : 'Other / Custom'}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="state-select" className="block text-[11px] font-bold text-text-secondary mb-1">
                      {t('locationStateSelect')}
                    </label>
                    <select
                      id="state-select"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        updateFullLocation(locality, selectedCity, e.target.value);
                      }}
                      disabled={isAnalyzing}
                      className="w-full h-10 rounded-lg border border-border-input bg-surface-dim px-3 text-xs text-text-primary focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all"
                    >
                      <option value="">{t('locationStateSelect')}</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Other">{language === 'hi' ? 'अन्य राज्य' : 'Other State'}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Symmetrically Aligned Locality & Visual Evidence Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Locality Input with GPS button */}
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3 flex items-center">
                    <svg className="h-4 w-4 text-chakra-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <input
                    id="locality-input"
                    type="text"
                    value={showManualLocation ? location : locality}
                    onChange={(e) => {
                      if (showManualLocation) {
                        setLocation(e.target.value);
                        if (error === 'missing_location') setError(null);
                      } else {
                        handleLocalityChange(e.target.value);
                      }
                    }}
                    placeholder={showManualLocation ? t('formLocationPlaceholder') : t('locationLocalityPlaceholder')}
                    disabled={isAnalyzing}
                    className={`w-full h-11 rounded-lg border bg-surface-dim pl-9.5 pr-24 text-sm text-text-primary placeholder:text-text-muted focus:border-chakra-700 focus:ring-2 focus:ring-kesari-300 focus:outline-none transition-all duration-150 disabled:opacity-60 ${
                      error === 'missing_location'
                        ? 'border-error ring-2 ring-red-100'
                        : 'border-border-input'
                    }`}
                  />
                  {/* Optional Permission-based GPS Button */}
                  <button
                    type="button"
                    onClick={handleRequestGPS}
                    disabled={isLocatingGPS || isAnalyzing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-chakra-700 hover:text-chakra-900 bg-white border border-border-input rounded-md hover:bg-chakra-50 shadow-2xs transition-colors flex items-center gap-1 disabled:opacity-60"
                    title="Request browser GPS (permission-based)"
                  >
                    {isLocatingGPS ? (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3 animate-spin text-chakra-600" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span className="text-[10px]">{t('locationLocating')}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span>📡</span>
                        <span>{t('locationUseGps')}</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Photographic Evidence Upload Button with matching h-11 height */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border-input bg-surface-dim px-4 text-sm font-semibold text-text-secondary hover:border-chakra-400 hover:text-chakra-700 hover:bg-white transition-all duration-150 text-center w-full shadow-2xs"
                  >
                    <svg className="h-4 w-4 text-kesari-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span className="truncate">{t('formUploadLabel')}</span>
                  </label>
                </div>
              </div>

              {/* GPS Notification Banner if active */}
              {gpsNotice && (
                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-chakra-50 border border-chakra-200 px-3 py-1.5 text-xs text-chakra-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-chakra-600">📍</span>
                    <span className="truncate font-medium">{gpsNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGpsNotice(null)}
                    className="text-text-muted hover:text-chakra-900 font-bold ml-2 shrink-0 text-sm"
                    aria-label="Dismiss GPS notice"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Evidence Image Preview */}
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-chakra-200 bg-chakra-50/50 p-3">
                <img
                  src={imagePreview}
                  alt="Diagnostic Attachment"
                  className="h-14 w-14 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-chakra-900 truncate">
                    {imageFile?.name}
                  </p>
                  <p className="text-[11px] text-harit-600 font-semibold mt-0.5">
                    ✓ Attached for AI Diagnostic Scanner
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-chakra-100 hover:text-chakra-700 transition-colors"
                  aria-label="Remove image"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 text-error shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs font-semibold text-red-700 leading-relaxed">
                  {getErrorMessage()}
                </p>
              </div>
            )}

            {/* Primary Action Button — Kesari Flame with Symmetrical 48px Height */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`mt-5 w-full h-12 rounded-full text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
                isSubmitDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-bharat-coral hover:bg-[#d84315] text-white active:scale-[0.99] hover:shadow-md'
              }`}
            >
              {isAnalyzing ? (
                <span className="inline-flex items-center gap-2 animate-pulse">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>
                    {analyzingStage === 1 && t('loadingUnderstanding')}
                    {analyzingStage === 2 && t('loadingCategory')}
                    {analyzingStage === 3 && t('loadingPreparing')}
                  </span>
                </span>
              ) : (
                <>
                  <span>+ {t('formAnalyzeBtn')}</span>
                  <span className="text-xs font-normal opacity-85">
                    ({language === 'hi' ? 'AI जांच व रिपोर्ट' : 'AI Diagnostic Triage'})
                  </span>
                </>
              )}
            </button>

            {/* Note */}
            <p className="mt-3.5 text-center text-xs text-text-muted leading-relaxed">
              {t('formNote')}
            </p>
          </div>
        </div>
      </form>

      {/* Downstream Cards Container */}
      <div ref={flowCardRef} className="space-y-4">
        {/* Step 2: AI Understanding Card */}
        {workflowStep === 'understanding' && analysisResult && (
          <AnalysisResultCard
            result={analysisResult}
            onEdit={handleEditUnderstanding}
            onContinue={handleContinueToGeneration}
            onRetry={handleRetryAnalysis}
          />
        )}


        {/* Step 3: AI Generated Complaint Preview Card */}
        {workflowStep === 'preview' && generatedDraft && (
          <ComplaintPreviewCard
            key={`${generatedDraft.category}-${generatedDraft.location}-${generatedDraft.subject}`}
            initialSubject={generatedDraft.subject}
            initialDescription={generatedDraft.description}
            category={generatedDraft.category}
            location={generatedDraft.location}
            priority={generatedDraft.priority}
            onConfirm={handleConfirmComplaint}
            onBackToEdit={handleBackToInput}
          />
        )}

        {/* Step 4: Recommended Authority & Official Channel Card */}
        {workflowStep === 'authority' && authorityRecommendation && (
          <AuthorityRecommendationCard
            recommendation={authorityRecommendation}
            complaint={confirmedComplaint}
            onReset={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}
