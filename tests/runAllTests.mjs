/**
 * NagrikSetu Unified Test Suite Runner
 *
 * Runs all automated test suites sequentially:
 * 1. testAnalyzer.mjs (AI Complaint Analyzer & Multilingual NLP)
 * 2. testNavbar.mjs (Navigation Architecture, Branding & Contracts)
 * 3. testPhase3.mjs (AI Understanding & Formal Grievance Generator)
 * 4. testPhase4.mjs (Authority Recommendation & Official Portal Redressal)
 * 5. testPhase5.mjs (Prototype Citizen Grievance Tracking Ledger)
 * 6. testPhase6.mjs (Voice Accessibility & Bilingual Translations)
 */

import { execSync } from 'child_process';

const suites = [
  { name: 'Analyzer & NLP Engine', file: 'tests/testAnalyzer.mjs' },
  { name: 'Navbar & Route Contracts', file: 'tests/testNavbar.mjs' },
  { name: 'Phase 3 (Grievance Generation)', file: 'tests/testPhase3.mjs' },
  { name: 'Phase 4 (Authority Redressal)', file: 'tests/testPhase4.mjs' },
  { name: 'Phase 5 (Tracking Ledger)', file: 'tests/testPhase5.mjs' },
  { name: 'Phase 6 (Voice & Accessibility)', file: 'tests/testPhase6.mjs' },
  { name: 'Gemini AI Integration (Phase 5 Engine)', file: 'tests/testGeminiAnalysis.mjs' },
];


console.log('================================================================');
console.log('  🏛️  NAGRIKSETU AI CIVIC ASSISTANCE — FULL TEST REGRESSION');
console.log('================================================================\n');

let totalPassedSuites = 0;
let failedSuites = [];

for (const suite of suites) {
  process.stdout.write(`⏳ Running [${suite.name}] (${suite.file})... `);
  try {
    execSync(`node ${suite.file}`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    totalPassedSuites++;
    console.log('✅ PASSED');
  } catch (err) {
    console.log('❌ FAILED');
    failedSuites.push({ suite, error: err.stdout || err.message });
  }
}

console.log('\n----------------------------------------------------------------');
if (failedSuites.length === 0) {
  console.log(`🎉 ALL ${totalPassedSuites}/${suites.length} TEST SUITES PASSED SUCCESSFULLY!`);
  console.log('----------------------------------------------------------------\n');
  process.exit(0);
} else {
  console.error(`💥 ${failedSuites.length} TEST SUITE(S) FAILED:`);
  for (const f of failedSuites) {
    console.error(`\n--- Error in ${f.suite.name} ---`);
    console.error(f.error);
  }
  process.exit(1);
}
