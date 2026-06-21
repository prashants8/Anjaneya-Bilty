import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL) as string;
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) as string;

console.log('DEBUG env SUPABASE_URL:', !!supabaseUrl);
console.log('DEBUG env VITE_SUPABASE_ANON_KEY present:', !!supabaseAnonKey);

// temporarily avoid throwing to see app errors in console
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
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