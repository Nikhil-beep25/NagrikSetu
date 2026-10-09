import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#001c38] text-white mt-auto">
      {/* Tricolor Accent Ribbon */}
      <div className="tricolor-ribbon w-full" aria-hidden="true" />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Col 1: NagrikSetu Brand & Core Meaning */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white p-1 shadow-sm overflow-hidden shrink-0">
                <img
                  src="/assets/nagriksetu_logo.jpg"
                  alt="NagrikSetu Logo"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl text-white tracking-tight leading-none">
                  Nagrik<span className="text-kesari-400">Setu</span>
                </span>
                <span className="text-xs text-slate-300 font-semibold mt-1">
                  Smart Citizen Grievance & Triage System
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              A smart bridge connecting citizens with local civic redressal channels using AI-powered issue understanding, structured complaint generation, and authority guidance.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-kesari-300 border border-white/15">
              <span>Citizen ↔ AI ↔ Government</span>
            </div>

            <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5">
              <span>📍 Prototype focused on Agra, Uttar Pradesh, India</span>
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Report Complaint
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="hover:text-white transition-colors">
                  My Complaints
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Prototype Info & Channels */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Prototype Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>5 Civic Categories</li>
              <li>English, Hindi & Hinglish</li>
              <li>AI Triage & Classification</li>
              <li>Guided Next Steps</li>
              <li className="pt-2 text-[11px] text-slate-400">
                Official external portals: <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white underline">CPGRAMS</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 NagrikSetu • Smart Citizen Grievance & Triage System. All rights reserved.
          </p>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            <span>Agra, Uttar Pradesh, India • Prototype — AI-assisted civic grievance experience. Not an official government body.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
