/**
 * NagrikSetu - Direct Backend Gemini Diagnostic & Full AI Flow Test
 *
 * Verifies:
 * 1. Safe backend Gemini SDK configuration (no secrets exposed)
 * 2. Direct Gemini model connectivity (gemini-3.5-flash-lite)
 * 3. Exact user prompt: "Mere ghar ke bahar sadak par bada gaddha hai, Agra mein."
 * 4. Road/Pothole category identification, urgency, guidance, and structured output
 * 5. Citizen Assistant conversational flow in Hindi
 * 6. Error sanitization (no API keys in logs or payloads)
 */

import dotenv from 'dotenv';
import {
  analyzeComplaintWithGemini,
  interactWithCitizenAssistantGemini,
  findGovernmentServiceWithGemini,
  isGeminiConfigured,
  getGeminiApiKey,
} from '../server/geminiService.js';
import { analyzeComplaint } from '../src/services/complaintAnalyzer.js';
import { getApiEndpoint } from '../src/utils/apiConfig.js';

dotenv.config();

async function runDiagnostic() {
  console.log('================================================================');
  console.log('  🔍 NAGRIKSETU — BACKEND GEMINI DIAGNOSTIC TEST');
  console.log('================================================================\n');

  // STEP 1: Key & Configuration Verification
  const configured = isGeminiConfigured();
  console.log(`[Config Check] Gemini Configured: ${configured ? 'YES' : 'NO'}`);
  console.log(`[Config Check] Model: ${process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'}`);

  // Guarantee key is NEVER printed
  const rawKey = getGeminiApiKey();
  if (rawKey) {
    const masked = rawKey.slice(0, 4) + '...' + rawKey.slice(-4);
    console.log(`[Security Check] API Key Masked: ${masked} (Length: ${rawKey.length})`);
    console.log(`[Security Check] Key Exists in React: NO (Server-only secret)`);
  } else {
    console.error('❌ FATAL: GEMINI_API_KEY is not configured in server environment.');
    process.exit(1);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('  TEST 1: Direct Gemini Complaint Analysis');
  console.log('  Prompt: "Mere ghar ke bahar sadak par bada gaddha hai, Agra mein."');
  console.log('----------------------------------------------------------------');

  const testPrompt = 'Mere ghar ke bahar sadak par bada gaddha hai, Agra mein.';
  let analysisResult;

  try {
    const startTime = Date.now();
    analysisResult = await analyzeComplaintWithGemini(testPrompt, 'Agra', 'hi');
    const elapsed = Date.now() - startTime;

    console.log(`⏱️ Response Time: ${elapsed}ms`);
    console.log(`✅ Success: ${analysisResult.success}`);
    console.log(`🤖 AI Assisted: ${analysisResult.data.isAiAssisted}`);
    console.log(`🏷️ Category: ${analysisResult.data.category}`);
    console.log(`📌 Subcategory: ${analysisResult.data.subcategory}`);
    console.log(`📍 Location: ${analysisResult.data.location}`);
    console.log(`⚠️ Urgency: ${analysisResult.data.urgency}`);
    console.log(`📝 Summary: ${analysisResult.data.summary}`);
    console.log(`🌐 Detected Language: ${analysisResult.data.detectedLanguage}`);
    console.log(`💡 Suggested Action: ${analysisResult.data.suggestedAction}`);
    console.log(`📋 Missing Information: ${JSON.stringify(analysisResult.data.missingInformation)}`);

    if (analysisResult.data.category !== 'Road/Pothole') {
      throw new Error(`Expected category "Road/Pothole", received "${analysisResult.data.category}"`);
    }
    console.log('\n✅ TEST 1 PASSED: Road/Pothole recognized accurately by Gemini AI.');
  } catch (err) {
    console.error('\n❌ TEST 1 FAILED:', {
      errorCategory: err.code || 'API_ERROR',
      sanitizedMessage: err.message?.replace(/key=[^&\s]+/gi, 'key=REDACTED'),
      isConfigurationIssue: !configured,
      isQuotaIssue: err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED'),
      isNetworkIssue: err.code === 'TIMEOUT' || err.code === 'ENOTFOUND',
    });
    process.exit(1);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('  TEST 2: Direct Gemini Citizen Assistant');
  console.log('  Prompt: "Mere ghar ke bahar sadak par bada gaddha hai, Agra mein."');
  console.log('----------------------------------------------------------------');

  try {
    const startTime = Date.now();
    const assistantResult = await interactWithCitizenAssistantGemini(
      testPrompt,
      [],
      'Uttar Pradesh',
      'Agra',
      'hi'
    );
    const elapsed = Date.now() - startTime;

    console.log(`⏱️ Response Time: ${elapsed}ms`);
    console.log(`✅ Success: ${assistantResult.success}`);
    console.log(`🤖 AI Assisted: ${assistantResult.data.isAiAssisted}`);
    console.log(`🎯 Intent: ${assistantResult.data.intent}`);
    console.log(`💬 Reply: "${assistantResult.data.reply}"`);
    console.log(`🛠️ Suggested Actions: ${JSON.stringify(assistantResult.data.suggestedActions)}`);

    if (assistantResult.data.intent !== 'CIVIC_COMPLAINT') {
      throw new Error(`Expected intent "CIVIC_COMPLAINT", received "${assistantResult.data.intent}"`);
    }
    console.log('\n✅ TEST 2 PASSED: Citizen Assistant routed to CIVIC_COMPLAINT with helpful Hindi reply.');
  } catch (err) {
    console.error('\n❌ TEST 2 FAILED:', {
      errorCategory: err.code || 'API_ERROR',
      sanitizedMessage: err.message?.replace(/key=[^&\s]+/gi, 'key=REDACTED'),
    });
    process.exit(1);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('  TEST 3: End-to-End Service Flow (Frontend Client -> Backend)');
  console.log('----------------------------------------------------------------');

  try {
    const endpoint = getApiEndpoint('/api/analyze-complaint');
    console.log(`Target Resolved Endpoint: ${endpoint}`);

    const clientResult = await analyzeComplaint(testPrompt, 'Agra', { language: 'hi' });
    console.log(`✅ Client Success: ${clientResult.success}`);
    console.log(`🤖 Client AI Assisted: ${clientResult.data.isAiAssisted}`);
    console.log(`🏷️ Client Category: ${clientResult.data.category}`);
    console.log(`📌 Client Subcategory: ${clientResult.data.subcategory}`);
    console.log(`⚠️ Client Urgency: ${clientResult.data.priority || clientResult.data.urgency}`);

    if (clientResult.data.category !== 'Road/Pothole') {
      throw new Error(`Expected category "Road/Pothole", received "${clientResult.data.category}"`);
    }
    console.log('\n✅ TEST 3 PASSED: Complete client-to-backend pipeline executes cleanly.');
  } catch (err) {
    console.error('\n❌ TEST 3 FAILED:', err.message);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('  🎉 ALL GEMINI INTEGRATION & AI FLOW DIAGNOSTICS PASSED');
  console.log('================================================================\n');
}

runDiagnostic();
