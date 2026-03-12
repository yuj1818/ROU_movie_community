import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const pathname = req.nextUrl.pathname;
    const page = req.nextUrl.searchParams.get('page');
    const res = await fetch(`${URL}${pathname}/?page=${page}`, {
      headers: {
        Authorization: session ? `Token ${session.backendToken}` : '',
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
