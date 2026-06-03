import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { buildWelcomeMessage } from '@/lib/telegram/message';
import { sendMessage } from '@/lib/telegram/bot';
import { DailyChatService } from '@/lib/ai/services/daily-chat.service';
import { MemoryService } from '@/lib/ai/services/memory.service';
import { OnboardingService } from '@/lib/ai/services/onboarding.service';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
    };
    text?: string;
  };
}

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.headers.get('x-telegram-bot-api-secret-token');
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const update: TelegramUpdate = await request.json();
    const message = update.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // Handle /start <token> command — links Telegram to Aven account
    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const token = parts[1]; // deep link token

      if (!token) {
        await sendMessage(
          chatId,
          '👋 Welcome to Aven! To connect your account, go to your Aven dashboard and click <b>Connect Telegram</b>.'
        );
        return NextResponse.json({ ok: true });
      }

      const supabase = await createServiceClient();

      // Look up user by token stored temporarily in users table or a linking table
      // Token format: userId encoded as base64url
      let userId: string;
      try {
        userId = Buffer.from(token, 'base64url').toString('utf-8');
      } catch {
        await sendMessage(chatId, '❌ Invalid link. Please try again from your Aven dashboard.');
        return NextResponse.json({ ok: true });
      }

      const { data: user, error } = await supabase
        .from('users')
        .update({ telegram_chat_id: chatId })
        .eq('id', userId)
        .select('id')
        .single();

      if (error || !user) {
        await sendMessage(chatId, '❌ Could not link your account. Please try again from your Aven dashboard.');
        return NextResponse.json({ ok: true });
      }

      // Fetch the user's latest plan goal
      const { data: plan } = await supabase
        .from('plans')
        .select('primary_goal')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const welcomeText = buildWelcomeMessage({
        userName: message.from?.first_name,
        primaryGoal: plan?.primary_goal ?? 'your goal',
        appUrl: process.env.NEXT_PUBLIC_APP_URL!,
      });

      await sendMessage(chatId, welcomeText);
    } else {
      const supabase = await createServiceClient();

      // 1. Look up user by telegram_chat_id
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_chat_id', chatId)
        .maybeSingle();

      if (userError || !user) {
        await sendMessage(
          chatId,
          '👋 Welcome to Aven! To link your Telegram, please visit your web dashboard and click <b>Connect Telegram</b>.'
        );
        return NextResponse.json({ ok: true });
      }

      // 2. Determine if user is in onboarding or active coaching (has a plan)
      const { data: plan } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!plan) {
        // ONBOARDING FLOW
        let { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!conversation) {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({ user_id: user.id, messages: [] })
            .select()
            .single();
          conversation = newConv;
        }

        if (!conversation) {
          await sendMessage(chatId, '⚠️ Something went wrong trying to start onboarding. Please try again on the web.');
          return NextResponse.json({ ok: true });
        }

        const updatedMessages = [
          ...(conversation.messages || []),
          { role: 'user', content: text }
        ];

        // Call Gemini onboarding chat
        const reply = await OnboardingService.chat(updatedMessages);
        const isComplete = OnboardingService.isProfileComplete(reply);

        // Save conversation history to Supabase
        await supabase
          .from('conversations')
          .update({
            messages: [
              ...updatedMessages,
              { role: 'assistant', content: reply }
            ],
            completed: isComplete
          })
          .eq('id', conversation.id);

        let cleanReply = reply;
        if (isComplete) {
          cleanReply = reply.replace(/\[PROFILE_READY\][\s\S]*?\[\/PROFILE_READY\]/g, '').trim();
        }

        // Send Aven's reply back to user via Telegram
        await sendMessage(chatId, cleanReply);
      } else {
        // DAILY COACHING SPRINT CHAT FLOW
        let { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!conversation) {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({ user_id: user.id, messages: [] })
            .select()
            .single();
          conversation = newConv;
        }

        if (!conversation) {
          await sendMessage(chatId, '⚠️ Something went wrong trying to access your coaching session.');
          return NextResponse.json({ ok: true });
        }

        const updatedMessages = [
          ...(conversation.messages || []),
          { role: 'user', content: text }
        ];

        // Save user message immediately to the database
        await supabase
          .from('conversations')
          .update({ messages: updatedMessages })
          .eq('id', conversation.id);

        // Determine active sprint day
        const { data: latestCard } = await supabase
          .from('daily_cards')
          .select('day_number')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .order('day_number', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        const sprintDay = latestCard?.day_number || 1;

        // Call daily coaching chat service
        const reply = await DailyChatService.chat(supabase, user.id, conversation.id, sprintDay);

        // Save Aven's reply to the database
        const finalMessages = [
          ...updatedMessages,
          { role: 'assistant', content: reply }
        ];

        await supabase
          .from('conversations')
          .update({ messages: finalMessages })
          .eq('id', conversation.id);

        // Send Aven's response to the user via Telegram
        await sendMessage(chatId, reply);

        // Run background processes concurrently
        try {
          Promise.allSettled([
            DailyChatService.calculateHealthScore(supabase, user.id, sprintDay),
            MemoryService.extractAndSave(supabase, user.id, conversation.id, sprintDay)
          ]);
        } catch (bgError) {
          console.error('[telegram/webhook] Background tasks error:', bgError);
        }
      }
    }
  } catch (error) {
    console.error('[telegram/webhook] Error:', error);
    return NextResponse.json({ ok: true }); // Always 200 to Telegram
  }
}
