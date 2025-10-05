import type { Session } from "@supabase/supabase-js";

export function isDemoEnabled() {
  return process.env.NEXT_PUBLIC_DEMO === "true";
}

export function getDemoUser() {
  if (!isDemoEnabled()) return null;
  return {
    id: "demo-user",
    email: "demo@quillborn.ai",
    name: "Demo Author",
  };
}

export function createDemoSession(): Session {
  const now = Math.floor(Date.now() / 1000);
  const isoNow = new Date(now * 1000).toISOString();

  return {
    provider_token: null,
    provider_refresh_token: null,
    access_token: "demo-access-token",
    refresh_token: "demo-refresh-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: now + 3600,
    user: {
      id: "demo-user",
      email: "demo@quillborn.ai",
      role: "authenticated",
      aud: "authenticated",
      app_metadata: { demo: true },
      user_metadata: { full_name: "Demo Author" },
      created_at: isoNow,
      updated_at: isoNow,
      email_confirmed_at: isoNow,
      last_sign_in_at: isoNow,
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  } satisfies Session;
}
