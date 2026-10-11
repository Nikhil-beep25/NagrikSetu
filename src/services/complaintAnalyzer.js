/**
 * AI Complaint Analyzer Service
 *
 * Production-ready hybrid analyzer:
 * 1. Primary: Gemini-powered AI complaint understanding via backend API (/api/analyze-complaint).
 * 2. Fallback: Local rule-based keyword & NLP pattern analyzer for instant resilience.
 *
 * The existing rule-based analyzer is preserved in full and activates seamlessly whenever:
 * - Gemini API is unconfigured / key missing
 * - The backend is unreachable or returns an error
 * - Request times out or encounters network limits
 * - The response fails schema validation
 */

import { detectEmergencyHazard } from './emergencySafetyDetector.js';
import { getApiEndpoint } from '../utils/apiConfig.js';

const SUPPORTED_CATEGORIES = [
  'Garbage',
  'Road/Pothole',
  'Streetlight',
  'Water',
  'Drainage',
];


/**
 * Keyword maps for each category.
 * Includes English, Hindi (Devanagari), and Hinglish (Latin) variations.
 */
const CATEGORY_KEYWORDS = {
  Garbage: [
    // English
    'garbage', 'trash', 'waste', 'rubbish', 'litter', 'dump', 'dustbin',
    'garbage collection', 'waste collection', 'sanitation',
    // Hinglish (Latin script)
    'kachra', 'kachara', 'kachda', 'kuda', 'kooda', 'kuda karkat',
    'safai', 'gandagi', 'ganda',
    // Hindi (Devanagari script)
    'कचरा', 'कचड़ा', 'कूड़ा', 'कूड़े', 'सफाई', 'गंदगी', 'डस्टबिन', 'कचरे', 'गंदा', 'स्वच्छता',
  ],
  'Road/Pothole': [
    // English
    'road', 'pothole', 'pot hole', 'crack', 'broken road', 'damaged road',
    'street damage', 'highway', 'pavement', 'footpath',
    // Hinglish (Latin script)
    'sadak', 'sarak', 'gadda', 'gadde', 'gaddha', 'pothole',
    'toot', 'tooti', 'kharab sadak', 'road kharab', 'road tut',
    // Hindi (Devanagari script)
    'सड़क', 'सडक', 'गड्ढा', 'गड्ढे', 'टूटी', 'टूटा', 'खराब सड़क', 'फुटपाथ', 'मार्ग',
  ],
  Streetlight: [
    // English
    'streetlight', 'street light', 'light pole', 'lamp post', 'lamp',
    'bulb', 'street lamp', 'pole light', 'lighting', 'dark', 'broken light', 'broken streetlight',
    // Hinglish (Latin script)
    'bijli', 'light', 'bulb', 'street light', 'khamba',
    'batti', 'roshni', 'light band', 'light kharab', 'light nahi',
    'andhera', 'andhere',
    // Hindi (Devanagari script)
    'स्ट्रीट लाइट', 'स्ट्रीटलाइट', 'बत्ती', 'बिजली', 'खंभा', 'रोशनी', 'अंधेरा', 'लाइट', 'दीपक',
  ],
  Water: [
    // English
    'water', 'water supply', 'tap', 'pipeline', 'water pressure',
    'drinking water', 'water tank', 'bore', 'borewell',
    // Hinglish (Latin script)
    'paani', 'pani', 'jal', 'nal', 'nalkaa', 'nalka',
    'supply', 'tanki', 'pipeline', 'tap',
    'paani nahi', 'pani nahi', 'water nahi',
    // Hindi (Devanagari script)
    'पानी', 'जल', 'नल', 'सप्लाई', 'टंकी', 'पाइपलाइन', 'पेयजल',
  ],
  Drainage: [
    // English
    'drainage', 'drain', 'sewer', 'sewage', 'clogged', 'blocked drain',
    'overflow', 'flooding', 'waterlogging', 'gutter',
    // Hinglish (Latin script)
    'nali', 'naali', 'nala', 'naala', 'gutter',
    'overflow', 'band nali', 'nali band', 'sewer',
    'paani bhara', 'jal bhar', 'flooding',
    // Hindi (Devanagari script)
    'नाली', 'नाला', 'सीवर', 'गटर', 'जलभराव', 'ओवरफ्लो', 'गंदा पानी',
  ],
};

/**
 * Priority keywords — if any match, bump to High.
 */
const HIGH_PRIORITY_KEYWORDS = [
  // Duration / urgency
  'week', 'weeks', 'month', 'months', 'hafte', 'mahine', 'mahina',
  'bahut din', 'kaafi din', 'long time', 'हफ्ते', 'महीने', 'सप्ताह',
  // Severity
  'dangerous', 'khatarnak', 'khatrnak', 'accident', 'hadsa',
  'health', 'bimari', 'bimaari', 'disease', 'infection',
  'emergency', 'urgent', 'jaldi', 'turant',
  'overflow', 'flooding', 'waterlogging', 'bhara', 'bhar gaya',
  'collapse', 'gir gaya',
  'खतरनाक', 'हादसा', 'बीमारी', 'आपातकाल', 'तुरंत', 'जल्दी',
];

/**
 * Normalize text: lowercase, keep letters, combining marks (matras in Indic scripts), and digits across all scripts, collapse whitespace.
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect category from complaint text using keyword matching.
 * Returns the best matching category or null.
 */
function detectCategory(normalizedText) {
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      let matched = false;
      if (/^[a-z0-9\s]+$/i.test(normalizedKeyword)) {
        const regex = new RegExp(`(^|\\s)${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|\\s)`, 'i');
        matched = regex.test(normalizedText);
      } else {
        matched = normalizedText.includes(normalizedKeyword);
      }

      if (matched) {
        // Longer keyword matches get higher weight
        scores[category] += normalizedKeyword.split(' ').length;
      }
    }
  }

  // Find the category with highest score
  let bestCategory = null;
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestScore > 0 ? bestCategory : null;
}

/**
 * Detect priority based on urgency/severity keywords.
 */
function detectPriority(normalizedText) {
  for (const keyword of HIGH_PRIORITY_KEYWORDS) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      return 'High';
    }
  }
  return 'Normal';
}

/**
 * Extract duration for the rule-based fallback.
 */
function extractFallbackDuration(normalizedText) {
  const durationMatch = normalizedText.match(
    /(\d+)\s*(din|day|days|week|weeks|hafte|month|months|mahine|mahina|दिन|हफ्ते|महीने)/i,
  );
  if (!durationMatch) return null;

  const rawUnit = durationMatch[2].toLowerCase();
  let unit = 'days';
  if (/hafte|week|सप्ताह/i.test(rawUnit)) unit = 'weeks';
  else if (/mahine|month|महीने/i.test(rawUnit)) unit = 'months';

  return {
    value: parseInt(durationMatch[1], 10),
    unit,
    rawText: durationMatch[0],
  };
}

/**
 * Translate the complaint to a clean English problem statement.
 */
function generateProblemStatement(normalizedText, category) {
  const templates = {
    Garbage: 'Garbage/waste collection issue reported',
    'Road/Pothole': 'Road damage or pothole issue reported',
    Streetlight: 'Streetlight malfunction or outage reported',
    Water: 'Water supply disruption or issue reported',
    Drainage: 'Drainage blockage or overflow issue reported',
  };

  const durationMatch = normalizedText.match(
    /(\d+)\s*(din|day|days|week|weeks|hafte|month|months|mahine|mahina|दिन|हफ्ते|महीने)/i,
  );
  const durationSuffix = durationMatch
    ? ` for ${durationMatch[1]} ${durationMatch[2]
        .replace(/din|दिन/i, 'day(s)')
        .replace(/hafte|हफ्ते/i, 'week(s)')
        .replace(/mahine?a?|महीने/i, 'month(s)')}`
    : '';

  return (templates[category] || 'Civic issue reported') + durationSuffix;
}

/**
 * Rule-based fallback analysis execution.

 * Guaranteed to run locally without network dependencies.
 *
 * @param {string} trimmed - Trimmed raw text.
 * @param {string} userLocation - Location entered by user.
 * @param {string} [fallbackReason] - Why fallback was used.
 * @returns {{success: boolean, data?: object, error?: string}}
 */
export function ruleBasedAnalyzeComplaint(trimmed, userLocation, fallbackReason = 'AI assistance is temporarily unavailable.') {
  // Pre-flight deterministic emergency safety detector
  const emergency = detectEmergencyHazard(trimmed);
  if (emergency) {
    return {
      success: true,
      data: {
        problem: trimmed,
        category: emergency.category,
        subcategory: emergency.subcategory,
        location: userLocation?.trim() || '',
        priority: 'High',
        urgency: 'High',
        urgencyReason: 'Immediate acute public safety hazard detected.',
        duration: null,
        missingInformation: userLocation?.trim() ? [] : ['Exact location or landmark of the hazard'],
        suggestedAction: emergency.guidanceSteps?.[2] || 'Contact emergency services (112 or 1912) immediately.',
        detectedLanguage: 'Multilingual / Indic',
        originalText: trimmed,
        isAiAssisted: false,
        isFallback: true,
        isEmergency: true,
        isSupported: emergency.isSupported,
        hazardType: emergency.hazardType,
        safetyMessage: emergency.safetyMessage,
        guidanceSteps: emergency.guidanceSteps,
        emergencyNumbers: emergency.emergencyNumbers,
        fallbackNotice: 'Basic emergency safety assessment is active.',
        fallbackReason,
        safetyNotice: emergency.safetyMessage,
      },
    };
  }

  const normalized = normalize(trimmed);
  const category = detectCategory(normalized);

  if (!category) {
    return {
      success: false,
      error: 'unsupported_category',
      isFallback: true,
      fallbackReason,
    };
  }

  const priority = detectPriority(normalized);
  const problem = generateProblemStatement(normalized, category);
  const duration = extractFallbackDuration(normalized);

  return {
    success: true,
    data: {
      problem,
      category,
      subcategory: `${category} Service Request`,
      location: userLocation?.trim() || '',
      priority,
      urgency: priority,
      urgencyReason: priority === 'High' ? 'Flagged based on reported conditions or duration' : 'Standard priority civic maintenance',
      duration,
      missingInformation: userLocation?.trim() ? [] : ['Exact location or landmark'],
      suggestedAction: 'Forward to local municipal department for inspection.',
      detectedLanguage: 'Multilingual / Indic',
      originalText: trimmed,
      isAiAssisted: false,
      isFallback: true,
      isEmergency: false,
      isSupported: true,
      safetyMessage: null,
      fallbackNotice: 'Basic complaint analysis is being used because AI assistance is temporarily unavailable.',
      fallbackReason,
      safetyNotice: priority === 'High'
        ? 'Potentially hazardous condition noted. For acute emergencies, please contact official emergency services (e.g. 112).'
        : null,
    },
  };
}


/**
 * Main analysis entrypoint.
 *
 * Attempts Gemini AI analysis via backend API.
 * Seamlessly activates rule-based fallback if backend is unreachable,
 * unconfigured, or returns an error.
 *
 * @param {string} complaintText - The raw complaint text from the user.
 * @param {string} [userLocation] - The location provided by the user.
 * @param {object} [options] - Options (e.g., { language: 'en', forceFallback: false }).
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function analyzeComplaint(complaintText, userLocation = '', options = {}) {
  const trimmed = complaintText ? complaintText.trim() : '';
  if (!trimmed) {
    return {
      success: false,
      error: 'empty_complaint',
    };
  }

  // Allow explicit fallback bypass (for testing or offline switches)
  if (options.forceFallback) {
    return ruleBasedAnalyzeComplaint(trimmed, userLocation, 'Explicitly requested offline analysis.');
  }

  // Construct API endpoint URL (handles browser, VITE_API_URL, and Node.js testing environments)
  const apiUrl = getApiEndpoint('/api/analyze-complaint');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintText: trimmed,
        location: userLocation,
        language: options.language || 'en',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (response.ok && isJson) {
      const result = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            problem: result.data.summary || generateProblemStatement(normalize(trimmed), result.data.category),
            category: result.data.category,
            subcategory: result.data.subcategory || `${result.data.category} Issue`,
            location: userLocation?.trim() || result.data.location || '',
            priority: result.data.urgency || 'Normal',
            urgencyReason: result.data.urgencyReason || '',
            duration: result.data.duration || null,
            missingInformation: result.data.missingInformation || [],
            suggestedAction: result.data.suggestedAction || '',
            detectedLanguage: result.data.detectedLanguage || 'English',
            originalText: trimmed,
            isAiAssisted: result.data.isAiAssisted !== false,
            isFallback: Boolean(result.data.isFallback),
            isEmergency: Boolean(result.data.isEmergency),
            isSupported: result.data.isSupported !== false,
            hazardType: result.data.hazardType || null,
            safetyMessage: result.data.safetyMessage || null,
            guidanceSteps: result.data.guidanceSteps || [],
            emergencyNumbers: result.data.emergencyNumbers || [],
            fallbackNotice: result.data.fallbackNotice || null,
            safetyNotice: result.data.safetyNotice || null,
            modelUsed: result.data.modelUsed || 'gemini-3.5-flash',
          },
        };
      }

      // If backend explicitly marked category as unsupported
      if (result.error === 'unsupported_category') {
        return {
          success: false,
          error: 'unsupported_category',
          data: result.data || null,
        };
      }

      // If backend signaled fallback is required
      if (result.fallbackRequired) {
        return ruleBasedAnalyzeComplaint(trimmed, userLocation, result.message || 'Gemini processing bypassed by backend.');
      }
    }

    // Specific HTTP status handling
    let statusReason = `Backend response status: ${response.status}`;
    if (response.status === 429) {
      statusReason = 'AI Assistant is currently busy. Basic guidance active.';
    } else if (response.status >= 500) {
      statusReason = 'AI service temporarily unavailable. Resilient basic guidance active.';
    } else if (!isJson && contentType.includes('text/html')) {
      statusReason = 'AI endpoint returned HTML (backend connection pending).';
    }

    return ruleBasedAnalyzeComplaint(trimmed, userLocation, statusReason);
  } catch (err) {
    // Network failure, timeout, ECONNREFUSED, or offline mode
    const reason = err.name === 'AbortError'
      ? 'AI request timed out after 9 seconds. Basic guidance active.'
      : 'Backend API unreachable, using resilient local analyzer.';

    return ruleBasedAnalyzeComplaint(trimmed, userLocation, reason);
  }
}

export {
  SUPPORTED_CATEGORIES,
  CATEGORY_KEYWORDS,
  HIGH_PRIORITY_KEYWORDS,
};
