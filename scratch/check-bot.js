const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not defined in .env.local');
    process.exit(1);
  }

  console.log('Using Bot Token:', token.substring(0, 10) + '...');
  
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    
    if (data.ok) {
      console.log('\n--- Bot Info ---');
      console.log('ID:', data.result.id);
      console.log('First Name:', data.result.first_name);
      console.log('Username:', data.result.username);
      console.log('Can Join Groups:', data.result.can_join_groups);
      console.log('Can Read All Group Messages:', data.result.can_read_all_group_messages);
      console.log('Supports Inline Queries:', data.result.supports_inline_queries);
      
      console.log(`\nYour Telegram Bot URL should be: https://t.me/${data.result.username}`);
    } else {
      console.error('Error fetching bot info:', data.description);
    }
  } catch (error) {
    console.error('Failed to contact Telegram API:', error);
  }
}

run().catch(console.error);
