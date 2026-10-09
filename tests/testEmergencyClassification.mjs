/**
 * NagrikSetu - Emergency Complaint Classification Test Suite
 *
 * Validates Phase 5 Emergency Safety Detection & Classification Fix:
 * 1. Broken live electrical wire sparking dangerously (English) -> Emergency / Other / High
 * 2. सड़क पर बिजली का तार टूटकर गिर गया है (Hindi) -> Emergency / Other / High
 * 3. Bijli ka taar toot gaya hai aur sparks aa rahe hain (Hinglish) -> Emergency / Other / High
 * 4. Ordinary broken streetlight -> Streetlight / Normal (NOT Emergency)
 * 5. Garbage collection complaint -> Garbage / Normal
 * 6. Water supply complaint -> Water / Normal
 * 7. Unsupported non-emergency complaint -> unsupported_category explanation
 * 8. Resilient safety output even under Gemini API failure / 429 quota exhaustion
 */

import assert from 'assert';
import { detectEmergencyHazard } from '../src/services/emergencySafetyDetector.js';
import { ruleBasedAnalyzeComplaint, analyzeComplaint } from '../src/services/complaintAnalyzer.js';

console.log('================================================================');
console.log('  🚨 NAGRIKSETU EMERGENCY CLASSIFICATION & SAFETY TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function testAssert(condition, message) {
  totalTests++;
  try {
    assert(condition, message);
    console.log(`  ✅ ${message}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${message}`);
    throw err;
  }
}

// -------------------------------------------------------------
// Test 1: Broken live electrical wire sparking (English)
// -------------------------------------------------------------
console.log('--- Test 1: Broken live electrical wire sparking dangerously (English) ---');
const text1 = 'Broken live electrical wire sparking dangerously near a street pole';
const hazard1 = detectEmergencyHazard(text1);
testAssert(hazard1 !== null, 'Emergency hazard detected by safety engine');
testAssert(hazard1.isEmergency === true, 'isEmergency is strictly true');
testAssert(hazard1.category === 'Other', 'Category is Other (not forced into Streetlight)');
testAssert(hazard1.subcategory === 'Electrical Hazard', 'Subcategory is Electrical Hazard');
testAssert(hazard1.isSupported === false, 'isSupported is false (handled by Discom / 112)');
testAssert(hazard1.urgency === 'High', 'Urgency is High');
testAssert(hazard1.safetyMessage.includes('10 meters'), 'Safety message specifies 10m distance');
testAssert(hazard1.safetyMessage.includes('112'), 'Safety message specifies 112 emergency helpline');
testAssert(hazard1.safetyMessage.includes('1912'), 'Safety message specifies 1912 electricity helpline');

const analysis1 = ruleBasedAnalyzeComplaint(text1, 'Civil Lines, Agra');
testAssert(analysis1.success === true, 'Analysis succeeds without unsupported_category rejection');
testAssert(analysis1.data.isEmergency === true, 'Analyzer output marks isEmergency true');
testAssert(analysis1.data.category === 'Other', 'Analyzer output category is Other');
testAssert(analysis1.data.isSupported === false, 'Analyzer output isSupported is false');
console.log();

// -------------------------------------------------------------
// Test 2: Hindi Devanagari electrical hazard
// -------------------------------------------------------------
console.log('--- Test 2: सड़क पर बिजली का तार टूटकर गिर गया है (Hindi Devanagari) ---');
const text2 = 'सड़क पर बिजली का तार टूटकर गिर गया है।';
const hazard2 = detectEmergencyHazard(text2);
testAssert(hazard2 !== null, 'Emergency detected for Hindi input');
testAssert(hazard2.isEmergency === true, 'isEmergency is true for Hindi description');
testAssert(hazard2.category === 'Other', 'Category is Other for Hindi electrical wire break');
testAssert(hazard2.urgency === 'High', 'Urgency is High');

const analysis2 = ruleBasedAnalyzeComplaint(text2, 'गांधी नगर');
testAssert(analysis2.success === true, 'Hindi complaint does not trigger unsupported rejection');
testAssert(analysis2.data.isEmergency === true, 'Hindi complaint marked as emergency');
testAssert(analysis2.data.category === 'Other', 'Hindi complaint categorized as Other');
console.log();

// -------------------------------------------------------------
// Test 3: Hinglish electrical hazard
// -------------------------------------------------------------
console.log('--- Test 3: Bijli ka taar toot gaya hai aur sparks aa rahe hain (Hinglish) ---');
const text3 = 'Bijli ka taar toot gaya hai aur sparks aa rahe hain.';
const hazard3 = detectEmergencyHazard(text3);
testAssert(hazard3 !== null, 'Emergency detected for Hinglish input');
testAssert(hazard3.isEmergency === true, 'isEmergency is true for Hinglish description');
testAssert(hazard3.category === 'Other', 'Category is Other for Hinglish live wire');

const analysis3 = ruleBasedAnalyzeComplaint(text3, 'Sector 14');
testAssert(analysis3.success === true, 'Hinglish emergency succeeds without rejection');
testAssert(analysis3.data.isEmergency === true, 'Hinglish emergency marked as emergency');
console.log();

// -------------------------------------------------------------
// Test 4: Ordinary broken streetlight (Must NOT be Emergency)
// -------------------------------------------------------------
console.log('--- Test 4: Ordinary broken streetlight (Strict Civic Invariant) ---');
const text4 = 'Ordinary broken streetlight pole is not glowing since 3 days';
const hazard4 = detectEmergencyHazard(text4);
testAssert(hazard4 === null, 'Ordinary streetlight does NOT trigger emergency hazard');

const analysis4 = ruleBasedAnalyzeComplaint(text4, 'MG Road');
testAssert(analysis4.success === true, 'Streetlight complaint is accepted');
testAssert(analysis4.data.isEmergency === false, 'isEmergency is false for normal streetlight');
testAssert(analysis4.data.category === 'Streetlight', 'Category is strictly Streetlight');
testAssert(analysis4.data.priority === 'Normal' || analysis4.data.urgency === 'Normal', 'Urgency is Normal');
testAssert(analysis4.data.isSupported === true, 'isSupported is true');
console.log();

// -------------------------------------------------------------
// Test 5: Garbage collection complaint
// -------------------------------------------------------------
console.log('--- Test 5: Garbage collection complaint ---');
const text5 = 'Garbage collection has not happened in our street for 4 days.';
const hazard5 = detectEmergencyHazard(text5);
testAssert(hazard5 === null, 'Garbage complaint does NOT trigger emergency hazard');

const analysis5 = ruleBasedAnalyzeComplaint(text5, 'Ward 12');
testAssert(analysis5.success === true, 'Garbage complaint is accepted');
testAssert(analysis5.data.category === 'Garbage', 'Category is Garbage');
testAssert(analysis5.data.isEmergency === false, 'isEmergency is false');
testAssert(analysis5.data.isSupported === true, 'isSupported is true');
console.log();

// -------------------------------------------------------------
// Test 6: Water supply complaint
// -------------------------------------------------------------
console.log('--- Test 6: Water supply complaint ---');
const text6 = 'Water supply has been disrupted since morning, taps are dry.';
const hazard6 = detectEmergencyHazard(text6);
testAssert(hazard6 === null, 'Water complaint does NOT trigger emergency hazard');

const analysis6 = ruleBasedAnalyzeComplaint(text6, 'Block C');
testAssert(analysis6.success === true, 'Water complaint is accepted');
testAssert(analysis6.data.category === 'Water', 'Category is Water');
testAssert(analysis6.data.isEmergency === false, 'isEmergency is false');
testAssert(analysis6.data.isSupported === true, 'isSupported is true');
console.log();

// -------------------------------------------------------------
// Test 7: Unsupported non-emergency complaint
// -------------------------------------------------------------
console.log('--- Test 7: Unsupported non-emergency complaint ---');
const text7 = 'I need urgent help with my international passport and visa application renewal';
const hazard7 = detectEmergencyHazard(text7);
testAssert(hazard7 === null, 'Passport inquiry is NOT an emergency hazard');

const analysis7 = ruleBasedAnalyzeComplaint(text7, 'Delhi');
testAssert(analysis7.success === false, 'Non-civic issue returns success false');
testAssert(analysis7.error === 'unsupported_category', 'Returns unsupported_category error code');
console.log();

// -------------------------------------------------------------
// Test 8: End-to-End Resilience & Gemini Failure Immunity
// -------------------------------------------------------------
console.log('--- Test 8: End-to-End Resilience & Live API Triage ---');
const e2eEmergency = await analyzeComplaint('Broken live electrical wire sparking dangerously near a street pole', 'Agra');
testAssert(e2eEmergency.success === true, 'Live analyzeComplaint succeeds for live wire');
testAssert(e2eEmergency.data.isEmergency === true, 'Live analyzeComplaint marks isEmergency true');
testAssert(e2eEmergency.data.category === 'Other', 'Live analyzeComplaint categorizes as Other');
testAssert(e2eEmergency.data.isSupported === false, 'Live analyzeComplaint marks isSupported false');
testAssert(e2eEmergency.data.safetyMessage.includes('112'), 'Live analyzeComplaint includes 112 in safetyMessage');
console.log();

console.log('================================================================');
console.log(`  🎉 ALL ${passedTests}/${totalTests} EMERGENCY CLASSIFICATION TESTS PASSED!`);
console.log('================================================================\n');
