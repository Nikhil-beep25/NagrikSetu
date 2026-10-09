/**
 * Authority Recommendation Service (Prototype Knowledge Base)
 *
 * Provides prototype civic authority mappings and verified official channel links.
 * Strictly adheres to prototype guidelines:
 * - Does NOT claim nationwide jurisdiction intelligence.
 * - Does NOT fabricate official URLs.
 * - If no verified portal URL is configured, officialPortalUrl is null.
 */

export const PROTOTYPE_AUTHORITY_MAP = {
  Garbage: {
    authority: 'Municipal Corporation / Local Urban Local Body',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: 'CPGRAMS — Public Grievance Portal',
    // Verified official Government of India public grievance redress portal
    officialPortalUrl: 'https://pgportal.gov.in/',
  },
  'Road/Pothole': {
    authority: 'Municipal Corporation / Local Road Authority',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: 'CPGRAMS — Public Grievance Portal',
    // Verified official Government of India public grievance redress portal
    officialPortalUrl: 'https://pgportal.gov.in/',
  },
  Streetlight: {
    authority: 'Local Municipal/Civic Authority',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: null,
    // Intentionally unconfigured to test and demonstrate the safe fallback
    officialPortalUrl: null,
  },
  Water: {
    authority: 'Local Water Supply Authority',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: 'CPGRAMS — Public Grievance Portal',
    // Verified official Government of India public grievance redress portal
    officialPortalUrl: 'https://pgportal.gov.in/',
  },
  Drainage: {
    authority: 'Municipal Corporation / Local Sanitation Authority',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: null,
    // Intentionally unconfigured to test and demonstrate the safe fallback
    officialPortalUrl: null,
  },
};

/**
 * Recommend the civic authority based on category and location.
 *
 * @param {string} category - Complaint category (Garbage, Road/Pothole, etc.)
 * @param {string} [location] - Location provided by citizen (used for contextual display)
 * @returns {{
 *   authority: string,
 *   category: string,
 *   location: string,
 *   reason: string,
 *   disclaimer: string,
 *   officialPortalUrl: string | null,
 *   portalName: string | null
 * }}
 */
export function recommendAuthority(category, location = '') {
  const mapping = PROTOTYPE_AUTHORITY_MAP[category] || {
    authority: 'Local Municipal/Civic Authority',
    reason: 'This complaint appears to relate to a local civic service.',
    portalName: null,
    officialPortalUrl: null,
  };

  return {
    authority: mapping.authority,
    category,
    location: location?.trim() || 'Not specified',
    reason: mapping.reason,
    disclaimer: 'AI recommendation. Please verify the authority before submitting.',
    officialPortalUrl: mapping.officialPortalUrl,
    portalName: mapping.portalName,
  };
}
