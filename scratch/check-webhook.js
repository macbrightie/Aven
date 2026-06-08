const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is not defined in .env.local.');
    console.log('👉 Please paste your TELEGRAM_BOT_TOKEN into your local .env.local file temporarily, then run the script.');
    process.exit(1);
  }

  console.log('Connecting to Telegram Bot API...');
  
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await res.json();
    
    if (data.ok) {
      console.log('\n=========================================');
      console.log('📡 TELEGRAM WEBHOOK DIAGNOSTIC STATUS');
      console.log('=========================================');
      console.log('• Webhook URL:       ', data.result.url || '❌ NOT SET (No URL registered)');
      console.log('• Pending updates:   ', data.result.pending_update_count);
      
      if (data.result.last_error_date) {
        const errorTime = new Date(data.result.last_error_date * 1000).toLocaleString();
        console.log('• Last Error Time:   ', errorTime);
        console.log('• Last Error Message:', data.result.last_error_message);
      } else {
        console.log('• Last Delivery:     ✅ SUCCESSFUL (No errors logged by Telegram)');
      }
      console.log('=========================================\n');
    } else {
      console.error('❌ Telegram API returned an error:', data.description);
    }
  } catch (error) {
    console.error('❌ Failed to connect to Telegram API:', error);
  }
}

run().catch(console.error);
