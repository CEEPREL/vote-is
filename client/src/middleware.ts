import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const url = req.nextUrl.clone();

  console.log('token: ', token);

  if (token && PUBLIC_PATHS.includes(url.pathname)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!token && !PUBLIC_PATHS.includes(url.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set(
      'redirect',
      req.nextUrl.pathname + req.nextUrl.search,
    );
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
