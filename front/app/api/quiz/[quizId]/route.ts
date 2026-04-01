import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  try {
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}/`, {
      headers: {
        Authorization: `Token ${session.backendToken}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Token ${session.backendToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
