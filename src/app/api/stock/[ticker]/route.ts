import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  // 2 years of daily candles
  const periodEnd = Math.floor(Date.now() / 1000);
  const periodStart = periodEnd - 2 * 365 * 24 * 60 * 60;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&period1=${periodStart}&period2=${periodEnd}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Yahoo Finance error', status: res.status }, { status: 502 });
    }

    const raw = await res.json();
    const result = raw?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: 'No data returned' }, { status: 404 });
    }

    const meta = result.meta ?? {};
    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

    return NextResponse.json({
      price: meta.regularMarketPrice ?? null,
      prevClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
      change: meta.regularMarketPrice && meta.chartPreviousClose
        ? meta.regularMarketPrice - meta.chartPreviousClose
        : null,
      changePercent: meta.regularMarketChangePercent ?? null,
      timestamps,
      closes,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
