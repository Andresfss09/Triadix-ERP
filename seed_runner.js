import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres.kduugycxrbpzzxekxmwf:R1059594222@aws-1-us-west-2.pooler.supabase.com:5432/postgres';

async function seed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'seed.sql'), 'utf8');
    await client.query(sql);
    console.log('Seed applied successfully');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

seed();

