import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ReportComplaintPage from './pages/ReportComplaintPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import AssistantPage from './pages/AssistantPage';
import FutureVisionPage from './pages/FutureVisionPage';
import LegalInfoPage from './pages/LegalInfoPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ComplaintProvider>
          <BrowserRouter>
            <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/report" element={<ReportComplaintPage />} />
              <Route path="/complaints" element={<MyComplaintsPage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:serviceId" element={<ServiceDetailsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/future-vision" element={<FutureVisionPage />} />
              <Route path="/privacy" element={<LegalInfoPage />} />
              <Route path="/terms" element={<LegalInfoPage />} />
              <Route path="/accessibility" element={<LegalInfoPage />} />
              <Route path="/disclaimer" element={<LegalInfoPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ComplaintProvider>
    </AuthProvider>
  </LanguageProvider>
);
}
