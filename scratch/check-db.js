const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local');
    process.exit(1);
  }

  console.log('Connecting to Supabase:', url);
  const supabase = createClient(url, serviceKey);

  console.log('\n--- Checking auth.users (via admin API) ---');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error listing auth.users:', authError.message);
  } else {
    console.log(`Found ${authData.users.length} user(s) in auth.users:`);
    authData.users.forEach(u => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, CreatedAt: ${u.created_at}`);
    });
  }

  console.log('\n--- Checking public.users ---');
  const { data: publicData, error: publicError } = await supabase
    .from('users')
    .select('*');
  
  if (publicError) {
    console.error('Error reading public.users:', publicError.message);
  } else {
    console.log(`Found ${publicData.length} user(s) in public.users:`);
    publicData.forEach(u => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, TelegramChatID: ${u.telegram_chat_id}, PreferredGreeting: ${u.preferred_greeting}`);
    });
  }

  console.log('\n--- Check complete ---');
}

run().catch(console.error);
