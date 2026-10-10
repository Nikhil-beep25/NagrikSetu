import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

console.log('================================================================');
console.log('  🚀 NAGRIKSETU — PHASE 13: FUTURE VISION & AUTOMATION AUDIT');
console.log('================================================================');

try {
  // 1. Verify App.jsx route
  const appPath = resolve(rootDir, 'src/App.jsx');
  const appContent = readFileSync(appPath, 'utf8');
  assert(appContent.includes('/future-vision'), 'App.jsx must contain /future-vision route');
  assert(appContent.includes('FutureVisionPage'), 'App.jsx must import and use FutureVisionPage');
  console.log('✅ App.jsx route /future-vision verified.');

  // 2. Verify Navbar.jsx has Future Vision link
  const navPath = resolve(rootDir, 'src/components/Navbar.jsx');
  const navContent = readFileSync(navPath, 'utf8');
  assert(navContent.includes('/future-vision'), 'Navbar.jsx must link to /future-vision');
  assert(navContent.includes('Future Vision') || navContent.includes('भविष्य दृष्टि'), 'Navbar.jsx must display Future Vision label');
  console.log('✅ Navbar.jsx navigation links verified.');

  // 3. Verify Footer.jsx has Future Vision link
  const footerPath = resolve(rootDir, 'src/components/Footer.jsx');
  const footerContent = readFileSync(footerPath, 'utf8');
  assert(footerContent.includes('/future-vision'), 'Footer.jsx must link to /future-vision');
  console.log('✅ Footer.jsx navigation links verified.');

  // 4. Verify AutomationVisionDemo.jsx
  const demoPath = resolve(rootDir, 'src/components/AutomationVisionDemo.jsx');
  const demoContent = readFileSync(demoPath, 'utf8');
  assert(demoContent.includes('Concept Preview — No Government Submission') || demoContent.includes('No Government Submission'), 'Demo must display Concept Preview disclaimer');
  assert(demoContent.includes('Mere area mein') || demoContent.includes('Mere gaon ki sadak'), 'Demo must have sample citizen prompt');
  assert(demoContent.includes('Understanding'), 'Demo must have Understanding stage');
  assert(demoContent.includes('Preparing'), 'Demo must have Preparing stage');
  assert(demoContent.includes('Portal'), 'Demo must have Portal identification stage');
  assert(demoContent.includes('Form Fields') || demoContent.includes('Filling'), 'Demo must have form field preparation stage');
  assert(demoContent.includes('Approval') || demoContent.includes('Consent'), 'Demo must have citizen approval stage');
  assert(demoContent.includes('Complete') || demoContent.includes('Demonstration'), 'Demo must have completion stage');
  console.log('✅ AutomationVisionDemo.jsx 6 simulated stages and safety disclaimers verified.');

  // 5. Verify HomePage.jsx Vision Section
  const homePath = resolve(rootDir, 'src/pages/HomePage.jsx');
  const homeContent = readFileSync(homePath, 'utf8');
  assert(homeContent.includes('Coming Soon: NagrikSetu AI Automation'), 'HomePage must have Coming Soon: NagrikSetu AI Automation heading');
  assert(homeContent.includes('From describing your problem to completing government workflows — with AI assistance.'), 'HomePage must have specified subtitle');
  assert(homeContent.includes('One Conversation. A Simpler Government Process.'), 'HomePage must have 6-step workflow title');
  assert(homeContent.includes('TELL YOUR PROBLEM'), 'Workflow step 1 must be present');
  assert(homeContent.includes('AI UNDERSTANDS'), 'Workflow step 2 must be present');
  assert(homeContent.includes('AI PREPARES'), 'Workflow step 3 must be present');
  assert(homeContent.includes('AI NAVIGATES'), 'Workflow step 4 must be present');
  assert(homeContent.includes('AI ASSISTS WITH FORM FILLING'), 'Workflow step 5 must be present');
  assert(homeContent.includes('CITIZEN APPROVES'), 'Workflow step 6 must be present');
  assert(homeContent.includes('Track Your Complaint'), 'Track your complaint capability must be present');
  assert(homeContent.includes('What Makes NagrikSetu Different?'), 'HomePage must have What Makes NagrikSetu Different section');
  assert(homeContent.includes('AutomationVisionDemo'), 'HomePage must embed AutomationVisionDemo');
  console.log('✅ HomePage.jsx vision, 6-step workflow, demo, and USP section verified.');

  // 6. Verify FutureVisionPage.jsx sections
  const visionPath = resolve(rootDir, 'src/pages/FutureVisionPage.jsx');
  const visionContent = readFileSync(visionPath, 'utf8');
  assert(visionContent.includes('Making government services accessible to every citizen, regardless of digital literacy.'), 'FutureVisionPage must state core mission');
  assert(visionContent.includes('The Problem') || visionContent.includes('समस्या: प्रशासनिक बाधाएं'), 'FutureVisionPage must present The Problem section');
  assert(visionContent.includes('Our Vision') || visionContent.includes('हमारा विजन'), 'FutureVisionPage must present Our Vision section');
  assert(visionContent.includes('How Future Automation Works') || visionContent.includes('भविष्य का ऑटोमेशन कैसे काम करेगा'), 'FutureVisionPage must explain how future automation works');
  assert(visionContent.includes('Who Benefits?') || visionContent.includes('किसे लाभ होगा?'), 'FutureVisionPage must present Who Benefits section');
  assert(visionContent.includes('Future Roadmap') || visionContent.includes('भविष्य का रोडमैप'), 'FutureVisionPage must present Future Roadmap');
  assert(visionContent.includes('Stage 1: AI Guidance and Complaint Preparation'), 'Roadmap stage 1 must be detailed');
  assert(visionContent.includes('Stage 2: AI-Assisted Government Portal Navigation'), 'Roadmap stage 2 must be detailed');
  assert(visionContent.includes('Stage 3: Citizen-Approved Form Automation'), 'Roadmap stage 3 must be detailed');
  assert(visionContent.includes('Stage 4: Authorized Submission and Status Tracking'), 'Roadmap stage 4 must be detailed');
  assert(visionContent.includes('What Makes NagrikSetu Different?'), 'FutureVisionPage must detail 6 USP pillars');
  assert(visionContent.includes('Security, Ethics & Citizen Control'), 'FutureVisionPage must detail security and ethics rules');
  assert(visionContent.includes('Never bypass CAPTCHA') && visionContent.includes('Never bypass OTP'), 'FutureVisionPage must explicitly forbid CAPTCHA/OTP bypass');
  assert(visionContent.includes('Accessibility Vision'), 'FutureVisionPage must have accessibility vision');
  console.log('✅ FutureVisionPage.jsx all 9 comprehensive sections verified.');

  // 7. Verify FutureVisionPopup.jsx and Layout.jsx integration
  const popupPath = resolve(rootDir, 'src/components/FutureVisionPopup.jsx');
  const popupContent = readFileSync(popupPath, 'utf8');
  assert(popupContent.includes('FIVE_MINUTES_MS') || popupContent.includes('5 * 60 * 1000'), 'Popup must have 5 minute timer threshold');
  assert(popupContent.includes('sessionStorage'), 'Popup must track session time and dismissal');
  assert(popupContent.includes('role="dialog"'), 'Popup must be an accessible dialog modal');
  assert(popupContent.includes('/future-vision'), 'Popup must link to /future-vision');

  const layoutPath = resolve(rootDir, 'src/layouts/Layout.jsx');
  const layoutContent = readFileSync(layoutPath, 'utf8');
  assert(layoutContent.includes('FutureVisionPopup'), 'Layout.jsx must mount FutureVisionPopup');
  console.log('✅ FutureVisionPopup.jsx 5-minute timed notification and Layout integration verified.');

  console.log('----------------------------------------------------------------');
  console.log('🎉 PHASE 13 FUTURE VISION VERIFICATION PASSED (100%)');
  console.log('================================================================');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
