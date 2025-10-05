import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createDemoSession, isDemoEnabled } from "@/lib/auth/demo-user";

type NextCookieOptions = {
  domain?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  expires?: Date;
};

export function mapToNextCookieOptions(options?: CookieOptions): NextCookieOptions {
  if (!options) return {};

  const expires =
    typeof options.expires === "number"
      ? new Date(options.expires)
      : options.expires;

  const sameSite =
    options.sameSite === true
      ? "strict"
      : options.sameSite === false
      ? undefined
      : options.sameSite;

  return {
    domain: options.domain,
    httpOnly: options.httpOnly,
    maxAge: options.maxAge,
    path: options.path,
    sameSite,
    secure: options.secure,
    expires,
  };
}

export function getSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "https://example.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "public-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: async (name) => cookieStore.get(name)?.value,
      set: async (name, value, options) => {
        cookieStore.set(name, value, mapToNextCookieOptions(options));
      },
      remove: async (name, options) => {
        const { path, domain } = mapToNextCookieOptions(options);
        if (domain) {
          cookieStore.delete({ name, domain, path });
        } else if (path) {
          cookieStore.delete({ name, path });
        } else {
          cookieStore.delete(name);
        }
      },
    },
  });
}

export async function getServerSession() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return session;
  }

  const demoCookie = cookies().get("quillborn-demo");
  if (isDemoEnabled() && demoCookie?.value === "1") {
    return createDemoSession();
  }

  return null;
}
