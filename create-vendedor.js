require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'vendedor@triadix.com',
    password: 'Vendedor123!',
    options: {
      data: {
        role: 'Vendedor',
        full_name: 'Carlos Vendedor',
        cedula: '1234567890',
        phone: '3001234567',
        address: 'Sucursal Sur'
      }
    }
  });
  console.log("Data:", data);
  if (error) console.error("Error:", error);
}

createUser();

