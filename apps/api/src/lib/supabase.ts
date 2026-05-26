import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _db: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (_db) return _db;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  _db = createClient(url, key, { auth: { persistSession: false } });
  return _db;
}

export const db = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
