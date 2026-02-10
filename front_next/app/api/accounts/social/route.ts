import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${URL}/api/accounts/social/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
