/**
 * NagrikSetu - Emergency Safety Detection Layer
 *
 * Deterministic safety rules to identify acute, life-threatening public hazards
 * BEFORE or independent of standard municipal category classification.
 *
 * Supported Hazard Domains:
 * 1. Electrical Hazards (exposed wires, sparking lines, fallen power lines, transformer bursts)
 * 2. Open Manholes & Deep Sinkholes (acute fall/collision dangers)
 * 3. Severe Inundation / Toxic Floods (acute water ingress posing safety risks)
 *
 * Supports English, Hindi (Devanagari), and Hinglish (Latin).
 * Operates offline without depending on Gemini API availability.
 */

// Normalizes text for robust pattern matching
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Electrical hazard patterns
 */
const ELECTRICAL_PATTERNS = [
  // English
  /\b(live wire|live electrical wire|exposed wire|exposed electrical wire|sparking|sparks|fallen power line|power line down|broken electric wire|broken electrical wire|wire sparking|wire broken|broken wire|transformer spark|transformer burst|transformer blast|electric shock|electrocution|current leak|hanging wire|snapped wire)\b/i,
  // Hindi (Devanagari)
  /(बिजली का तार|बिजली के तार|तार टूट|तार गिर|स्पार्क|चिंगारी|बिजली तार|हाई वोल्टेज|करंट दौड़|करंट लग|खंभा करंट|ट्रांसफार्मर|बिजली का खंभा करंट|तार लटक)/u,
  // Hinglish
  /\b(bijli ka taar|bijlee ka taar|bijli ke taar|taar toot|taar tut|taar gir|sparks aa|sparking ho|current aa|current lag|bijli wire|electric wire|live taar|taar latak|transformer phat)\b/i,
];

/**
 * Open manhole patterns
 */
const OPEN_MANHOLE_PATTERNS = [
  // English
  /\b(open manhole|manhole open|uncovered manhole|open gutter|uncovered gutter|deep sinkhole|road collapse|falling into manhole)\b/i,
  // Hindi (Devanagari)
  /(खुला मैनहोल|मैनहोल खुला|खुला गटर|गटर खुला|खुला नाला|गड्ढा गहरा धंस)/u,
  // Hinglish
  /\b(khula manhole|manhole khula|khula gutter|gutter khula|khula nala|dhakkan nahi|dhakkan gayab)\b/i,
];

/**
 * Severe flooding / acute inundation patterns
 */
const SEVERE_FLOOD_PATTERNS = [
  // English
  /\b(severe flood|acute flood|water entering houses|drowning risk|submerged homes|homes under water)\b/i,
  // Hindi (Devanagari)
  /(घरों में पानी भर गया|डूबने का खतरा|भयानक बाढ़|घर डूब)/u,
  // Hinglish
  /\b(ghar doob|pani ghar ke andar bhar|drowning risk|acute flood)\b/i,
];

/**
 * Detects whether a complaint text describes an immediate public safety emergency.
 *
 * @param {string} text - Raw or normalized complaint text.
 * @returns {object|null} - Emergency metadata or null if no acute hazard detected.
 */
export function detectEmergencyHazard(text) {
  if (!text || typeof text !== 'string') return null;
  const clean = normalizeText(text);

  // 1. Check Electrical Hazards
  const isElectrical = ELECTRICAL_PATTERNS.some((pattern) => pattern.test(clean));
  if (isElectrical) {
    return {
      isEmergency: true,
      hazardType: 'electrical_hazard',
      category: 'Other',
      subcategory: 'Electrical Hazard',
      urgency: 'High',
      isSupported: false, // Electrical grid power lines belong to Discom/Emergency, not standard municipal sanitation/civil queues
      safetyMessage:
        'DANGER: Stay away from the exposed or sparking electrical wire. Maintain a safe distance of at least 10 meters (33 feet). Do not touch any metal objects, poles, or standing water nearby. Call emergency services (112) or electricity helpline (1912) immediately.',
      guidanceSteps: [
        'Immediately move at least 10 meters (33 feet) away from the wire or pole.',
        'Warn pedestrians, children, and vehicles in the vicinity to keep away.',
        'Call 112 (National Emergency Helpline) or 1912 (All-India Electricity Emergency Helpline) immediately.',
        'NagrikSetu is an administrative grievance tool and has NOT alerted emergency services. You must place an emergency call directly.',
      ],
      emergencyNumbers: [
        { label: 'National Emergency Response Helpline', number: '112' },
        { label: 'All-India Electricity Discom Emergency', number: '1912' },
      ],
    };
  }

  // 2. Check Open Manhole Hazards
  const isOpenManhole = OPEN_MANHOLE_PATTERNS.some((pattern) => pattern.test(clean));
  if (isOpenManhole) {
    return {
      isEmergency: true,
      hazardType: 'open_manhole',
      category: 'Drainage',
      subcategory: 'Open Manhole Hazard',
      urgency: 'High',
      isSupported: true, // Supported municipal domain, but treated with emergency safety priority
      safetyMessage:
        'SAFETY WARNING: An open manhole poses a fatal fall hazard for pedestrians and two-wheelers. Exercise extreme caution in this area and call emergency services (112) if immediate danger exists.',
      guidanceSteps: [
        'Keep clear of the opening and guide pedestrians away, especially after dark.',
        'For immediate road hazard intervention, inform local traffic police or dial 112.',
        'Lodge a high-priority municipal drainage complaint through NagrikSetu for urgent barricading.',
      ],
      emergencyNumbers: [
        { label: 'National Emergency Helpline', number: '112' },
      ],
    };
  }

  // 3. Check Severe Flooding Hazards
  const isSevereFlood = SEVERE_FLOOD_PATTERNS.some((pattern) => pattern.test(clean));
  if (isSevereFlood) {
    return {
      isEmergency: true,
      hazardType: 'severe_flood',
      category: 'Drainage',
      subcategory: 'Severe Inundation Hazard',
      urgency: 'High',
      isSupported: true,
      safetyMessage:
        'FLOOD SAFETY WARNING: Rising water entering residences poses structural and electrical risks. Call 112 for urgent rescue or flood evacuation assistance.',
      guidanceSteps: [
        'Move residents to higher ground if water levels are rising rapidly.',
        'Turn off main electrical power switches if safe to do so.',
        'Call 112 for urgent rescue or flood evacuation assistance.',
      ],
      emergencyNumbers: [
        { label: 'National Emergency Helpline', number: '112' },
      ],
    };
  }

  return null;
}
