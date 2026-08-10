
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  if (!isProtectedRoute && !isAdminRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find((c) => c.name.includes("auth-token"));

  let user: any = null;

  if (authCookie?.value) {
    try {
      const parsed = JSON.parse(authCookie.value);
      const accessToken = Array.isArray(parsed)
        ? parsed[0]
        : parsed?.access_token || parsed;

      if (accessToken && typeof accessToken === "string") {
        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL ||
          "https://cgzfvvwtmltwstvpmzzy.supabase.co";
        const supabaseAnonKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: supabaseAnonKey,
          },
        });

        if (res.ok) {
          user = await res.json();
        }
      }
    } catch {
      // Ignore cookie parse errors safely
    }
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};