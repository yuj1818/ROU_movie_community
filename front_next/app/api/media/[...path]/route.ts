import { NextRequest } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  const res = await fetch(`${URL}/media/${path.join('/')}`, {
    cache: 'no-store',
  });

  if (!res.ok) return new Response('Image fetch failed', { status: 500 });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
