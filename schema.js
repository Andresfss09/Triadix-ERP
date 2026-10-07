const { Client } = require('pg');

async function run() {
  const client = new Client('postgresql://postgres.kduugycxrbpzzxekxmwf:TRIADIX_2026_ERP_supersecure@aws-1-us-west-2.pooler.supabase.com:5432/postgres');
  await client.connect();

  try {
    console.log("Checking columns...");
    const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'`);
    const existing = res.rows.map(r => r.column_name);
    
    const required = ['full_name', 'cedula', 'email', 'phone', 'address'];
    for (const col of required) {
      if (!existing.includes(col)) {
        console.log(`Adding column ${col}...`);
        await client.query(`ALTER TABLE profiles ADD COLUMN ${col} TEXT;`);
      }
    }
    console.log("Done");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();

