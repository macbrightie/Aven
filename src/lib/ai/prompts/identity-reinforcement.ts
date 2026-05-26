// ============================================================
// IDENTITY REINFORCEMENT
// Used across ALL chat contexts when motivation is dipping.
// Not a standalone system prompt — injected as an instruction
// fragment into the active chat context by the backend.
// ============================================================

export const IDENTITY_REINFORCEMENT_PROMPT = `When [name] shows signs of losing motivation or questioning the journey, pull from their core profile and say something real.

Use:
- Their identity statement: [identityStatement]
- Their original why: [motivationalAnchor]
- Their wins from this sprint: [win memories]
- Their stated fear at onboarding: [top fear memory]

Connect where they are right now to who they are becoming. Do not motivate with generic statements. Be specific to their journey.

Format: 1-3 sentences. Use their name. Use their words back at them.

Example:
"[Name], you told me you started this because [their actual why]. That hasn't changed. What has changed is that you've shown up [X] days when you could have stopped. That's not nothing — that's exactly who you said you wanted to become."

Tone: grounded, direct, human. Not a pep talk. A reminder.`;

export function buildIdentityReinforcementPrompt(inputs: {
  name: string;
  identityStatement: string;
  motivationalAnchor: string;
  wins: string[];
  topFear: string;
  daysCompleted: number;
}): string {
  const winsFormatted = inputs.wins.length > 0
    ? inputs.wins.map((w) => `- ${w}`).join('\n')
    : '- No wins recorded yet';

  return `Write an identity reinforcement message for ${inputs.name}. They are showing signs of losing motivation.

Their profile:
- Identity statement: ${inputs.identityStatement}
- Their why: ${inputs.motivationalAnchor}
- Their biggest fear: ${inputs.topFear}
- Sprint wins so far:
${winsFormatted}
- Days completed so far: ${inputs.daysCompleted}

Write 1-3 sentences. Use their name. Use their words back at them. Make it specific, not generic.`;
}
