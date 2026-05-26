import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/plan'];

// Routes that are always public
const PUBLIC_ROUTES = [
  '/',
  '/start',
  '/building',
  '/plan-reveal',
  '/challenge',
  '/connect',
  '/verify',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Refresh the Supabase session on every request
  const { supabaseResponse, user } = await updateSession(request);

  // Check if the route is protected
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !user) {
    // Redirect unauthenticated users to the landing page
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
