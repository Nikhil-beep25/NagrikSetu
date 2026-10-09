/**
 * Phase 3 Automated Verification Tests
 *
 * Tests the complete AI understanding -> Complaint generation flow for all 5 required prompts:
 * 1. Garbage: "Mere area mein garbage collect nahi hua."
 * 2. Road: "Road mein bada pothole hai."
 * 3. Streetlight: "Street light kaam nahi kar rahi."
 * 4. Water: "Teen din se paani nahi aa raha."
 * 5. Drainage: "Nali overflow ho rahi hai."
 */

import { analyzeComplaint } from '../src/services/complaintAnalyzer.js';
import { generateComplaint } from '../src/services/complaintGenerator.js';

const testCases = [
  {
    categoryName: 'Garbage',
    input: 'Mere area mein garbage collect nahi hua.',
    location: 'Sector 15, Vasundhara',
    expectedCategory: 'Garbage',
  },
  {
    categoryName: 'Road/Pothole',
    input: 'Road mein bada pothole hai.',
    location: 'Link Road',
    expectedCategory: 'Road/Pothole',
  },
  {
    categoryName: 'Streetlight',
    input: 'Street light kaam nahi kar rahi.',
    location: 'Pocket B, Mayur Vihar',
    expectedCategory: 'Streetlight',
  },
  {
    categoryName: 'Water',
    input: 'Teen din se paani nahi aa raha.',
    location: 'Civil Lines',
    expectedCategory: 'Water',
    expectedDuration: 'three days',
  },
  {
    categoryName: 'Drainage',
    input: 'Nali overflow ho rahi hai.',
    location: 'Shastri Nagar',
    expectedCategory: 'Drainage',
  },
];

async function runPhase3Tests() {
  console.log('=== AI CIVIC ACCESS — PHASE 3 TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    console.log(`--- Testing ${tc.categoryName} ---`);
    console.log(`Input: "${tc.input}"`);
    console.log(`Location: "${tc.location}"`);

    // 1. Analyze
    const analysis = await analyzeComplaint(tc.input, tc.location);
    if (!analysis.success || analysis.data.category !== tc.expectedCategory) {
      console.log(`❌ Analysis failed. Expected category "${tc.expectedCategory}", got:`, analysis);
      failed++;
      continue;
    }
    console.log(`✅ AI Understanding: Category = ${analysis.data.category}, Priority = ${analysis.data.priority}`);

    // 2. Generate
    const generated = generateComplaint(analysis.data);
    if (!generated.subject || !generated.description) {
      console.log(`❌ Generation failed. Missing subject or description:`, generated);
      failed++;
      continue;
    }

    console.log(`Generated Subject:\n  "${generated.subject}"`);
    console.log(`Generated Description:\n  "${generated.description}"`);

    // 3. Factual & Grounding Checks
    let testValid = true;

    // Check location incorporation
    if (!generated.subject.includes(tc.location) && !generated.description.includes(tc.location)) {
      console.log(`❌ Location was not included in subject or description.`);
      testValid = false;
    }

    // Check duration for Water test
    if (tc.expectedDuration) {
      if (!generated.description.toLowerCase().includes(tc.expectedDuration)) {
        console.log(`❌ Duration "${tc.expectedDuration}" was not properly reflected in description.`);
        testValid = false;
      } else {
        console.log(`✅ Factual Duration: correctly captured "${tc.expectedDuration}".`);
      }
    } else {
      // Ensure no invented duration when none specified
      const hasInventedDuration = /\b(days?|weeks?|months?)\b/i.test(generated.description);
      if (hasInventedDuration) {
        console.log(`❌ Invented duration found when none was provided!`);
        testValid = false;
      } else {
        console.log(`✅ Grounding: No unmentioned duration invented.`);
      }
    }

    // Ensure no invented authorities or submission claims
    const forbiddenPhrases = [
      'submitted to',
      'assigned to',
      'mcd commissioner',
      'pwd minister',
      'complaint id',
      'residents of xyz',
    ];
    for (const phrase of forbiddenPhrases) {
      if (generated.description.toLowerCase().includes(phrase)) {
        console.log(`❌ Forbidden ungrounded phrase found: "${phrase}"`);
        testValid = false;
      }
    }

    if (testValid) {
      console.log(`✅ ${tc.categoryName} complaint is professional, grounded, and concise.`);
      passed++;
    } else {
      failed++;
    }
    console.log();
  }

  console.log(`=== SUMMARY: ${passed} passed, ${failed} failed out of ${testCases.length} ===\n`);
  if (failed > 0) process.exit(1);
}

runPhase3Tests();
