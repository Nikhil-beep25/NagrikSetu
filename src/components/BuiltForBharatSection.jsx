import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function BuiltForBharatSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <section
      aria-labelledby="built-for-bharat-heading"
      className="relative bg-gradient-to-b from-[#FFF9F1] via-[#FFFDF9] to-[#FFF9F1] py-16 sm:py-24 border-t border-b border-[#E3E8EF] overflow-hidden"
    >
      {/* Decorative Subtle Watermark */}
      <div
        className="absolute inset-0 bg-watermark-mandala opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient Gradient Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#F47721]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#13865B]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          {/* Tricolor Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F47721]/30 px-4 py-1.5 text-xs font-black text-[#F47721] shadow-2xs mb-4">
            <span className="h-2 w-2 rounded-full bg-[#13865B] animate-pulse" />
            <span>{isHindi ? 'भारत के लिए निर्मित • सामाजिक प्रभाव' : 'Built for Bharat • Social Impact'}</span>
          </div>

          {/* Main Heading */}
          <h2
            id="built-for-bharat-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1F50] tracking-tight leading-tight"
          >
            {isHindi ? 'हर नागरिक के लिए, हर भारतवासी के लिए।' : 'Built for Bharat. Designed for Every Citizen.'}
          </h2>

          {/* Tagline */}
          <p className="mt-3.5 text-base sm:text-lg font-bold text-[#F47721]">
            {isHindi
              ? '“तकनीक को नागरिकों को समझना चाहिए — न कि नागरिकों को तकनीक को।”'
              : '“Technology should understand citizens — not the other way around.”'}
          </p>

          {/* Description */}
          <p className="mt-4 text-xs sm:text-base text-[#596579] leading-relaxed max-w-2xl mx-auto">
            {isHindi
              ? 'नागरिकसेतु का उद्देश्य नागरिक शिकायत सहायता और सरकारी सेवा नेविगेशन को सरल, अधिक सुलभ और समझने में आसान बनाना है, विशेष रूप से डिजिटल बाधाओं का सामना करने वाले नागरिकों के लिए।'
              : 'NagrikSetu aims to make civic complaint assistance and government service navigation simpler, more accessible, and easier to understand, especially for citizens facing digital barriers.'}
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">
          
          {/* CARD 1: Speak in Your Language */}
          <div className="group rounded-3xl bg-white border border-[#E3E8EF] hover:border-[#F47721]/50 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B1F50]">
                {isHindi ? 'अपनी भाषा में बोलें' : 'Speak in Your Language'}
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                {isHindi
                  ? 'अपनी समस्या स्वाभाविक रूप से हिंदी, अंग्रेजी या हिंग्लिश में बताएं।'
                  : 'Describe your problem naturally in Hindi, English, or Hinglish.'}
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3E8EF]/60 mt-6 flex items-center justify-between text-xs font-bold text-[#F47721]">
              <span>{isHindi ? 'ध्वनि एवं स्थानीय भाषा' : 'Voice & Vernacular'}</span>
              <span>→</span>
            </div>
          </div>

          {/* CARD 2: Get AI-Powered Guidance */}
          <div className="group rounded-3xl bg-white border border-[#E3E8EF] hover:border-[#0B1F50]/50 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B1F50]">
                {isHindi ? 'AI-संचालित मार्गदर्शन प्राप्त करें' : 'Get AI-Powered Guidance'}
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                {isHindi
                  ? 'AI आपकी समस्या को समझने, शिकायत तैयार करने और प्रासंगिक सेवाएं खोजने में मदद करता है।'
                  : 'Let AI help you understand your issue, prepare complaints, and find relevant services.'}
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3E8EF]/60 mt-6 flex items-center justify-between text-xs font-bold text-[#0B1F50]">
              <span>{isHindi ? 'स्मार्ट शिकायत प्रारूप' : 'Smart Grievance Drafts'}</span>
              <span>→</span>
            </div>
          </div>

          {/* CARD 3: Simplify Government Processes */}
          <div className="group rounded-3xl bg-white border border-[#E3E8EF] hover:border-[#13865B]/50 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                {/* Coming Soon Pill */}
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-kesari-500 text-chakra-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  <span>✨</span>
                  <span>{isHindi ? 'कमिंग सून' : 'Coming Soon'}</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B1F50]">
                {isHindi ? 'सरकारी प्रक्रियाओं को सरल बनाएं' : 'Simplify Government Processes'}
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                {isHindi
                  ? 'आज स्पष्ट मार्गदर्शन प्राप्त करें, और भविष्य में नागरिक-स्वीकृत AI ऑटोमेशन की योजना है।'
                  : 'Access clearer guidance today, with citizen-approved AI workflow automation planned for the future.'}
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3E8EF]/60 mt-6 flex items-center justify-between text-xs font-bold text-[#13865B]">
              <span>{isHindi ? 'पारदर्शी पोर्टल नेविगेशन' : 'Transparent Navigation'}</span>
              <span>→</span>
            </div>
          </div>

        </div>

        {/* Social Impact Message Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#001c38] via-[#0B1F50] to-[#002D56] text-white p-8 sm:p-12 shadow-2xl border-2 border-amber-400/80 overflow-hidden mb-12 sm:mb-14">
          {/* Subtle Tricolor Top Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F47721] via-white to-[#13865B]" aria-hidden="true" />

          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="text-3xl sm:text-4xl block" aria-hidden="true">
              🇮🇳
            </span>
            <p className="text-base sm:text-2xl font-black tracking-tight text-white leading-snug">
              “
              {isHindi
                ? 'गांवों से लेकर शहरों तक, नागरिकसेतु एक ऐसे भविष्य की परिकल्पना करता है जहां हर नागरिक आत्मविश्वास के साथ डिजिटल सार्वजनिक सेवाओं का उपयोग कर सके।'
                : 'From villages to cities, NagrikSetu envisions a future where every citizen can access digital public services with confidence.'}
              ”
            </p>
            <p className="text-xs sm:text-sm font-semibold text-amber-200/90 pt-1">
              {isHindi
                ? 'डिजिटल समावेशन • सामाजिक विश्वास • प्रशासनिक पारदर्शिता'
                : 'Digital Inclusion • Civic Trust • Administrative Transparency'}
            </p>
          </div>
        </div>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          {/* Primary CTA */}
          <Link
            to="/assistant"
            className="animate-shine w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#F47721] to-[#e06616] hover:from-[#e06616] hover:to-[#c8560e] text-white px-8 py-4 text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>🤖</span>
            <span>{isHindi ? 'नागरिकसेतु AI से बात करें' : 'Talk to NagrikSetu AI'}</span>
            <span>→</span>
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/future-vision"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white hover:bg-[#EEF4FF] text-[#0B1F50] border-2 border-[#0B1F50] px-8 py-4 text-sm sm:text-base font-black shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>🚀</span>
            <span>{isHindi ? 'हमारा भविष्य विजन देखें' : 'Explore Our Future Vision'}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
