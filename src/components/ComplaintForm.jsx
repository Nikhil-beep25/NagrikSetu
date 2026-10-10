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

  // Example complaints for quick guidance
  const exampleComplaints = [
    {
      label: language === 'hi' ? 'सड़क पर गड्ढा' : 'Road Pothole',
      text: language === 'hi' ? 'सड़क पर बहुत बड़ा गड्ढा है जिससे दुर्घटना का खतरा है।' : 'Main road has a dangerous deep pothole causing accidents.',
      city: 'Agra',
    },
    {
      label: language === 'hi' ? 'कचरा नहीं उठा' : 'Garbage Uncollected',
      text: language === 'hi' ? 'हमारे क्षेत्र में 3 दिन से कचरा नहीं उठाया गया और दुर्गंध फैल रही है।' : 'Garbage has not been collected from our area for 3 days.',
      city: 'Agra',
    },
    {
      label: language === 'hi' ? 'स्ट्रीट लाइट खराब' : 'Broken Streetlight',
      text: language === 'hi' ? 'गली की स्ट्रीट लाइट 5 दिनों से बंद है और रात में अंधेरा रहता है।' : 'Street light on our street has been malfunctioning for 5 days.',
      city: 'Agra',
    },
    {
      label: language === 'hi' ? 'जल आपूर्ति बंद' : 'No Water Supply',
      text: language === 'hi' ? 'तीन दिन से पीने का पानी नहीं आ रहा है, पाइपलाइन में समस्या है।' : 'Drinking water supply pipeline has been broken for 3 days.',
      city: 'Agra',
    },
  ];

  const handleUseExample = (ex) => {
    setText(ex.text);
    if (!selectedCity && !location) {
      handleSelectCity(ex.city);
    }
    if (workflowStep !== 'input') {
      setWorkflowStep('input');
      setAnalysisResult(null);
      setGeneratedDraft(null);
      setAuthorityRecommendation(null);
      setConfirmedComplaint(null);
      setError(null);
    }
  };

  // State calculations for Progress Indicator (Section 2)
  const isStep1Done = text.trim().length > 0;
  const isStep2Done = Boolean(location.trim() || selectedCity || locality.trim());
  const isStep3Done = Boolean(analysisResult);
  const isStep4Done = Boolean(confirmedComplaint);

  const activeStepNumber =
    workflowStep === 'authority'
      ? 4
      : workflowStep === 'preview'
      ? 4
      : workflowStep === 'understanding' || isAnalyzing
      ? 3
      : isStep1Done
      ? 2
      : 1;

  const progressSteps = [
    { number: 1, label: language === 'hi' ? 'विवरण' : 'Describe', isDone: isStep1Done, isActive: activeStepNumber === 1 },
    { number: 2, label: language === 'hi' ? 'स्थान' : 'Location', isDone: isStep2Done, isActive: activeStepNumber === 2 },
    { number: 3, label: language === 'hi' ? 'AI विश्लेषण' : 'Analyze', isDone: isStep3Done, isActive: activeStepNumber === 3 },
    { number: 4, label: language === 'hi' ? 'समीक्षा' : 'Review', isDone: isStep4Done, isActive: activeStepNumber === 4 },
  ];

  return (
    <div className="w-full space-y-8">
      {/* ==================================================
          SECTION 2: PROGRESS INDICATOR (HONEST APP STATE)
         ================================================== */}
      <div className="rounded-2xl border border-[#E3E8EF] bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-2">
            <span>🧭</span>
            <span>{language === 'hi' ? 'शिकायत तैयारी चरण' : 'Complaint Preparation Workflow'}</span>
          </span>
          <span className="text-xs font-bold text-[#F47721] bg-[#FFF9F1] border border-[#F47721]/20 px-2.5 py-0.5 rounded-full">
            {language === 'hi' ? `चरण ${activeStepNumber} / 4` : `Step ${activeStepNumber} of 4`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {progressSteps.map((step, idx) => {
            const isCompleted = step.isDone && activeStepNumber > step.number;
            const isCurrent = activeStepNumber === step.number;
            return (
              <div key={step.number} className="flex flex-col items-center text-center relative">
                {/* Connector line between steps */}
                {idx < 3 && (
                  <div
                    className={`hidden sm:block absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                      step.isDone ? 'bg-[#13865B]' : 'bg-slate-200'
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-[#13865B] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#F47721] text-white ring-4 ring-[#F47721]/20 shadow-sm'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>

                <span
                  className={`mt-2 text-[11px] sm:text-xs font-black transition-colors ${
                    isCurrent
                      ? 'text-[#F47721]'
                      : isCompleted
                      ? 'text-[#13865B]'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          SECTION 3: BALANCED TWO-COLUMN COMPOSITION
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================
            MAIN COLUMN: FORM & DOWNSTREAM CARDS (8 COLS)
           ================================================== */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="rounded-2xl border-2 border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
              {/* Top Tricolor Accent Line */}
              <div className="tricolor-ribbon-3px w-full" aria-hidden="true" />

              <div className="p-6 sm:p-8 space-y-6">
                {/* Form Title & Prominent "Speak Your Problem" Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <label
                      htmlFor="complaint-text"
                      className="block text-base sm:text-lg font-black text-[#0B1F50] tracking-tight"
                    >
                      {language === 'hi' ? 'अपनी समस्या का विवरण दें' : 'Describe Your Civic Problem'}
                    </label>
                    <p className="text-xs text-[#596579] mt-0.5 font-medium">
                      {language === 'hi'
                        ? 'हिन्दी, अंग्रेज़ी या हिंग्लिश में लिखें या बोलें'
                        : 'Describe your issue in plain Hindi, English, or Hinglish'}
                    </p>
                  </div>

                  {/* Prominent Voice Input Button (Section 4) */}
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`inline-flex items-center justify-center gap-2 h-11 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200 shadow-md'
                        : 'bg-[#FFF9F1] text-[#0B1F50] border-2 border-[#F47721]/40 hover:border-[#F47721] hover:bg-white shadow-2xs'
                    }`}
                    aria-label={
                      isListening
                        ? language === 'hi' ? 'आवाज़ रिकॉर्डिंग रोकें' : 'Stop Listening'
                        : language === 'hi' ? 'अपनी समस्या बोलें' : 'Speak Your Problem'
                    }
                  >
                    <span className="text-base sm:text-lg">🎤</span>
                    <span>
                      {isListening
                        ? (language === 'hi' ? 'बोल रहे हैं...' : 'Listening...')
                        : (language === 'hi' ? 'अपनी समस्या बोलें' : 'Speak Your Problem')}
                    </span>
                  </button>
                </div>

                {/* Listening Active Banner */}
                {isListening && (
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-red-50 border-2 border-red-300 px-4 py-3 text-xs text-red-800 animate-pulse">
                    <span className="flex items-center gap-2 font-black">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                      <span>{language === 'hi' ? 'अपनी भाषा में बोलें — रिकॉर्ड हो रहा है...' : 'Listening in Hindi / English... Speak naturally.'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="font-black underline hover:text-red-950 px-2 py-1 rounded bg-white border border-red-200 cursor-pointer"
                    >
                      {language === 'hi' ? 'पूर्ण करें' : 'Done'}
                    </button>
                  </div>
                )}

                {/* Voice Notice */}
                {(voiceNotice === 'voice_not_supported' || (!isVoiceSupported && voiceError === 'not_supported')) && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
                    <span className="text-base shrink-0">ℹ️</span>
                    <span>{t('voiceNotSupported')}</span>
                  </div>
                )}

                {voiceError === 'permission_denied' && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700">
                    <span className="text-base shrink-0">⚠️</span>
                    <span>{t('voicePermissionError')}</span>
                  </div>
                )}

                {/* Main Problem Description Textarea */}
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
                    className="w-full resize-none rounded-xl border border-slate-200 bg-[#FFF9F1]/40 px-4 py-3.5 pr-12 text-xs sm:text-sm text-[#1D2939] placeholder:text-slate-400 focus:border-[#0B1F50] focus:bg-white focus:ring-2 focus:ring-[#0B1F50]/15 focus:outline-hidden transition-all duration-150 disabled:opacity-60 leading-relaxed font-sans font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    title={isListening ? 'Stop' : 'Speak'}
                    className={`absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'text-slate-400 hover:bg-[#FFF9F1] hover:text-[#F47721]'
                    }`}
                  >
                    🎤
                  </button>
                </div>

                {/* ==================================================
                    SECTION 5: LOCATION CONTROLS (PILOT CITIES)
                   ================================================== */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-[#0B1F50] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="text-[#F47721]">📍</span>
                      <span>{t('locationSelectPilotCity')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowManualLocation(!showManualLocation)}
                      className="text-xs font-bold text-[#F47721] hover:underline cursor-pointer"
                    >
                      {showManualLocation
                        ? (language === 'hi' ? 'स्मार्ट शहर चयनकर्ता' : 'Use Smart City Selector')
                        : (language === 'hi' ? 'कस्टम पता दर्ज करें' : 'Manual Address Entry')}
                    </button>
                  </div>

                  {/* Pilot City Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SUPPORTED_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => (c.name === 'Agra' ? handleUseCurrentWard() : handleSelectCity(c.name))}
                        className={`px-3 py-1 text-xs font-black rounded-full border transition-all cursor-pointer ${
                          selectedCity === c.name
                            ? 'bg-[#0B1F50] text-white border-[#0B1F50] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-[#FFF9F1]'
                        }`}
                      >
                        {c.name === 'Agra' ? '📍 Agra (Pilot)' : c.name}
                      </button>
                    ))}
                  </div>

                  {/* City & State Dropdowns */}
                  {!showManualLocation && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="city-select" className="block text-[11px] font-black text-slate-500 uppercase mb-1">
                          {t('locationCitySelect')}
                        </label>
                        <select
                          id="city-select"
                          value={selectedCity}
                          onChange={(e) => handleSelectCity(e.target.value)}
                          disabled={isAnalyzing}
                          className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0B1F50] focus:outline-hidden transition-all"
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
                        <label htmlFor="state-select" className="block text-[11px] font-black text-slate-500 uppercase mb-1">
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
                          className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0B1F50] focus:outline-hidden transition-all"
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

                  {/* Locality Input & GPS */}
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
                      📍
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
                      className={`w-full h-11 rounded-xl border bg-white pl-10 pr-24 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#0B1F50] focus:outline-hidden transition-all ${
                        error === 'missing_location'
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleRequestGPS}
                      disabled={isLocatingGPS || isAnalyzing}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-[#0B1F50] hover:text-[#F47721] bg-[#FFF9F1] border border-slate-200 rounded-lg hover:bg-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isLocatingGPS ? '📡 Locating...' : '📡 GPS'}
                    </button>
                  </div>

                  {gpsNotice && (
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs text-blue-900">
                      <span className="truncate">📍 {gpsNotice}</span>
                      <button
                        type="button"
                        onClick={() => setGpsNotice(null)}
                        className="font-bold ml-2 text-slate-500 hover:text-black cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    SECTION 6: PHOTO EVIDENCE UPLOAD AREA
                   ================================================== */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0B1F50] uppercase tracking-wider flex items-center gap-1.5">
                      <span>📷</span>
                      <span>{language === 'hi' ? 'फोटो साक्ष्य संलग्न करें (वैकल्पिक)' : 'Photo Evidence (Optional)'}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      JPG, PNG (Max 10MB)
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />

                  {!imagePreview ? (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-[#F47721] rounded-2xl bg-[#FFF9F1]/30 hover:bg-[#FFF9F1]/60 transition-all cursor-pointer text-center"
                    >
                      <span className="text-2xl mb-1">📸</span>
                      <span className="text-xs font-black text-[#0B1F50]">
                        {language === 'hi' ? 'फोटो अपलोड करने के लिए क्लिक करें' : 'Click to Upload Evidence Photo'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'hi' ? 'सड़क, नाली, कचरा या लाइट की स्पष्ट तस्वीर' : 'Clear photo of pothole, waste, drainage or lamp'}
                      </span>
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-3">
                      <img
                        src={imagePreview}
                        alt="Evidence Preview"
                        className="h-16 w-16 sm:h-18 sm:w-18 rounded-xl object-cover border border-emerald-200 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-emerald-950 truncate">
                          {imageFile?.name || 'Attached Photo'}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                          ✓ {language === 'hi' ? 'फोटो साक्ष्य तैयार है' : 'Photo evidence attached for AI scan'}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'हटाएं' : 'Remove'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3">
                    <span className="text-base text-red-600 mt-0.5">⚠️</span>
                    <p className="text-xs font-bold text-red-800 leading-relaxed">
                      {getErrorMessage()}
                    </p>
                  </div>
                )}

                {/* Submit AI Analysis Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`w-full h-12 rounded-xl text-xs sm:text-sm font-black transition-all duration-150 flex items-center justify-center gap-2 shadow-md ${
                    isSubmitDisabled
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#F47721] hover:bg-[#d96617] text-white active:scale-[0.99] hover:shadow-lg cursor-pointer'
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
                      <span>✨</span>
                      <span>{t('formAnalyzeBtn')}</span>
                      <span className="text-xs font-medium opacity-90">
                        ({language === 'hi' ? 'AI जांच व प्रारूप' : 'AI Diagnostic Triage'})
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  {t('formNote')}
                </p>
              </div>
            </div>
          </form>

          {/* ==================================================
              DOWNSTREAM CARDS CONTAINER (SECTIONS 7 & 8)
             ================================================== */}
          <div ref={flowCardRef} className="space-y-6">
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

        {/* ==================================================
            SUPPORTING COLUMN: INSTRUCTIONS & EXAMPLES (4 COLS)
           ================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Helpful Instructions */}
          <div className="rounded-2xl border border-[#E3E8EF] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-2">
              <span>💡</span>
              <span>{language === 'hi' ? 'प्रभावी शिकायत कैसे लिखें?' : 'Tips for Effective Complaints'}</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-[#596579] font-medium leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#13865B] font-bold">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'सटीक स्थान:' : 'Exact Location:'}</strong>{' '}
                  {language === 'hi' ? 'लैंडमार्क, सड़क का नाम या वार्ड नंबर अवश्य बताएं।' : 'Include a known landmark, street name, or ward.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#13865B] font-bold">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'समस्या की अवधि:' : 'Duration:'}</strong>{' '}
                  {language === 'hi' ? 'यह समस्या कितने दिनों से है (उदा. 3 दिन, 1 हफ्ता)।' : 'Mention how long the issue has persisted.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#13865B] font-bold">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'साक्ष्य फोटो:' : 'Photo Evidence:'}</strong>{' '}
                  {language === 'hi' ? 'तस्वीर से समस्या की गंभीरता स्पष्ट होती है।' : 'Clear photos help authorities prioritize repair.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#13865B] font-bold">✓</span>
                <span>
                  <strong>{language === 'hi' ? 'सरल भाषा:' : 'Plain Language:'}</strong>{' '}
                  {language === 'hi' ? 'तकनीकी शब्दों की आवश्यकता नहीं, अपनी भाषा में बताएं।' : 'Write naturally in Hindi, English, or Hinglish.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Clickable Example Complaints */}
          <div className="rounded-2xl border border-[#E3E8EF] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-2">
                <span>💬</span>
                <span>{language === 'hi' ? 'नमूना समस्याएं (क्लिक करें)' : 'Example Complaints (Quick Fill)'}</span>
              </h3>
            </div>
            <p className="text-[11px] text-[#596579] font-medium">
              {language === 'hi'
                ? 'किसी भी उदाहरण पर क्लिक करके फॉर्म में भरें:'
                : 'Click any example to quickly populate the form:'}
            </p>
            <div className="space-y-2">
              {exampleComplaints.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUseExample(ex)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 bg-[#FFF9F1]/50 hover:bg-[#FFF9F1] hover:border-[#F47721]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-black text-[#0B1F50] group-hover:text-[#F47721]">
                    <span>{ex.label}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-[#F47721]">भरें &rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    &ldquo;{ex.text}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Supported Categories */}
          <div className="rounded-2xl border border-[#E3E8EF] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B1F50] flex items-center gap-2">
              <span>🏛️</span>
              <span>{language === 'hi' ? 'समर्थित नागरिक श्रेणियां' : 'Supported Civic Scopes'}</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <span>🗑️</span>
                <span>{language === 'hi' ? 'कचरा' : 'Waste'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <span>🚧</span>
                <span>{language === 'hi' ? 'सड़क / गड्ढा' : 'Roads'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <span>💡</span>
                <span>{language === 'hi' ? 'स्ट्रीट लाइट' : 'Lighting'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <span>🚰</span>
                <span>{language === 'hi' ? 'जल आपूर्ति' : 'Water'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 col-span-2">
                <span>🌊</span>
                <span>{language === 'hi' ? 'नाली व जलभराव' : 'Drainage & Sewage'}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Emergency Contacts Warning */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/70 p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-900 font-black text-xs uppercase tracking-wider">
              <span>🚨</span>
              <span>{language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Contacts'}</span>
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed font-medium">
              {language === 'hi'
                ? 'यदि बिजली का तार टूटकर गिरा हो या जान-माल का खतरा हो, तो तुरंत डायल करें:'
                : 'For live sparking wires or immediate life hazards, contact directly:'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="tel:112"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-red-600 text-white font-black text-xs shadow-2xs hover:bg-red-700"
              >
                📞 112 (National)
              </a>
              <a
                href="tel:1912"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-amber-600 text-white font-black text-xs shadow-2xs hover:bg-amber-700"
              >
                ⚡ 1912 (Power)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

