import type { NextRequest } from 'next/server';

const allowedSources = [
  { hostname: 'quranenc.com', pathname: '/downloads/pdf/' },
  { hostname: 'hadeethenc.com', pathname: '/downloads/pdf/' },
] as const;

function isAllowedSource(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && allowedSources.some((source) => url.hostname === source.hostname && url.pathname.startsWith(source.pathname));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url');
  if (!source || !isAllowedSource(source)) return new Response('Invalid PDF source', { status: 400 });

  const range = request.headers.get('range');
  const upstream = await fetch(source, {
    headers: range ? { Range: range } : undefined,
    cache: 'force-cache',
  });
  if (!upstream.ok && upstream.status !== 206) return new Response('PDF source unavailable', { status: upstream.status });

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
    'Accept-Ranges': upstream.headers.get('accept-ranges') ?? 'bytes',
  });
  for (const name of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
