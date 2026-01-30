import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    const pathname = req.nextUrl.pathname;
    const res = await fetch(`${URL}${pathname}?key=${key}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
