import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect_to") ?? "/app";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
  }

  const supabase = getSupabaseServerClient();
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
