import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${session.backendToken}`,
      },
    });

    return new NextResponse(null, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
