import { GoogleGenAI } from '@google/genai';
import type { ConversationMessage } from '../types/ai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const DEFAULT_MODEL = 'gemini-2.5-flash';

export class GeminiService {
  /**
   * Generates a standard text response for chat.
   */
  static async generateChatResponse(
    messages: ConversationMessage[],
    systemInstruction?: string,
    model: string = DEFAULT_MODEL
  ): Promise<string> {
    const response = await ai.models.generateContent({
      model,
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || '';
  }

  /**
   * Generates a structured JSON response based on a schema.
   */
  static async generateStructuredResponse<T>(
    prompt: string,
    schema: any, // Using standard JSON Schema object
    systemInstruction?: string,
    model: string = DEFAULT_MODEL
  ): Promise<T> {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Lower temperature for more deterministic JSON
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text || '';
    return JSON.parse(text) as T;
  }
}
