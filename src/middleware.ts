
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // In a real production app with cookies, we could verify the token here.
  // Since we're using LocalStorage for tokens in this specific client request,
  // we'll rely on API-level protection and frontend-level redirection.
  // However, we can still protect certain paths from being reached if we were using cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/tasks/:path*'],
};
