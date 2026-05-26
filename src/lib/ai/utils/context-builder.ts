import { buildContextInjection, type ContextInjectionInputs } from '../prompts/context-injection';

/**
 * Combines the dynamic USER CONTEXT block with the active system prompt.
 * Prepend this to the system instructions before sending to Gemini.
 */
export function buildChatSystemPrompt(
  systemPrompt: string,
  inputs: ContextInjectionInputs
): string {
  const contextBlock = buildContextInjection(inputs);
  return `${contextBlock}\n\n${systemPrompt}`;
}

