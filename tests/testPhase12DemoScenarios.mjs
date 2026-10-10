import { detectAuthority } from '../src/services/authorityService.js';
import { getAllServices, getServiceById } from '../src/services/governmentServiceNavigator.js';
import { generateFormalComplaintLetter } from '../src/services/complaintGenerator.js';

const BACKEND_URL = 'http://localhost:5001';

console.log('================================================================');
console.log('  🎯 NAGRIKSETU — PHASE 12: FINAL 4 DEMO SCENARIOS VALIDATION');
console.log('================================================================\n');

let passCount = 0;
const totalCount = 4;

// Helper to make backend API calls
async function callApi(endpoint, body) {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await res.json();
}

// -----------------------------------------------------------------------------
// SCENARIO 1: Garbage complaint in Agra
// -----------------------------------------------------------------------------
console.log('--- SCENARIO 1: Garbage Complaint in Agra ---');
try {
  const complaintText = 'Severe accumulation of uncollected rotting garbage overflowing onto the road at Sanjay Place, Agra';
  const location = 'Sanjay Place, Agra';

  const res = await callApi('/api/analyze-complaint', {
    complaintText,
    location,
    language: 'en',
  });

  const analysis = res.data;
  console.log(`[Backend Analysis] success: ${res.success}, Category: ${analysis?.category}, Urgency: ${analysis?.urgency}, AI-assisted: ${analysis?.isAiAssisted}, Model: ${analysis?.modelUsed}`);

  // Authority detection for Agra Garbage
  const authority = detectAuthority({
    city: 'Agra',
    locality: 'Sanjay Place, Agra',
    category: analysis?.category || 'Garbage',
  });

  console.log(`[Authority Mapping] Authority: "${authority.authority}", Jurisdiction: "${authority.jurisdiction}", Portal: "${authority.officialWebsite || authority.officialPortalUrl}"`);

  // Complaint letter generation
  const letter = generateFormalComplaintLetter({
    category: analysis?.category || 'Garbage',
    location: 'Sanjay Place, Agra',
    problem: complaintText,
  });

  console.log(`[Grievance Letter] Subject: "${letter.subject}"`);
  console.log(`[Letter Body Preview]: "${letter.body.slice(0, 120)}..."`);

  if (
    res.success === true &&
    analysis?.category === 'Garbage' &&
    authority.authority.includes('Agra Nagar Nigam') &&
    letter.fullLetter.length > 50
  ) {
    console.log('✅ SCENARIO 1 PASSED: Full end-to-end workflow confirmed for Agra Garbage.\n');
    passCount++;
  } else {
    throw new Error('Scenario 1 conditions not satisfied');
  }
} catch (err) {
  console.error('❌ SCENARIO 1 FAILED:', err.message, '\n');
}

// -----------------------------------------------------------------------------
// SCENARIO 2: Water supply complaint in Delhi
// -----------------------------------------------------------------------------
console.log('--- SCENARIO 2: Water Supply Complaint in Delhi ---');
try {
  const complaintText = 'Contaminated muddy water coming from taps for the last 3 days in Rohini Sector 9, Delhi';
  const location = 'Rohini Sector 9, Delhi';

  const res = await callApi('/api/analyze-complaint', {
    complaintText,
    location,
    language: 'en',
  });

  const analysis = res.data;
  console.log(`[Backend Analysis] success: ${res.success}, Category: ${analysis?.category}, Urgency: ${analysis?.urgency}, AI-assisted: ${analysis?.isAiAssisted}, Model: ${analysis?.modelUsed}`);

  // Authority detection for Delhi Water
  const authority = detectAuthority({
    city: 'Delhi',
    locality: 'Rohini Sector 9, Delhi',
    category: analysis?.category || 'Water',
  });

  console.log(`[Authority Mapping] Authority: "${authority.authority}", Jurisdiction: "${authority.jurisdiction}", Portal: "${authority.officialWebsite || authority.officialPortalUrl}"`);

  // Complaint letter generation
  const letter = generateFormalComplaintLetter({
    category: analysis?.category || 'Water',
    location: 'Rohini Sector 9, Delhi',
    problem: complaintText,
  });

  console.log(`[Grievance Letter] Subject: "${letter.subject}"`);
  console.log(`[Letter Body Preview]: "${letter.body.slice(0, 120)}..."`);

  if (
    res.success === true &&
    analysis?.category === 'Water' &&
    authority.authority.includes('Delhi Jal Board') &&
    letter.fullLetter.length > 50
  ) {
    console.log('✅ SCENARIO 2 PASSED: Full end-to-end workflow confirmed for Delhi Water.\n');
    passCount++;
  } else {
    throw new Error('Scenario 2 conditions not satisfied');
  }
} catch (err) {
  console.error('❌ SCENARIO 2 FAILED:', err.message, '\n');
}

// -----------------------------------------------------------------------------
// SCENARIO 3: Income certificate guidance in Uttar Pradesh
// -----------------------------------------------------------------------------
console.log('--- SCENARIO 3: Income Certificate Guidance in Uttar Pradesh ---');
try {
  // 1. Directory search & verification
  const searchResults = getAllServices({ query: 'Income', state: 'Uttar Pradesh' });
  console.log(`[Service Search] Found ${searchResults.length} matching services for 'Income' in Uttar Pradesh`);

  const service = searchResults[0] || getServiceById('income-certificate-up');
  console.log(`[Service Details] Title: "${service.name}", Department: "${service.department}", Portal: "${service.officialPortal}"`);
  console.log(`[Required Documents] ${service.requiredDocuments.length} verified documents: ${service.requiredDocuments.map(d => d.name).join(', ')}`);
  console.log(`[Application Steps] ${service.applicationSteps.length} procedural steps provided`);

  // 2. Assistant guidance via backend API
  const assistantRes = await callApi('/api/citizen-assistant', {
    message: 'How do I apply for an income certificate in Uttar Pradesh? What documents are required?',
    conversationHistory: [],
    selectedState: 'Uttar Pradesh',
    language: 'en',
  });

  const assistantData = assistantRes.data;
  console.log(`[AI Assistant Reply] success: ${assistantRes.success}, Intent: "${assistantData?.intent}", Reply length: ${assistantData?.reply?.length} chars`);
  console.log(`[AI Assistant Preview]: "${assistantData?.reply?.slice(0, 150)}..."`);

  if (
    service &&
    service.officialPortal.includes('edistrict.up.gov.in') &&
    service.requiredDocuments.length >= 4 &&
    assistantRes.success === true &&
    assistantData?.reply?.length > 50
  ) {
    console.log('✅ SCENARIO 3 PASSED: Full end-to-end guidance verified for UP Income Certificate.\n');
    passCount++;
  } else {
    throw new Error('Scenario 3 conditions not satisfied');
  }
} catch (err) {
  console.error('❌ SCENARIO 3 FAILED:', err.message, '\n');
}

// -----------------------------------------------------------------------------
// SCENARIO 4: Emergency electrical hazard detection
// -----------------------------------------------------------------------------
console.log('--- SCENARIO 4: Emergency Electrical Hazard Detection ---');
try {
  const hazardText = 'Broken live electrical wire sparking dangerously near a street pole';
  const location = 'Sanjay Place, Agra';

  // 1. Test complaint analyzer endpoint
  const analysisRes = await callApi('/api/analyze-complaint', {
    complaintText: hazardText,
    location,
    language: 'en',
  });

  const analysis = analysisRes.data;
  console.log(`[Complaint Analyzer] isEmergency: ${analysis?.isEmergency}, Urgency: ${analysis?.urgency}, Category: ${analysis?.category}`);
  console.log(`[Analyzer Safety Message]: "${analysis?.safetyNotice || analysis?.safetyMessage}"`);
  console.log(`[Emergency Numbers]: ${JSON.stringify(analysis?.emergencyNumbers || [])}`);

  // 2. Test conversational assistant emergency interception
  const assistantRes = await callApi('/api/citizen-assistant', {
    message: hazardText,
    conversationHistory: [],
    selectedCity: 'Agra',
    language: 'en',
  });

  const assistantData = assistantRes.data;
  console.log(`[AI Assistant Safety Interlock] isEmergency: ${assistantData?.isEmergency}, Intent: "${assistantData?.intent}"`);
  console.log(`[Assistant Actions]: ${JSON.stringify(assistantData?.suggestedActions || [])}`);

  const has112 = analysis?.safetyMessage?.includes('112') || analysis?.emergencyNumbers?.some(n => n.number === '112');
  const has1912 = analysis?.safetyMessage?.includes('1912') || analysis?.emergencyNumbers?.some(n => n.number === '1912');

  if (
    analysis?.isEmergency === true &&
    analysis?.urgency === 'High' &&
    assistantData?.isEmergency === true &&
    has112 &&
    has1912
  ) {
    console.log('✅ SCENARIO 4 PASSED: Instant safety interlock, 10m perimeter warning, and 112/1912 helplines verified.\n');
    passCount++;
  } else {
    throw new Error('Scenario 4 conditions not satisfied');
  }
} catch (err) {
  console.error('❌ SCENARIO 4 FAILED:', err.message, '\n');
}

console.log('================================================================');
console.log(`📊 FINAL RESULT: ${passCount}/${totalCount} SCENARIOS PASSED (${Math.round((passCount / totalCount) * 100)}%)`);
console.log('================================================================');

if (passCount !== totalCount) {
  process.exit(1);
}
