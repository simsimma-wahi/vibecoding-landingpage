import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Server-side Supabase client with authentication support
export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  try {
    const cookieStore = await cookies();
    
    // Create a Supabase client with the user's session from cookies
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Server-side: cookies are handled by Next.js
        },
        remove(name: string, options: any) {
          // Server-side: cookies are handled by Next.js
        },
      },
    });

    return supabase;
  } catch (error) {
    // Fallback: create client without cookie handling if cookies() fails
    console.warn('Could not access cookies, creating client without session:', error);
    return createClient(supabaseUrl, supabaseAnonKey);
  }
}

