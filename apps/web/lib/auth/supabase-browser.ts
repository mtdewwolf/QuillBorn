import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseBrowserClient = SupabaseClient;

let client: SupabaseBrowserClient | null = null;

export const getSupabaseBrowserClient = (): SupabaseBrowserClient => {
  if (client) {
    return client;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "https://example.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "public-anon-key";

  client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    isSingleton: true,
  });

  return client;
};
