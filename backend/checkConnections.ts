import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { Client as PgClient, ClientConfig } from 'pg';

async function checkPostgres() {
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || !dbUrl.startsWith('postgres')) {
    console.error('❌ DATABASE_URL not valid:', dbUrl);
    return;
  }

  // Manual parsing to handle special characters
  let config: ClientConfig = {};

  try {
    // Extract components using regex patterns
    // Format: postgresql://username:password@hostname:port/database?params
    const regex = /postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(?:\?.*)?/;
    const matches = dbUrl.match(regex);

    if (!matches || matches.length < 6) {
      throw new Error('Could not parse DATABASE_URL properly');
    }

    config = {
      host: matches[3],
      port: parseInt(matches[4], 10),
      user: matches[1],
      password: matches[2],
      database: matches[5],
      ssl: { rejectUnauthorized: false },
    };

    console.log('✅ Database config parsed successfully');
  } catch (err) {
    console.error('❌ Failed to parse DATABASE_URL:', err);
    // Print a more helpful message with a sanitized version of the URL
    const sanitized = dbUrl.replace(/:[^@]+@/, ':***@');
    console.error('Database URL format (sanitized):', sanitized);
    return;
  }

  const client = new PgClient(config);

  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', res.rows[0]);
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
  } finally {
    await client.end();
  }
}

async function checkSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables not set.');
    return;
  }

  console.log('Connecting to Supabase with URL:', supabaseUrl);
  console.log('API key length:', supabaseKey.length);

  // Add validation for Supabase key format
  if (supabaseKey.length < 30) {
    console.error('❌ Supabase API key appears to be invalid (too short)');
    console.error('Valid Supabase API keys are typically long strings starting with "eyJh..."');
    console.error(
      'Please check your .env file and update SUPABASE_KEY with the correct anon or service_role key'
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.from('profiles').select('*').limit(1);

  if (error) {
    console.error('❌ Supabase connection error:', error);
    console.log('Please verify that:');
    console.log('1. The SUPABASE_URL is correct');
    console.log(
      '2. The SUPABASE_KEY is the anon key or service_role key from your Supabase project'
    );
    console.log('3. The "profiles" table exists in your database');
  } else {
    console.log('✅ Supabase connected:', data && data.length > 0 ? 'Success' : 'No data');
  }
}

(async () => {
  await checkPostgres();
  await checkSupabase();
})();
