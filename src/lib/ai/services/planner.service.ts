import { OpenAIService } from './openai';
import { PLAN_GENERATION_SYSTEM_PROMPT, buildPlanGenerationPrompt } from '../prompts/plan-generation';
import { ADJUST_PLAN_SYSTEM_PROMPT, buildAdjustPlanPrompt } from '../prompts/adjust-plan';
import type { PlanData } from '@/types/plan';
import type { ExtractedProfile } from '@/types/user';

export class PlannerService {
  static async generatePlan(
    profile: Partial<ExtractedProfile>,
    transcript: string
  ): Promise<PlanData> {
    const prompt = buildPlanGenerationPrompt(profile, transcript);

    try {
      // Using OpenAI's JSON mode which guarantees valid JSON output matching the prompt's instructions.
      const data = await OpenAIService.generateStructuredResponse<PlanData>(
        prompt,
        null,
        PLAN_GENERATION_SYSTEM_PROMPT
      );

      return data;
    } catch (error) {
      console.error('[PlannerService] Failed to parse JSON:', error);
      throw new Error('Plan generation failed — invalid JSON response');
    }
  }

  static async adjustPlan(
    originalPlan: any,
    completedTasks: any[],
    intensity: string,
    timelineMonths: number,
    changeDescription: string,
    startDay: number
  ): Promise<any> {
    const prompt = buildAdjustPlanPrompt(
      originalPlan,
      completedTasks,
      intensity,
      timelineMonths,
      changeDescription,
      startDay
    );

    try {
      const data = await OpenAIService.generateStructuredResponse<any>(
        prompt,
        null,
        ADJUST_PLAN_SYSTEM_PROMPT
      );
      return data;
    } catch (error) {
      console.error('[PlannerService] Failed to adjust plan:', error);
      throw new Error('Plan adjustment failed — invalid JSON response');
    }
  }
}
