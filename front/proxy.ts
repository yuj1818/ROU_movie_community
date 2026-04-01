import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_PAGES = ['/login', '/register'];
const PROTECTED_PAGES = ['/quiz', '/post/create', '/profile'];
const ADMIN_ONLY_PAGES = ['/quiz/create'];

function startsWithAny(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );
}

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isEditPage = pathname.endsWith('/edit');
  const isLoggedIn = !!token;
  const isAdmin = token?.is_staff;

  if (isLoggedIn && startsWithAny(pathname, AUTH_PAGES)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isLoggedIn && (startsWithAny(pathname, PROTECTED_PAGES) || isEditPage)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (startsWithAny(pathname, ADMIN_ONLY_PAGES) && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login/:path*',
    '/register/:path*',
    '/quiz/:path*',
    '/profile/:path*',
    '/post/:path*',
  ],
};
