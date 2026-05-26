import type { SupabaseClient } from '@supabase/supabase-js';

export interface Memory {
  id: string;
  user_id: string;
  memory_type: 'goal' | 'fear' | 'struggle' | 'win' | 'identity' | 'schedule' | 'blocker' | 'why' | 'preference';
  content: string;
  importance: number;
  sprint_day: number;
  created_at: string;
  last_referenced_at: string;
}

/**
 * Retrieves memories for a user.
 * - Always fetches core memories (importance 4-5) up to 5 items.
 * - If contextMessage is provided, also search for matching keywords for relevance (importance 2-3) up to 3 items.
 */
export async function retrieveMemories(
  supabase: SupabaseClient,
  userId: string,
  contextMessage?: string
): Promise<{ core: Memory[]; relevant: Memory[] }> {
  // Fetch core memories (importance 4-5)
  const { data: coreData, error: coreError } = await supabase
    .from('user_memories')
    .select('*')
    .eq('user_id', userId)
    .gte('importance', 4)
    .order('importance', { ascending: false })
    .limit(5);

  if (coreError) {
    console.error('[retrieveMemories] Error fetching core memories:', coreError);
  }

  const core = (coreData || []) as Memory[];

  // Fetch relevant memories (importance 2-3) based on context message keywords
  let relevant: Memory[] = [];

  if (contextMessage && contextMessage.trim().length > 0) {
    // Extract simple keywords from the context message
    const keywords = contextMessage
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4); // Filter out short words (e.g., pronouns, prepositions)

    if (keywords.length > 0) {
      // Fetch importance 2-3 memories to filter contextually in memory
      const { data: relevantData, error: relevantError } = await supabase
        .from('user_memories')
        .select('*')
        .eq('user_id', userId)
        .in('importance', [2, 3])
        .limit(30); // Grab up to 30 medium importance items to filter

      if (relevantError) {
        console.error('[retrieveMemories] Error fetching relevant pool:', relevantError);
      } else if (relevantData) {
        const pool = relevantData as Memory[];
        relevant = pool
          .filter((mem) => {
            const contentLower = mem.content.toLowerCase();
            return keywords.some((kw) => contentLower.includes(kw));
          })
          .slice(0, 3); // Max 3 items context-matched
      }
    }
  }

  return { core, relevant };
}

