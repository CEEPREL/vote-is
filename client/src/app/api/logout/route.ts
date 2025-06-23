import { NextResponse } from 'next/server';

export function logout() {
  const response = NextResponse.redirect('/login');
  response.cookies.delete('accessToken');
  return response;
}
