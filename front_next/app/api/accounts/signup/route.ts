import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, password, password2, nickname, region, birth } = body;

  if (password !== password2) {
    return NextResponse.json(
      { message: '비밀번호가 일치하지 않습니다' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${URL}/api/accounts/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password1: password,
        password2,
        region,
        birth,
        nickname,
      }),
    });

    const data = await res.json();

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
