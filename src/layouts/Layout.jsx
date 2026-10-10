import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import FutureVisionPopup from '../components/FutureVisionPopup';
import FutureVisionButton from '../components/FutureVisionButton';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <FutureVisionButton />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <FutureVisionPopup />
    </div>
  );
}
