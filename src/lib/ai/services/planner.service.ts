import { GeminiService } from './gemini';
import { PLAN_GENERATION_SYSTEM_PROMPT, buildPlanGenerationPrompt } from '../prompts/plan-generation';
import type { PlanData } from '@/types/plan';
import type { ExtractedProfile } from '@/types/user';

export class PlannerService {
  static async generatePlan(
    profile: Partial<ExtractedProfile>,
    transcript: string
  ): Promise<PlanData> {
    const prompt = buildPlanGenerationPrompt(profile, transcript);

    // We pass the prompt, and we rely on the prompt's instructions for the schema since we
    // aren't fully defining the strict OpenAPI schema object in code yet. 
    // If needed, we can define the full responseSchema object to pass to Gemini.
    // For now, we will use JSON mode without a strict responseSchema object, as the prompt is detailed.

    // Let's use standard generateChatResponse to just get JSON, or we can use generateStructuredResponse.
    // Since we didn't define a massive schema object, we can just use generateChatResponse and parse it.

    const responseText = await GeminiService.generateChatResponse(
      [{ role: 'user', content: prompt }],
      PLAN_GENERATION_SYSTEM_PROMPT
    );

    try {
      // Find JSON block if it included markdown backticks, though we asked it not to.
      let cleanText = responseText.trim();
      if (cleanText.startsWith('\`\`\`json')) {
        cleanText = cleanText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      } else if (cleanText.startsWith('\`\`\`')) {
        cleanText = cleanText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
      }
      
      const data = JSON.parse(cleanText) as PlanData;
      return data;
    } catch (error) {
      console.error('[PlannerService] Failed to parse JSON:', responseText);
      throw new Error('Plan generation failed — invalid JSON response');
    }
  }
}
