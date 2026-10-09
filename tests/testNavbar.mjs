import fs from 'fs';
import path from 'path';

console.log('=== NAGRIKSETU GLOBAL NAVBAR COMPONENT TEST ===\n');

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

// 1. Check Navbar.jsx file existence
const navbarPath = path.resolve('src/components/Navbar.jsx');
assert(fs.existsSync(navbarPath), 'Navbar.jsx exists in src/components/');

const navbarContent = fs.readFileSync(navbarPath, 'utf8');

// 2. Check Brand elements
assert(navbarContent.includes('NagrikSetu Logo') || navbarContent.includes('/assets/nagriksetu_logo.jpg'), 'Brand logo /assets/nagriksetu_logo.jpg is used');
assert(navbarContent.includes('Nagrik') && navbarContent.includes('Setu'), 'Brand name NagrikSetu is present');
assert(navbarContent.includes('Smart Citizen Grievance & Triage System'), 'Subtitle "Smart Citizen Grievance & Triage System" is present');

// 3. Check Exact Navigation Items and Order
const navItemsRegex = /const NAV_ITEMS = \[\s*([\s\S]*?)\s*\];/;
const match = navbarContent.match(navItemsRegex);
assert(match !== null, 'NAV_ITEMS configuration array exists in Navbar.jsx');

if (match) {
  const itemsText = match[1];
  const homeIdx = itemsText.indexOf("'Home'");
  const howIdx = itemsText.indexOf("'How It Works'");
  const reportIdx = itemsText.indexOf("'Report Complaint'");
  const complaintsIdx = itemsText.indexOf("'My Complaints'");

  assert(homeIdx !== -1, 'Navigation item "Home" exists');
  assert(howIdx !== -1, 'Navigation item "How It Works" exists');
  assert(reportIdx !== -1, 'Navigation item "Report Complaint" exists');
  assert(complaintsIdx !== -1, 'Navigation item "My Complaints" exists');

  assert(homeIdx < howIdx, 'Home is before How It Works');
  assert(howIdx < reportIdx, 'How It Works is before Report Complaint');
  assert(reportIdx < complaintsIdx, 'Report Complaint is before My Complaints');
}

// 4. Ensure NO forbidden navigation items
const forbiddenItems = ['Report Issue', 'Dashboard', 'Services', 'Ward Feed'];
forbiddenItems.forEach((forbidden) => {
  // Check within NAV_ITEMS
  if (match) {
    assert(!match[1].includes(forbidden), `Forbidden item "${forbidden}" is not in navigation items`);
  }
});

// 5. Ensure NO forbidden old brand names
const forbiddenBrands = ['NagrikAI', 'CivicAI', 'Civic Sense', 'AI Civic Portal'];
forbiddenBrands.forEach((brand) => {
  assert(!navbarContent.includes(brand), `Forbidden brand "${brand}" is not in Navbar`);
});

// 6. Check Active Navigation Logic
assert(navbarContent.includes('isItemActive') || navbarContent.includes('isActive'), 'Active navigation highlighting logic is implemented');
assert(navbarContent.includes('kesari') && (navbarContent.includes('border-b-2') || navbarContent.includes('border-kesari')), 'Active style uses orange/kesari accent and bottom border');

// 7. Check Primary CTA
assert(navbarContent.includes('+ Report Complaint'), 'Primary CTA "+ Report Complaint" is present');
assert(navbarContent.includes('to="/report"'), 'Primary CTA links to "/report"');

// 8. Check Top Civic Information Bar
assert(navbarContent.includes('Citizen Grievance Assistance'), 'Top bar contains "Citizen Grievance Assistance"');
assert(navbarContent.includes('AI-assisted civic complaint guidance'), 'Top bar contains "AI-assisted civic complaint guidance"');
assert(navbarContent.includes('A-') && navbarContent.includes('A+') && navbarContent.includes('हिन्दी'), 'Top bar contains font resizers and language switcher');

// 9. Check Mobile Drawer
assert(navbarContent.includes('mobileOpen'), 'Mobile menu toggle state is present');
assert(navbarContent.includes('setMobileOpen(false)'), 'Mobile menu closes on navigation');

// 10. Check Layout and App route integration
const layoutPath = path.resolve('src/layouts/Layout.jsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(layoutContent.includes('<Navbar />') || layoutContent.includes('<Navbar'), 'Navbar is rendered globally in Layout.jsx');

const appPath = path.resolve('src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(appContent.includes('path="/"'), 'Route "/" configured in App.jsx');
assert(appContent.includes('path="/how-it-works"'), 'Route "/how-it-works" configured in App.jsx');
assert(appContent.includes('path="/report"'), 'Route "/report" configured in App.jsx');
assert(appContent.includes('path="/complaints"'), 'Route "/complaints" configured in App.jsx');
assert(appContent.includes('path="/complaints/:id"'), 'Route "/complaints/:id" configured in App.jsx');

// 11. Check Scroll to top behavior on page change
const scrollToTopPath = path.resolve('src/components/ScrollToTop.jsx');
assert(fs.existsSync(scrollToTopPath), 'ScrollToTop.jsx component exists');
assert(appContent.includes('<ScrollToTop />') || appContent.includes('<ScrollToTop'), 'ScrollToTop is mounted inside BrowserRouter in App.jsx');
const scrollToTopContent = fs.readFileSync(scrollToTopPath, 'utf8');
assert(scrollToTopContent.includes('window.scrollTo(0, 0)'), 'ScrollToTop scrolls to upper side (top) by default on pathname change');

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed out of ${passed + failed} ===\n`);
if (failed > 0) process.exit(1);
