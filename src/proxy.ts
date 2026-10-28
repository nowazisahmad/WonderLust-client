import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  // Better-Auth session cookie check in Edge runtime
  // (Better Auth uses 'better-auth.session_token' or '__Secure-better-auth.session_token')
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie || !sessionCookie.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/add-destination', '/my-bookings', '/destinations/:path', '/profile'],
}
