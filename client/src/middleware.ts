import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const url = req.nextUrl.clone();

  // If logged in and trying to access auth pages, redirect to dashboard
  if (token && ['/', '/login', '/register'].includes(url.pathname)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If not logged in and trying to access protected pages, redirect to login
  const publicPaths = ['/', '/login', '/register'];
  if (!token && !publicPaths.includes(url.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/create-room',
    '/room/:path*',
  ],
};
