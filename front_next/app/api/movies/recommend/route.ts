import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: 'UnAuthenticated' }, { status: 401 });

  try {
    const title = req.nextUrl.searchParams.get('title');
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}/?title=${title}`, {
      headers: {
        Authorization: `Token ${session.backendToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
