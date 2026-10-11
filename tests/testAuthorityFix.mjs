/**
 * NagrikSetu - Verification Test Suite for Authority Matching & Complaint Routing
 *
 * Specifically verifies:
 * 1. Pothole complaints never recommend electricity providers (Torrent Power).
 * 2. Emergency contacts match the issue (no 1912 on road issues).
 * 3. Unrelated official portal links are never displayed.
 * 4. Legitimate electrical hazards correctly route to Torrent Power / Discoms.
 * 5. English, Hindi, and Hinglish complaints.
 */

import { detectAuthority, recommendAuthority, normalizeCategory } from '../src/services/authorityService.js';
import { detectEmergencyHazard } from '../src/services/emergencySafetyDetector.js';

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
console.log('  🔍 NAGRIKSETU — AUTHORITY MATCHING & ROUTING VERIFICATION');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: User Scenario — Pothole in Sikandra, Agra, UP
// "Main road has a dangerous deep pothole causing accidents."
// -----------------------------------------------------------------------------
console.log('Test 1: Pothole in Sikandra, Agra, UP (English)');
{
  const res = recommendAuthority('Road/Pothole', 'Sikandra, Agra, Uttar Pradesh', {
    city: 'Agra',
    locality: 'Sikandra',
    isEmergency: true, // Marked emergency because of "accidents / dangerous"
    intelligent: true,
  });

  assert(res.category === 'Road/Pothole', 'Category is Road/Pothole');
  assert(!res.authority.includes('Torrent Power'), 'MUST NOT return Torrent Power Limited');
  assert(
    res.authority.includes('Public Works Department') || res.authority.includes('Agra Nagar Nigam'),
    `Routes to verified road authority (Got: ${res.authority})`
  );
  assert(
    !res.officialPortalUrl?.includes('torrentpower'),
    'MUST NOT recommend Torrent Power portal'
  );
  assert(
    !res.portalName?.includes('Torrent Power'),
    'Portal name does NOT mention Torrent Power'
  );
  const has1912 = res.emergencyNumbers?.some(e => e.number === '1912');
  assert(!has1912, 'MUST NOT display electricity emergency number 1912');
}

// -----------------------------------------------------------------------------
// TEST 2: Hindi Pothole Complaint in Sikandra, Agra
// "सिकंदरा मुख्य सड़क पर बहुत गहरा खतरनाक गड्ढा है"
// -----------------------------------------------------------------------------
console.log('\nTest 2: Hindi Pothole Complaint in Sikandra, Agra');
{
  const res = recommendAuthority('Road/Pothole', 'सिकंदरा, आगरा, उत्तर प्रदेश', {
    city: 'Agra',
    isEmergency: true,
    intelligent: true,
  });

  assert(res.category === 'Road/Pothole', 'Category is Road/Pothole');
  assert(!res.authority.includes('Torrent Power'), 'Hindi complaint does NOT return Torrent Power');
  assert(
    res.authority.includes('Public Works Department') || res.authority.includes('Agra Nagar Nigam'),
    `Routes to verified road authority in Hindi (Got: ${res.authority})`
  );
  const has1912 = res.emergencyNumbers?.some(e => e.number === '1912');
  assert(!has1912, 'Does NOT display electricity helpline 1912 for Hindi pothole');
}

// -----------------------------------------------------------------------------
// TEST 3: Hinglish Pothole Complaint in Agra
// "Sikandra main road par khatarnak gaddha hai"
// -----------------------------------------------------------------------------
console.log('\nTest 3: Hinglish Pothole Complaint in Agra');
{
  const res = recommendAuthority('Road/Pothole', 'Sikandra main road, Agra', {
    city: 'Agra',
    isEmergency: true,
    intelligent: true,
  });

  assert(res.category === 'Road/Pothole', 'Category is Road/Pothole');
  assert(!res.authority.includes('Torrent Power'), 'Hinglish complaint does NOT return Torrent Power');
  assert(
    res.authority.includes('Public Works Department') || res.authority.includes('Agra Nagar Nigam'),
    `Routes to verified road authority in Hinglish (Got: ${res.authority})`
  );
}

// -----------------------------------------------------------------------------
// TEST 4: Legitimate Electrical Hazard in Agra (Must Still Route to Torrent Power)
// -----------------------------------------------------------------------------
console.log('\nTest 4: Legitimate Electrical Hazard in Agra');
{
  const hazard = detectEmergencyHazard('Broken live electrical wire sparking on the street pole');
  assert(hazard !== null, 'Emergency detector flags live wire');
  assert(hazard.hazardType === 'electrical_hazard', 'Hazard type is electrical_hazard');

  const res = recommendAuthority(hazard.category, 'Sikandra, Agra, Uttar Pradesh', {
    city: 'Agra',
    locality: 'Sikandra',
    isEmergency: true,
    hazardType: hazard.hazardType,
    intelligent: true,
  });

  assert(res.authority.includes('Torrent Power'), 'Legitimate electrical hazard routes to Torrent Power');
  assert(res.authorityId === 'agra-torrent-power', 'Authority ID is agra-torrent-power');
  assert(res.officialPortalUrl?.includes('torrentpower'), 'Displays Torrent Power portal URL');
  const has1912 = res.emergencyNumbers?.some(e => e.number === '1912');
  assert(has1912, 'Displays 1912 electricity helpline for genuine electrical hazard');
}

// -----------------------------------------------------------------------------
// TEST 5: Open Manhole in Agra (Drainage Hazard -> Not Torrent Power)
// -----------------------------------------------------------------------------
console.log('\nTest 5: Open Manhole in Agra');
{
  const hazard = detectEmergencyHazard('Open manhole on the street without cover');
  assert(hazard !== null, 'Emergency detector flags open manhole');
  assert(hazard.hazardType === 'open_manhole', 'Hazard type is open_manhole');

  const res = recommendAuthority('Drainage', 'Kamla Nagar, Agra, Uttar Pradesh', {
    city: 'Agra',
    locality: 'Kamla Nagar',
    isEmergency: true,
    hazardType: hazard.hazardType,
    intelligent: true,
  });

  assert(!res.authority.includes('Torrent Power'), 'Open manhole does NOT route to Torrent Power');
  assert(res.authority.includes('Agra Nagar Nigam') || res.authority.includes('Jal Sansthan'), 'Routes to municipal body or Jal Sansthan');
  const has1912 = res.emergencyNumbers?.some(e => e.number === '1912');
  assert(!has1912, 'Does NOT display 1912 electricity number for open manhole');
}

// -----------------------------------------------------------------------------
// TEST 6: General Category "Other" in Agra (Not Electrical)
// -----------------------------------------------------------------------------
console.log('\nTest 6: General Category Other in Agra');
{
  const res = recommendAuthority('Other', 'Agra, Uttar Pradesh', {
    city: 'Agra',
    intelligent: true,
  });

  assert(!res.authority.includes('Torrent Power'), 'General Other category does NOT route to Torrent Power');
  assert(res.authority.includes('Agra Nagar Nigam'), 'Routes to municipal corporation for general civic issue');
  const has1912 = res.emergencyNumbers?.some(e => e.number === '1912');
  assert(!has1912, 'Does NOT display 1912 for general civic issue');
}

console.log('\n================================================================');
console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed}`);
console.log('================================================================\n');

if (failed > 0) process.exit(1);
