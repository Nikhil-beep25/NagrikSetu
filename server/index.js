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
  isGeminiConfigured,
} from './geminiService.js';
import { detectEmergencyHazard } from '../src/services/emergencySafetyDetector.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
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
