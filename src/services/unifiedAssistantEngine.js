/**
 * NagrikSetu - Unified AI Citizen Assistant Engine
 *
 * Implements conversational intent classification, short-term context resolution,
 * emergency safety pre-flight, and deterministic response generation.
 *
 * Supported Intents:
 * 1. CIVIC_COMPLAINT
 * 2. GOVERNMENT_SERVICE
 * 3. DOCUMENT_GUIDANCE
 * 4. APPOINTMENT_GUIDANCE
 * 5. GENERAL_GUIDANCE
 * 6. EMERGENCY
 * 7. UNKNOWN
 */

import { detectEmergencyHazard } from './emergencySafetyDetector.js';
import {
  getServiceById,
  normalizeState,
  detectServiceIntent,
} from './governmentServiceNavigator.js';

export const ASSISTANT_INTENTS = {
  CIVIC_COMPLAINT: 'CIVIC_COMPLAINT',
  GOVERNMENT_SERVICE: 'GOVERNMENT_SERVICE',
  DOCUMENT_GUIDANCE: 'DOCUMENT_GUIDANCE',
  APPOINTMENT_GUIDANCE: 'APPOINTMENT_GUIDANCE',
  GENERAL_GUIDANCE: 'GENERAL_GUIDANCE',
  EMERGENCY: 'EMERGENCY',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Extracts conversation context from the last few messages in history.
 *
 * @param {Array<{role: string, content: string}>} history
 * @returns {object} Extracted context
 */
export function extractConversationContext(history = []) {
  const context = {
    previousServiceType: null,
    previousServiceId: null,
    previousState: null,
    previousComplaintCategory: null,
    previousComplaintLocation: null,
    previousComplaintDuration: null,
    pendingClarification: null, // 'state' | 'location' | null
  };

  if (!Array.isArray(history) || history.length === 0) {
    return context;
  }

  // Iterate backwards through recent messages (up to last 6)
  const recent = history.slice(-6);

  for (let i = recent.length - 1; i >= 0; i--) {
    const msg = recent[i];
    const text = (msg.content || '').toLowerCase();

    // Check assistant messages for pending clarifications
    if (msg.role === 'assistant' || msg.role === 'system') {
      if (
        text.includes('state') ||
        text.includes('राज्य') ||
        text.includes('delhi or uttar pradesh') ||
        text.includes('दिल्ली अथवा उत्तर प्रदेश')
      ) {
        if (!context.pendingClarification) context.pendingClarification = 'state';
      }
      if (
        text.includes('location') ||
        text.includes('स्थान') ||
        text.includes('area') ||
        text.includes('जगह') ||
        text.includes('वार्ड')
      ) {
        if (!context.pendingClarification) context.pendingClarification = 'location';
      }
    }

    // Detect previously mentioned services
    if (!context.previousServiceType) {
      if (text.includes('income') || text.includes('आय')) {
        context.previousServiceType = 'Income Certificate';
      } else if (text.includes('birth') || text.includes('जन्म')) {
        context.previousServiceType = 'Birth Certificate';
      } else if (text.includes('caste') || text.includes('जाति')) {
        context.previousServiceType = 'Caste Certificate';
      } else if (text.includes('domicile') || text.includes('निवास') || text.includes('residence')) {
        context.previousServiceType = 'Domicile Certificate';
      } else if (text.includes('passport') || text.includes('पासपोर्ट')) {
        context.previousServiceType = 'Passport Services';
        context.previousServiceId = 'passport-services-india';
      }
    }

    // Detect previously mentioned states
    if (!context.previousState) {
      const normState = normalizeState(text);
      if (normState) context.previousState = normState;
    }

    // Detect previously mentioned complaint categories
    if (!context.previousComplaintCategory) {
      if (text.includes('kachra') || text.includes('garbage') || text.includes('kooda') || text.includes('कचरा')) {
        context.previousComplaintCategory = 'Garbage';
      } else if (text.includes('pothole') || text.includes('gaddha') || text.includes('road') || text.includes('सड़क')) {
        context.previousComplaintCategory = 'Road/Pothole';
      } else if (text.includes('streetlight') || text.includes('street light') || text.includes('pole') || text.includes('स्ट्रीट लाइट')) {
        context.previousComplaintCategory = 'Streetlight';
      } else if (text.includes('pani') || text.includes('water') || text.includes('जल') || text.includes('पानी')) {
        context.previousComplaintCategory = 'Water';
      } else if (text.includes('drain') || text.includes('sewer') || text.includes('naali') || text.includes('नाली')) {
        context.previousComplaintCategory = 'Drainage';
      }
    }

    // Extract duration if present (e.g. 3 din, 5 days)
    if (!context.previousComplaintDuration) {
      const durMatch = text.match(/(\d+)\s*(days?|din|दिन|hours?|ghante|घंटे|weeks?|hafte|हफ्ते)/i);
      if (durMatch) {
        context.previousComplaintDuration = durMatch[0];
      }
    }
  }

  return context;
}

/**
 * Checks if the text is asking specifically for required documents.
 */
function isDocumentInquiry(text) {
  const lower = text.toLowerCase();
  return (
    /\b(document|documents|papers|kya lagega|kaunse documents|dastavez|praman patra ke liye documents|list of documents|requirements)\b/i.test(lower) ||
    /(दस्तावेज|कागजात|क्या लगेगा|डॉक्यूमेंट्स|प्रमाण पत्र के लिए दस्तावेज)/u.test(text)
  );
}

/**
 * Checks if the text is asking specifically about appointments or booking.
 */
function isAppointmentInquiry(text) {
  const lower = text.toLowerCase();
  return (
    /\b(appointment|book appointment|slot|timing|schedule|physical visit|visit office|psk slot|online booking|kaise book kare|appointment lena hai)\b/i.test(lower) ||
    /(अपॉइंटमेंट|स्लॉट|बुकिंग|तारीख|समय|दफ्तर जाना|कार्यालय जाना)/u.test(text)
  );
}

/**
 * Checks if the text is a pure state response (e.g. "Uttar Pradesh", "UP", "Delhi", "Agra").
 */
function isStateDeclaration(text) {
  const s = text.trim().toLowerCase();
  return (
    s === 'up' ||
    s === 'u.p.' ||
    s === 'u.p' ||
    s === 'uttar pradesh' ||
    s === 'uttarpradesh' ||
    s === 'delhi' ||
    s === 'dilli' ||
    s === 'agra' ||
    s === 'उत्तर प्रदेश' ||
    s === 'दिल्ली' ||
    s === 'आगरा' ||
    s.startsWith('state ') ||
    s.startsWith('from ') ||
    s.startsWith('in ') ||
    s.includes('state uttar pradesh') ||
    s.includes('state delhi')
  );
}

/**
 * Process citizen input and generate structured response and intent.
 *
 * @param {string} message - Current citizen message
 * @param {Array} [conversationHistory] - Previous chat messages
 * @param {string} [language] - 'en' | 'hi'
 * @returns {object} Structured assistant result
 */
export function processAssistantMessage(message, conversationHistory = [], language = 'en') {
  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      reply: language === 'hi' ? 'कृपया अपना संदेश या प्रश्न लिखें।' : 'Please type your question or request.',
      intent: ASSISTANT_INTENTS.UNKNOWN,
      suggestedActions: [],
      isAiAssisted: false,
    };
  }

  const raw = message.trim();
  const lower = raw.toLowerCase();
  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(raw);

  // =========================================================================
  // STEP 1: EMERGENCY SAFETY DETECTION (HIGHEST PRIORITY)
  // Must execute first to immediately intercept life hazards (sparking wire, open manhole)
  // =========================================================================
  const emergencyHazard = detectEmergencyHazard(raw);
  if (emergencyHazard) {
    const isElectrical = emergencyHazard.hazardType === 'electrical_hazard';
    return {
      reply: isHindi
        ? `⚠️ आपातकालीन सुरक्षा चेतावनी:\n${
            isElectrical
              ? 'बिजली का तार टूटना या स्पार्क होना जीवन के लिए घातक हो सकता है! तुरंत कम से कम 10 मीटर की सुरक्षित दूरी बनाएं। पास के किसी भी खंभे या पानी को न छुएं।\n\nतत्काल राष्ट्रीय आपातकालीन नंबर 112 या बिजली हेल्पलाइन 1912 पर कॉल करें।'
              : emergencyHazard.safetyMessage
          }\n\n(सूचना: नागरिकसेतु एक प्रशासनिक शिकायत प्रणाली है, यह स्वचालित रूप से आपातकालीन कर्मियों को नहीं बुलाता।)`
        : `⚠️ EMERGENCY SAFETY ALERT:\n${emergencyHazard.safetyMessage}\n\n(Note: NagrikSetu is an administrative civic platform and does NOT automatically contact emergency responders. Please call directly.)`,
      intent: ASSISTANT_INTENTS.EMERGENCY,
      isEmergency: true,
      hazardType: emergencyHazard.hazardType,
      safetyMessage: emergencyHazard.safetyMessage,
      emergencyNumbers: emergencyHazard.emergencyNumbers,
      suggestedActions: [
        {
          type: 'call_emergency',
          label: isHindi ? '112 आपातकालीन कॉल' : 'Call 112 Emergency',
          target: 'tel:112',
        },
        ...(isElectrical
          ? [
              {
                type: 'call_emergency',
                label: isHindi ? '1912 बिजली हेल्पलाइन' : 'Call 1912 Electricity',
                target: 'tel:1912',
              },
            ]
          : []),
      ],
      isAiAssisted: false,
    };
  }

  // =========================================================================
  // STEP 2: CONTEXT RESOLUTION
  // Extract previous conversation context (pending state clarification, service type, complaint info)
  // =========================================================================
  const context = extractConversationContext(conversationHistory);

  // Context follow-up A: Citizen answers with State (e.g. "Uttar Pradesh" or "Delhi")
  const stateFromCurrent = normalizeState(raw);
  if (
    (context.pendingClarification === 'state' || isStateDeclaration(raw)) &&
    (stateFromCurrent || context.previousState)
  ) {
    const resolvedState = stateFromCurrent || context.previousState;
    const resolvedServiceType = context.previousServiceType || 'Income Certificate';

    let resolvedServiceId = null;
    if (resolvedServiceType.includes('Income')) {
      resolvedServiceId = resolvedState === 'Delhi' ? 'income-certificate-delhi' : 'income-certificate-up';
    } else if (resolvedServiceType.includes('Birth')) {
      resolvedServiceId = resolvedState === 'Delhi' ? 'birth-certificate-delhi' : 'birth-certificate-up';
    } else if (resolvedServiceType.includes('Caste')) {
      resolvedServiceId = resolvedState === 'Delhi' ? 'caste-certificate-delhi' : 'caste-certificate-up';
    } else if (resolvedServiceType.includes('Domicile')) {
      resolvedServiceId = resolvedState === 'Delhi' ? 'domicile-certificate-delhi' : 'domicile-certificate-up';
    }

    const serviceObj = getServiceById(resolvedServiceId);
    if (serviceObj) {
      return {
        reply: isHindi
          ? `मैंने ${resolvedState} के लिए ${serviceObj.hiName} का चयन कर लिया है। यह सेवा ${serviceObj.department} द्वारा प्रदान की जाती है। आप नीचे दिए गए बटन से आवश्यक दस्तावेज, आवेदन प्रक्रिया और आधिकारिक पोर्टल देख सकते हैं।`
          : `I have selected the ${serviceObj.name} for ${resolvedState}. This service is administered by ${serviceObj.department}. You can review verified eligibility, required documents checklist, and official portal link below.`,
        intent: ASSISTANT_INTENTS.GOVERNMENT_SERVICE,
        serviceId: resolvedServiceId,
        matchedService: serviceObj,
        state: resolvedState,
        suggestedActions: [
          {
            type: 'navigate_service',
            label: isHindi ? 'दस्तावेज व प्रक्रिया देखें' : 'View Service Details',
            target: `/services/${resolvedServiceId}`,
          },
          {
            type: 'external_portal',
            label: isHindi ? 'आधिकारिक पोर्टल' : 'Official Portal',
            target: serviceObj.officialPortal,
          },
        ],
        isAiAssisted: false,
      };
    }
  }

  // Context follow-up B: Citizen answers with Location for pending Civic Complaint
  if (context.pendingClarification === 'location' && context.previousComplaintCategory) {
    const loc = raw;
    const cat = context.previousComplaintCategory;
    const dur = context.previousComplaintDuration || '';
    const compiledDescription = dur
      ? `${cat} problem reported in ${loc} for ${dur}.`
      : `${cat} problem reported in ${loc}.`;

    return {
      reply: isHindi
        ? `धन्यवाद! मैंने स्थान "${loc}" दर्ज कर लिया है। क्या आप ${cat} संबंधी इस शिकायत का औपचारिक पत्र तैयार करके संबंधित विभाग को भेजना चाहते हैं?`
        : `Thank you! I have recorded the location as "${loc}". Would you like me to prepare a formal grievance letter for this ${cat} issue?`,
      intent: ASSISTANT_INTENTS.CIVIC_COMPLAINT,
      category: cat,
      location: loc,
      suggestedActions: [
        {
          type: 'navigate_report',
          label: isHindi ? 'शिकायत तैयार करें' : 'Prepare Complaint',
          target: '/report',
          payload: {
            text: compiledDescription,
            location: loc,
            category: cat,
          },
        },
      ],
      isAiAssisted: false,
    };
  }

  // =========================================================================
  // STEP 3: DOCUMENT CHECKLIST INQUIRY
  // Example: "Income certificate ke liye kya documents chahiye?"
  // =========================================================================
  if (isDocumentInquiry(raw)) {
    // Detect service and state
    const intentResult = detectServiceIntent(raw);

    if (intentResult.requiresState) {
      return {
        reply: isHindi
          ? `दस्तावेजों की आवश्यकताएं राज्य अनुसार भिन्न होती हैं। क्या आप दिल्ली अथवा उत्तर प्रदेश (आगरा) के लिए दस्तावेज चेकलिस्ट देखना चाहते हैं?`
          : `Document requirements vary by state. Are you looking for requirements in Delhi or Uttar Pradesh (Agra)?`,
        intent: ASSISTANT_INTENTS.DOCUMENT_GUIDANCE,
        requiresClarification: true,
        clarificationType: 'state',
        serviceType: intentResult.serviceType,
        suggestedActions: [
          {
            type: 'clarify_state',
            label: 'Delhi (e-District Delhi)',
            state: 'Delhi',
          },
          {
            type: 'clarify_state',
            label: 'Uttar Pradesh (eDistrict UP)',
            state: 'Uttar Pradesh',
          },
        ],
        isAiAssisted: false,
      };
    }

    if (intentResult.matchedService) {
      const s = intentResult.matchedService;
      const docsSummary = s.requiredDocuments
        .slice(0, 4)
        .map((d) => `• ${isHindi ? d.hiName : d.name} (${d.mandatory ? (isHindi ? 'अनिवार्य' : 'Mandatory') : (isHindi ? 'वैकल्पिक' : 'Optional')})`)
        .join('\n');

      return {
        reply: isHindi
          ? `${s.hiName} (${s.state}) के लिए मुख्य दस्तावेज:\n${docsSummary}\n\nआप हमारे इंटरैक्टिव चेकलिस्ट टूल में अपनी तैयारी को मार्क कर सकते हैं।`
          : `Verified documents required for ${s.name} (${s.state}):\n${docsSummary}\n\nYou can track your readiness using our interactive checklist tool below.`,
        intent: ASSISTANT_INTENTS.DOCUMENT_GUIDANCE,
        serviceId: s.id,
        matchedService: s,
        suggestedActions: [
          {
            type: 'navigate_checklist',
            label: isHindi ? 'इंटरैक्टिव चेकलिस्ट खोलें' : 'Open Document Checklist',
            target: `/services/${s.id}#documents`,
          },
          {
            type: 'navigate_service',
            label: isHindi ? 'सेवा विवरण' : 'Service Details',
            target: `/services/${s.id}`,
          },
        ],
        isAiAssisted: false,
      };
    }
  }

  // =========================================================================
  // STEP 4: APPOINTMENT GUIDANCE INQUIRY
  // Example: "Passport appointment kaise book kare?"
  // =========================================================================
  if (isAppointmentInquiry(raw)) {
    const isPassport = lower.includes('passport') || lower.includes('पासपोर्ट') || lower.includes('psk');
    if (isPassport) {
      const passportService = getServiceById('passport-services-india');
      return {
        reply: isHindi
          ? `पासपोर्ट आवेदन के लिए व्यक्तिगत अपॉइंटमेंट अनिवार्य है:\n1. विदेश मंत्रालय के पासपोर्ट सेवा केंद्र (PSK/POPSK) पर बायोमेट्रिक्स और फोटो लिया जाता है।\n2. अपॉइंटमेंट सीधे passportindia.gov.in पर ऑनलाइन बुक करें।\n3. पासपोर्ट सेवा केंद्र पर एआरएन (ARN) रसीद और मूल पहचान/पते के प्रमाण साथ ले जाएं।\n\nनागरिकसेतु स्वयं अपॉइंटमेंट बुक नहीं करता — कृपया आधिकारिक पोर्टल का उपयोग करें।`
          : `In-person appointment is mandatory for Passport Services:\n1. Biometric fingerprinting and digital photograph capture are conducted at a Passport Seva Kendra (PSK/POPSK).\n2. Schedule your slot directly on the official portal: passportindia.gov.in.\n3. Bring your Application Reference (ARN) receipt and original identity/address documents to the PSK.\n\nNagrikSetu does not book appointments on your behalf. Please schedule on the official portal below.`,
        intent: ASSISTANT_INTENTS.APPOINTMENT_GUIDANCE,
        serviceId: 'passport-services-india',
        matchedService: passportService,
        suggestedActions: [
          {
            type: 'external_portal',
            label: isHindi ? 'आधिकारिक पासपोर्ट पोर्टल पर बुक करें' : 'Schedule on Passport Seva',
            target: 'https://www.passportindia.gov.in/',
          },
          {
            type: 'navigate_service',
            label: isHindi ? 'पासपोर्ट दिशानिर्देश व दस्तावेज' : 'Passport Guidelines & Checklist',
            target: '/services/passport-services-india',
          },
        ],
        isAiAssisted: false,
      };
    } else {
      // For general certificates:
      return {
        reply: isHindi
          ? `दिल्ली और उत्तर प्रदेश में जन्म, आय, जाति और मूल निवास प्रमाण पत्रों के लिए भौतिक कार्यालय जाने की आवश्यकता नहीं होती। ये सेवाएं संबंधित ई-डिस्ट्रिक्ट पोर्टल पर 100% ऑनलाइन उपलब्ध हैं।`
          : `For state certificates (Birth, Income, Caste, Domicile in Delhi and Uttar Pradesh), physical office visits and appointments are generally NOT required. These services are processed 100% online through state e-District portals.`,
        intent: ASSISTANT_INTENTS.APPOINTMENT_GUIDANCE,
        suggestedActions: [
          {
            type: 'navigate_service',
            label: isHindi ? 'सरकारी सेवाएं देखें' : 'Browse Government Services',
            target: '/services',
          },
        ],
        isAiAssisted: false,
      };
    }
  }

  // =========================================================================
  // STEP 5: CIVIC GRIEVANCE / COMPLAINT REPORTING
  // Example: "Mere area mein 3 din se pani nahi aa raha", "Sadak par bada gaddha hai"
  // =========================================================================
  const isCivicProblem =
    /\b(pothole|gaddha|sadak|broken road|garbage|kachra|kooda|waste pile|dustbin|cleanliness|safai|streetlight|street light|light pole|andhera|water supply|no water|paani nahi|pani nahi|dirty water|ganda paani|drainage|drain|sewer|naali|nali|gutter|waterlog|jalbharo)\b/i.test(
      lower
    ) ||
    /(गड्ढा|सड़क|कचरा|कूड़ा|सफाई|स्ट्रीट लाइट|बिजली का खंभा|पानी नहीं आ रहा|गंदा पानी|नाली|सीवर|जलभराव)/u.test(
      raw
    );

  if (isCivicProblem && !lower.includes('certificate') && !lower.includes('praman patra')) {
    // Identify category
    let category = 'Other';
    if (/kachra|garbage|kooda|safai|कचरा|कूड़ा/i.test(lower)) category = 'Garbage';
    else if (/pothole|gaddha|sadak|road|गड्ढा|सड़क/i.test(lower)) category = 'Road/Pothole';
    else if (/streetlight|street light|andhera|लाइट/i.test(lower)) category = 'Streetlight';
    else if (/pani|water|paani|जल|पानी/i.test(lower)) category = 'Water';
    else if (/drain|sewer|naali|nali|gutter|नाली|सीवर/i.test(lower)) category = 'Drainage';

    // Extract duration if present
    const durMatch = raw.match(/(\d+)\s*(days?|din|दिन|hours?|ghante|घंटे|weeks?|hafte|हफ्ते)/i);
    const durationStr = durMatch ? durMatch[0] : null;

    // Check if location is already included in message
    const hasLocation =
      /\b(in |near |at |sector|colony|ward|road|street|nagar|marg|chowk|agra|delhi)\b/i.test(lower) ||
      /(में|के पास|रोड|मार्ग|कॉलोनी|नगर|वार्ड|आगरा|दिल्ली)/u.test(raw);

    if (!hasLocation) {
      return {
        reply: isHindi
          ? `मैंने आपकी ${category} संबंधी शिकायत पहचान ली है${
              durationStr ? ` (अवधि: ${durationStr})` : ''
            }। सटीक नगर निगम विभाग से मिलान के लिए कृपया अपनी समस्या का स्थान (कॉलोनी, मोहल्ला या वार्ड) बताएं।`
          : `I have recognized your ${category} complaint${
              durationStr ? ` (reported duration: ${durationStr})` : ''
            }. To identify the responsible municipal authority, please provide the location (locality, colony, or ward).`,
        intent: ASSISTANT_INTENTS.CIVIC_COMPLAINT,
        category,
        duration: durationStr,
        requiresClarification: true,
        clarificationType: 'location',
        suggestedActions: [
          {
            type: 'navigate_report',
            label: isHindi ? 'शिकायत फॉर्म में जाएं' : 'Open Complaint Form',
            target: '/report',
            payload: { text: raw, category },
          },
        ],
        isAiAssisted: false,
      };
    }

    // Has location: offer to prepare formal complaint
    return {
      reply: isHindi
        ? `मैंने आपकी ${category} संबंधी समस्या दर्ज कर ली है। नागरिकसेतु AI इसका औपचारिक शिकायत पत्र तैयार कर सकता है और उपयुक्त नगर निकाय (जैसे आगरा नगर निगम) को निर्देशित कर सकता है।`
        : `I've analyzed your civic report regarding ${category}. NagrikSetu AI can format this into a formal grievance letter and route it to the appropriate municipal authority.`,
      intent: ASSISTANT_INTENTS.CIVIC_COMPLAINT,
      category,
      suggestedActions: [
        {
          type: 'navigate_report',
          label: isHindi ? 'शिकायत तैयार करें' : 'Prepare Complaint',
          target: '/report',
          payload: { text: raw, category },
        },
      ],
      isAiAssisted: false,
    };
  }

  // =========================================================================
  // STEP 6: GOVERNMENT SERVICE DISCOVERY
  // Example: "Mujhe birth certificate banwana hai"
  // =========================================================================
  const serviceIntent = detectServiceIntent(raw);
  if (serviceIntent.intent === 'government_service') {
    if (serviceIntent.requiresState) {
      return {
        reply: isHindi
          ? `${serviceIntent.hiServiceType} राज्य स्तर पर जारी किए जाते हैं। कृपया बताएं कि आप दिल्ली से आवेदन कर रहे हैं अथवा उत्तर प्रदेश (आगरा) से?`
          : `${serviceIntent.serviceType} is administered state-wise. Are you applying in Delhi or Uttar Pradesh (including Agra)?`,
        intent: ASSISTANT_INTENTS.GOVERNMENT_SERVICE,
        requiresClarification: true,
        clarificationType: 'state',
        serviceType: serviceIntent.serviceType,
        suggestedActions: [
          {
            type: 'clarify_state',
            label: 'Delhi',
            state: 'Delhi',
          },
          {
            type: 'clarify_state',
            label: 'Uttar Pradesh / Agra',
            state: 'Uttar Pradesh',
          },
        ],
        isAiAssisted: false,
      };
    }

    if (serviceIntent.matchedService) {
      const s = serviceIntent.matchedService;
      return {
        reply: isHindi
          ? `${s.hiName} (${s.state}) के लिए आवेदन मार्गदर्शन:\n• विभाग: ${s.department}\n• आवेदन का प्रकार: ${s.appointmentRequired ? 'अपॉइंटमेंट अनिवार्य' : '100% ऑनलाइन'}\n\nआप नीचे दिए गए लिंक से आधिकारिक पोर्टल और आवश्यक दस्तावेजों की सूची देख सकते हैं।`
          : `Verified details for ${s.name} (${s.state}):\n• Issuing Authority: ${s.department}\n• Process Mode: ${s.appointmentRequired ? 'Appointment Required' : '100% Online Application'}\n\nYou can view the full document checklist and official portal below.`,
        intent: ASSISTANT_INTENTS.GOVERNMENT_SERVICE,
        serviceId: s.id,
        matchedService: s,
        suggestedActions: [
          {
            type: 'navigate_service',
            label: isHindi ? 'सेवा विवरण देखें' : 'View Service Details',
            target: `/services/${s.id}`,
          },
          {
            type: 'external_portal',
            label: isHindi ? 'आधिकारिक पोर्टल' : 'Official Portal',
            target: s.officialPortal,
          },
        ],
        isAiAssisted: false,
      };
    }
  }

  // =========================================================================
  // STEP 7: GENERAL PLATFORM GUIDANCE
  // Example: "NagrikSetu kya hai?", "How does this platform work?"
  // =========================================================================
  if (
    lower.includes('nagriksetu') ||
    lower.includes('what is this') ||
    lower.includes('help') ||
    lower.includes('kaise kaam karta') ||
    lower.includes('kya kar sakte') ||
    lower.includes('hello') ||
    lower.includes('namaste') ||
    lower.includes('नमस्ते') ||
    lower.includes('सहायता')
  ) {
    return {
      reply: isHindi
        ? `नमस्ते! मैं नागरिकसेतु AI सहायक हूँ। मैं आपकी निम्नलिखित कार्यों में सहायता कर सकता हूँ:\n1. 📢 नागरिक शिकायतें (कचरा, सड़क, पानी, लाइट) दर्ज करना और पत्र तैयार करना।\n2. 🏛️ सरकारी सेवाएं (जन्म, आय, जाति, मूल निवास, पासपोर्ट) खोजना।\n3. 📋 आवश्यक दस्तावेजों की चेकलिस्ट तैयार करना।\n4. 📅 आधिकारिक पोर्टल एवं अपॉइंटमेंट प्रक्रिया समझना।\n\nबताइए, आज आप किस सेवा के बारे में जानना चाहते हैं?`
        : `Namaste! I am NagrikSetu, your AI Citizen Assistant. I can help you with:\n1. 📢 Civic Grievance Reporting: Formatting complaints for garbage, potholes, streetlights, water, or drainage.\n2. 🏛️ Government Service Navigation: Verified procedures for Birth, Income, Caste, Domicile certificates, and Passport.\n3. 📋 Document Readiness Checklists: Tracking required paperwork before applying.\n4. 🌐 Official Portal Guidance: Direct verified links to e-District and Passport Seva.\n\nHow can I help you today?`,
      intent: ASSISTANT_INTENTS.GENERAL_GUIDANCE,
      suggestedActions: [
        {
          type: 'quick_prompt',
          label: isHindi ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Problem',
          query: 'How do I report a pothole?',
        },
        {
          type: 'quick_prompt',
          label: isHindi ? 'आय प्रमाण पत्र' : 'Income Certificate',
          query: 'Mujhe income certificate banwana hai',
        },
        {
          type: 'quick_prompt',
          label: isHindi ? 'पासपोर्ट अपॉइंटमेंट' : 'Passport Appointment',
          query: 'Passport appointment kaise book kare?',
        },
      ],
      isAiAssisted: false,
    };
  }

  // =========================================================================
  // STEP 8: UNKNOWN / UNSUPPORTED INTENT
  // =========================================================================
  return {
    reply: isHindi
      ? `वर्तमान में मैं नागरिक समस्याओं (सड़क, कचरा, पानी, लाइट) और सत्यापित सरकारी सेवाओं (जन्म, आय, जाति, मूल निवास प्रमाण पत्र तथा पासपोर्ट) में सहायता प्रदान करता हूँ। क्या आप इनमें से किसी सेवा के बारे में जानना चाहते हैं?`
      : `Currently, I assist with civic grievance reporting (roads, garbage, streetlights, water, drainage) and verified government services (Birth, Income, Caste, Domicile certificates, and Passport). Would you like help with any of these?`,
    intent: ASSISTANT_INTENTS.UNKNOWN,
    suggestedActions: [
      {
        type: 'navigate_report',
        label: isHindi ? 'नागरिक शिकायत दर्ज करें' : 'Report Civic Grievance',
        target: '/report',
      },
      {
        type: 'navigate_service',
        label: isHindi ? 'सरकारी सेवाएं ब्राउज़ करें' : 'Browse Services',
        target: '/services',
      },
    ],
    isAiAssisted: false,
  };
}
