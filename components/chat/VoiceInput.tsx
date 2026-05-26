'use client';

import { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function VoiceInput({
  onTranscript,
  className = '',
  children,
  onListeningChange,
  onListeningRestart,
}: {
  onTranscript: (text: string) => void;
  className?: string;
  children?: React.ReactNode | ((isListening: boolean) => React.ReactNode);
  onListeningChange?: (isListening: boolean) => void;
  onListeningRestart?: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const shouldBeListeningRef = useRef(false);
  const lastStartTimestamp = useRef(0);

  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    console.log('[VoiceInput] Initializing SpeechRecognition...');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognitionRef.current = recognition;
    shouldBeListeningRef.current = true;
    lastStartTimestamp.current = Date.now();

    recognition.onstart = () => {
      console.log('[VoiceInput] Microphone active. Listening started.');
      setIsListening(true);
      onListeningChange?.(true);
    };

    recognition.onend = () => {
      console.log('[VoiceInput] Session ended.');
      if (shouldBeListeningRef.current) {
        console.log('[VoiceInput] Auto-restarting continuous dictation segment...');
        onListeningRestart?.();
        const timeSinceLastStart = Date.now() - lastStartTimestamp.current;
        if (timeSinceLastStart < 1000) {
          console.warn('[VoiceInput] Restarting too fast. Cooldown delayed start...');
          setTimeout(() => {
            if (shouldBeListeningRef.current) {
              try {
                lastStartTimestamp.current = Date.now();
                recognitionRef.current?.start();
              } catch (err) {
                console.error('[VoiceInput] Failed delayed restart:', err);
              }
            }
          }, 1000);
        } else {
          try {
            lastStartTimestamp.current = Date.now();
            recognition.start();
          } catch (err) {
            console.error('[VoiceInput] Failed immediate restart:', err);
          }
        }
      } else {
        setIsListening(false);
        onListeningChange?.(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[VoiceInput] Warning or Error event received:', event.error);
      
      // Stop completely on fatal, permission, or network block errors
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed' ||
        event.error === 'audio-capture' ||
        event.error === 'network'
      ) {
        console.error('[VoiceInput] Fatal error occurred. Stopping listener:', event.error);
        shouldBeListeningRef.current = false;
        setIsListening(false);
        onListeningChange?.(false);

        if (event.error === 'network') {
          alert('Chrome Speech Recognition is blocked by a network or firewall restriction. If you are using a VPN, AdBlocker, or Pi-hole, try disabling it, or switch to Safari (which uses macOS native dictation and works flawlessly!).');
        }
      }
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log('[VoiceInput] Dictated transcript update:', transcript);
      if (transcript) {
        onTranscript(transcript.trim());
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('[VoiceInput] Failed to invoke recognition.start():', e);
    }
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      console.log('[VoiceInput] User clicked to stop and check text.');
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      onListeningChange?.(false);
    } else {
      startListening();
    }
  };

  if (children) {
    return (
      <button
        type="button"
        onClick={toggleListening}
        className={`focus:outline-none ${className}`}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      >
        {typeof children === 'function' ? children(isListening) : children}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Voice input"
      onClick={toggleListening}
      className={`
        p-2 rounded-full transition
        ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
        ${className}
      `}
    >
      {isListening ? '🎙️' : '🎤'}
    </button>
  );
}