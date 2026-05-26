'use client';

import { useState, useRef } from 'react';
import { VoiceInput } from './VoiceInput';

// ConversationUI — stub for the main chat interface
// Will be implemented in the UI phase
export function ConversationUI() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const baseValueRef = useRef("");

  return (
    <div className="flex flex-col h-[60vh] rounded-[2rem] border border-border bg-card overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <p className="text-muted-foreground text-sm text-center">
          Conversation will appear here
        </p>
      </div>
      <div className="border-t border-border p-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type your message…"}
          className="flex-1 px-6 py-3 rounded-[999px] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <VoiceInput
          onTranscript={(text) => {
            setInput(baseValueRef.current ? `${baseValueRef.current} ${text}` : text);
          }}
          onListeningChange={(listening) => {
            setIsListening(listening);
            if (listening) {
              baseValueRef.current = input;
            }
          }}
          onListeningRestart={() => {
            baseValueRef.current = input;
          }}
        >
          {(activeListening) => (
            <span className="text-xl">
              {activeListening ? '✔️' : '🎤'}
            </span>
          )}
        </VoiceInput>
      </div>
    </div>
  );
}


