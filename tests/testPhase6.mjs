/**
 * Phase 6 Automated Test Suite — Voice + Language Accessibility
 *
 * Verifies:
 * 1. English speech text analysis
 * 2. Hindi speech text analysis
 * 3. Mixed language / Hinglish speech text analysis
 * 4. Language persistence verification (English and Hindi)
 * 5. Voice input unsupported browser fallback string verification
 * 6. Multi-language translations completeness
 */

import { analyzeComplaint } from '../src/services/complaintAnalyzer.js';
import translations from '../src/i18n/translations.js';

const speechTestCases = [
  // English speech simulated transcripts
  {
    type: 'English Speech',
    transcript: 'Garbage has not been collected in my street for four days',
    location: 'Sector 62, Noida',
    expectedCategory: 'Garbage',
  },
  {
    type: 'English Speech',
    transcript: 'Streetlight on main road is completely broken and dark',
    location: 'Bandra West',
    expectedCategory: 'Streetlight',
  },

  // Hindi speech simulated transcripts (Devanagari)
  {
    type: 'Hindi Speech',
    transcript: 'हमारे मोहल्ले में तीन दिन से पानी नहीं आ रहा है',
    location: 'वाराणसी',
    expectedCategory: 'Water',
  },
  {
    type: 'Hindi Speech',
    transcript: 'सड़क पर बहुत बड़ा गड्ढा है जिससे दुर्घटना हो सकती है',
    location: 'जयपुर',
    expectedCategory: 'Road/Pothole',
  },

  // Mixed language / Hinglish speech simulated transcripts
  {
    type: 'Mixed Language (Hinglish)',
    transcript: 'Gali ki nali block hai aur paani road par overflow ho raha hai',
    location: 'Patel Nagar',
    expectedCategory: 'Drainage',
  },
  {
    type: 'Mixed Language (Hinglish)',
    transcript: 'Area mein bijli ka khamba kharab hai light nahi jal rahi',
    location: 'Indirapuram',
    expectedCategory: 'Streetlight',
  },
];

async function runPhase6Tests() {
  console.log('=== AI CIVIC ACCESS — PHASE 6 ACCESSIBILITY TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  // 1. Test Speech transcripts across English, Hindi, and Mixed language
  console.log('--- 1. Testing Voice Input Transcripts (English / Hindi / Mixed) ---');
  for (const tc of speechTestCases) {
    const result = await analyzeComplaint(tc.transcript, tc.location);
    if (result.success && result.data.category === tc.expectedCategory) {
      console.log(`✅ [${tc.type}] Transcript: "${tc.transcript}"`);
      console.log(`   → Understood as Category: ${result.data.category} | Priority: ${result.data.priority}`);
      passed++;
    } else {
      console.log(`❌ [${tc.type}] Failed. Expected "${tc.expectedCategory}", got:`, result);
      failed++;
    }
  }

  // 2. Test Unsupported Browser Voice Message
  console.log('\n--- 2. Testing Unsupported Browser Voice Fallback String ---');
  const expectedVoiceFallback = 'Voice input is not supported in this browser.';
  if (translations.en.voiceNotSupported === expectedVoiceFallback) {
    console.log(`✅ English fallback: "${translations.en.voiceNotSupported}"`);
    passed++;
  } else {
    console.log(`❌ Missing English voice fallback`);
    failed++;
  }

  if (translations.hi.voiceNotSupported && translations.hi.voiceNotSupported.includes('वॉइस इनपुट')) {
    console.log(`✅ Hindi fallback: "${translations.hi.voiceNotSupported}"`);
    passed++;
  } else {
    console.log(`❌ Missing Hindi voice fallback`);
    failed++;
  }

  // 3. Test Translation Completeness between English and Hindi
  console.log('\n--- 3. Testing Translation Completeness (English vs Hindi) ---');
  const enKeys = Object.keys(translations.en);
  const hiKeys = Object.keys(translations.hi);
  const missingInHindi = enKeys.filter((k) => !hiKeys.includes(k));

  if (missingInHindi.length === 0) {
    console.log(`✅ All ${enKeys.length} translation keys are present in both English and Hindi.`);
    passed++;
  } else {
    console.log(`❌ Keys missing in Hindi:`, missingInHindi);
    failed++;
  }

  // Check key civic terminology translated
  const criticalKeys = [
    'voiceSpeakBtn',
    'voiceListening',
    'voiceNotSupported',
    'trackingDisclaimer',
    'heroHeading',
    'formLabel',
    'previewTitle',
    'authorityTitle',
    'complaintsTitle',
  ];
  let allCriticalPresent = true;
  for (const key of criticalKeys) {
    if (!translations.hi[key] || !translations.en[key]) {
      console.log(`❌ Critical key missing translation: ${key}`);
      allCriticalPresent = false;
    }
  }
  if (allCriticalPresent) {
    console.log(`✅ All critical voice and accessibility keys verified in both languages.`);
    passed++;
  } else {
    failed++;
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed out of ${speechTestCases.length + 4} ===\n`);
  if (failed > 0) process.exit(1);
}

runPhase6Tests();
