import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { processAssistantMessage } from '../services/unifiedAssistantEngine';
import { getApiEndpoint } from '../utils/apiConfig';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const STORAGE_KEY = 'nagriksetu_assistant_history';
let messageSeq = 0;
function getNextMessageId(prefix) {
  messageSeq += 1;
  return `${prefix}-${messageSeq}`;
}

function getFormattedTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatbotWidget() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Initial welcome message
  const getInitialMessages = () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    return [
      {
        id: 'welcome-widget',
        role: 'assistant',
        content:
          language === 'hi'
            ? 'नमस्ते! मैं नागरिकसेतु AI सहायक हूँ। आपकी क्या सहायता कर सकता हूँ?'
            : "Namaste! I'm NagrikSetu, your AI citizen assistant. How can I help you today?",
        timestamp: getFormattedTimestamp(),
        suggestedActions: [
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'सड़क पर गड्ढा' : 'Report Pothole',
            query: language === 'hi' ? 'सड़क पर गड्ढा है कैसे शिकायत करें?' : 'How do I report a pothole?',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'आय प्रमाण पत्र' : 'Income Certificate',
            query: language === 'hi' ? 'मुझे आय प्रमाण पत्र बनवाना है' : 'Mujhe income certificate banwana hai',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'बिजली तार आपातकाल' : 'Wire Hazard (112)',
            query: language === 'hi' ? 'सड़क पर बिजली का तार टूटकर गिर गया है' : 'Broken live electrical wire sparking near street pole',
          },
        ],
      },
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const chatContainerRef = useRef(null);

  // Voice speech recognition
  const { isListening, isSupported: isVoiceSupported, startListening, stopListening } =
    useSpeechRecognition();

  // Listen to custom event to open chatbot from anywhere
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-nagriksetu-chatbot', handleOpen);
    return () => window.removeEventListener('open-nagriksetu-chatbot', handleOpen);
  }, []);

  // Sync messages with sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll inner chat container only when new messages arrive
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: getNextMessageId('user'),
      role: 'user',
      content: textToSend,
      timestamp: getFormattedTimestamp(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(getApiEndpoint('/api/citizen-assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (response.ok && isJson) {
        const json = await response.json();
        const data = json.data;

        if (json.success && data && data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: getNextMessageId('assistant'),
              role: 'assistant',
              content: data.reply,
              intent: data.intent,
              isEmergency: data.isEmergency,
              fallbackNotice: data.fallbackNotice,
              suggestedActions: data.suggestedActions || [],
              timestamp: getFormattedTimestamp(),
            },
          ]);
          return;
        }
      }

      let noticeMessage =
        language === 'hi'
          ? 'AI सेवा अस्थायी रूप से अनुपलब्ध है। बुनियादी मार्गदर्शन सक्रिय है।'
          : 'AI assistance is temporarily unavailable. Basic guidance active.';

      if (response.status === 429) {
        noticeMessage =
          language === 'hi'
            ? 'AI सेवा पर वर्तमान में अधिक लोड है। बुनियादी मार्गदर्शन सक्रिय है।'
            : 'AI service is busy right now. Basic guidance active.';
      } else if (!isJson && contentType.includes('text/html')) {
        noticeMessage =
          language === 'hi'
            ? 'AI बैकएंड सेवा से संपर्क नहीं हो पाया। बुनियादी मार्गदर्शन सक्रिय है।'
            : 'AI backend connection pending. Basic offline guidance active.';
      }

      const fallback = processAssistantMessage(
        textToSend,
        updatedHistory.map((m) => ({ role: m.role, content: m.content })),
        language
      );
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId('assistant'),
          role: 'assistant',
          content: fallback.reply,
          intent: fallback.intent,
          isEmergency: fallback.isEmergency,
          fallbackNotice: noticeMessage,
          suggestedActions: fallback.suggestedActions || [],
          timestamp: getFormattedTimestamp(),
        },
      ]);
    } catch {
      const fallback = processAssistantMessage(
        textToSend,
        updatedHistory.map((m) => ({ role: m.role, content: m.content })),
        language
      );
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId('assistant'),
          role: 'assistant',
          content: fallback.reply,
          intent: fallback.intent,
          isEmergency: fallback.isEmergency,
          fallbackNotice:
            language === 'hi'
              ? 'नेटवर्क समस्या के कारण AI सेवा से संपर्क नहीं हो सका। बुनियादी मार्गदर्शन सक्रिय है।'
              : 'Network issue connecting to AI service. Basic guidance active.',
          suggestedActions: fallback.suggestedActions || [],
          timestamp: getFormattedTimestamp(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening({
        lang: language === 'hi' ? 'hi-IN' : 'en-IN',
        onResult: (transcript) => {
          setInputText(transcript);
        },
      });
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'navigate_report') {
      navigate('/report', { state: action.payload || {} });
      setIsOpen(false);
    } else if (action.type === 'navigate_service' || action.type === 'navigate_checklist') {
      navigate(action.target);
      setIsOpen(false);
    } else if (action.type === 'external_portal') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'call_emergency') {
      window.open(action.target, '_self');
    } else if (action.type === 'clarify_state') {
      handleSendMessage(action.state);
    } else if (action.type === 'quick_prompt') {
      handleSendMessage(action.query);
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClearChat = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          language === 'hi'
            ? 'बातचीत रीसेट कर दी गई है। आप किस विषय में जानकारी चाहते हैं?'
            : "Chat cleared. What would you like help with?",
        timestamp: getFormattedTimestamp(),
        suggestedActions: [
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'नागरिक समस्या' : 'Report Civic Issue',
            query: language === 'hi' ? 'सड़क पर गड्ढा है कैसे शिकायत करें?' : 'How do I report a pothole?',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'आय प्रमाण पत्र' : 'Income Certificate',
            query: language === 'hi' ? 'मुझे आय प्रमाण पत्र बनवाना है' : 'Mujhe income certificate banwana hai',
          },
        ],
      },
    ]);
  };

  return (
    <div
      className="fixed right-3.5 sm:right-5 md:right-6 z-40 select-none print:hidden"
      style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* =========================================================================
          1. CHAT WINDOW (FULLSCREEN ON MOBILE, FLOATING CARD ON DESKTOP)
          ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="NagrikSetu AI Chatbot"
          aria-modal="true"
          className="fixed inset-0 sm:inset-auto md:bottom-20 md:right-6 sm:bottom-20 sm:right-6 w-full sm:w-[410px] md:w-[410px] sm:max-w-[calc(100vw-24px)] h-[100dvh] sm:h-[560px] md:h-[560px] sm:max-h-[calc(100vh-90px)] bg-white rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-border flex flex-col overflow-hidden animate-fade-slide-up z-50"
        >
          {/* Header */}
          <div
            className="bg-gradient-to-r from-chakra-900 to-chakra-800 text-white p-3.5 flex items-center justify-between shadow-xs shrink-0"
            style={{ paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#13865B] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                🤖
              </div>
              <div className="leading-tight">
                <div className="font-display font-extrabold text-sm flex items-center gap-1.5 tracking-tight">
                  <span>NagrikSetu AI</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-300 font-body font-medium">
                  {language === 'hi' ? 'नागरिक सहायता चैटबॉट' : 'Citizen Assistance Assistant'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs transition-colors cursor-pointer"
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-chakra-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🏛️
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 space-y-2 text-xs leading-relaxed font-body ${
                    msg.role === 'user'
                      ? 'bg-chakra-800 text-white rounded-br-none shadow-xs'
                      : msg.isEmergency
                      ? 'bg-red-50 border border-red-300 text-red-950 rounded-bl-none shadow-xs'
                      : 'bg-white border border-border text-slate-900 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {/* Emergency Warning Header */}
                  {msg.isEmergency && (
                    <div className="flex items-center gap-1.5 text-[11px] font-friendly font-black text-red-700 pb-1 border-b border-red-200">
                      <span>⚠️</span>
                      <span>{language === 'hi' ? 'आपातकालीन चेतावनी' : 'EMERGENCY SAFETY ALERT'}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Fallback Notice */}
                  {msg.fallbackNotice && (
                    <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium">
                      ℹ️ {msg.fallbackNotice}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-1.5 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-friendly font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer ${
                            act.type === 'call_emergency'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : act.type === 'navigate_report'
                              ? 'bg-kesari-500 hover:bg-kesari-600 text-white'
                              : act.type === 'navigate_service' || act.type === 'navigate_checklist'
                              ? 'bg-chakra-800 hover:bg-chakra-900 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-border'
                          }`}
                        >
                          {act.type === 'call_emergency' && <span>📞</span>}
                          {act.type === 'navigate_report' && <span>📝</span>}
                          {act.type === 'navigate_service' && <span>🏛️</span>}
                          {act.type === 'quick_prompt' && <span>💬</span>}
                          <span>{act.label}</span>
                          {act.type === 'external_portal' && <span>↗</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] text-right font-body ${
                      msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-kesari-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-text-muted">
                <div className="h-7 w-7 rounded-full bg-chakra-800 text-white flex items-center justify-center text-xs shrink-0">
                  🏛️
                </div>
                <div className="bg-white border border-border rounded-xl rounded-bl-none p-2.5 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {language === 'hi' ? 'सोच रहा है...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-white px-3 py-1.5 border-t border-border/60 flex items-center gap-1.5 overflow-x-auto text-[10px] font-friendly">
            <span className="text-slate-400 font-bold whitespace-nowrap">
              {language === 'hi' ? 'सुझाव:' : 'Quick:'}
            </span>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(language === 'hi' ? 'सड़क पर गड्ढा है' : 'How do I report a pothole?')
              }
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'सड़क गड्ढा' : 'Pothole'}
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  language === 'hi' ? 'मुझे आय प्रमाण पत्र बनवाना है' : 'Mujhe income certificate banwana hai'
                )
              }
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'आय प्रमाण पत्र' : 'Income Cert'}
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  language === 'hi'
                    ? 'मूल निवास प्रमाण पत्र के दस्तावेज क्या हैं?'
                    : 'What documents do I need for domicile certificate?'
                )
              }
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'दस्तावेज' : 'Documents'}
            </button>
          </div>

          {/* Input & Mic Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 md:p-3 bg-white border-t border-border flex items-center gap-1.5 shrink-0"
            style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'hi' ? 'अपनी समस्या या सवाल पूछें...' : 'Ask question or report issue...'
              }
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs font-body rounded-xl border border-border-input bg-surface-dim hover:bg-white focus:bg-white focus:border-chakra-500 focus:outline-hidden text-slate-900"
            />

            {/* Voice Input Button */}
            {isVoiceSupported && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                title={isListening ? 'Stop listening' : 'Speak message'}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-border'
                }`}
              >
                🎤
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#13865B] hover:bg-[#0E6C48] disabled:opacity-40 text-white font-friendly font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          2. FLOATING TRIGGER BUTTON (SIMPLE GREEN CHATBOT BUTTON — COMPATIBLE WITH ALL RATIOS)
          ========================================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI Citizen Assistant" : "Open AI Citizen Assistant"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`group relative flex items-center justify-center rounded-full bg-[#13865B] hover:bg-[#0E6C48] active:bg-[#0A5236] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/25 focus:outline-hidden focus:ring-4 focus:ring-[#13865B]/30 ${
          isOpen ? 'hidden md:inline-flex' : 'inline-flex'
        } w-[52px] h-[52px] sm:w-auto sm:h-auto p-0 sm:px-4 sm:py-3`}
      >
        {/* Simple Clean Chatbot Icon */}
        <span className="flex items-center justify-center">
          {isOpen ? (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <circle cx="9" cy="12" r="1.25" fill="currentColor" stroke="none" />
              <circle cx="15" cy="12" r="1.25" fill="currentColor" stroke="none" />
            </svg>
          )}
        </span>

        {/* Text for tablet and desktop viewports */}
        <span className="font-friendly font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline ml-2">
          {language === 'hi' ? 'AI नागरिक सहायक' : 'AI Assistant'}
        </span>

        {/* Simple live status dot */}
        <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-emerald-300 ml-2 shrink-0 animate-pulse" />
      </button>
    </div>
  );
}
