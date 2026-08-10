if (typeof (globalThis as any).__dirname === "undefined") {
  (globalThis as any).__dirname = "";
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
    const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

    if ((isProtectedRoute || isAdminRoute) && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (isAuthRoute && user) {
      const role =
        user.app_metadata?.role || user.user_metadata?.role || user.role;
      const isAdmin =
        role === "admin" ||
        user.app_metadata?.is_admin === true ||
        user.user_metadata?.is_admin === true;

      const url = request.nextUrl.clone();
      url.pathname = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("[middleware] Auth check failed:", err);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};