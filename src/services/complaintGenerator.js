/**
 * AI Complaint Generator Service
 *
 * Converts structured AI analysis into a professional, formal civic complaint.
 * Adheres strictly to civic integrity rules:
 * - Does NOT invent dates, addresses, authorities, incidents, or actions.
 * - Factual, concise, and respectful tone.
 * - Only incorporates information provided by the user.
 */

const NUMBER_WORDS = {
  ek: 'one', one: 'one', 'एक': 'one',
  do: 'two', two: 'two', 'दो': 'two',
  teen: 'three', three: 'three', 'तीन': 'three',
  chaar: 'four', char: 'four', four: 'four', 'चार': 'four',
  paanch: 'five', panch: 'five', five: 'five', 'पांच': 'five', 'पाँच': 'five',
  chhah: 'six', cheh: 'six', six: 'six', 'छह': 'six',
  saat: 'seven', seven: 'seven', 'सात': 'seven',
  aath: 'eight', eight: 'eight', 'आठ': 'eight',
  nau: 'nine', nine: 'nine', 'नौ': 'nine',
  das: 'ten', ten: 'ten', 'दस': 'ten',
};

/**
 * Safely extract duration mention from text without inventing dates or times.
 */
function extractDuration(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Pattern for digits: e.g., "3 din", "5 days", "2 weeks"
  const digitMatch = lower.match(
    /(\d+)\s*(din|days?|haft[ae]|weeks?|mahin[ae]|months?|दिन|हफ्ते|सप्ताह|महीने)/i,
  );
  if (digitMatch) {
    const num = digitMatch[1];
    const unit = digitMatch[2].toLowerCase();
    let unitStr = 'days';
    if (/haft|week|सप्ताह/i.test(unit)) unitStr = Number(num) === 1 ? 'week' : 'weeks';
    else if (/mahin|month|महीने/i.test(unit)) unitStr = Number(num) === 1 ? 'month' : 'months';
    else unitStr = Number(num) === 1 ? 'day' : 'days';
    return `${num} ${unitStr}`;
  }

  // Pattern for word numbers: e.g., "teen din", "two days", "do hafte"
  const wordKeys = Object.keys(NUMBER_WORDS).join('|');
  const wordRegex = new RegExp(
    `(${wordKeys})\\s*(din|days?|haft[ae]|weeks?|mahin[ae]|months?|दिन|हफ्ते|सप्ताह|महीने)`,
    'i',
  );
  const wordMatch = lower.match(wordRegex);
  if (wordMatch) {
    const word = wordMatch[1].toLowerCase();
    const englishWord = NUMBER_WORDS[word] || word;
    const unit = wordMatch[2].toLowerCase();
    let unitStr = 'days';
    if (/haft|week|सप्ताह/i.test(unit)) unitStr = englishWord === 'one' ? 'week' : 'weeks';
    else if (/mahin|month|महीने/i.test(unit)) unitStr = englishWord === 'one' ? 'month' : 'months';
    else unitStr = englishWord === 'one' ? 'day' : 'days';
    return `${englishWord} ${unitStr}`;
  }

  return null;
}

/**
 * Generate a professional subject and description from structured analysis.
 *
 * @param {object} analysis - The structured analysis object from complaintAnalyzer.
 * @returns {{ subject: string, description: string }}
 */
export function generateComplaint(analysis) {
  if (!analysis) {
    throw new Error('Analysis data is required to generate a complaint');
  }

  const { category, location, originalText, problem } = analysis;
  const trimmedLoc = location?.trim();
  const locationPhrase = trimmedLoc ? trimmedLoc : 'the mentioned area';
  let duration = extractDuration(originalText || problem);
  if (!duration && analysis.duration) {
    if (typeof analysis.duration === 'string') {
      duration = analysis.duration;
    } else if (analysis.duration.value && analysis.duration.unit) {
      duration = `${analysis.duration.value} ${analysis.duration.unit}`;
    } else if (analysis.duration.rawText) {
      duration = extractDuration(analysis.duration.rawText);
    }
  }
  const durationPhrase = duration ? ` for the past ${duration}` : '';

  switch (category) {
    case 'Garbage':
      return {
        subject: trimmedLoc
          ? `Garbage collection issue in ${trimmedLoc}`
          : 'Garbage collection issue in my area',
        description: `Garbage has not been collected in ${locationPhrase}${durationPhrase}. This is causing inconvenience to residents and may create sanitation concerns. Kindly arrange garbage collection and take the necessary action.`,
      };

    case 'Road/Pothole':
      return {
        subject: trimmedLoc
          ? `Road damage and pothole issue in ${trimmedLoc}`
          : 'Road damage and pothole issue in my area',
        description: `A significant pothole and road damage has been reported in ${locationPhrase}${durationPhrase}. This poses a safety hazard for commuters and daily traffic. Kindly inspect the site and arrange the necessary road repair work.`,
      };

    case 'Streetlight':
      return {
        subject: trimmedLoc
          ? `Streetlight malfunction in ${trimmedLoc}`
          : 'Streetlight malfunction in my area',
        description: `The street lighting in ${locationPhrase} is non-functional${durationPhrase}. The lack of illumination creates safety concerns for pedestrians and commuters during nighttime hours. Kindly inspect and restore the lighting service.`,
      };

    case 'Water':
      return {
        subject: trimmedLoc
          ? `Water supply disruption in ${trimmedLoc}`
          : 'Water supply disruption in my area',
        description: `Water supply has been disrupted in ${locationPhrase}${durationPhrase}. This is causing significant inconvenience for daily essential needs. Kindly inspect the supply line and take prompt action to restore normal water supply.`,
      };

    case 'Drainage':
      return {
        subject: trimmedLoc
          ? `Drainage overflow and blockage issue in ${trimmedLoc}`
          : 'Drainage overflow and blockage issue in my area',
        description: `The drainage system in ${locationPhrase} is overflowing and clogged${durationPhrase}. This is leading to water stagnation and potential health hazards. Kindly arrange for drain cleaning and clearing the blockage promptly.`,
      };

    default:
      return {
        subject: trimmedLoc
          ? `Civic issue reported in ${trimmedLoc}`
          : 'Civic issue reported in my area',
        description: `A civic issue regarding ${problem || 'the neighborhood'} has been reported in ${locationPhrase}${durationPhrase}. Kindly inspect the area and take appropriate action.`,
      };
  }
}

/**
 * Generate a complete formal complaint letter including salutation and closing.
 *
 * @param {object} analysis - The structured analysis object.
 * @returns {{ subject: string, salutation: string, body: string, closing: string, fullLetter: string }}
 */
export function generateFormalComplaintLetter(analysis) {
  const { subject, description } = generateComplaint(analysis);
  const salutation = 'Respected Sir/Madam,';
  const closing = 'Thank you for your attention.\n\nSincerely,\nConcerned Citizen';
  return {
    subject,
    salutation,
    body: description,
    closing,
    fullLetter: `Subject: ${subject}\n\n${salutation}\n\n${description}\n\n${closing}`,
  };
}

