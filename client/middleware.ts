import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  // If no token, redirect to login
  if (!token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next(); // Allow request
}
export const config = {
  matcher: ['/dashboard', '/create-room', '/room/:path*'],
};
