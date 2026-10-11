/**
 * NagrikSetu - Backend API Server
 *
 * Minimal, production-oriented Express backend for NagrikSetu.
 * Acts as the secure proxy between the React frontend and Google Gemini API.
 *
 * Security & Reliability:
 * - Keeps GEMINI_API_KEY secure on the server.
 * - Enforces request size limits and basic IP rate limiting.
 * - Handles Gemini timeouts, missing keys, and unexpected errors cleanly.
 * - Signals fallback to the frontend without failing the citizen workflow.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  analyzeComplaintWithGemini,
  findGovernmentServiceWithGemini,
  interactWithCitizenAssistantGemini,
  isGeminiConfigured,
} from './geminiService.js';
import { detectEmergencyHazard } from '../src/services/emergencySafetyDetector.js';
import { detectServiceIntent } from '../src/services/governmentServiceNavigator.js';
import { processAssistantMessage } from '../src/services/unifiedAssistantEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. mobile, curl, server-to-server) or when wildcard / unconstrained
      if (!origin || !allowedOrigins || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '500kb' }));

// In-memory sliding-window IP rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40;
const ipRequestHistory = new Map();

function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  const history = ipRequestHistory.get(ip) || [];
  const recent = history.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      fallbackRequired: true,
      error: 'rate_limited',
      message: 'Too many requests. Please wait a moment before trying again.',
    });
  }

  recent.push(now);
  ipRequestHistory.set(ip, recent);
  next();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NagrikSetu AI Engine',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Helper to construct emergency response from deterministic safety detector
function buildEmergencyPayload(hazard, text, loc, modelName = 'gemini-3.5-flash', isAi = false) {
  return {
    category: hazard.category,
    subcategory: hazard.subcategory,
    summary: text,
    originalDescription: text,
    location: loc || null,
    duration: null,
    urgency: 'High',
    urgencyReason: 'Immediate acute public safety hazard detected.',
    detectedLanguage: 'Multilingual / Indic',
    missingInformation: loc ? [] : ['Exact landmark or location of hazard'],
    suggestedAction: hazard.guidanceSteps?.[2] || 'Contact emergency services (112) immediately.',
    isCivicComplaint: true,
    isEmergency: true,
    isSupported: hazard.isSupported,
    hazardType: hazard.hazardType,
    safetyMessage: hazard.safetyMessage,
    guidanceSteps: hazard.guidanceSteps,
    emergencyNumbers: hazard.emergencyNumbers,
    safetyNotice: hazard.safetyMessage,
    isAiAssisted: isAi,
    isFallback: !isAi,
    modelUsed: modelName,
  };
}

// Analyze complaint endpoint
app.post('/api/analyze-complaint', rateLimitMiddleware, async (req, res) => {
  const { complaintText, location, language } = req.body || {};

  // 1. Input validation
  if (!complaintText || typeof complaintText !== 'string' || !complaintText.trim()) {
    return res.status(400).json({
      success: false,
      fallbackRequired: false,
      error: 'empty_complaint',
      message: 'Complaint description cannot be empty.',
    });
  }

  const trimmedText = complaintText.trim();
  if (trimmedText.length > 3000) {
    return res.status(400).json({
      success: false,
      fallbackRequired: false,
      error: 'input_too_long',
      message: 'Complaint text is too long (maximum 3000 characters).',
    });
  }

  const safeLocation = typeof location === 'string' ? location.slice(0, 300).trim() : '';

  // 2. Pre-flight deterministic emergency safety detector
  const emergencyHazard = detectEmergencyHazard(trimmedText);

  // 3. Check if Gemini credentials are configured
  if (!isGeminiConfigured()) {
    if (emergencyHazard) {
      return res.status(200).json({
        success: true,
        data: buildEmergencyPayload(emergencyHazard, trimmedText, safeLocation, 'deterministic-safety-engine', false),
      });
    }

    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      error: 'missing_api_key',
      message: 'Gemini API key is not configured on the server. Please activate fallback analyzer.',
    });
  }

  // 4. Call Gemini API
  try {
    const analysis = await analyzeComplaintWithGemini(trimmedText, safeLocation, language || 'en');

    // If either Gemini or deterministic detector flags an emergency, deliver emergency payload immediately
    if (analysis.data.isEmergency || emergencyHazard) {
      return res.status(200).json({
        success: true,
        data: {
          ...analysis.data,
          ...(emergencyHazard ? {
            isEmergency: true,
            isSupported: emergencyHazard.isSupported,
            hazardType: emergencyHazard.hazardType,
            category: emergencyHazard.category,
            subcategory: emergencyHazard.subcategory,
            safetyMessage: emergencyHazard.safetyMessage,
            guidanceSteps: emergencyHazard.guidanceSteps,
            emergencyNumbers: emergencyHazard.emergencyNumbers,
            safetyNotice: emergencyHazard.safetyMessage,
          } : {}),
        },
      });
    }

    // Only non-emergency unsupported requests are returned as unsupported_category
    if (!analysis.data.isCivicComplaint || analysis.data.category === 'Unsupported') {
      return res.status(200).json({
        success: false,
        fallbackRequired: false,
        error: 'unsupported_category',
        message: 'This complaint does not fall into one of the supported municipal civic categories.',
        data: analysis.data,
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis.data,
    });
  } catch (err) {
    console.error('[NagrikSetu Backend] Gemini Analysis Failed:', err.message || err);

    // If Gemini fails (429 rate limit, timeout, etc.) and an emergency is detected, guarantee safety output
    if (emergencyHazard) {
      return res.status(200).json({
        success: true,
        data: buildEmergencyPayload(emergencyHazard, trimmedText, safeLocation, process.env.GEMINI_MODEL || 'gemini-3.5-flash', false),
      });
    }

    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      error: err.code || 'gemini_error',
      message: 'Gemini AI processing encountered an issue. Fallback to rule-based analysis required.',
    });
  }
});

// Find government service endpoint (Phase 7 Service Navigator)
app.post('/api/find-government-service', rateLimitMiddleware, async (req, res) => {
  const { query, state, language } = req.body || {};

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      success: false,
      error: 'empty_query',
      message: 'Search query cannot be empty.',
    });
  }

  const safeQuery = query.trim().slice(0, 1000);
  const safeState = typeof state === 'string' ? state.trim().slice(0, 100) : null;

  // 1. Run deterministic ground-truth parser first
  const deterministicResult = detectServiceIntent(safeQuery, safeState);

  // If deterministicResult recognized an acute civic complaint (e.g. pothole / garbage)
  if (deterministicResult.intent === 'civic_complaint') {
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
      },
    });
  }

  // 2. Check if Gemini is configured
  if (!isGeminiConfigured()) {
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
        fallbackNotice: 'Deterministic service navigator active (Gemini key unconfigured).',
      },
    });
  }

  // 3. Enhance with Gemini natural language understanding if available
  try {
    const aiResult = await findGovernmentServiceWithGemini(safeQuery, safeState, language || 'en');
    return res.status(200).json({
      success: true,
      data: aiResult.data,
    });
  } catch (err) {
    console.warn('[Gemini Service Search] Falling back to deterministic engine:', err.message);
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
        fallbackNotice: 'Natural language search fallback used.',
      },
    });
  }
});

// Unified AI Citizen Assistant endpoint (Phase 8)
app.post('/api/citizen-assistant', rateLimitMiddleware, async (req, res) => {
  const { message, conversationHistory, selectedState, selectedCity, language } = req.body || {};

  // 1. Input validation
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: 'empty_message',
      message: 'Citizen message cannot be empty.',
    });
  }

  const safeMessage = message.trim().slice(0, 3000);
  const safeHistory = Array.isArray(conversationHistory)
    ? conversationHistory.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: String(m.content || '').slice(0, 1500),
      }))
    : [];
  const safeState = typeof selectedState === 'string' ? selectedState.slice(0, 100) : null;
  const safeCity = typeof selectedCity === 'string' ? selectedCity.slice(0, 100) : null;
  const safeLanguage = language === 'hi' ? 'hi' : 'en';

  // 2. Pre-flight emergency safety check
  const emergencyHazard = detectEmergencyHazard(safeMessage);
  if (emergencyHazard) {
    const deterministicResult = processAssistantMessage(safeMessage, safeHistory, safeLanguage);
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
      },
    });
  }

  // 3. Fallback check if Gemini is not configured
  if (!isGeminiConfigured()) {
    const deterministicResult = processAssistantMessage(safeMessage, safeHistory, safeLanguage);
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
        fallbackNotice: 'AI assistance is temporarily unavailable. Basic guidance is being provided.',
      },
    });
  }

  // 4. Call Gemini Conversational Assistant
  try {
    const assistantResult = await interactWithCitizenAssistantGemini(
      safeMessage,
      safeHistory,
      safeState,
      safeCity,
      safeLanguage
    );
    return res.status(200).json({
      success: true,
      data: assistantResult.data,
    });
  } catch (err) {
    console.warn('[Gemini Citizen Assistant] Falling back to deterministic engine:', err.message);
    const deterministicResult = processAssistantMessage(safeMessage, safeHistory, safeLanguage);
    return res.status(200).json({
      success: true,
      data: {
        ...deterministicResult,
        isAiAssisted: false,
        fallbackNotice: 'AI assistance is temporarily unavailable. Basic guidance is being provided.',
      },
    });
  }
});


// Generic 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'not_found', message: 'API route not found' });
});

// Central safe error handler
app.use((err, req, res, _next) => {
  console.error('[NagrikSetu Backend] Unhandled Error:', err.message || err);
  res.status(500).json({
    success: false,
    fallbackRequired: true,
    error: 'server_error',
    message: 'An internal server error occurred.',
  });
});

// Start listening if run directly
let serverInstance = null;
export function startServer(port = PORT) {
  return new Promise((resolve) => {
    serverInstance = app.listen(port, () => {
      console.log(`[NagrikSetu Backend] Running on http://localhost:${port}`);
      console.log(`[NagrikSetu Backend] Gemini AI Configured: ${isGeminiConfigured()}`);
      resolve(serverInstance);
    });
  });
}

export function stopServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => resolve());
    } else {
      resolve();
    }
  });
}

export default app;

// Auto-start when executed directly
if (process.argv[1] && process.argv[1].endsWith('server/index.js')) {
  startServer(PORT);
}
