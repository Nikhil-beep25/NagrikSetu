import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom React Hook for Web Speech API Speech Recognition
 * Supports English (en-IN), Hindi (hi-IN), and Hinglish with fallback.
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = useCallback(
    ({ onResult, lang = 'en-IN' } = {}) => {
      setError(null);

      if (!isSupported) {
        setError('not_supported');
        return;
      }

      try {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        // Stop any running instance
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {
            // Ignore
          }
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = lang;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const currentText = finalTranscript || interimTranscript;
          if (currentText && onResult) {
            onResult(currentText, Boolean(finalTranscript));
          }
        };

        recognition.onerror = (event) => {
          if (event.error === 'not-allowed') {
            setError('permission_denied');
          } else if (event.error !== 'no-speech') {
            setError(event.error || 'speech_error');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        setError('start_failed');
        setIsListening(false);
      }
    },
    [isSupported],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    error,
    setError,
    startListening,
    stopListening,
  };
}
