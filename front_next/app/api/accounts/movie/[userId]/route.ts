import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const target = req.nextUrl.searchParams.get('target');
    const page = req.nextUrl.searchParams.get('page');
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}?target=${target}&page=${page}`, {
      headers: {
        Authorization: session ? `Token ${session.backendToken}` : '',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
