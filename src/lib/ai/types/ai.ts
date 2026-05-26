export interface ConversationMessage {
  role: 'user' | 'assistant' | 'model'; // 'model' for gemini compatibility if needed, but sticking to 'user'|'assistant' helps avoid migrating the DB schema.
  content: string;
}

export interface AIStreamChunk {
  type: 'text' | 'error' | 'done';
  content?: string;
  error?: string;
}

// Added for Gemini structured output
export interface StructuredGenerationOptions<T> {
  schema: any; // Using any for schema to avoid complex type dependencies for now
  systemPrompt?: string;
}
