/**
 * Phase 4 Automated Test Suite
 *
 * Tests the Authority Recommendation & Official Channel service across all 5 categories:
 * 1. Garbage
 * 2. Road/Pothole
 * 3. Streetlight
 * 4. Water
 * 5. Drainage
 */

import { recommendAuthority } from '../src/services/authorityService.js';

const expectedMappings = [
  {
    category: 'Garbage',
    expectedAuthority: 'Municipal Corporation / Local Urban Local Body',
    location: 'Rohini Sector 7',
    expectUrl: true,
  },
  {
    category: 'Road/Pothole',
    expectedAuthority: 'Municipal Corporation / Local Road Authority',
    location: 'MG Road, Gurugram',
    expectUrl: true,
  },
  {
    category: 'Streetlight',
    expectedAuthority: 'Local Municipal/Civic Authority',
    location: 'Indirapuram',
    expectUrl: false, // tests safe unconfigured fallback
  },
  {
    category: 'Water',
    expectedAuthority: 'Local Water Supply Authority',
    location: 'Lajpat Nagar',
    expectUrl: true,
  },
  {
    category: 'Drainage',
    expectedAuthority: 'Municipal Corporation / Local Sanitation Authority',
    location: 'Old Rajinder Nagar',
    expectUrl: false, // tests safe unconfigured fallback
  },
];

async function runPhase4Tests() {
  console.log('=== AI CIVIC ACCESS — PHASE 4 TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  for (const item of expectedMappings) {
    console.log(`--- Testing Category: ${item.category} ---`);
    const rec = recommendAuthority(item.category, item.location);

    let testValid = true;

    // 1. Check Authority Name
    if (rec.authority === item.expectedAuthority) {
      console.log(`✅ Authority: "${rec.authority}"`);
    } else {
      console.log(`❌ Expected authority "${item.expectedAuthority}", got "${rec.authority}"`);
      testValid = false;
    }

    // 2. Check Reason
    const expectedReason = 'This complaint appears to relate to a local civic service.';
    if (rec.reason === expectedReason) {
      console.log(`✅ Reason: "${rec.reason}"`);
    } else {
      console.log(`❌ Expected reason "${expectedReason}", got "${rec.reason}"`);
      testValid = false;
    }

    // 3. Check Disclaimer
    const expectedDisclaimer = 'AI recommendation. Please verify the authority before submitting.';
    if (rec.disclaimer === expectedDisclaimer) {
      console.log(`✅ Disclaimer: "${rec.disclaimer}"`);
    } else {
      console.log(`❌ Expected disclaimer "${expectedDisclaimer}", got "${rec.disclaimer}"`);
      testValid = false;
    }

    // 4. Check Location reflection
    if (rec.location === item.location) {
      console.log(`✅ Location preserved: "${rec.location}"`);
    } else {
      console.log(`❌ Expected location "${item.location}", got "${rec.location}"`);
      testValid = false;
    }

    // 5. Check Official Channel configuration
    if (item.expectUrl) {
      if (rec.officialPortalUrl && rec.officialPortalUrl.startsWith('https://')) {
        console.log(`✅ Verified Portal URL: ${rec.officialPortalUrl} (${rec.portalName})`);
      } else {
        console.log(`❌ Expected verified HTTPS portal URL, got ${rec.officialPortalUrl}`);
        testValid = false;
      }
    } else {
      if (rec.officialPortalUrl === null) {
        console.log(`✅ Unconfigured Portal Fallback: null (displays "Official portal link not configured yet.")`);
      } else {
        console.log(`❌ Expected null URL for unconfigured portal, got ${rec.officialPortalUrl}`);
        testValid = false;
      }
    }

    // 6. Grounding check: verify no fake URLs were fabricated
    if (rec.officialPortalUrl && !['https://pgportal.gov.in/'].includes(rec.officialPortalUrl)) {
      console.log(`❌ Unverified URL found: ${rec.officialPortalUrl}`);
      testValid = false;
    }

    if (testValid) {
      console.log(`✅ Category "${item.category}" passed all Phase 4 checks.\n`);
      passed++;
    } else {
      console.log(`❌ Category "${item.category}" failed checks.\n`);
      failed++;
    }
  }

  console.log(`=== SUMMARY: ${passed} passed, ${failed} failed out of ${expectedMappings.length} ===\n`);
  if (failed > 0) process.exit(1);
}

runPhase4Tests();
