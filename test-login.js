require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'vendedor@triadix.com',
    password: 'Vendedor123!'
  });
  console.log("Data:", !!data.session);
  if (error) console.error("Error:", error.message);
}

testLogin();

