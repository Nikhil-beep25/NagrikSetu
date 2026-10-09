/**
 * NagrikSetu - Phase 7 Government Service Navigator Test Suite
 *
 * Validates:
 * 1. Government service directory rendering & schema
 * 2. Service search
 * 3. State filtering
 * 4. Service detail navigation & routes
 * 5. Document checklist functionality
 * 6. Checklist persistence
 * 7. AI service intent detection
 * 8. Hindi input
 * 9. Hinglish input
 * 10. Unknown service handling
 * 11. Missing state handling
 * 12. Official portal link validation
 * 13. Appointment guidance
 * 14. Mobile navigation
 * 15. Existing complaint workflow compatibility
 * 16. The 5 specific verification scenarios from specifications
 */

import fs from 'fs';
import path from 'path';
import { GOVERNMENT_SERVICES_DIRECTORY } from '../src/data/governmentServicesDirectory.js';
import {
  getAllServices,
  getServiceById,
  normalizeState,
  detectServiceIntent,
  getChecklistStorageKey,
} from '../src/services/governmentServiceNavigator.js';

console.log('=== NAGRIKSETU GOVERNMENT SERVICE NAVIGATOR (PHASE 7) TEST SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ ${message}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Government Service Directory Rendering & Schema
// -----------------------------------------------------------------------------
console.log('\n--- 1. Service Directory Schema & Records ---');
assert(Array.isArray(GOVERNMENT_SERVICES_DIRECTORY), 'Directory is an array');
assert(GOVERNMENT_SERVICES_DIRECTORY.length >= 9, `Contains at least 9 verified services (Found: ${GOVERNMENT_SERVICES_DIRECTORY.length})`);

const requiredServiceIds = [
  'birth-certificate-delhi',
  'income-certificate-delhi',
  'caste-certificate-delhi',
  'domicile-certificate-delhi',
  'birth-certificate-up',
  'income-certificate-up',
  'caste-certificate-up',
  'domicile-certificate-up',
  'passport-services-india',
];

requiredServiceIds.forEach((id) => {
  const service = getServiceById(id);
  assert(service !== null, `Required service "${id}" exists in directory`);
  if (service) {
    assert(typeof service.name === 'string' && service.name.length > 0, `[${id}] Has valid name`);
    assert(typeof service.hiName === 'string' && service.hiName.length > 0, `[${id}] Has valid Hindi name`);
    assert(typeof service.department === 'string' && service.department.length > 0, `[${id}] Has department`);
    assert(Array.isArray(service.eligibility) && service.eligibility.length > 0, `[${id}] Has eligibility criteria`);
    assert(Array.isArray(service.requiredDocuments) && service.requiredDocuments.length > 0, `[${id}] Has required documents`);
    assert(Array.isArray(service.applicationSteps) && service.applicationSteps.length > 0, `[${id}] Has application steps`);
    assert(typeof service.appointmentRequired === 'boolean', `[${id}] Has appointmentRequired flag`);
    assert(typeof service.officialPortal === 'string' && service.officialPortal.startsWith('https://'), `[${id}] Has official portal URL`);
    assert(service.verificationStatus === 'Verified', `[${id}] Verification status is 'Verified'`);
    assert(typeof service.lastVerified === 'string' && service.lastVerified.length > 0, `[${id}] Has lastVerified date`);
  }
});

// -----------------------------------------------------------------------------
// 2. Service Search
// -----------------------------------------------------------------------------
console.log('\n--- 2. Service Search ---');
const incomeResults = getAllServices({ query: 'Income' });
assert(incomeResults.length >= 2, 'Search query "Income" returns both Delhi & UP Income Certificates');

const birthResultsHi = getAllServices({ query: 'जन्म' });
assert(birthResultsHi.length >= 2, 'Hindi search query "जन्म" returns Birth Certificates');

const passportResults = getAllServices({ query: 'Passport' });
assert(passportResults.some((s) => s.id === 'passport-services-india'), 'Search query "Passport" returns Passport Services');

// -----------------------------------------------------------------------------
// 3. State Filtering
// -----------------------------------------------------------------------------
console.log('\n--- 3. State Filtering ---');
const delhiServices = getAllServices({ state: 'Delhi' });
assert(delhiServices.every((s) => s.state === 'Delhi' || s.state === 'National'), 'Delhi filter only returns Delhi and National services');
assert(delhiServices.some((s) => s.id === 'birth-certificate-delhi'), 'Delhi filter includes birth-certificate-delhi');

const upServices = getAllServices({ state: 'Uttar Pradesh' });
assert(upServices.every((s) => s.state === 'Uttar Pradesh' || s.state === 'National'), 'UP filter only returns UP and National services');
assert(upServices.some((s) => s.id === 'income-certificate-up'), 'UP filter includes income-certificate-up');

const nationalServices = getAllServices({ state: 'National' });
assert(nationalServices.some((s) => s.id === 'passport-services-india'), 'National filter includes Passport services');

// -----------------------------------------------------------------------------
// 4. Service Detail Navigation & Routes
// -----------------------------------------------------------------------------
console.log('\n--- 4. Service Detail Navigation & Routes ---');
const appJsxPath = path.resolve('src/App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
assert(appJsxContent.includes('path="/services"'), 'App.jsx contains route "/services"');
assert(appJsxContent.includes('path="/services/:serviceId"'), 'App.jsx contains route "/services/:serviceId"');

const servicesPagePath = path.resolve('src/pages/ServicesPage.jsx');
assert(fs.existsSync(servicesPagePath), 'src/pages/ServicesPage.jsx exists');

const detailsPagePath = path.resolve('src/pages/ServiceDetailsPage.jsx');
assert(fs.existsSync(detailsPagePath), 'src/pages/ServiceDetailsPage.jsx exists');

// -----------------------------------------------------------------------------
// 5. Document Checklist Functionality
// -----------------------------------------------------------------------------
console.log('\n--- 5. Document Checklist Functionality ---');
const upIncome = getServiceById('income-certificate-up');
assert(upIncome.requiredDocuments.length >= 3, 'UP Income Certificate lists required documents');
const mandatoryDocs = upIncome.requiredDocuments.filter((d) => d.mandatory);
assert(mandatoryDocs.length >= 2, 'UP Income Certificate contains mandatory documents');
assert(upIncome.requiredDocuments.every((d) => typeof d.id === 'string' && typeof d.name === 'string'), 'Each document item has id and name');

// -----------------------------------------------------------------------------
// 6. Checklist Persistence
// -----------------------------------------------------------------------------
console.log('\n--- 6. Checklist Persistence ---');
const key = getChecklistStorageKey('income-certificate-delhi');
assert(key === 'nagriksetu_checklist_income-certificate-delhi', 'Checklist storage key generates correct prefix');

const detailsContent = fs.readFileSync(detailsPagePath, 'utf8');
assert(detailsContent.includes('saveStoredChecklist') && detailsContent.includes('resetStoredChecklist'), 'ServiceDetailsPage uses storage helpers for local checklist persistence');
assert(detailsContent.includes('Never upload or submit actual Aadhaar'), 'ServiceDetailsPage includes privacy disclaimer against document uploads');

// -----------------------------------------------------------------------------
// 7. AI Service Intent Detection
// -----------------------------------------------------------------------------
console.log('\n--- 7. AI Service Intent Detection ---');
const intentGeneral = detectServiceIntent('How can I apply for a birth certificate in Delhi?');
assert(intentGeneral.intent === 'government_service', 'Detects government service intent');
assert(intentGeneral.serviceId === 'birth-certificate-delhi', 'Correctly matches birth-certificate-delhi');

// -----------------------------------------------------------------------------
// 8. Hindi Input
// -----------------------------------------------------------------------------
console.log('\n--- 8. Hindi Input ---');
const intentHiBirth = detectServiceIntent('मुझे जन्म प्रमाण पत्र बनवाना है।', 'Delhi');
assert(intentHiBirth.serviceId === 'birth-certificate-delhi', 'Hindi "मुझे जन्म प्रमाण पत्र बनवाना है।" resolves to Delhi Birth Certificate when state is Delhi');

const intentHiDomicile = detectServiceIntent('मुझे निवास प्रमाण पत्र बनवाना है।', 'Uttar Pradesh');
assert(intentHiDomicile.serviceId === 'domicile-certificate-up', 'Hindi "मुझे निवास प्रमाण पत्र बनवाना है।" resolves to UP Domicile Certificate');

// -----------------------------------------------------------------------------
// 9. Hinglish Input
// -----------------------------------------------------------------------------
console.log('\n--- 9. Hinglish Input ---');
const intentHinglishPassport = detectServiceIntent('Passport banwane ke liye appointment kaise book kare?');
assert(intentHinglishPassport.serviceId === 'passport-services-india', 'Hinglish passport query matches passport-services-india');

const intentHinglishCaste = detectServiceIntent('Mera jati praman patra up me kaise banega?');
assert(intentHinglishCaste.serviceId === 'caste-certificate-up', 'Hinglish "Mera jati praman patra up me" matches caste-certificate-up');

// -----------------------------------------------------------------------------
// 10. Unknown Service Handling
// -----------------------------------------------------------------------------
console.log('\n--- 10. Unknown Service Handling ---');
const intentUnknown = detectServiceIntent('How do I apply for a commercial space rocket license in Mars?');
assert(intentUnknown.intent === 'unsupported', 'Returns unsupported intent for unknown service');
assert(intentUnknown.targetRoute === '/services', 'Redirects unsupported queries to /services directory');

// -----------------------------------------------------------------------------
// 11. Missing State Handling
// -----------------------------------------------------------------------------
console.log('\n--- 11. Missing State Handling ---');
const intentMissingState = detectServiceIntent('Mujhe income certificate banwana hai.');
assert(intentMissingState.requiresState === true, 'Flags requiresState: true when state is missing');
assert(intentMissingState.availableServices.length === 2, 'Offers Delhi and UP options for Income Certificate');

// Normalizing state
assert(normalizeState('delhi') === 'Delhi', 'Normalizes "delhi" to "Delhi"');
assert(normalizeState('Agra') === 'Uttar Pradesh', 'Normalizes "Agra" to "Uttar Pradesh"');
assert(normalizeState('up') === 'Uttar Pradesh', 'Normalizes "up" to "Uttar Pradesh"');

// -----------------------------------------------------------------------------
// 12. Official Portal Link Validation
// -----------------------------------------------------------------------------
console.log('\n--- 12. Official Portal Link Validation ---');
const verifiedPortals = GOVERNMENT_SERVICES_DIRECTORY.map((s) => s.officialPortal);
verifiedPortals.forEach((portal) => {
  assert(portal.startsWith('https://'), `Portal ${portal} uses secure HTTPS`);
  assert(
    portal.includes('.gov.in') ||
    portal.includes('.nic.in'),
    `Portal ${portal} belongs to verified government domain (.gov.in or .nic.in)`
  );
});

// -----------------------------------------------------------------------------
// 13. Appointment Guidance
// -----------------------------------------------------------------------------
console.log('\n--- 13. Appointment Guidance ---');
const passportService = getServiceById('passport-services-india');
assert(passportService.appointmentRequired === true, 'Passport service specifies appointmentRequired: true');
assert(passportService.appointmentDetails.bookingUrl.includes('passportindia.gov.in'), 'Passport service has verified booking link');
assert(passportService.appointmentDetails.guidance.length > 0, 'Passport service has appointment preparation guidelines');

const delhiBirth = getServiceById('birth-certificate-delhi');
assert(delhiBirth.appointmentRequired === false, 'Delhi Birth Certificate is 100% online (appointmentRequired: false)');

// -----------------------------------------------------------------------------
// 14. Mobile Navigation
// -----------------------------------------------------------------------------
console.log('\n--- 14. Mobile Navigation ---');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(navbarContent.includes('to="/services"'), 'Navbar contains link to "/services"');
assert(navbarContent.includes('Gov Services') || navbarContent.includes('सरकारी सेवाएं'), 'Navbar contains Gov Services navigation label');

// -----------------------------------------------------------------------------
// 15. Existing Complaint Workflow Compatibility
// -----------------------------------------------------------------------------
console.log('\n--- 15. Civic Grievance vs Gov Services Routing ---');
const potholeQuery = detectServiceIntent('How do I report a pothole in my street?');
assert(potholeQuery.intent === 'civic_complaint', 'Civic issue (pothole) detected as civic_complaint');
assert(potholeQuery.targetRoute === '/report', 'Pothole query directs to /report complaint workflow');

const garbageQuery = detectServiceIntent('Kachra saaf nahi hua do din se');
assert(garbageQuery.intent === 'civic_complaint', 'Garbage complaint detected as civic_complaint');
assert(garbageQuery.targetRoute === '/report', 'Garbage complaint directs to /report');

// -----------------------------------------------------------------------------
// 16. The 5 Specific Verification Scenarios
// -----------------------------------------------------------------------------
console.log('\n--- 16. Verification of the 5 Mandatory Scenarios ---');

// SCENARIO 1: Citizen: "Mujhe income certificate banwana hai."
// Expected: Identifies Income Certificate and asks for relevant state if missing.
const scenario1 = detectServiceIntent('Mujhe income certificate banwana hai.');
assert(
  scenario1.serviceType === 'Income Certificate' && scenario1.requiresState === true,
  'Scenario 1 Passed: "Mujhe income certificate banwana hai." identifies Income Certificate and prompts for state'
);

// SCENARIO 2: Citizen: "मुझे जन्म प्रमाण पत्र बनवाना है।"
// Expected: Birth Certificate service guidance.
const scenario2 = detectServiceIntent('मुझे जन्म प्रमाण पत्र बनवाना है।');
assert(
  scenario2.serviceType === 'Birth Certificate',
  'Scenario 2 Passed: "मुझे जन्म प्रमाण पत्र बनवाना है।" identifies Birth Certificate guidance'
);

// SCENARIO 3: Citizen: "How do I book a passport appointment?"
// Expected: Verified passport appointment process and official link.
const scenario3 = detectServiceIntent('How do I book a passport appointment?');
assert(
  scenario3.serviceId === 'passport-services-india' &&
  scenario3.matchedService.appointmentRequired === true &&
  scenario3.matchedService.appointmentDetails.bookingUrl.includes('passportindia.gov.in'),
  'Scenario 3 Passed: "How do I book a passport appointment?" returns verified appointment process and official MEA link'
);

// SCENARIO 4: Citizen: "What documents do I need for a domicile certificate?"
// Expected: State-specific document checklist based on verified data.
const scenario4Delhi = detectServiceIntent('What documents do I need for a domicile certificate in Delhi?');
assert(
  scenario4Delhi.serviceId === 'domicile-certificate-delhi' &&
  scenario4Delhi.matchedService.requiredDocuments.length > 0,
  'Scenario 4 Passed (Delhi): Domicile document checklist returned based on verified data'
);
const scenario4UP = detectServiceIntent('What documents do I need for a domicile certificate in Agra?');
assert(
  scenario4UP.serviceId === 'domicile-certificate-up' &&
  scenario4UP.matchedService.requiredDocuments.length > 0,
  'Scenario 4 Passed (UP/Agra): Domicile document checklist returned based on verified data'
);

// SCENARIO 5: Citizen: "How do I report a pothole?"
// Expected: Direct the citizen to the existing complaint workflow, not the government service directory.
const scenario5 = detectServiceIntent('How do I report a pothole?');
assert(
  scenario5.intent === 'civic_complaint' && scenario5.targetRoute === '/report',
  'Scenario 5 Passed: "How do I report a pothole?" directs to existing /report complaint workflow'
);

// -----------------------------------------------------------------------------
// Backend API Endpoint Simulation (POST /api/find-government-service)
// -----------------------------------------------------------------------------
console.log('\n--- 17. Backend API Route Implementation Verification ---');
const serverIndexPath = path.resolve('server/index.js');
const serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
assert(serverIndexContent.includes('/api/find-government-service'), 'server/index.js contains POST /api/find-government-service route');

const geminiServicePath = path.resolve('server/geminiService.js');
const geminiServiceContent = fs.readFileSync(geminiServicePath, 'utf8');
assert(geminiServiceContent.includes('findGovernmentServiceWithGemini'), 'server/geminiService.js implements findGovernmentServiceWithGemini function');

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed out of ${passed + failed} ===\n`);
if (failed > 0) process.exit(1);
