import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval to prevent "process is not defined" in browser
const getNextPublicUrl = () => {
  try { return process.env.NEXT_PUBLIC_SUPABASE_URL || ''; } catch { return ''; }
};

const getNextPublicKey = () => {
  try { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; } catch { return ''; }
};

const getViteUrl = () => {
  try { return process.env.VITE_SUPABASE_URL || ''; } catch { return ''; }
};

const getViteKey = () => {
  try { return process.env.VITE_SUPABASE_ANON_KEY || ''; } catch { return ''; }
};

const supabaseUrl = getNextPublicUrl() || getViteUrl();
const supabaseAnonKey = getNextPublicKey() || getViteKey();

console.log('DEBUG env SUPABASE_URL present:', !!supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = (() => {
  try {
    return (supabaseUrl && supabaseAnonKey)
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;
  } catch (error) {
    console.error('Supabase initialization failed:', error);
    return null;
  }
})();