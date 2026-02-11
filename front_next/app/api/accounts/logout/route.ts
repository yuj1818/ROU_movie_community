import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    return fetch(`${URL}${pathname}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
