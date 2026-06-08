const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const liveUrl = process.argv[2];

  if (!token || !secret) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN or TELEGRAM_WEBHOOK_SECRET is missing in .env.local.');
    process.exit(1);
  }

  if (!liveUrl) {
    console.error('❌ Error: Please provide your live deployment URL as an argument.');
    console.log('👉 Example: node scratch/register-webhook.js https://deylon-4zd21ahsz-brightmacs-projects.vercel.app');
    console.log('👉 Example: node scratch/register-webhook.js https://deylon.app');
    process.exit(1);
  }

  // Ensure url starts with https
  let baseUrl = liveUrl.trim();
  if (!baseUrl.startsWith('https://')) {
    console.error('❌ Error: Webhook URL must use HTTPS protocol (starts with https://).');
    process.exit(1);
  }
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const webhookUrl = `${baseUrl}/api/telegram/webhook`;
  console.log(`Registering webhook URL: ${webhookUrl}`);

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&secret_token=${encodeURIComponent(secret)}`
    );
    const data = await res.json();

    if (data.ok) {
      console.log('\n=========================================');
      console.log('✅ TELEGRAM WEBHOOK REGISTERED SUCCESSFULLY!');
      console.log('=========================================');
      console.log('• Target URL: ', webhookUrl);
      console.log('• Response:   ', data.description);
      console.log('=========================================\n');
    } else {
      console.error('❌ Telegram API returned an error:', data.description);
    }
  } catch (error) {
    console.error('❌ Failed to connect to Telegram API:', error);
  }
}

run().catch(console.error);
