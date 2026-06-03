export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamChunk {
  type: 'text' | 'error' | 'done';
  content?: string;
  error?: string;
}

// Added for structured output
export interface StructuredGenerationOptions<T> {
  schema: any;
  systemPrompt?: string;
}
