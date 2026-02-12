import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_PAGES = ['/login', '/register'];
const PROTECTED_PAGES = [
  '/quiz',
  '/review/create',
  '/review/edit',
  '/movie/review',
  '/profile',
];

function startsWithAny(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );
}

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;

  if (isLoggedIn && startsWithAny(pathname, AUTH_PAGES)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isLoggedIn && startsWithAny(pathname, PROTECTED_PAGES)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login/:path*',
    '/register/:path*',
    '/quiz/:path*',
    '/profile/:path*',
    '/movie/review/:path*',
    '/review/:path*',
  ],
};
