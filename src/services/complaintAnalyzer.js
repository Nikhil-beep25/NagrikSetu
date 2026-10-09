/**
 * AI Complaint Analyzer Service
 *
 * Clean abstraction over complaint analysis.
 * Currently uses a keyword-based mock implementation.
 * Can be swapped for a real AI API (e.g., Gemini, OpenAI) by
 * replacing the analyzeComplaint function body.
 */

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
    'bulb', 'street lamp', 'pole light', 'lighting',
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
  'broken', 'collapse', 'gir gaya', 'toot gaya',
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
      if (normalizedText.includes(normalizedKeyword)) {
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
 * Translate the complaint to a clean English problem statement.
 * This is a structured mock — a real AI would do translation.
 */
function generateProblemStatement(normalizedText, category) {
  const templates = {
    Garbage: 'Garbage/waste collection issue reported',
    'Road/Pothole': 'Road damage or pothole issue reported',
    Streetlight: 'Streetlight malfunction or outage reported',
    Water: 'Water supply disruption or issue reported',
    Drainage: 'Drainage blockage or overflow issue reported',
  };

  // Try to extract duration mentions for a richer statement (both Latin and Devanagari numbers/words)
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
 * Main analysis function.
 *
 * @param {string} complaintText - The raw complaint text from the user.
 * @param {string} userLocation - The location provided by the user (can be empty).
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function analyzeComplaint(complaintText, userLocation) {
  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  const trimmed = complaintText.trim();
  if (!trimmed) {
    return {
      success: false,
      error: 'empty_complaint',
    };
  }

  const normalized = normalize(trimmed);
  const category = detectCategory(normalized);

  if (!category) {
    return {
      success: false,
      error: 'unsupported_category',
    };
  }

  const priority = detectPriority(normalized);
  const problem = generateProblemStatement(normalized, category);

  return {
    success: true,
    data: {
      problem,
      category,
      location: userLocation?.trim() || '',
      priority,
      originalText: trimmed,
    },
  };
}

export { SUPPORTED_CATEGORIES };
