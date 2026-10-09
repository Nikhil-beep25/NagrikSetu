/**
 * NagrikSetu - Gemini AI Complaint Analysis Service
 *
 * Implements server-side Google Gemini Gen AI integration using
 * the official @google/genai SDK.
 *
 * Security & Integrity Guarantees:
 * - Credentials reside exclusively on the server (never exposed to client).
 * - Enforces schema-constrained JSON output.
 * - Validates all response fields before dispatching.
 * - Does not fabricate locations, dates, names, or authorities.
 * - Provides graceful fallback triggers when unconfigured or failing.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { detectEmergencyHazard } from '../src/services/emergencySafetyDetector.js';
import { detectServiceIntent } from '../src/services/governmentServiceNavigator.js';
import { processAssistantMessage } from '../src/services/unifiedAssistantEngine.js';

export const VALID_CATEGORIES = [
  'Garbage',
  'Road/Pothole',
  'Streetlight',
  'Water',
  'Drainage',
  'Other',
  'Unsupported',
];

/**
 * Normalizes category variations into the 5 canonical NagrikSetu categories or Other/Unsupported.
 */
export function normalizeCategory(categoryStr, originalText = '') {
  // If original text is an acute electrical hazard, strictly categorize as Other (not Streetlight)
  if (originalText) {
    const hazard = detectEmergencyHazard(originalText);
    if (hazard && hazard.category === 'Other') {
      return 'Other';
    }
  }

  if (!categoryStr) return 'Unsupported';
  const clean = String(categoryStr).trim().toLowerCase();

  if (clean.includes('other') || clean.includes('electrical') || clean.includes('hazard')) {
    return 'Other';
  }
  if (clean.includes('garbage') || clean.includes('sanitation') || clean.includes('waste') || clean.includes('kachra') || clean.includes('kooda')) {
    return 'Garbage';
  }
  if (clean.includes('road') || clean.includes('pothole') || clean.includes('sadak') || clean.includes('gaddha')) {
    return 'Road/Pothole';
  }
  if (clean.includes('streetlight') || clean.includes('street light') || clean.includes('lamp') || clean.includes('bijli') || clean.includes('pole')) {
    return 'Streetlight';
  }
  if (clean.includes('water') || clean.includes('paani') || clean.includes('pani') || clean.includes('jal') || clean.includes('pipeline')) {
    return 'Water';
  }
  if (clean.includes('drain') || clean.includes('sewer') || clean.includes('gutter') || clean.includes('nali') || clean.includes('naali') || clean.includes('waterlog')) {
    return 'Drainage';
  }
  if (clean.includes('unsupported')) {
    return 'Unsupported';
  }

  return 'Unsupported';
}


/**
 * Retrieves the Gemini API key if properly configured.
 */
export function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (key && typeof key === 'string' && key.trim().length > 0 && key !== 'your_gemini_api_key_here') {
    return key.trim();
  }
  return null;
}

/**
 * Checks whether the Gemini API key is configured in the environment.
 */
export function isGeminiConfigured() {
  return Boolean(getGeminiApiKey());
}

/**
 * Response schema for Gemini structured output.
 */
const COMPLAINT_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      enum: ['Garbage', 'Road/Pothole', 'Streetlight', 'Water', 'Drainage', 'Other', 'Unsupported'],
      description: 'Primary civic category, Other for electrical hazards, or Unsupported if not a municipal civic problem.',
    },
    subcategory: {
      type: Type.STRING,
      description: 'Specific subcategory, e.g., Electrical Hazard, Open Manhole, Uncollected Waste, Deep Pothole, etc.',
    },
    summary: {
      type: Type.STRING,
      description: 'Cleaned, objective factual summary of the citizen problem.',
    },
    location: {
      type: Type.STRING,
      description: 'Explicit location or landmark mentioned by citizen in their text, or null if omitted.',
      nullable: true,
    },
    durationValue: {
      type: Type.INTEGER,
      description: 'Numeric duration count if mentioned (e.g. 5 for 5 days), or null.',
      nullable: true,
    },
    durationUnit: {
      type: Type.STRING,
      description: 'Unit of duration (days, weeks, months, hours) if mentioned, or null.',
      nullable: true,
    },
    durationRawText: {
      type: Type.STRING,
      description: 'Exact citizen text referring to duration (e.g. 5 din, 3 days, do hafte), or null.',
      nullable: true,
    },
    urgency: {
      type: Type.STRING,
      enum: ['High', 'Normal'],
      description: 'High only for acute safety hazards (exposed wires, open manholes, hazardous flooding), otherwise Normal.',
    },
    urgencyReason: {
      type: Type.STRING,
      description: 'Grounded rationale for why the urgency level was chosen.',
    },
    detectedLanguage: {
      type: Type.STRING,
      enum: ['English', 'Hindi', 'Hinglish', 'Mixed'],
      description: 'Detected language of user input.',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of essential details missing for civic action (e.g. exact landmark, ward name).',
    },
    suggestedAction: {
      type: Type.STRING,
      description: 'Professional next step recommended for the citizen or municipal officer.',
    },
    isCivicComplaint: {
      type: Type.BOOLEAN,
      description: 'True if this is a genuine municipal civic grievance, False if personal, passport, taxation, etc.',
    },
    isEmergency: {
      type: Type.BOOLEAN,
      description: 'True if acute danger, open live wire, open manhole, or life safety hazard.',
    },
    isSupported: {
      type: Type.BOOLEAN,
      description: 'True if within the 5 supported municipal categories, False if grid emergency / other.',
    },
    safetyMessage: {
      type: Type.STRING,
      description: 'Direct emergency safety instruction for the citizen, or null.',
      nullable: true,
    },
  },
  required: [
    'category',
    'subcategory',
    'summary',
    'urgency',
    'urgencyReason',
    'detectedLanguage',
    'missingInformation',
    'suggestedAction',
    'isCivicComplaint',
  ],
};

/**
 * Validates and normalizes Gemini's output before returning to frontend.
 */
export function validateAndNormalizeGeminiResponse(rawJson, originalText, userLocation = '') {
  if (!rawJson || typeof rawJson !== 'object') {
    throw new Error('Malformed AI response: expected JSON object.');
  }

  // Pre-flight deterministic emergency hazard detection
  const detectedHazard = detectEmergencyHazard(originalText);

  const rawCat = rawJson.category || '';
  let normalizedCat = normalizeCategory(rawCat, originalText);
  let isCivic = rawJson.isCivicComplaint !== false && normalizedCat !== 'Unsupported';

  let category = isCivic ? normalizedCat : 'Unsupported';
  let urgency = rawJson.urgency === 'High' ? 'High' : 'Normal';
  let isEmergency = Boolean(rawJson.isEmergency || detectedHazard);
  let isSupported = category !== 'Unsupported' && category !== 'Other';
  let safetyMessage = rawJson.safetyMessage || null;
  let subcategory = rawJson.subcategory || `${category} Issue`;
  let emergencyNumbers = detectedHazard?.emergencyNumbers || [
    { label: 'National Emergency Response Helpline', number: '112' },
  ];
  let guidanceSteps = detectedHazard?.guidanceSteps || [];

  // Enforce deterministic emergency overrides for acute hazards
  if (detectedHazard) {
    isEmergency = true;
    urgency = 'High';
    category = detectedHazard.category;
    subcategory = detectedHazard.subcategory;
    isSupported = detectedHazard.isSupported;
    safetyMessage = detectedHazard.safetyMessage;
    guidanceSteps = detectedHazard.guidanceSteps;
    emergencyNumbers = detectedHazard.emergencyNumbers;
  } else if (isEmergency) {
    urgency = 'High';
    if (!safetyMessage) {
      safetyMessage = 'Potentially dangerous condition detected. Please stay at a safe distance and contact emergency services (112) if immediate danger exists.';
    }
  }

  // Construct structured duration if provided
  let duration = null;
  if (rawJson.durationRawText || rawJson.durationUnit || typeof rawJson.durationValue === 'number') {
    duration = {
      value: typeof rawJson.durationValue === 'number' ? rawJson.durationValue : null,
      unit: rawJson.durationUnit || 'days',
      rawText: rawJson.durationRawText || (rawJson.durationValue ? `${rawJson.durationValue} ${rawJson.durationUnit || 'days'}` : ''),
    };
  }

  // Location resolution: prioritize explicit location passed by user, fallback to extracted location
  const extractedLocation = typeof rawJson.location === 'string' && rawJson.location.trim().length > 0
    ? rawJson.location.trim()
    : null;
  const effectiveLocation = userLocation?.trim() || extractedLocation || '';

  // Missing information list
  const missingInfo = Array.isArray(rawJson.missingInformation)
    ? rawJson.missingInformation.filter(item => typeof item === 'string' && item.trim().length > 0)
    : [];

  // If location is not provided anywhere, make sure it is noted in missing information
  if (!effectiveLocation && !missingInfo.some(m => /location|place|ward|address|जगह|इलाका/i.test(m))) {
    missingInfo.unshift('Exact location or landmark of the issue');
  }

  return {
    category,
    subcategory,
    summary: rawJson.summary || originalText,
    originalDescription: originalText,
    location: effectiveLocation || null,
    extractedLocation,
    duration,
    urgency,
    urgencyReason: rawJson.urgencyReason || (urgency === 'High' ? 'Safety concern reported' : 'Routine civic maintenance request'),
    detectedLanguage: rawJson.detectedLanguage || 'English',
    missingInformation: missingInfo,
    suggestedAction: rawJson.suggestedAction || (isEmergency && !isSupported ? 'Contact emergency services (112 or 1912) immediately.' : 'Submit to municipal department for verification and action.'),
    isCivicComplaint: isCivic,
    isEmergency,
    isSupported,
    safetyMessage,
    guidanceSteps,
    emergencyNumbers,
    safetyNotice: urgency === 'High'
      ? (safetyMessage || 'Potentially hazardous condition detected. NagrikSetu is an administrative grievance platform, not an emergency response dispatch. For acute life-threatening emergencies, please contact official emergency helplines (e.g., 112).')
      : null,
  };
}


/**
 * Analyzes a civic complaint using the Gemini API.
 *
 * @param {string} complaintText - Raw text in English, Hindi, or Hinglish.
 * @param {string} [userLocation] - Optional user location.
 * @param {string} [preferredLang] - Preferred output language ('en' | 'hi').
 * @returns {Promise<{success: boolean, data?: object, error?: string, fallbackRequired?: boolean}>}
 */
export async function analyzeComplaintWithGemini(complaintText, userLocation = '', preferredLang = 'en') {
  if (!isGeminiConfigured()) {
    const error = new Error('GEMINI_API_KEY is not configured on the server.');
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemPrompt = `You are the civic grievance intelligence engine for NagrikSetu, an AI assistance platform for Indian citizens.
Citizens describe local civic problems in English, Hindi (Devanagari script), Hinglish (Romanized Hindi), or mixed code-switching.

Supported Categories:
1. Garbage (Sanitation, solid waste, uncollected dustbins, kachra, kooda, safai, gandagi)
2. Road/Pothole (Damaged roads, craters, broken pavement, footpath, sadak, gaddha, toot)
3. Streetlight (Non-working street lamps, broken poles, dark streets, streetlight band, bijli khamba)
4. Water (Drinking water supply cut, pipe leakage, contamination, paani nahi aa raha, jal tanki)
5. Drainage (Blocked drains, overflowing sewers, waterlogging, nali band, naala overflow, ganda paani)
6. Unsupported (Any NON-CIVIC matter such as passport, visa, PAN/Aadhaar card, income tax, personal matrimonial or civil disputes, cyber crime, e-commerce refund).

Strict Civic Integrity Rules:
- DO NOT invent or hallucinate facts, dates, names, or official government departments.
- Extract ONLY what the citizen states.
- Urgency: Set to 'High' ONLY if the citizen reports an immediate physical danger or health hazard (e.g. exposed live electric wire, open deep manhole, toxic hospital waste, severe road crater causing crashes, acute flood into residences). Otherwise set to 'Normal'.
- Duration: Extract numeric value, unit, and citizen's raw words if mentioned (e.g. '3 din', '5 days', 'do hafte'). If not mentioned, set to null.
- Location: Extract any locality or landmark mentioned in text. If none, set to null.
- Missing Information: Identify essential details required by municipal staff to take action (e.g., specific landmark, house number, ward).
- Summary: Concise and professional problem description in ${preferredLang === 'hi' ? 'Hindi' : 'English'}.`;

  const userPrompt = `Citizen Complaint:
"""
${complaintText}
"""
${userLocation ? `Citizen Stated Location: "${userLocation}"` : 'Citizen Stated Location: (None provided yet)'}`;

  // Call Gemini with timeout
  const timeoutMs = 12000;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error(`Gemini API request timed out after ${timeoutMs}ms.`);
      err.code = 'TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: COMPLAINT_ANALYSIS_SCHEMA,
      temperature: 0.1,
    },
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  const textOutput = response.text;

  if (!textOutput) {
    throw new Error('Gemini API returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(textOutput);
  } catch (parseErr) {
    throw new Error(`Failed to parse Gemini JSON output: ${parseErr.message}`);
  }

  const normalized = validateAndNormalizeGeminiResponse(parsed, complaintText, userLocation);

  return {
    success: true,
    data: {
      ...normalized,
      modelUsed: modelName,
      isAiAssisted: true,
      isFallback: false,
    },
  };
}

/**
 * Structured schema for Government Service Intent Search
 */
const GOVERNMENT_SERVICE_SEARCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      description: 'government_service | civic_complaint | unsupported',
    },
    serviceName: {
      type: Type.STRING,
      description: 'Exact matching service name: Birth Certificate, Income Certificate, Caste Certificate, Domicile / Residence Certificate, Passport Services, or null if civic_complaint / unsupported.',
      nullable: true,
    },
    detectedState: {
      type: Type.STRING,
      description: 'State mentioned or relevant: Delhi, Uttar Pradesh, National, or null.',
      nullable: true,
    },
    requiresState: {
      type: Type.BOOLEAN,
      description: 'True if the service is state-specific (Birth, Income, Caste, Domicile) and user did not specify Delhi or Uttar Pradesh.',
    },
    explanation: {
      type: Type.STRING,
      description: 'Helpful guidance explaining what service this corresponds to, or why it routes to complaints.',
    },
  },
  required: ['intent', 'requiresState', 'explanation'],
};

/**
 * Searches and routes government service inquiries using Gemini API.
 * Grounded strictly in verified government services.
 *
 * @param {string} queryText - User question in English, Hindi, or Hinglish.
 * @param {string} [stateInput] - Optional state hint (e.g. 'Delhi', 'Uttar Pradesh').
 * @param {string} [preferredLang] - 'en' | 'hi'.
 * @returns {Promise<{success: boolean, data?: object}>}
 */
export async function findGovernmentServiceWithGemini(queryText, stateInput = '', preferredLang = 'en') {
  if (!isGeminiConfigured()) {
    const error = new Error('GEMINI_API_KEY is not configured on the server.');
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemPrompt = `You are the Government Service Navigator Assistant for NagrikSetu, an AI civic assistance platform for India.
Citizens ask questions about government certificates, citizen procedures, or civic complaints in English, Hindi, or Hinglish.

Our Verified Government Service Catalog currently covers:
1. Birth Certificate (Delhi or Uttar Pradesh including Agra)
2. Income Certificate (Delhi or Uttar Pradesh including Agra)
3. Caste Certificate (SC/ST/OBC - Delhi or Uttar Pradesh)
4. Domicile / Residence Certificate (Delhi or Uttar Pradesh including Agra)
5. Passport Services (Ministry of External Affairs - National / All India)

Strict GovTech Rules:
- If citizen describes a civic complaint (road pothole, garbage, streetlight, drainage, sewer, water supply disruption), set intent to "civic_complaint". Do NOT match to a certificate.
- If citizen asks for a certificate without specifying a state (e.g. "Mujhe income certificate banwana hai"), set intent to "government_service", serviceName to "Income Certificate", and requiresState to true.
- If state is Delhi, UP, or National, set detectedState accordingly.
- NEVER invent government fees, fake portals, or unverified departments.
- Explanation must be helpful, concise, in ${preferredLang === 'hi' ? 'Hindi' : 'English'}.`;

  const userPrompt = `Citizen Query: "${queryText}"\nDeclared State: "${stateInput || 'None'}"`;

  const timeoutMs = 10000;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error(`Gemini API request timed out after ${timeoutMs}ms.`);
      err.code = 'TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: GOVERNMENT_SERVICE_SEARCH_SCHEMA,
      temperature: 0.1,
    },
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  const textOutput = response.text;

  if (!textOutput) {
    throw new Error('Gemini API returned an empty response.');
  }

  const parsed = JSON.parse(textOutput);

  // Cross-reference with deterministic engine ground-truth
  const deterministicFallback = detectServiceIntent(queryText, stateInput || parsed.detectedState);

  // If Gemini says civic_complaint or deterministic engine says civic_complaint
  if (parsed.intent === 'civic_complaint' || deterministicFallback.intent === 'civic_complaint') {
    return {
      success: true,
      data: {
        intent: 'civic_complaint',
        message: parsed.explanation || deterministicFallback.message,
        hiMessage: deterministicFallback.hiMessage,
        matchedService: null,
        serviceId: null,
        targetRoute: '/report',
        requiresState: false,
        isAiAssisted: true,
        modelUsed: modelName,
      },
    };
  }

  // Resolve matching service from verified directory
  let resolvedService = deterministicFallback.matchedService;
  let serviceId = deterministicFallback.serviceId;
  let requiresState = deterministicFallback.requiresState;

  if (parsed.requiresState) {
    requiresState = true;
  }

  return {
    success: true,
    data: {
      intent: parsed.intent || deterministicFallback.intent,
      serviceType: deterministicFallback.serviceType || parsed.serviceName,
      hiServiceType: deterministicFallback.hiServiceType,
      serviceId: requiresState ? null : (serviceId || deterministicFallback.serviceId),
      matchedService: requiresState ? null : resolvedService,
      state: deterministicFallback.state || parsed.detectedState || null,
      requiresState,
      message: parsed.explanation || deterministicFallback.message,
      hiMessage: deterministicFallback.hiMessage,
      availableServices: deterministicFallback.availableServices || [],
      targetRoute: requiresState ? '/services' : deterministicFallback.targetRoute,
      isAiAssisted: true,
      modelUsed: modelName,
    },
  };
}

/**
 * Unified AI Citizen Assistant Conversation Handler (Phase 8)
 *
 * @param {string} message
 * @param {Array<{role: string, content: string}>} conversationHistory
 * @param {string|null} selectedState
 * @param {string|null} selectedCity
 * @param {string} [language]
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function interactWithCitizenAssistantGemini(
  message,
  conversationHistory = [],
  selectedState = null,
  selectedCity = null,
  language = 'en'
) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is unconfigured on the server.');
  }

  // First verify deterministic engine result
  const deterministicFallback = processAssistantMessage(
    message,
    conversationHistory,
    language
  );

  // If deterministic engine detected an acute emergency hazard, return it immediately without API latency
  if (deterministicFallback.isEmergency) {
    return {
      success: true,
      data: {
        ...deterministicFallback,
        isAiAssisted: false,
      },
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  const systemInstruction = `You are NagrikSetu, an AI Citizen Assistant for India.
You assist citizens with:
1. CIVIC_COMPLAINT: Garbage, Road/Pothole, Streetlight, Water, Drainage. If the complaint lacks a specific location (colony, ward, or street), ask for it.
2. GOVERNMENT_SERVICE: Verified state certificates (Delhi & Uttar Pradesh / Agra: Birth Certificate, Income Certificate, Caste Certificate, Domicile Certificate) and National Passport Services.
   - If user asks for Birth, Income, Caste, or Domicile without specifying state, ask if they are applying from Delhi or Uttar Pradesh (Agra).
   - If user mentions Uttar Pradesh or Agra, link to UP e-District services. If Delhi, link to Delhi e-District.
   - For Passport, mention mandatory in-person biometrics appointment at Passport Seva Kendra (PSK).
3. DOCUMENT_GUIDANCE: Verified documents from official rules (Aadhaar, residence proof, self-declaration, etc.). Never ask to upload sensitive identity cards.
4. APPOINTMENT_GUIDANCE: Explain online vs physical visit.
5. EMERGENCY: If any electrical hazard, open manhole, or severe flood is mentioned, warn immediately and advise calling 112 or 1912.
6. GENERAL_GUIDANCE: Explaining platform capabilities.
7. UNKNOWN: Inquiries outside municipal complaints or verified government services.

CRITICAL RULES:
- Never fabricate fees, URLs, or fake government departments.
- Respond in the language used by the citizen (English, Hindi, or Hinglish).
- Be polite, helpful, and concise.`;

  // Format recent chat history (last 6 messages max)
  const formattedHistory = (conversationHistory || [])
    .slice(-6)
    .map((msg) => `${msg.role === 'user' ? 'Citizen' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const prompt = `${formattedHistory ? `Recent Conversation History:\n${formattedHistory}\n\n` : ''}Current Citizen Message: "${message}"
${selectedState ? `Selected State Hint: ${selectedState}` : ''}
${selectedCity ? `Selected City Hint: ${selectedCity}` : ''}

Classify the intent and generate a helpful citizen response.`;

  const assistantSchema = {
    type: Type.OBJECT,
    properties: {
      reply: { type: Type.STRING },
      intent: {
        type: Type.STRING,
        enum: [
          'CIVIC_COMPLAINT',
          'GOVERNMENT_SERVICE',
          'DOCUMENT_GUIDANCE',
          'APPOINTMENT_GUIDANCE',
          'GENERAL_GUIDANCE',
          'EMERGENCY',
          'UNKNOWN',
        ],
      },
      serviceId: { type: Type.STRING },
      category: { type: Type.STRING },
      location: { type: Type.STRING },
      requiresClarification: { type: Type.BOOLEAN },
      clarificationType: { type: Type.STRING },
    },
    required: ['reply', 'intent', 'requiresClarification'],
  };

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: assistantSchema,
      temperature: 0.2,
    },
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Citizen Assistant Gemini request timed out')), 12000)
  );

  const response = await Promise.race([apiPromise, timeoutPromise]);
  const textOutput = response.text;

  if (!textOutput) {
    throw new Error('Gemini Assistant returned empty response.');
  }

  const parsed = JSON.parse(textOutput);

  // Blend AI response with verified suggested actions from deterministic engine
  const suggestedActions = deterministicFallback.suggestedActions || [];

  return {
    success: true,
    data: {
      reply: parsed.reply || deterministicFallback.reply,
      intent: parsed.intent || deterministicFallback.intent,
      serviceId: parsed.serviceId || deterministicFallback.serviceId || null,
      category: parsed.category || deterministicFallback.category || null,
      location: parsed.location || deterministicFallback.location || null,
      requiresClarification: parsed.requiresClarification ?? deterministicFallback.requiresClarification ?? false,
      clarificationType: parsed.clarificationType || deterministicFallback.clarificationType || null,
      suggestedActions,
      isEmergency: parsed.intent === 'EMERGENCY',
      isAiAssisted: true,
      modelUsed: modelName,
    },
  };
}

