import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ Assertion Failed: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  🛡️  NAGRIKSETU — DEMO AUTH & RESPONSIVE AUDIT VERIFICATION');
console.log('================================================================\n');

try {
  // 1. AuthContext demo session & sessionStorage validation
  const authContextPath = resolve(rootDir, 'src/context/AuthContext.jsx');
  assert(existsSync(authContextPath), 'AuthContext.jsx exists');
  const authContent = readFileSync(authContextPath, 'utf8');

  assert(authContent.includes('nagriksetu_demo_session_v1'), 'AuthContext uses nagriksetu_demo_session_v1 storage key');
  assert(authContent.includes('sessionStorage'), 'AuthContext uses sessionStorage for demo session persistence');
  assert(authContent.includes('crypto.randomUUID'), 'AuthContext generates runtime UUID using crypto.randomUUID()');
  assert(authContent.includes('loginDemo'), 'AuthContext exports loginDemo method');
  assert(authContent.includes('isDemoSession'), 'AuthContext exposes isDemoSession boolean flag');
  assert(authContent.includes('DEMO_DURATION_MS') && authContent.includes('2 * 60 * 60 * 1000'), 'Demo session duration is configured for 2 hours');
  assert(authContent.includes('expiresAt'), 'Demo session includes expiresAt timestamp');
  assert(authContent.includes('logout'), 'AuthContext provides logout clearing demo session');

  // 2. SignInPage layout, one-click demo button, and disclaimers
  const signInPath = resolve(rootDir, 'src/pages/SignInPage.jsx');
  assert(existsSync(signInPath), 'SignInPage.jsx exists');
  const signInContent = readFileSync(signInPath, 'utf8');

  assert(signInContent.includes('Continue with Demo Account'), 'SignInPage contains "Continue with Demo Account" button');
  assert(signInContent.includes('डेमो अकाउंट से जारी रखें'), 'SignInPage contains Hindi "डेमो अकाउंट से जारी रखें"');
  assert(signInContent.includes('lg:grid-cols-12') || signInContent.includes('lg:grid-cols-2'), 'SignInPage implements responsive 2-column desktop layout');
  assert(signInContent.includes('Demo Access Code') || signInContent.includes('DEMO2026'), 'SignInPage provides optional manual Demo Access Code');
  assert(
    signInContent.includes('Demo account: Data and access are for demonstration only') ||
    signInContent.includes('This is not a verified citizen identity'),
    'SignInPage displays clear prototype demo notice without misleading government claims'
  );

  // 3. Navbar mobile navigation, body scroll lock, and Demo badge
  const navPath = resolve(rootDir, 'src/components/Navbar.jsx');
  assert(existsSync(navPath), 'Navbar.jsx exists');
  const navContent = readFileSync(navPath, 'utf8');

  assert(navContent.includes("document.body.style.overflow = 'hidden'"), 'Navbar locks background body scroll when mobile drawer is open');
  assert(navContent.includes('hamburgerRef.current?.focus()'), 'Navbar restores focus to hamburger trigger on Escape/close');
  assert(navContent.includes("currentUser.mode === 'demo'"), 'Navbar checks demo mode to display Demo Citizen badge');

  // 4. HeroSlider mobile clearance & control alignment
  const heroPath = resolve(rootDir, 'src/components/HeroSlider.jsx');
  assert(existsSync(heroPath), 'HeroSlider.jsx exists');
  const heroContent = readFileSync(heroPath, 'utf8');

  assert(heroContent.includes('pb-20') || heroContent.includes('pb-24'), 'HeroSlider has responsive bottom clearance for mobile controls');
  assert(heroContent.includes('break-words'), 'HeroSlider titles use break-words to prevent mobile text overflow');

  // 5. ChatbotWidget full-screen mobile sheet
  const chatbotPath = resolve(rootDir, 'src/components/ChatbotWidget.jsx');
  assert(existsSync(chatbotPath), 'ChatbotWidget.jsx exists');
  const chatbotContent = readFileSync(chatbotPath, 'utf8');

  assert(chatbotContent.includes('fixed inset-0 sm:inset-auto'), 'ChatbotWidget uses full-screen sheet on mobile viewports');
  assert(chatbotContent.includes('h-[100dvh]') || chatbotContent.includes('h-full sm:h-'), 'ChatbotWidget respects dynamic viewport height on mobile');

  // 6. MyComplaintsPage metrics responsiveness & Demo banner
  const complaintsPath = resolve(rootDir, 'src/pages/MyComplaintsPage.jsx');
  assert(existsSync(complaintsPath), 'MyComplaintsPage.jsx exists');
  const complaintsContent = readFileSync(complaintsPath, 'utf8');

  assert(complaintsContent.includes("currentUser?.mode === 'demo'"), 'MyComplaintsPage renders Demo Citizen welcome banner');
  assert(complaintsContent.includes('grid-cols-1 xs:grid-cols-2 lg:grid-cols-4'), 'MyComplaintsPage metrics cards adapt gracefully from 1 col on 320px to 4 cols');

  // 7. index.css overflow prevention & reduced-motion preference
  const cssPath = resolve(rootDir, 'src/index.css');
  assert(existsSync(cssPath), 'index.css exists');
  const cssContent = readFileSync(cssPath, 'utf8');

  assert(cssContent.includes('overflow-x: hidden'), 'index.css enforces overflow-x: hidden to prevent horizontal scrolling');
  assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'index.css supports reduced-motion accessibility preference');

  console.log(`\n================================================================`);
  console.log(`🎉 DEMO AUTH & RESPONSIVE AUDIT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================================================\n`);

  if (failed > 0) process.exit(1);
} catch (e) {
  console.error('Fatal error during test:', e);
  process.exit(1);
}
