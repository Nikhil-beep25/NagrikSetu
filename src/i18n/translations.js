const translations = {
  en: {
    // Navbar
    navHome: 'Home',
    navComplaints: 'My Complaints',
    navHow: 'How It Works',

    // Hero
    heroBadge: 'AI-Powered Civic Assistant',
    heroHeading: 'Tell us your civic problem.',
    heroSubheading:
      'Describe your problem in your own words. AI helps you understand the complaint and find the right next step.',

    // Complaint form
    formLabel: 'What problem are you facing?',
    formPlaceholder:
      'Example: Garbage has not been collected in my area for 3 days...',
    formLocationPlaceholder: 'Your area or locality',
    formUploadLabel: 'Attach photo (optional)',
    formAnalyzeBtn: 'Analyze Complaint',
    formAnalyzing: 'Analyzing...',
    formNote:
      'You can describe your problem in English, Hindi, or Hinglish.',
    formMicTooltip: 'Click to speak your problem',
    formImageSelected: 'Image selected',

    // Voice Input (Phase 6)
    voiceSpeakBtn: 'Speak your problem',
    voiceListening: 'Listening... speak now',
    voiceStopBtn: 'Stop listening',
    voiceNotSupported: 'Voice input is not supported in this browser.',
    voicePermissionError:
      'Microphone access denied. Please allow microphone permission in your browser.',

    // Analysis result
    resultTitle: 'Complaint Understanding',
    resultProblem: 'Problem',
    resultCategory: 'Category',
    resultLocation: 'Location',
    resultPriority: 'Priority',
    resultEdit: 'Edit',
    resultContinue: 'Generate Complaint',
    loadingUnderstanding: 'Understanding your complaint...',
    loadingCategory: 'Identifying the problem category...',
    loadingPreparing: 'Preparing your complaint...',
    fallbackNotice:
      'Basic complaint analysis is being used because AI assistance is temporarily unavailable.',
    aiAssistedBadge: 'Powered by Gemini AI',
    fallbackBadge: 'Rule-Based Fallback',
    urgencyHigh: 'High Urgency',
    urgencyNormal: 'Normal Urgency',
    urgencyReasonLabel: 'Urgency Assessment',
    durationLabel: 'Duration Reported',
    missingInfoTitle: 'Suggested Missing Information',
    missingInfoDesc:
      'Providing these details will help authorities resolve your complaint faster:',
    retryAnalysisBtn: 'Re-analyze with AI',
    safetyNoticeTitle: 'Emergency & Hazard Advisory',
    safetyNoticeText:
      'NagrikSetu is an administrative grievance platform, not an emergency response service. For acute public safety hazards or life-threatening emergencies, please contact emergency helplines (e.g. 112).',
    emergencyCriticalAlert: 'CRITICAL SAFETY ALERT — IMMEDIATE HAZARD',
    emergencyStayClear: 'Stay at least 10 meters (33 feet) away. Do not touch wires, metal poles, or standing water.',
    emergencyCall112: 'Call 112 (National Emergency)',
    emergencyCall1912: 'Call 1912 (Electricity Discom)',
    emergencyUnsupportedExplanation:
      'This is an acute electrical hazard requiring immediate on-site response from electricity authorities and emergency services, not a standard municipal grievance.',
    emergencyDisclaimer:
      'NagrikSetu is an administrative grievance tool and has NOT dispatched emergency teams. You must call 112 or 1912 directly.',
    emergencyActionsTitle: 'Immediate Safety Actions',
    emergencySafeDistanceNotice: 'Maintain safe distance immediately',
    detectedLanguageLabel: 'Detected Language',
    subcategoryLabel: 'Subcategory',

    // Complaint Preview (Phase 3)
    previewTitle: 'AI Generated Complaint',
    previewSubtitle:
      'Review and edit the formal complaint generated for submission.',
    previewSubject: 'Subject',
    previewSubjectPlaceholder: 'Enter complaint subject...',
    previewDescription: 'Description',
    previewDescriptionPlaceholder: 'Enter complaint description...',
    previewEditBtn: 'Edit Complaint',
    previewConfirmBtn: 'Confirm Complaint',
    previewConfirmedBadge: 'Saved in Application State',
    previewConfirmedTitle: 'Complaint Confirmed',
    previewConfirmedDesc:
      'Your formal complaint has been saved in the application state. See the recommended authority and official channel below.',
    previewViewComplaints: 'View in My Complaints',
    previewCreateNew: 'File Another Complaint',

    // Authority Recommendation (Phase 4)
    authorityTitle: 'Recommended Authority',
    authoritySubtitle:
      'Identified civic department and next official submission channel',
    authorityLabel: 'Authority',
    authorityComplaintType: 'Complaint Type',
    authorityLocation: 'Location',
    authorityReasonLabel: 'Reason',
    authorityReasonText:
      'This complaint appears to relate to a local civic service.',
    authorityDisclaimer:
      'AI recommendation. Please verify the authority before submitting.',
    authorityJurisdictionLabel: 'Jurisdiction',
    authorityConfidenceLabel: 'Confidence Level',
    authorityVerificationLabel: 'Verification Status',
    authorityLastVerifiedLabel: 'Last Verified',
    authorityWebsiteBtn: 'Visit Official Website',
    authorityAlternativesTitle: 'Alternative Responsible Authorities',
    authorityUncertainNotice:
      'Based on your selected location and complaint category, this authority may be responsible. Please verify the jurisdiction before submitting your complaint.',
    authorityNonAffiliationNotice:
      'NagrikSetu is an independent civic assistance platform and is not officially affiliated with any government department.',
    locationCitySelect: 'Select City / District',
    locationStateSelect: 'Select State',
    locationLocalityPlaceholder: 'Ward / Locality / Sector / Colony',
    locationManualFallback: 'Or type custom location',
    locationGpsDetected: 'GPS coordinates detected',
    locationGpsUnavailable: 'Geolocation not supported in this browser.',
    locationUseGps: 'Use GPS',
    locationLocating: 'Detecting location...',
    locationGpsError: 'Unable to retrieve GPS location. Please enter location manually.',
    locationSelectPilotCity: 'Quick Select Verified Pilot City:',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence',
    statusVerified: 'Verified Government Record',
    statusUnverified: 'Provisional Recommendation',
    channelTitle: 'Official Complaint Channel',
    channelOpenBtn: 'Open Official Portal',
    channelNotConfigured: 'Official portal link not configured yet.',
    channelCitizenResponsibility:
      'Please submit through the official portal above. You can copy your complaint details to paste into the form.',
    copyComplaintBtn: 'Copy Complaint Text',
    copiedFeedback: 'Copied to clipboard!',

    // Tracking (Phase 5)
    trackingDisclaimer:
      'Prototype tracking — live government status integration is not connected.',
    trackingNoticeHeader: 'Prototype Tracking Notice',
    prototypeTimelineHeader: 'Prototype Timeline',
    currentPrototypeStatus: 'Current prototype status',
    timelineStepCreated: 'Complaint Created',
    timelineStepPrepared: 'Complaint Prepared',
    timelineStepChannel: 'Official Channel Selected',
    timelineStepUnderReview: 'Under Review',
    timelineStepResolved: 'Resolved',
    trackComplaintBtn: 'Track Complaint',
    backToComplaints: 'Back to My Complaints',
    complaintNotFound: 'Complaint Not Found',
    simulateStatus: 'Simulate Prototype Status:',

    // Statuses
    statusCreated: 'Created',
    statusPrepared: 'Prepared',
    statusUnderReview: 'Under Review',
    statusResolved: 'Resolved',

    // Errors
    errorMissingLocation:
      'Please provide your location so we can identify the relevant civic authority.',
    errorUnsupportedCategory:
      'We currently support garbage, roads, streetlights, water, and drainage complaints.',
    errorEmptyComplaint: 'Please describe your civic problem.',
    errorAnalysisFailed:
      'Something went wrong while analyzing your complaint. Please try again.',
    errorEmptySubject: 'Subject cannot be empty.',
    errorEmptyDescription: 'Description cannot be empty.',

    // Continue confirmation
    continueMessage:
      'Your complaint has been reviewed. Proceeding to complaint generation.',

    // How it works
    howTitle: 'How It Works',
    howStep1Title: 'Describe your problem',
    howStep1Desc:
      'Write about your civic issue in plain language — English, Hindi, or Hinglish.',
    howStep2Title: 'AI understands it',
    howStep2Desc:
      'Our AI reads your complaint, identifies the category, and extracts key details.',
    howStep3Title: 'Find the right authority',
    howStep3Desc:
      'Get matched to the correct government department or official for your issue.',
    howStep4Title: 'Track your complaint',
    howStep4Desc:
      'Stay updated on the status of your complaint and any responses.',

    // My Complaints (Phase 5)
    complaintsTitle: 'My Complaints',
    complaintsEmpty: "You haven't created any complaints yet.",
    complaintsCreate: 'Create Complaint',
    complaintsEmptySubtitle: 'View and track your submitted civic complaints',
    complaintsRecordedNotice: 'recorded in current session',
    complaintStatusConfirmed: 'Confirmed — Authority Identified',
    complaintsSavedCount: 'Saved Complaints',

    // Footer
    footerTagline: 'Making civic access simple with AI.',
    footerRights: '© 2026 AI Civic Access. All rights reserved.',
  },
  hi: {
    // Navbar
    navHome: 'होम',
    navComplaints: 'मेरी शिकायतें',
    navHow: 'कैसे काम करता है',

    // Hero
    heroBadge: 'AI-संचालित नागरिक सहायक',
    heroHeading: 'अपनी नागरिक समस्या बताएं।',
    heroSubheading:
      'अपनी समस्या अपने शब्दों में बताएं। AI आपकी शिकायत समझने और सही अगला कदम खोजने में मदद करता है।',

    // Complaint form
    formLabel: 'आपको कौन सी समस्या हो रही है?',
    formPlaceholder:
      'उदाहरण: मेरे इलाके में 3 दिन से कचरा नहीं उठाया गया है...',
    formLocationPlaceholder: 'आपका क्षेत्र या इलाका',
    formUploadLabel: 'फोटो अटैच करें (वैकल्पिक)',
    formAnalyzeBtn: 'शिकायत का विश्लेषण करें',
    formAnalyzing: 'विश्लेषण हो रहा है...',
    formNote:
      'आप अपनी समस्या अंग्रेजी, हिंदी या हिंग्लिश में बता सकते हैं।',
    formMicTooltip: 'अपनी समस्या बोलने के लिए क्लिक करें',
    formImageSelected: 'तस्वीर चुनी गई',

    // Voice Input (Phase 6)
    voiceSpeakBtn: 'अपनी समस्या बोलें',
    voiceListening: 'सुन रहे हैं... कृपया बोलिए',
    voiceStopBtn: 'सुनना बंद करें',
    voiceNotSupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।',
    voicePermissionError:
      'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया अपने ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।',

    // Analysis result
    resultTitle: 'शिकायत की समझ',
    resultProblem: 'समस्या',
    resultCategory: 'श्रेणी',
    resultLocation: 'स्थान',
    resultPriority: 'प्राथमिकता',
    resultEdit: 'संपादित करें',
    resultContinue: 'शिकायत जनरेट करें',
    loadingUnderstanding: 'आपकी शिकायत समझी जा रही है...',
    loadingCategory: 'समस्या की श्रेणी पहचानी जा रही है...',
    loadingPreparing: 'शिकायत तैयार की जा रही है...',
    fallbackNotice:
      'बुनियादी शिकायत विश्लेषण का उपयोग किया जा रहा है क्योंकि AI सहायता अस्थायी रूप से अनुपलब्ध है।',
    aiAssistedBadge: 'Gemini AI द्वारा संचालित',
    fallbackBadge: 'नियम-आधारित बैकअप',
    urgencyHigh: 'उच्च प्राथमिकता',
    urgencyNormal: 'सामान्य प्राथमिकता',
    urgencyReasonLabel: 'प्राथमिकता मूल्यांकन',
    durationLabel: 'दर्ज अवधि',
    missingInfoTitle: 'अपेक्षित अतिरिक्त जानकारी',
    missingInfoDesc:
      'यह विवरण प्रदान करने से प्रशासन को समस्या निवारण में आसानी होगी:',
    retryAnalysisBtn: 'AI के साथ पुनः विश्लेषण करें',
    safetyNoticeTitle: 'आपातकालीन व जोखिम सूचना',
    safetyNoticeText:
      'नागरिकसेतु एक प्रशासनिक शिकायत मंच है, आपातकालीन प्रतिक्रिया सेवा नहीं। गंभीर खतरे या आपात स्थिति के लिए कृपया तुरंत आपातकालीन हेल्पलाइन (जैसे 112) पर संपर्क करें।',
    emergencyCriticalAlert: 'गंभीर सुरक्षा चेतावनी — तत्काल जोखिम',
    emergencyStayClear: 'कम से कम 10 मीटर (33 फीट) की दूरी बनाए रखें। तार, धातु के खंभे या भरे पानी को न छुएं।',
    emergencyCall112: '112 पर कॉल करें (राष्ट्रीय आपातकाल)',
    emergencyCall1912: '1912 पर कॉल करें (विद्युत डिस्कॉम)',
    emergencyUnsupportedExplanation:
      'यह एक गंभीर विद्युत जोखिम है जिसके लिए विद्युत वितरण निगम और आपातकालीन सेवाओं से तत्काल मौके पर कार्रवाई की आवश्यकता है, न कि सामान्य नगरपालिका शिकायत।',
    emergencyDisclaimer:
      'नागरिकसेतु एक प्रशासनिक शिकायत पोर्टल है और इसने आपातकालीन टीम नहीं भेजी है। कृपया 112 या 1912 पर सीधे कॉल करें।',
    emergencyActionsTitle: 'तत्काल सुरक्षा कदम',
    emergencySafeDistanceNotice: 'तुरंत सुरक्षित दूरी बनाए रखें',
    detectedLanguageLabel: 'पहचानी गई भाषा',
    subcategoryLabel: 'उप-श्रेणी',

    // Complaint Preview (Phase 3)
    previewTitle: 'AI द्वारा जनरेट की गई शिकायत',
    previewSubtitle:
      'प्रस्तुत करने के लिए जनरेट की गई औपचारिक शिकायत की समीक्षा और संपादन करें।',
    previewSubject: 'विषय',
    previewSubjectPlaceholder: 'शिकायत का विषय दर्ज करें...',
    previewDescription: 'विवरण',
    previewDescriptionPlaceholder: 'शिकायत का विवरण दर्ज करें...',
    previewEditBtn: 'शिकायत संपादित करें',
    previewConfirmBtn: 'शिकायत की पुष्टि करें',
    previewConfirmedBadge: 'एप्लिकेशन स्थिति में सहेजा गया',
    previewConfirmedTitle: 'शिकायत की पुष्टि हो गई',
    previewConfirmedDesc:
      'आपकी औपचारिक शिकायत एप्लिकेशन स्थिति में सहेज ली गई है। नीचे अनुशंसित प्राधिकरण और आधिकारिक चैनल देखें।',
    previewViewComplaints: 'मेरी शिकायतों में देखें',
    previewCreateNew: 'एक और शिकायत दर्ज करें',

    // Authority Recommendation (Phase 4)
    authorityTitle: 'अनुशंसित प्राधिकरण',
    authoritySubtitle:
      'पहचाना गया नागरिक विभाग और अगला आधिकारिक प्रस्तुति चैनल',
    authorityLabel: 'प्राधिकरण',
    authorityComplaintType: 'शिकायत का प्रकार',
    authorityLocation: 'स्थान',
    authorityReasonLabel: 'कारण',
    authorityReasonText:
      'यह शिकायत एक स्थानीय नागरिक सेवा से संबंधित प्रतीत होती है।',
    authorityDisclaimer:
      'AI अनुशंसा। सबमिट करने से पहले कृपया प्राधिकरण की पुष्टि करें।',
    authorityJurisdictionLabel: 'अधिकार क्षेत्र',
    authorityConfidenceLabel: 'विश्वास स्तर',
    authorityVerificationLabel: 'सत्यापन स्थिति',
    authorityLastVerifiedLabel: 'अंतिम सत्यापन',
    authorityWebsiteBtn: 'आधिकारिक वेबसाइट देखें',
    authorityAlternativesTitle: 'वैकल्पिक जिम्मेदार विभाग',
    authorityUncertainNotice:
      'आपके चयनित स्थान और शिकायत श्रेणी के आधार पर, यह प्राधिकरण जिम्मेदार हो सकता है। कृपया अपनी शिकायत दर्ज करने से पहले अधिकार क्षेत्र की पुष्टि करें।',
    authorityNonAffiliationNotice:
      'नागरिकसेतु एक स्वतंत्र नागरिक सहायता मंच है और किसी भी सरकारी विभाग से आधिकारिक रूप से संबद्ध नहीं है।',
    locationCitySelect: 'शहर / जिला चुनें',
    locationStateSelect: 'राज्य चुनें',
    locationLocalityPlaceholder: 'वार्ड / इलाका / सेक्टर / कॉलोनी',
    locationManualFallback: 'या कस्टम स्थान टाइप करें',
    locationGpsDetected: 'जीपीएस निर्देशांक प्राप्त हुए',
    locationGpsUnavailable: 'इस ब्राउज़र में जियोलोकेशन समर्थित नहीं है।',
    locationUseGps: 'GPS का उपयोग करें',
    locationLocating: 'स्थान खोजा जा रहा है...',
    locationGpsError: 'GPS स्थान प्राप्त करने में असमर्थ। कृपया स्थान मैन्युअल दर्ज करें।',
    locationSelectPilotCity: 'सत्यापित पायलट शहर चुनें:',
    confidenceHigh: 'उच्च विश्वसनीयता',
    confidenceMedium: 'मध्यम विश्वसनीयता',
    confidenceLow: 'कम विश्वसनीयता',
    statusVerified: 'सत्यापित सरकारी रिकॉर्ड',
    statusUnverified: 'अनंतिम सिफारिश',
    channelTitle: 'आधिकारिक शिकायत चैनल',
    channelOpenBtn: 'आधिकारिक पोर्टल खोलें',
    channelNotConfigured: 'आधिकारिक पोर्टल लिंक अभी कॉन्फ़िगर नहीं किया गया है।',
    channelCitizenResponsibility:
      'कृपया ऊपर दिए गए आधिकारिक पोर्टल के माध्यम से सबमिट करें। आप फॉर्म में पेस्ट करने के लिए विवरण कॉपी कर सकते हैं।',
    copyComplaintBtn: 'शिकायत विवरण कॉपी करें',
    copiedFeedback: 'क्लिपबोर्ड पर कॉपी हो गया!',

    // Tracking (Phase 5)
    trackingDisclaimer:
      'प्रोटोटाइप ट्रैकिंग — लाइव सरकारी स्थिति एकीकरण जुड़ा हुआ नहीं है।',
    trackingNoticeHeader: 'प्रोटोटाइप ट्रैकिंग सूचना',
    prototypeTimelineHeader: 'प्रोटोटाइप समयरेखा',
    currentPrototypeStatus: 'वर्तमान प्रोटोटाइप स्थिति',
    timelineStepCreated: 'शिकायत बनाई गई',
    timelineStepPrepared: 'शिकायत तैयार की गई',
    timelineStepChannel: 'आधिकारिक चैनल चुना गया',
    timelineStepUnderReview: 'समीक्षाधीन',
    timelineStepResolved: 'समाधान हो गया',
    trackComplaintBtn: 'शिकायत ट्रैक करें',
    backToComplaints: 'मेरी शिकायतों पर वापस जाएं',
    complaintNotFound: 'शिकायत नहीं मिली',
    simulateStatus: 'प्रोटोटाइप स्थिति का अनुकरण करें:',

    // Statuses
    statusCreated: 'निर्मित',
    statusPrepared: 'तैयार',
    statusUnderReview: 'समीक्षाधीन',
    statusResolved: 'समाधानित',

    // Errors
    errorMissingLocation:
      'कृपया अपना स्थान बताएं ताकि हम सही नागरिक प्राधिकरण की पहचान कर सकें।',
    errorUnsupportedCategory:
      'हम वर्तमान में कचरा, सड़क, स्ट्रीटलाइट, पानी और नाली की शिकायतों का समर्थन करते हैं।',
    errorEmptyComplaint: 'कृपया अपनी नागरिक समस्या का वर्णन करें।',
    errorAnalysisFailed:
      'शिकायत का विश्लेषण करते समय कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    errorEmptySubject: 'विषय खाली नहीं हो सकता।',
    errorEmptyDescription: 'विवरण खाली नहीं हो सकता।',

    // Continue confirmation
    continueMessage:
      'आपकी शिकायत की समीक्षा हो गई है। शिकायत निर्माण की ओर बढ़ रहे हैं।',

    // How it works
    howTitle: 'यह कैसे काम करता है',
    howStep1Title: 'अपनी समस्या बताएं',
    howStep1Desc:
      'अपनी नागरिक समस्या सामान्य भाषा में लिखें — अंग्रेजी, हिंदी, या हिंग्लिश।',
    howStep2Title: 'AI इसे समझता है',
    howStep2Desc:
      'हमारा AI आपकी शिकायत पढ़ता है, श्रेणी पहचानता है, और मुख्य विवरण निकालता है।',
    howStep3Title: 'सही प्राधिकरण खोजें',
    howStep3Desc:
      'आपकी समस्या के लिए सही सरकारी विभाग या अधिकारी से मिलान किया जाता है।',
    howStep4Title: 'अपनी शिकायत ट्रैक करें',
    howStep4Desc:
      'अपनी शिकायत की स्थिति और किसी भी प्रतिक्रिया पर अपडेट रहें।',

    // My Complaints (Phase 5)
    complaintsTitle: 'मेरी शिकायतें',
    complaintsEmpty: 'आपने अभी तक कोई शिकायत नहीं बनाई है।',
    complaintsCreate: 'शिकायत दर्ज करें',
    complaintsEmptySubtitle: 'अपनी दर्ज नागरिक शिकायतें देखें और ट्रैक करें',
    complaintsRecordedNotice: 'वर्तमान सत्र में दर्ज शिकायतें',
    complaintStatusConfirmed: 'पुष्ट — प्राधिकरण पहचाना गया',
    complaintsSavedCount: 'सहेजी गई शिकायतें',

    // Footer
    footerTagline: 'AI के साथ नागरिक पहुंच को सरल बनाना।',
    footerRights: '© 2026 AI Civic Access. सर्वाधिकार सुरक्षित।',
  },
};

export default translations;
