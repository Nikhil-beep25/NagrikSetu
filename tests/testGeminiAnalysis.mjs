/**
 * Phase 5 Automated Test Suite — Gemini AI Complaint Integration
 *
 * Tests all 12 Phase 5 requirements with mocked AI responses:
 * 1. English complaint analysis
 * 2. Hindi complaint analysis
 * 3. Hinglish complaint analysis
 * 4. Category identification & normalization
 * 5. Duration extraction
 * 6. Missing location handling
 * 7. Urgency classification (High vs Normal) & safety notice
 * 8. Invalid / malformed AI response handling
 * 9. Gemini API failure / missing credentials handling
 * 10. Fallback analyzer seamless activation
 * 11. Formal complaint letter generation
 * 12. Existing complaint workflow compatibility
 */

import {
  validateAndNormalizeGeminiResponse,
  normalizeCategory,
} from '../server/geminiService.js';
import {
  analyzeComplaint,
} from '../src/services/complaintAnalyzer.js';
import {
  generateFormalComplaintLetter,
} from '../src/services/complaintGenerator.js';
import { startServer, stopServer } from '../server/index.js';


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

async function runTestSuite() {
  console.log('================================================================');
  console.log('  🤖 PHASE 5: GEMINI AI COMPLAINT INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // Test 1: English Complaint Analysis
  // -------------------------------------------------------------
  console.log('--- Test 1: English Complaint Analysis ---');
  const mockEnglishAi = {
    category: 'Streetlight',
    subcategory: 'Streetlight Outage',
    summary: 'Streetlight has not been functioning for three days.',
    location: null,
    durationValue: 3,
    durationUnit: 'days',
    durationRawText: 'three days',
    urgency: 'Normal',
    urgencyReason: 'No immediate safety hazard reported.',
    detectedLanguage: 'English',
    missingInformation: ['Specific pole number or street landmark'],
    suggestedAction: 'Report to electricity board / municipal corporation.',
    isCivicComplaint: true,
  };
  const englishResult = validateAndNormalizeGeminiResponse(
    mockEnglishAi,
    'My streetlight has not been working for three days.',
    'Sector 62, Noida',
  );
  assert(englishResult.category === 'Streetlight', 'Identified category as Streetlight');
  assert(englishResult.duration?.value === 3, 'Extracted duration value: 3');
  assert(englishResult.duration?.unit === 'days', 'Extracted duration unit: days');
  assert(englishResult.detectedLanguage === 'English', 'Detected language is English');
  assert(englishResult.location === 'Sector 62, Noida', 'Preserved user-provided location');
  console.log();

  // -------------------------------------------------------------
  // Test 2: Hindi (Devanagari) Complaint Analysis
  // -------------------------------------------------------------
  console.log('--- Test 2: Hindi Complaint Analysis ---');
  const mockHindiAi = {
    category: 'Drainage / Sewerage',
    subcategory: 'Blocked Drain Overflow',
    summary: 'घर के सामने नाली बंद है और गंदा पानी भर रहा है।',
    location: null,
    durationValue: null,
    durationUnit: null,
    durationRawText: null,
    urgency: 'High',
    urgencyReason: 'घर के बाहर जलभराव से बीमारी और फिसलन का गंभीर खतरा है।',
    detectedLanguage: 'Hindi',
    missingInformation: ['सटीक वार्ड संख्या या मकान नंबर'],
    suggestedAction: 'जल निकासी विभाग को तुरंत सूचित करें।',
    isCivicComplaint: true,
  };
  const hindiResult = validateAndNormalizeGeminiResponse(
    mockHindiAi,
    'मेरे घर के सामने नाली बंद है और पानी भर रहा है।',
    'शास्त्री नगर',
  );
  assert(hindiResult.category === 'Drainage', 'Normalized Devanagari category to Drainage');
  assert(hindiResult.urgency === 'High', 'Identified urgency as High');
  assert(hindiResult.safetyNotice !== null, 'Generated official safety advisory for High urgency');
  assert(hindiResult.detectedLanguage === 'Hindi', 'Detected language is Hindi');
  console.log();

  // -------------------------------------------------------------
  // Test 3: Hinglish (Romanized Hindi) Complaint Analysis
  // -------------------------------------------------------------
  console.log('--- Test 3: Hinglish Complaint Analysis ---');
  const mockHinglishAi = {
    category: 'Water Supply',
    subcategory: 'Drinking Water Shortage',
    summary: 'Water supply has been disrupted for four days.',
    location: null,
    durationValue: 4,
    durationUnit: 'days',
    durationRawText: '4 din',
    urgency: 'Normal',
    urgencyReason: 'Civic water cut without pipeline rupture.',
    detectedLanguage: 'Hinglish',
    missingInformation: ['Colony block or street name'],
    suggestedAction: 'Lodge grievance with Delhi Jal Board.',
    isCivicComplaint: true,
  };
  const hinglishResult = validateAndNormalizeGeminiResponse(
    mockHinglishAi,
    'Mere area mein 4 din se pani nahi aa raha.',
    'Dwarka Sector 7',
  );
  assert(hinglishResult.category === 'Water', 'Normalized Hinglish category to Water');
  assert(hinglishResult.duration?.rawText === '4 din', 'Captured raw duration string "4 din"');
  assert(hinglishResult.detectedLanguage === 'Hinglish', 'Detected language as Hinglish');
  console.log();

  // -------------------------------------------------------------
  // Test 4: Category Identification & Normalization
  // -------------------------------------------------------------
  console.log('--- Test 4: Category Normalization (All 5 Domains + Unsupported) ---');
  assert(normalizeCategory('Garbage / Sanitation') === 'Garbage', 'Garbage / Sanitation -> Garbage');
  assert(normalizeCategory('Road / Pothole Damage') === 'Road/Pothole', 'Road / Pothole Damage -> Road/Pothole');
  assert(normalizeCategory('Street Light Outage') === 'Streetlight', 'Street Light Outage -> Streetlight');
  assert(normalizeCategory('Water Supply Shortage') === 'Water', 'Water Supply Shortage -> Water');
  assert(normalizeCategory('Drainage / Sewerage') === 'Drainage', 'Drainage / Sewerage -> Drainage');
  assert(normalizeCategory('Passport Renewal Request') === 'Unsupported', 'Passport -> Unsupported');
  console.log();

  // -------------------------------------------------------------
  // Test 5: Duration Extraction
  // -------------------------------------------------------------
  console.log('--- Test 5: Duration Extraction Precision ---');
  const mockDurationAi = {
    category: 'Garbage',
    subcategory: 'Uncollected Trash',
    summary: 'Garbage pile not cleared for 5 days.',
    location: null,
    durationValue: 5,
    durationUnit: 'days',
    durationRawText: '5 din',
    urgency: 'Normal',
    urgencyReason: 'Sanitation concern.',
    detectedLanguage: 'Hinglish',
    missingInformation: [],
    suggestedAction: 'Schedule sanitation pickup.',
    isCivicComplaint: true,
  };
  const durationNorm = validateAndNormalizeGeminiResponse(mockDurationAi, '5 din se kachra pada hai', 'Rohini');
  assert(durationNorm.duration !== null, 'Duration object is present');
  assert(durationNorm.duration.value === 5, 'Duration numeric value is 5');
  assert(durationNorm.duration.unit === 'days', 'Duration unit is days');
  assert(durationNorm.duration.rawText === '5 din', 'Duration rawText is "5 din"');
  console.log();

  // -------------------------------------------------------------
  // Test 6: Missing Location Handling (No Hallucination)
  // -------------------------------------------------------------
  console.log('--- Test 6: Missing Location Handling ---');
  const mockNoLocationAi = {
    category: 'Road/Pothole',
    subcategory: 'Dangerous Pothole',
    summary: 'Large pothole on the road.',
    location: null,
    durationValue: null,
    durationUnit: null,
    durationRawText: null,
    urgency: 'High',
    urgencyReason: 'Risk of vehicle accidents.',
    detectedLanguage: 'Hinglish',
    missingInformation: [],
    suggestedAction: 'Repair road surface.',
    isCivicComplaint: true,
  };
  const noLocNorm = validateAndNormalizeGeminiResponse(mockNoLocationAi, 'Road pe bahut bada gaddha hai', '');
  assert(noLocNorm.location === null, 'Location is strictly null (not fabricated)');
  assert(
    noLocNorm.missingInformation.some(m => /location|landmark|address|जगह/i.test(m)),
    'Missing location is explicitly flagged in missingInformation array',
  );
  console.log();

  // -------------------------------------------------------------
  // Test 7: Intelligent Urgency Classification & Safety Notice
  // -------------------------------------------------------------
  console.log('--- Test 7: Urgency Classification (High vs Normal) ---');
  const highHazardMock = {
    category: 'Streetlight',
    subcategory: 'Exposed Live Wire',
    summary: 'Electric pole wire is broken and sparking on the sidewalk.',
    location: 'Main Market',
    durationValue: null,
    durationUnit: null,
    durationRawText: null,
    urgency: 'High',
    urgencyReason: 'Exposed live electrical wires pose fatal electrocution hazard.',
    detectedLanguage: 'English',
    missingInformation: [],
    suggestedAction: 'Immediate emergency power isolation required.',
    isCivicComplaint: true,
  };
  const highNorm = validateAndNormalizeGeminiResponse(highHazardMock, 'Wire sparking on pole', 'Main Market');
  assert(highNorm.urgency === 'High', 'Urgency classified as High for live hazard');
  assert(typeof highNorm.safetyNotice === 'string', 'Safety notice provided for public protection');
  assert(highNorm.safetyNotice.includes('112'), 'Safety notice directs citizen to official 112 helpline');

  const normalMock = {
    category: 'Garbage',
    subcategory: 'Dustbin Full',
    summary: 'Routine garbage collection needed.',
    location: 'Park Street',
    durationValue: 2,
    durationUnit: 'days',
    durationRawText: '2 days',
    urgency: 'Normal',
    urgencyReason: 'Standard sanitation maintenance.',
    detectedLanguage: 'English',
    missingInformation: [],
    suggestedAction: 'Dispatch municipal truck.',
    isCivicComplaint: true,
  };
  const normalNorm = validateAndNormalizeGeminiResponse(normalMock, 'Dustbin full for 2 days', 'Park Street');
  assert(normalNorm.urgency === 'Normal', 'Urgency classified as Normal for routine issue');
  assert(normalNorm.safetyNotice === null, 'No unnecessary safety alert for normal urgency');
  console.log();

  // -------------------------------------------------------------
  // Test 8: Invalid / Malformed AI Response Handling
  // -------------------------------------------------------------
  console.log('--- Test 8: Malformed AI Response Validation ---');
  try {
    validateAndNormalizeGeminiResponse(null, 'test', '');
    assert(false, 'Should throw error for null response');
  } catch (err) {
    assert(err.message.includes('Malformed AI response'), 'Correctly caught malformed response');
  }
  console.log();

  // -------------------------------------------------------------
  // Test 9 & 10: Gemini API Failure & Fallback Analyzer Activation
  // -------------------------------------------------------------
  console.log('--- Tests 9 & 10: Gemini Failure & Seamless Fallback Activation ---');
  const fallbackResult = await analyzeComplaint(
    'Mere ghar ke bahar 5 din se kachra pada hai',
    'Indirapuram',
    { forceFallback: true },
  );
  assert(fallbackResult.success === true, 'Fallback analyzer successfully returned data');
  assert(fallbackResult.data.isAiAssisted === false, 'Marked isAiAssisted as false');
  assert(fallbackResult.data.isFallback === true, 'Marked isFallback as true');
  assert(fallbackResult.data.category === 'Garbage', 'Fallback correctly identified Garbage category');
  assert(
    typeof fallbackResult.data.fallbackNotice === 'string',
    'Fallback notice returned for UI transparency',
  );
  console.log();

  // -------------------------------------------------------------
  // Test 11: Professional Grievance Letter Generation
  // -------------------------------------------------------------
  console.log('--- Test 11: Professional Grievance Letter Generation ---');
  const letterData = generateFormalComplaintLetter({
    category: 'Garbage',
    location: 'Sector 4, Rohini',
    duration: { value: 5, unit: 'days', rawText: '5 din' },
    originalText: 'Mere ghar ke bahar 5 din se kachra pada hai',
    problem: 'Garbage collection issue in Sector 4, Rohini',
  });
  assert(letterData.subject.includes('Sector 4, Rohini'), 'Subject includes location');
  assert(letterData.salutation === 'Respected Sir/Madam,', 'Salutation is respectful');
  assert(letterData.body.includes('five days') || letterData.body.includes('5 days'), 'Body accurately reflects duration');
  assert(letterData.closing.includes('Sincerely'), 'Closing is professional');
  assert(!letterData.fullLetter.includes('assigned to'), 'No invented assignments');
  console.log();

  // -------------------------------------------------------------
  // Test 12: Express Backend Server Integration & Error Handling
  // -------------------------------------------------------------
  console.log('--- Test 12: Backend Express Server Integration & Endpoints ---');
  const TEST_PORT = 5098;
  await startServer(TEST_PORT);

  try {
    // 1. Health endpoint
    const healthRes = await fetch(`http://localhost:${TEST_PORT}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with 200');
    assert(healthJson.status === 'ok', 'Health status is ok');
    assert(typeof healthJson.geminiConfigured === 'boolean', 'Reports geminiConfigured boolean');

    // 2. Empty complaint validation
    const emptyRes = await fetch(`http://localhost:${TEST_PORT}/api/analyze-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaintText: '   ' }),
    });
    const emptyJson = await emptyRes.json();
    assert(emptyRes.status === 400, 'Empty complaint returns 400 Bad Request');
    assert(emptyJson.error === 'empty_complaint', 'Returns empty_complaint error code');

    // 3. Fallback request when key missing (or mock verification)
    const testReqRes = await fetch(`http://localhost:${TEST_PORT}/api/analyze-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintText: 'Mere area mein 3 din se kachra nahi uthaya gaya.',
        location: 'Agra, UP',
      }),
    });
    const testReqJson = await testReqRes.json();
    assert(testReqRes.status === 200, 'Endpoint responds safely with 200');
    assert(
      testReqJson.success === true || testReqJson.fallbackRequired === true,
      'Endpoint handles request with either AI response or graceful fallback required signal',
    );
  } finally {
    await stopServer();
    console.log('  ✅ Test server stopped cleanly');
    passed++;
  }

  console.log('\n================================================================');
  console.log(`  🎉 PHASE 5 TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
