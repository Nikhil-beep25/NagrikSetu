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

      if (response.ok) {
        const json = await response.json();
        const data = json.data;
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
      } else {
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
                ? 'AI सेवा अस्थायी रूप से अनुपलब्ध है। बुनियादी मार्गदर्शन सक्रिय है।'
                : 'AI assistance is temporarily unavailable. Basic guidance active.',
            suggestedActions: fallback.suggestedActions || [],
            timestamp: getFormattedTimestamp(),
          },
        ]);
      }
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
              ? 'AI सेवा अस्थायी रूप से अनुपलब्ध है। बुनियादी मार्गदर्शन सक्रिय है।'
              : 'AI assistance is temporarily unavailable. Basic guidance active.',
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none print:hidden">
      {/* =========================================================================
          1. CHAT WINDOW (POPUP PANEL)
          ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="NagrikSetu AI Chatbot"
          aria-modal="true"
          className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 w-[340px] sm:w-[410px] max-w-[calc(100vw-24px)] h-[520px] sm:h-[560px] max-h-[calc(100vh-90px)] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-slide-up z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-chakra-900 to-chakra-800 text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-kesari-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                🤖
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>NagrikSetu AI</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
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
                  className={`max-w-[85%] rounded-2xl p-3 space-y-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-chakra-800 text-white rounded-br-none shadow-xs'
                      : msg.isEmergency
                      ? 'bg-red-50 border border-red-300 text-red-950 rounded-bl-none shadow-xs'
                      : 'bg-white border border-border text-slate-900 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {/* Emergency Warning Header */}
                  {msg.isEmergency && (
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-red-700 pb-1 border-b border-red-200">
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
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer ${
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
                    className={`text-[9px] text-right ${
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
          <div className="bg-white px-3 py-1.5 border-t border-border/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-400 font-bold whitespace-nowrap">
              {language === 'hi' ? 'सुझाव:' : 'Quick:'}
            </span>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(language === 'hi' ? 'सड़क पर गड्ढा है' : 'How do I report a pothole?')
              }
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer"
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
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer"
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
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer"
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
            className="p-2.5 bg-white border-t border-border flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'hi' ? 'अपनी समस्या या सवाल पूछें...' : 'Ask question or report issue...'
              }
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-border-input bg-surface-dim hover:bg-white focus:bg-white focus:border-chakra-500 focus:outline-hidden text-slate-900"
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
              className="px-3.5 py-2 rounded-xl bg-kesari-500 hover:bg-kesari-600 disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          2. FLOATING TRIGGER BUTTON (CORNER BUBBLE)
          ========================================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI Citizen Assistant" : "Open AI Citizen Assistant"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-kesari-500 to-kesari-600 hover:from-kesari-600 hover:to-kesari-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20 focus:outline-hidden focus:ring-4 focus:ring-kesari-300"
      >
        <span className="text-xl sm:text-2xl leading-none">🤖</span>
        <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">
          {language === 'hi' ? 'AI नागरिक सहायक' : 'AI Assistant'}
        </span>
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white shrink-0 animate-pulse" />

        {/* Floating Notification Indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kesari-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-kesari-600 border border-white" />
          </span>
        )}
      </button>
    </div>
  );
}
