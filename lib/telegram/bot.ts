import TelegramBot from 'node-telegram-bot-api';

let bot: TelegramBot | null = null;

export function getBot(): TelegramBot {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    // Polling disabled — we use webhook in production
    bot = new TelegramBot(token, { polling: false });
  }
  return bot;
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
): Promise<TelegramBot.Message> {
  const botInstance = getBot();
  return botInstance.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    ...options,
  });
}

export async function setWebhook(webhookUrl: string): Promise<boolean> {
  const botInstance = getBot();
  return botInstance.setWebHook(webhookUrl, {
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
  });
}

export async function verifyWebhookSecret(secret: string | null): Promise<boolean> {
  return secret === process.env.TELEGRAM_WEBHOOK_SECRET;
}
