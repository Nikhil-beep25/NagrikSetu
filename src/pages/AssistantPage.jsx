import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { processAssistantMessage } from '../services/unifiedAssistantEngine';
import { getApiEndpoint } from '../utils/apiConfig';

const STORAGE_KEY = 'nagriksetu_assistant_history';
let messageSeq = 0;
function getNextMessageId(prefix) {
  messageSeq += 1;
  return `${prefix}-${messageSeq}`;
}

function getFormattedTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AssistantPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Initial welcome message
  const getInitialMessages = () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage read error
    }

    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          language === 'hi'
            ? 'नमस्ते! मैं नागरिकसेतु हूँ। बताइए, आपको किस काम में सहायता चाहिए?'
            : "Namaste! I'm NagrikSetu, your AI citizen assistant. Tell me what you need help with.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Problem',
            query: language === 'hi' ? 'सड़क पर गड्ढा है कैसे शिकायत करें?' : 'How do I report a pothole?',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'आय प्रमाण पत्र' : 'Income Certificate',
            query: language === 'hi' ? 'मुझे आय प्रमाण पत्र बनवाना है' : 'Mujhe income certificate banwana hai',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents',
            query: language === 'hi' ? 'मूल निवास प्रमाण पत्र के लिए दस्तावेज क्या हैं?' : 'What documents do I need for a domicile certificate?',
          },
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'पासपोर्ट अपॉइंटमेंट' : 'Passport Guidance',
            query: language === 'hi' ? 'पासपोर्ट अपॉइंटमेंट कैसे बुक करें?' : 'Passport appointment kaise book kare?',
          },
        ],
      },
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const isFirstMount = useRef(true);

  // Sync with sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage write error
    }
  }, [messages]);

  // Keep window at the top on navigation, and scroll ONLY the inner chat box
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      return;
    }

    // Scroll inner chat container only — never scroll the window down
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

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
      // First attempt backend Gemini assistant endpoint
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
        // Fallback to local deterministic assistant engine
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
                ? 'AI सेवा अस्थायी रूप से अनुपलब्ध है। बुनियादी मार्गदर्शन प्रदान किया जा रहा है।'
                : 'AI assistance is temporarily unavailable. Basic guidance is being provided.',
            suggestedActions: fallback.suggestedActions || [],
            timestamp: getFormattedTimestamp(),
          },
        ]);
      }
    } catch {
      // Network / Offline fallback
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
              ? 'AI सेवा अस्थायी रूप से अनुपलब्ध है। बुनियादी मार्गदर्शन प्रदान किया जा रहा है।'
              : 'AI assistance is temporarily unavailable. Basic guidance is being provided.',
          suggestedActions: fallback.suggestedActions || [],
          timestamp: getFormattedTimestamp(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'navigate_report') {
      navigate('/report', { state: action.payload || {} });
    } else if (action.type === 'navigate_service' || action.type === 'navigate_checklist') {
      navigate(action.target);
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
            ? 'बातचीत रीसेट कर दी गई है। मैं आपकी किस प्रकार सहायता कर सकता हूँ?'
            : "Conversation cleared. Tell me what you'd like help with.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          {
            type: 'quick_prompt',
            label: language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Report a Civic Problem',
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
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-6 sm:py-8 flex flex-col justify-between">
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 space-y-4 flex-1 flex flex-col">
        {/* =========================================================================
            HEADER & ACTIONS
            ========================================================================= */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-kesari-500 text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              🤖
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-chakra-900 tracking-tight">
                {t('assistantTitle')}
              </h1>
              <p className="text-[11px] sm:text-xs text-text-muted">
                {t('assistantSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg border border-border-input hover:border-slate-400 bg-white hover:bg-surface-dim text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            title="Reset conversation"
          >
            <span>🗑️</span>
            <span>{t('assistantClearBtn')}</span>
          </button>
        </div>

        {/* =========================================================================
            CHAT MESSAGE THREAD
            ========================================================================= */}
        <div
          ref={chatContainerRef}
          className="flex-1 bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm overflow-y-auto space-y-4 max-h-[60vh] min-h-[380px]"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-chakra-800 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1 shadow-2xs">
                  🏛️
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-chakra-800 text-white rounded-br-none shadow-xs'
                    : msg.isEmergency
                    ? 'bg-red-50 border border-red-300 text-red-950 rounded-bl-none shadow-xs'
                    : 'bg-surface-dim border border-border-card text-slate-900 rounded-bl-none shadow-2xs'
                }`}
              >
                {/* Emergency Header if applicable */}
                {msg.isEmergency && (
                  <div className="flex items-center gap-1.5 text-xs font-black text-red-700 pb-1 border-b border-red-200">
                    <span>⚠️</span>
                    <span>{t('assistantEmergencyWarning')}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>

                {/* Fallback Transparent Notice */}
                {msg.fallbackNotice && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-semibold flex items-center gap-1">
                    <span>ℹ️</span>
                    <span>{msg.fallbackNotice}</span>
                  </div>
                )}

                {/* Suggested Action Cards inside Assistant Bubble */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-border/40 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleActionClick(act)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                          act.type === 'call_emergency'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : act.type === 'navigate_report'
                            ? 'bg-kesari-500 hover:bg-kesari-600 text-white'
                            : act.type === 'navigate_service' || act.type === 'navigate_checklist'
                            ? 'bg-chakra-800 hover:bg-chakra-900 text-white'
                            : act.type === 'clarify_state'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-border'
                        }`}
                      >
                        {act.type === 'call_emergency' && <span>📞</span>}
                        {act.type === 'navigate_report' && <span>📝</span>}
                        {act.type === 'navigate_service' && <span>🏛️</span>}
                        {act.type === 'navigate_checklist' && <span>📋</span>}
                        {act.type === 'external_portal' && <span>🌐</span>}
                        {act.type === 'clarify_state' && <span>📍</span>}
                        {act.type === 'quick_prompt' && <span>💬</span>}
                        <span>{act.label}</span>
                        {act.type === 'external_portal' && <span>↗</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] text-right ${
                    msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-kesari-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center text-xs text-text-muted">
              <div className="h-8 w-8 rounded-full bg-chakra-800 text-white flex items-center justify-center text-sm font-bold shrink-0">
                🏛️
              </div>
              <div className="bg-surface-dim border border-border-card rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px] font-semibold">{t('assistantThinking')}</span>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            INPUT FIELD & SEND CONTROLS
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-border p-3 sm:p-4 shadow-sm space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="assistant-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('assistantInputPlaceholder')}
              disabled={loading}
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-border-input bg-surface-dim hover:bg-white focus:bg-white focus:border-chakra-500 focus:ring-2 focus:ring-chakra-200 focus:outline-hidden transition-all text-text-primary"
            />
            <button
              id="assistant-send-button"
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-kesari-500 hover:bg-kesari-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{t('assistantSendBtn')}</span>
              <span>→</span>
            </button>
          </form>

          {/* Quick Action Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            <span className="text-[10px] font-bold text-text-muted whitespace-nowrap">
              {t('assistantSuggestedHeading')}:
            </span>
            <button
              type="button"
              onClick={() => handleSendMessage(language === 'hi' ? 'सड़क पर गड्ढा है' : 'How do I report a pothole?')}
              className="px-2.5 py-1 rounded-md bg-surface-dim hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              {t('assistantActionCivic')}
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(language === 'hi' ? 'मुझे आय प्रमाण पत्र बनवाना है' : 'Mujhe income certificate banwana hai')}
              className="px-2.5 py-1 rounded-md bg-surface-dim hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              {t('assistantActionServices')}
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(language === 'hi' ? 'मूल निवास प्रमाण पत्र के दस्तावेज क्या हैं?' : 'What documents do I need for a domicile certificate?')}
              className="px-2.5 py-1 rounded-md bg-surface-dim hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              {t('assistantActionDocs')}
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(language === 'hi' ? 'पासपोर्ट अपॉइंटमेंट कैसे बुक करें?' : 'Passport appointment kaise book kare?')}
              className="px-2.5 py-1 rounded-md bg-surface-dim hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              {t('assistantActionAppointment')}
            </button>
          </div>
        </div>

        {/* =========================================================================
            DISCLAIMER & TRUST FOOTER
            ========================================================================= */}
        <div className="text-center text-[11px] text-text-muted px-2">
          <span>🛡️ {t('serviceDisclaimerNotice')}</span>
        </div>
      </div>
    </div>
  );
}
