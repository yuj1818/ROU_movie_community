import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pathname = req.nextUrl.pathname;

  const { password1, password2 } = body;

  if (password1 !== password2) {
    return NextResponse.json(
      { message: '비밀번호가 일치하지 않습니다' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${URL}${pathname}/`, {
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
