import { OpenAIService } from './openai';
import { ONBOARDING_SYSTEM_PROMPT } from '../prompts/onboarding';
import type { ConversationMessage } from '../types/ai';

export class OnboardingService {
  static async chat(messages: ConversationMessage[]): Promise<string> {
    return OpenAIService.generateChatResponse(
      messages,
      ONBOARDING_SYSTEM_PROMPT
    );
  }

  static isProfileComplete(lastAssistantMessage: string): boolean {
    return lastAssistantMessage.includes('[PROFILE_COMPLETE]');
  }
}
