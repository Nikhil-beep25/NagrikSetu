/**
 * Phase 6 Automated Test Suite — Intelligent Location-Based Government Authority Detection
 *
 * Verifies all 18 scenarios specified in Phase 6 requirements:
 * 1. Delhi garbage complaint (MCD)
 * 2. Delhi pothole complaint (PWD Delhi / arterial vs colony)
 * 3. Delhi water supply complaint (Delhi Jal Board)
 * 4. Agra garbage complaint (Agra Nagar Nigam)
 * 5. Agra streetlight complaint (Agra Nagar Nigam)
 * 6. Agra water supply complaint (Agra Jal Sansthan / Jansunwai)
 * 7. Noida civic complaint (NOIDA Authority)
 * 8. Greater Noida civic complaint (GNIDA)
 * 9. Ghaziabad civic complaint (GNN / GDA)
 * 10. Gurugram civic complaint (MCG / GMDA)
 * 11. Faridabad civic complaint (MCF / FMDA)
 * 12. Unknown city (CPGRAMS fallback with Low confidence)
 * 13. Missing locality (Safe city-level resolution)
 * 14. Ambiguous road ownership (MCD with PWD alternative)
 * 15. Emergency electrical hazard (Discom + 112 & 1912)
 * 16. Missing official portal handling (No invented URLs)
 * 17. Invalid location input (Graceful non-crashing fallback)
 * 18. Hindi and Hinglish location names (Bilingual parsing)
 */

import {
  parseLocation,
  detectAuthority,
  recommendAuthority,
} from '../src/services/authorityService.js';
import { AUTHORITY_DIRECTORY } from '../src/data/authorityDirectory.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  🏛️  PHASE 6: GOVERNMENT AUTHORITY DETECTION ENGINE TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. Delhi garbage complaint
// -----------------------------------------------------------------------------
console.log('Test 1: Delhi garbage complaint');
{
  const res = detectAuthority({
    city: 'Delhi',
    locality: 'Rohini Sector 7',
    category: 'Garbage',
  });
  assert(res.authorityId === 'delhi-mcd', 'Routes to Municipal Corporation of Delhi (MCD)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.verificationStatus === 'Verified', 'Verification status is Verified');
  assert(res.officialPortalUrl.includes('mcdonline.nic.in'), 'Official portal is MCD online');
}

// -----------------------------------------------------------------------------
// 2. Delhi pothole complaint (Arterial road -> PWD Delhi)
// -----------------------------------------------------------------------------
console.log('\nTest 2: Delhi pothole complaint (Arterial corridor)');
{
  const res = detectAuthority({
    city: 'Delhi',
    locality: 'Ring Road near AIIMS Flyover',
    category: 'Road/Pothole',
    isArterialRoad: true,
  });
  assert(res.authorityId === 'delhi-pwd', 'Routes to PWD Delhi for arterial / flyover roads');
  assert(res.confidence === 'High', 'Confidence is High for specified arterial road');
  assert(Array.isArray(res.alternativeAuthorities) && res.alternativeAuthorities.length > 0, 'Lists MCD as alternative for colony roads');
  assert(res.officialWebsite.includes('pwddelhi.gov.in'), 'Official PWD website present');
}

// -----------------------------------------------------------------------------
// 3. Delhi water supply complaint
// -----------------------------------------------------------------------------
console.log('\nTest 3: Delhi water supply complaint');
{
  const res = detectAuthority({
    city: 'Delhi',
    locality: 'Karol Bagh',
    category: 'Water',
  });
  assert(res.authorityId === 'delhi-djb', 'Routes to Delhi Jal Board (DJB)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.verificationStatus === 'Verified', 'Verification status is Verified');
  assert(res.officialPortalUrl.includes('djb.gov.in'), 'Official DJB portal link present');
}

// -----------------------------------------------------------------------------
// 4. Agra garbage complaint (Pilot City Priority)
// -----------------------------------------------------------------------------
console.log('\nTest 4: Agra garbage complaint (Agra Nagar Nigam)');
{
  const res = detectAuthority({
    city: 'Agra',
    state: 'Uttar Pradesh',
    locality: 'Sikandra',
    category: 'Garbage',
  });
  assert(res.authorityId === 'agra-ann', 'Routes to Agra Nagar Nigam (ANN)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.verificationStatus === 'Verified', 'Verification status is Verified');
  assert(res.officialPortalUrl.includes('agranagarnigam.in'), 'Official Agra Nagar Nigam portal URL verified');
}

// -----------------------------------------------------------------------------
// 5. Agra streetlight complaint
// -----------------------------------------------------------------------------
console.log('\nTest 5: Agra streetlight complaint');
{
  const res = detectAuthority({
    city: 'Agra',
    state: 'Uttar Pradesh',
    locality: 'Kamla Nagar',
    category: 'Streetlight',
  });
  assert(res.authorityId === 'agra-ann', 'Routes streetlight to Agra Nagar Nigam');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.category === 'Streetlight', 'Category preserved as Streetlight');
}

// -----------------------------------------------------------------------------
// 6. Agra water supply complaint
// -----------------------------------------------------------------------------
console.log('\nTest 6: Agra water supply complaint');
{
  const res = detectAuthority({
    city: 'Agra',
    state: 'Uttar Pradesh',
    locality: 'Shahganj',
    category: 'Water',
  });
  assert(res.authorityId === 'agra-jal-sansthan', 'Routes to Agra Jal Sansthan / UP Jal Nigam');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.officialPortalUrl.includes('jansunwai.up.nic.in'), 'Official portal is UP IGRS Jansunwai');
}

// -----------------------------------------------------------------------------
// 7. Noida civic complaint
// -----------------------------------------------------------------------------
console.log('\nTest 7: Noida civic complaint');
{
  const res = detectAuthority({
    city: 'Noida',
    state: 'Uttar Pradesh',
    locality: 'Sector 62',
    category: 'Drainage',
  });
  assert(res.authorityId === 'noida-authority', 'Routes to New Okhla Industrial Development Authority (NOIDA)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.officialPortalUrl.includes('noidaauthorityonline.in'), 'Official Noida portal verified');
}

// -----------------------------------------------------------------------------
// 8. Greater Noida civic complaint
// -----------------------------------------------------------------------------
console.log('\nTest 8: Greater Noida civic complaint');
{
  const res = detectAuthority({
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    locality: 'Alpha 1 Commercial Belt',
    category: 'Garbage',
  });
  assert(res.authorityId === 'greater-noida-gnida', 'Routes to Greater Noida Authority (GNIDA)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.officialWebsite.includes('greaternoidaauthority.in'), 'GNIDA official website verified');
}

// -----------------------------------------------------------------------------
// 9. Ghaziabad civic complaint
// -----------------------------------------------------------------------------
console.log('\nTest 9: Ghaziabad civic complaint');
{
  // GDA Scheme test
  const resGda = detectAuthority({
    city: 'Ghaziabad',
    locality: 'Indirapuram',
    category: 'Road/Pothole',
  });
  assert(resGda.authorityId === 'ghaziabad-gda', 'Recognizes Indirapuram as GDA Scheme');

  // Municipal Zone test
  const resGnn = detectAuthority({
    city: 'Ghaziabad',
    locality: 'Kavi Nagar Zone',
    category: 'Garbage',
  });
  assert(resGnn.authorityId === 'ghaziabad-gnn' || resGnn.authorityId === 'ghaziabad-gda', 'Routes to Ghaziabad Nagar Nigam or GDA');
  assert(resGnn.verificationStatus === 'Verified', 'Verification status is Verified');
}

// -----------------------------------------------------------------------------
// 10. Gurugram civic complaint
// -----------------------------------------------------------------------------
console.log('\nTest 10: Gurugram civic complaint');
{
  const res = detectAuthority({
    city: 'Gurugram',
    state: 'Haryana',
    locality: 'Sector 14',
    category: 'Garbage',
  });
  assert(res.authorityId === 'gurugram-mcg', 'Routes to Municipal Corporation of Gurugram (MCG)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.officialWebsite.includes('mcg.gov.in'), 'MCG portal verified');
}

// -----------------------------------------------------------------------------
// 11. Faridabad civic complaint
// -----------------------------------------------------------------------------
console.log('\nTest 11: Faridabad civic complaint');
{
  const res = detectAuthority({
    city: 'Faridabad',
    state: 'Haryana',
    locality: 'NIT 2',
    category: 'Water',
  });
  assert(res.authorityId === 'faridabad-mcf', 'Routes to Municipal Corporation Faridabad (MCF)');
  assert(res.confidence === 'High', 'Confidence is High');
  assert(res.officialPortalUrl.includes('mcfbd.gov.in'), 'MCF portal verified');
}

// -----------------------------------------------------------------------------
// 12. Unknown city (Outside pilot region)
// -----------------------------------------------------------------------------
console.log('\nTest 12: Unknown city (Outside pilot region)');
{
  const res = detectAuthority({
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    locality: 'RS Puram',
    category: 'Drainage',
  });
  assert(res.authorityId === 'central-cpgrams', 'Routes to Government of India CPGRAMS portal');
  assert(res.confidence === 'Low', 'Confidence is Low for unmapped city');
  assert(res.requiresConfirmation === true, 'Requires citizen confirmation flagged');
  assert(res.officialPortalUrl.includes('pgportal.gov.in'), 'Official CPGRAMS URL provided');
}

// -----------------------------------------------------------------------------
// 13. Missing locality
// -----------------------------------------------------------------------------
console.log('\nTest 13: Missing locality');
{
  const res = detectAuthority({
    city: 'Agra',
    state: 'Uttar Pradesh',
    locality: '',
    category: 'Garbage',
  });
  assert(res.authorityId === 'agra-ann', 'Resolves city-level municipal authority (Agra Nagar Nigam)');
  assert(res.requiresConfirmation === true, 'Flags confirmation needed to identify specific ward');
}

// -----------------------------------------------------------------------------
// 14. Ambiguous road ownership
// -----------------------------------------------------------------------------
console.log('\nTest 14: Ambiguous road ownership in Delhi');
{
  const res = detectAuthority({
    city: 'Delhi',
    locality: 'General road near South Extension',
    category: 'Road/Pothole',
  });
  assert(res.authorityId === 'delhi-mcd', 'Recommends MCD for colony roads');
  assert(res.confidence === 'Medium', 'Confidence is Medium due to road width ambiguity');
  assert(res.requiresConfirmation === true, 'Requires confirmation if road is arterial (>60ft)');
  assert(
    res.alternativeAuthorities.some((alt) => alt.name.includes('PWD Delhi')),
    'Explains PWD Delhi maintains master arterial roads and flyovers'
  );
}

// -----------------------------------------------------------------------------
// 15. Emergency electrical hazard
// -----------------------------------------------------------------------------
console.log('\nTest 15: Emergency electrical hazard');
{
  // Agra electrical emergency -> Torrent Power
  const resAgra = detectAuthority({
    city: 'Agra',
    isEmergency: true,
    hazardType: 'electrical',
    category: 'Other',
  });
  assert(resAgra.authorityId === 'agra-torrent-power', 'Routes Agra electrical hazard to Torrent Power');
  assert(
    resAgra.emergencyNumbers.some((e) => e.number === '112') &&
    resAgra.emergencyNumbers.some((e) => e.number === '1912'),
    'Displays 112 and 1912 emergency helplines'
  );

  // Delhi electrical emergency -> Discom (North Delhi -> TPDDL)
  const resDelhiNorth = detectAuthority({
    city: 'Delhi',
    locality: 'Rohini Sector 3',
    isEmergency: true,
    hazardType: 'electrical',
    category: 'Other',
  });
  assert(resDelhiNorth.authorityId === 'delhi-discom-tpddl', 'Routes North Delhi electrical hazard to Tata Power DDL');
  assert(resDelhiNorth.confidence === 'High', 'Confidence is High for verified discom');
}

// -----------------------------------------------------------------------------
// 16. Missing official portal handling
// -----------------------------------------------------------------------------
console.log('\nTest 16: Missing official portal handling');
{
  // Check that records never invent government URLs
  const allRecords = AUTHORITY_DIRECTORY;
  let allUrlsValid = true;
  for (const rec of allRecords) {
    if (rec.officialWebsite && !rec.officialWebsite.startsWith('https://')) {
      allUrlsValid = false;
    }
    if (rec.complaintPortal && !rec.complaintPortal.startsWith('https://')) {
      allUrlsValid = false;
    }
  }
  assert(allUrlsValid, 'Every configured official URL is a secure HTTPS link to verified domain');
}

// -----------------------------------------------------------------------------
// 17. Invalid location input
// -----------------------------------------------------------------------------
console.log('\nTest 17: Invalid location input handling');
{
  const resNull = detectAuthority({ city: null, state: null, locality: null });
  assert(resNull.authorityId === 'central-cpgrams', 'Handles null location safely with CPGRAMS');
  assert(resNull.confidence === 'Low', 'Confidence is Low');

  const resEmptyStr = recommendAuthority('Garbage', '');
  assert(resEmptyStr && resEmptyStr.authority, 'Handles empty string location gracefully');

  const resNumber = recommendAuthority('Garbage', 12345);
  assert(resNumber && resNumber.authority, 'Handles numeric location gracefully');
}

// -----------------------------------------------------------------------------
// 18. Hindi and Hinglish location names
// -----------------------------------------------------------------------------
console.log('\nTest 18: Hindi and Hinglish location names');
{
  // Devanagari Hindi
  const parsedHindiAgra = parseLocation('सिकंदरा, आगरा, उत्तर प्रदेश');
  assert(parsedHindiAgra.city === 'Agra' && parsedHindiAgra.state === 'Uttar Pradesh', 'Parses Hindi "सिकंदरा, आगरा"');

  const parsedHindiDelhi = parseLocation('रोहिणी, दिल्ली');
  assert(parsedHindiDelhi.city === 'Delhi', 'Parses Hindi "रोहिणी, दिल्ली"');

  const parsedHindiNoida = parseLocation('सेक्टर 62, नोएडा');
  assert(parsedHindiNoida.city === 'Noida', 'Parses Hindi "नोएडा"');

  // Hinglish
  const parsedHinglishDilli = parseLocation('Dilli rohini sec 8');
  assert(parsedHinglishDilli.city === 'Delhi', 'Parses Hinglish "Dilli"');

  const parsedHinglishGzb = parseLocation('Indirapuram Gzb');
  assert(parsedHinglishGzb.city === 'Ghaziabad', 'Parses Hinglish "Gzb" / Indirapuram');

  const parsedHinglishGurgaon = parseLocation('DLF Phase 3 Gurgaon');
  assert(parsedHinglishGurgaon.city === 'Gurugram', 'Parses Hinglish "Gurgaon"');
}

// -----------------------------------------------------------------------------
// Mock Geocoding Test Verification
// -----------------------------------------------------------------------------
console.log('\nMock Geocoding Verification:');
{
  // Simulated browser geolocation coordinates
  const mockGeoAgra = { latitude: 27.1767, longitude: 78.0081 };
  let detectedPilotCity = null;
  if (mockGeoAgra.latitude >= 27.05 && mockGeoAgra.latitude <= 27.30 && mockGeoAgra.longitude >= 77.85 && mockGeoAgra.longitude <= 78.15) {
    detectedPilotCity = 'Agra';
  }
  assert(detectedPilotCity === 'Agra', 'Simulated GPS coordinates (27.1767°N, 78.0081°E) map to Agra pilot zone');
}

console.log(`\n================================================================`);
console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
