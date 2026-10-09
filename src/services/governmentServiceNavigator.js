/**
 * NagrikSetu - Government Service Navigator Engine
 *
 * Provides deterministic and AI-assisted search, state filtering,
 * document checklist management, and intent routing across verified government services.
 */

import { GOVERNMENT_SERVICES_DIRECTORY } from '../data/governmentServicesDirectory.js';

/**
 * Retrieves all government services matching optional filters.
 *
 * @param {object} [filters]
 * @param {string} [filters.category] - 'All' | 'Certificates' | 'Identity & Travel'
 * @param {string} [filters.state] - 'All' | 'Delhi' | 'Uttar Pradesh' | 'National'
 * @param {string} [filters.query] - Search term
 * @returns {Array<object>}
 */
export function getAllServices(filters = {}) {
  const { category = 'All', state = 'All', query = '' } = filters;

  return GOVERNMENT_SERVICES_DIRECTORY.filter((service) => {
    // Category match
    if (category && category !== 'All' && service.category !== category) {
      return false;
    }

    // State match: 'National' services apply everywhere
    if (state && state !== 'All') {
      const stateMatch = service.state === state || service.state === 'National';
      if (!stateMatch) return false;
    }

    // Query match
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      const matchName = service.name.toLowerCase().includes(q) || service.hiName.includes(q);
      const matchDesc = service.description.toLowerCase().includes(q) || service.hiDescription.includes(q);
      const matchDept = service.department.toLowerCase().includes(q);
      const matchState = service.state.toLowerCase().includes(q);
      const matchDocs = service.requiredDocuments.some(
        (doc) => doc.name.toLowerCase().includes(q) || doc.hiName.includes(q)
      );
      if (!matchName && !matchDesc && !matchDept && !matchState && !matchDocs) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Retrieves a single service by ID.
 *
 * @param {string} serviceId
 * @returns {object|null}
 */
export function getServiceById(serviceId) {
  if (!serviceId) return null;
  return GOVERNMENT_SERVICES_DIRECTORY.find((s) => s.id === serviceId) || null;
}

/**
 * Standardizes user state input into canonical state names.
 *
 * @param {string} stateInput
 * @returns {string|null}
 */
export function normalizeState(stateInput) {
  if (!stateInput) return null;
  const s = String(stateInput).trim().toLowerCase();
  if (s.includes('delhi') || s.includes('dilli') || s.includes('दिल्ली')) {
    return 'Delhi';
  }
  if (
    s.includes('uttar pradesh') ||
    s.includes('up') ||
    s.includes('u.p') ||
    s.includes('agra') ||
    s.includes('noida') ||
    s.includes('ghaziabad') ||
    s.includes('उत्तर प्रदेश') ||
    s.includes('आगरा')
  ) {
    return 'Uttar Pradesh';
  }
  if (s.includes('national') || s.includes('all india') || s.includes('bharat') || s.includes('भारत')) {
    return 'National';
  }
  return null;
}

/**
 * Identifies the citizen's intent from natural language input.
 * Distinguishes between civic complaints (potholes, garbage) and government service inquiries.
 * Handles English, Hindi (Devanagari), and Hinglish (Latin).
 *
 * @param {string} text - User query
 * @param {string} [declaredState] - Optional state hint
 * @returns {object}
 */
export function detectServiceIntent(text, declaredState = null) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      intent: 'empty',
      message: 'Please enter a search query or question.',
      matchedService: null,
      serviceId: null,
      targetRoute: null,
      requiresState: false,
    };
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. CIVIC COMPLAINT DETECTION (Redirect to complaint workflow)
  const isCivicGrievance =
    /\b(pothole|gaddha|road damaged|sadak|broken road|garbage|kachra|kooda|waste pile|dustbin overflow|cleanliness|safai|streetlight|street light|light pole|andhera|dark road|water supply|no water|ganda paani|dirty water|drainage|drain|sewer|sewerage|naali|nali block|gutter|waterlogging|waterlog)\b/i.test(
      lower
    ) ||
    /(गड्ढा|सड़क|कचरा|कूड़ा|सफाई|स्ट्रीट लाइट|बिजली का खंभा|पानी नहीं आ रहा|गंदा पानी|नाली|सीवर)/u.test(
      raw
    );

  // If query mentions reporting a civic grievance (e.g., "how to report a pothole", "pothole complaint")
  if (isCivicGrievance && !/\b(certificate|praman patra|passport|visa)\b/i.test(lower)) {
    return {
      intent: 'civic_complaint',
      message:
        'This appears to be a civic problem (road, garbage, streetlight, water supply, or drainage). NagrikSetu provides an AI-assisted civic grievance reporting and authority detection workflow for this.',
      hiMessage:
        'यह एक नागरिक समस्या (सड़क, कचरा, स्ट्रीटलाइट, पानी, नाली) प्रतीत होती है। इसके लिए नागरिकसेतु के शिकायत निवारण व सरकारी विभाग पहचान टूल का उपयोग करें।',
      matchedService: null,
      serviceId: null,
      targetRoute: '/report',
      requiresState: false,
    };
  }

  // 2. STATE DETECTION FROM QUERY OR ARGUMENT
  const detectedState = declaredState ? normalizeState(declaredState) : normalizeState(raw);

  // 3. GOVERNMENT SERVICE INTENT MATCHING
  // A. Birth Certificate
  const isBirth =
    /\b(birth|janam|janm|newborn|baby birth certificate)\b/i.test(lower) ||
    /(जन्म|जन्म प्रमाण पत्र|पैदाइश)/u.test(raw);

  if (isBirth) {
    if (!detectedState) {
      return {
        intent: 'government_service',
        serviceType: 'Birth Certificate',
        hiServiceType: 'जन्म प्रमाण पत्र',
        requiresState: true,
        message: 'Birth Certificates are issued state-wise. Are you applying in Delhi or Uttar Pradesh (including Agra)?',
        hiMessage: 'जन्म प्रमाण पत्र राज्य-वार जारी किए जाते हैं। क्या आप दिल्ली अथवा उत्तर प्रदेश (आगरा) के लिए आवेदन कर रहे हैं?',
        availableServices: [
          getServiceById('birth-certificate-delhi'),
          getServiceById('birth-certificate-up'),
        ],
        targetRoute: '/services',
      };
    }

    const serviceId = detectedState === 'Delhi' ? 'birth-certificate-delhi' : 'birth-certificate-up';
    return {
      intent: 'government_service',
      serviceType: 'Birth Certificate',
      hiServiceType: 'जन्म प्रमाण पत्र',
      state: detectedState,
      serviceId,
      matchedService: getServiceById(serviceId),
      targetRoute: `/services/${serviceId}`,
      requiresState: false,
      message: `Navigating to ${detectedState} Birth Certificate service requirements and official portal.`,
      hiMessage: `${detectedState} जन्म प्रमाण पत्र सेवा और आधिकारिक पोर्टल की जानकारी।`,
    };
  }

  // B. Income Certificate
  const isIncome =
    /\b(income|aay|salary certificate|family income|income certificate)\b/i.test(lower) ||
    /(आय प्रमाण पत्र|वार्षिक आय|आय सर्टिफिकेट)/u.test(raw);

  if (isIncome) {
    if (!detectedState) {
      return {
        intent: 'government_service',
        serviceType: 'Income Certificate',
        hiServiceType: 'आय प्रमाण पत्र',
        requiresState: true,
        message: 'Income Certificates are issued by the state revenue department. Please choose Delhi or Uttar Pradesh (Agra).',
        hiMessage: 'आय प्रमाण पत्र राज्य राजस्व विभाग द्वारा जारी होते हैं। कृपया दिल्ली अथवा उत्तर प्रदेश (आगरा) चुनें।',
        availableServices: [
          getServiceById('income-certificate-delhi'),
          getServiceById('income-certificate-up'),
        ],
        targetRoute: '/services',
      };
    }

    const serviceId = detectedState === 'Delhi' ? 'income-certificate-delhi' : 'income-certificate-up';
    return {
      intent: 'government_service',
      serviceType: 'Income Certificate',
      hiServiceType: 'आय प्रमाण पत्र',
      state: detectedState,
      serviceId,
      matchedService: getServiceById(serviceId),
      targetRoute: `/services/${serviceId}`,
      requiresState: false,
      message: `Navigating to ${detectedState} Income Certificate requirements and official portal.`,
      hiMessage: `${detectedState} आय प्रमाण पत्र आवश्यकताएं और आधिकारिक पोर्टल।`,
    };
  }

  // C. Caste Certificate
  const isCaste =
    /\b(caste|jati|jaati|sc certificate|st certificate|obc certificate|category certificate)\b/i.test(lower) ||
    /(जाति|जाति प्रमाण पत्र|अनुसूचित जाति|ओबीसी|एससी|एसटी)/u.test(raw);

  if (isCaste) {
    if (!detectedState) {
      return {
        intent: 'government_service',
        serviceType: 'Caste Certificate',
        hiServiceType: 'जाति प्रमाण पत्र',
        requiresState: true,
        message: 'Caste Certificates require lineage verification in your state. Are you applying in Delhi or Uttar Pradesh?',
        hiMessage: 'जाति प्रमाण पत्र राज्य सूची पर आधारित होते हैं। क्या आप दिल्ली या उत्तर प्रदेश के लिए आवेदन कर रहे हैं?',
        availableServices: [
          getServiceById('caste-certificate-delhi'),
          getServiceById('caste-certificate-up'),
        ],
        targetRoute: '/services',
      };
    }

    const serviceId = detectedState === 'Delhi' ? 'caste-certificate-delhi' : 'caste-certificate-up';
    return {
      intent: 'government_service',
      serviceType: 'Caste Certificate',
      hiServiceType: 'जाति प्रमाण पत्र',
      state: detectedState,
      serviceId,
      matchedService: getServiceById(serviceId),
      targetRoute: `/services/${serviceId}`,
      requiresState: false,
      message: `Navigating to ${detectedState} Caste Certificate eligibility, documents, and portal.`,
      hiMessage: `${detectedState} जाति प्रमाण पत्र पात्रता, दस्तावेज एवं पोर्टल।`,
    };
  }

  // D. Domicile / Residence Certificate
  const isDomicile =
    /\b(domicile|residence|niwas|mool niwas|mul niwas|stay certificate|residential certificate)\b/i.test(lower) ||
    /(निवास|मूल निवास|अधिवास प्रमाण पत्र|स्थायी निवास)/u.test(raw);

  if (isDomicile) {
    if (!detectedState) {
      return {
        intent: 'government_service',
        serviceType: 'Domicile / Residence Certificate',
        hiServiceType: 'मूल निवास प्रमाण पत्र',
        requiresState: true,
        message: 'Domicile rules differ across states (3 years continuous residency). Are you applying in Delhi or Uttar Pradesh (Agra)?',
        hiMessage: 'मूल निवास नियम राज्य अनुसार अलग होते हैं। क्या आप दिल्ली अथवा उत्तर प्रदेश (आगरा) के लिए देख रहे हैं?',
        availableServices: [
          getServiceById('domicile-certificate-delhi'),
          getServiceById('domicile-certificate-up'),
        ],
        targetRoute: '/services',
      };
    }

    const serviceId = detectedState === 'Delhi' ? 'domicile-certificate-delhi' : 'domicile-certificate-up';
    return {
      intent: 'government_service',
      serviceType: 'Domicile Certificate',
      hiServiceType: 'मूल निवास प्रमाण पत्र',
      state: detectedState,
      serviceId,
      matchedService: getServiceById(serviceId),
      targetRoute: `/services/${serviceId}`,
      requiresState: false,
      message: `Navigating to ${detectedState} Domicile Certificate documents and official procedure.`,
      hiMessage: `${detectedState} मूल निवास प्रमाण पत्र प्रक्रिया एवं आवश्यक दस्तावेज।`,
    };
  }

  // E. Passport Services (Central / National)
  const isPassport =
    /\b(passport|pass port|psk|popsk|tatkaal passport|passport appointment|travel document|visa)\b/i.test(lower) ||
    /(पासपोर्ट|पासपोर्ट अपॉइंटमेंट|पासपोर्ट सेवा)/u.test(raw);

  if (isPassport) {
    const serviceId = 'passport-services-india';
    return {
      intent: 'government_service',
      serviceType: 'Passport Services',
      hiServiceType: 'पासपोर्ट सेवाएं',
      state: 'National',
      serviceId,
      matchedService: getServiceById(serviceId),
      targetRoute: `/services/${serviceId}`,
      requiresState: false,
      message: 'Passport services are administered nationally by the Ministry of External Affairs through Passport Seva Kendras (PSK). Personal appointment is mandatory for biometrics.',
      hiMessage: 'पासपोर्ट सेवा विदेश मंत्रालय द्वारा संचालित राष्ट्रीय सेवा है। बायोमेट्रिक्स के लिए व्यक्तिगत अपॉइंटमेंट अनिवार्य है।',
    };
  }

  // 4. UNKNOWN / GENERAL SERVICE SEARCH FALLBACK
  const matchingRecords = getAllServices({ query: raw });
  if (matchingRecords.length > 0) {
    return {
      intent: 'search_results',
      message: `Found ${matchingRecords.length} government service(s) matching your query.`,
      hiMessage: `आपकी खोज से संबंधित ${matchingRecords.length} सरकारी सेवाएं मिलीं।`,
      matchedService: matchingRecords[0],
      serviceId: matchingRecords[0].id,
      availableServices: matchingRecords,
      targetRoute: `/services/${matchingRecords[0].id}`,
      requiresState: false,
    };
  }

  return {
    intent: 'unsupported',
    message:
      'We currently provide verified service navigators for Birth, Income, Caste, and Domicile certificates (Delhi and Uttar Pradesh / Agra), and National Passport Services. More state services are being added.',
    hiMessage:
      'वर्तमान में हम दिल्ली और उत्तर प्रदेश (आगरा) के लिए जन्म, आय, जाति, मूल निवास प्रमाण पत्र और राष्ट्रीय पासपोर्ट सेवाओं की सत्यापित जानकारी प्रदान करते हैं।',
    matchedService: null,
    serviceId: null,
    targetRoute: '/services',
    requiresState: false,
  };
}

/**
 * Storage helpers for Document Checklist MVP persistence
 */
const CHECKLIST_STORAGE_PREFIX = 'nagriksetu_checklist_';

export function getChecklistStorageKey(serviceId) {
  return `${CHECKLIST_STORAGE_PREFIX}${serviceId}`;
}

export function getStoredChecklist(serviceId) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(getChecklistStorageKey(serviceId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredChecklist(serviceId, preparedDocIds) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(
      getChecklistStorageKey(serviceId),
      JSON.stringify(preparedDocIds || [])
    );
  } catch (err) {
    console.error('Failed to save document checklist to localStorage', err);
  }
}

export function resetStoredChecklist(serviceId) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(getChecklistStorageKey(serviceId));
  } catch (err) {
    console.error('Failed to clear document checklist', err);
  }
}
