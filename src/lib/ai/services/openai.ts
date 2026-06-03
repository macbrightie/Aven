import OpenAI from 'openai';
import type { ConversationMessage } from '../types/ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const DEFAULT_MODEL = 'gpt-4o-mini';

export class OpenAIService {
  /**
   * Generates a standard text response for chat.
   */
  static async generateChatResponse(
    messages: ConversationMessage[],
    systemInstruction?: string,
    model: string = DEFAULT_MODEL
  ): Promise<string> {
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    if (systemInstruction) {
      formattedMessages.push({ role: 'system', content: systemInstruction });
    }
    
    formattedMessages.push(
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );

    const response = await openai.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Generates a structured JSON response.
   */
  static async generateStructuredResponse<T>(
    prompt: string,
    schema?: any | null,
    systemInstruction?: string,
    model: string = DEFAULT_MODEL
  ): Promise<T> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.2, // Lower temperature for more deterministic JSON
      response_format: { type: 'json_object' },
    });

    const text = response.choices[0]?.message?.content || '';
    return JSON.parse(text) as T;
  }
}
