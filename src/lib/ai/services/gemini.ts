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
    // Sanitize messages for Gemini: must start with 'user' and roles must alternate
    const sanitizedContents: any[] = [];
    
    for (const m of messages) {
      const mappedRole = m.role === 'assistant' ? 'model' : m.role;
      
      if (sanitizedContents.length === 0) {
        if (mappedRole === 'model') {
          // Force start with user if the first message is from the assistant
          sanitizedContents.push({ role: 'user', parts: [{ text: 'Hello' }] });
        }
        sanitizedContents.push({ role: mappedRole, parts: [{ text: m.content }] });
      } else {
        const lastContent = sanitizedContents[sanitizedContents.length - 1];
        if (lastContent.role === mappedRole) {
          // Merge consecutive messages of the same role
          lastContent.parts[0].text += '\n\n' + m.content;
        } else {
          sanitizedContents.push({ role: mappedRole, parts: [{ text: m.content }] });
        }
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents: sanitizedContents,
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
