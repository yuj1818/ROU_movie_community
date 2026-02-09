import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const body = await req.json();

  const res = await fetch(`${URL}/api/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json({ ok: true });

  cookieStore.set('accessToken', data.key, {
    httpOnly: true,
    path: '/',
    secure: false,
  });

  cookieStore.set('userId', data.user, {
    httpOnly: true,
    path: '/',
    secure: false,
  });

  return response;
}
