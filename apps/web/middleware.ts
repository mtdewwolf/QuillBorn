import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { mapToNextCookieOptions } from "@/lib/auth/supabase-server";

const PROTECTED_PATHS = [/^\/app(\/.*)?$/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((regex) => regex.test(pathname));

  if (!isProtected) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    "https://example.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "public-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => {
        response.cookies.set({
          name,
          value,
          ...mapToNextCookieOptions(options),
        });
      },
      remove: (name, options) => {
        const mapped = mapToNextCookieOptions(options);
        if (mapped.domain) {
          response.cookies.delete({ name, domain: mapped.domain, path: mapped.path });
        } else if (mapped.path) {
          response.cookies.delete({ name, path: mapped.path });
        } else {
          response.cookies.delete(name);
        }
      },
    },
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const demoEnabled = process.env.NEXT_PUBLIC_DEMO === "true";
  const hasDemoCookie = request.cookies.get("quillborn-demo")?.value === "1";
  const wantsDemo = request.nextUrl.searchParams.get("demo") === "1";

  if (!session) {
    if (demoEnabled && (hasDemoCookie || wantsDemo)) {
      if (!hasDemoCookie) {
        response.cookies.set("quillborn-demo", "1", {
          path: "/",
          httpOnly: false,
          maxAge: 60 * 60 * 24,
        });
      }
      return response;
    }

    response.cookies.delete("quillborn-demo");
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (hasDemoCookie) {
    response.cookies.delete("quillborn-demo");
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/api/:path*"],
};
