'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { X, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { StockMeta } from '@/app/tracker/page';

interface QuoteData {
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
}

// Candle stored as { dateStr -> close } for O(1) lookup, no timestamp mismatch
interface CandleMap {
  byDate: Record<string, number>; // "2026-03-07" -> close price
  coveragePrice: number | null;   // close on or after coverage date
}

interface ChartPoint {
  date: string;
  [ticker: string]: number | string | null;
}

const CHART_COLORS = [
  '#c9a96e',
  '#1a1a2e',
  '#5b7fa3',
  '#8b6f5a',
  '#4a7c6f',
  '#7a5a8a',
  '#9e5a5a',
];

const FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY ?? '';

const FILTER_OPTIONS = [
  { value: 'best', label: 'Best Since Coverage' },
  { value: 'worst', label: 'Worst Since Coverage' },
  { value: 'all', label: 'All Covered' },
] as const;

type FilterType = (typeof FILTER_OPTIONS)[number]['value'];

function tsToDateStr(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateStrToLabel(s: string): string {
  const [, m, d] = s.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default function StockTracker({ stocks }: { stocks: StockMeta[] }) {
  const tickers = stocks.map((s) => s.ticker);

  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [candlesLoaded, setCandlesLoaded] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [filter, setFilter] = useState<FilterType>('best');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const candleCache = useRef<Record<string, CandleMap>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // ─── Fetch quotes ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!FINNHUB_KEY || tickers.length === 0) { setLoadingQuotes(false); return; }

    async function fetchQuotes() {
      const results: Record<string, QuoteData> = {};
      for (const ticker of tickers) {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
          const d = await res.json();
          if (d.c) results[ticker] = { price: d.c, change: d.d ?? 0, changePercent: d.dp ?? 0, prevClose: d.pc ?? d.c };
        } catch { /* skip */ }
      }
      setQuotes(results);
      setLoadingQuotes(false);
    }

    fetchQuotes();
    const iv = setInterval(fetchQuotes, 60_000);
    return () => clearInterval(iv);
  }, []);

  // ─── Fetch ALL candles on mount (fix: use date strings, not timestamps) ──
  useEffect(() => {
    if (!FINNHUB_KEY || stocks.length === 0) { setCandlesLoaded(true); return; }

    const startTs = Math.floor(new Date('2026-01-02').getTime() / 1000);
    const endTs = Math.floor(Date.now() / 1000);

    async function fetchAll() {
      for (const stock of stocks) {
        if (candleCache.current[stock.ticker]) continue;
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${stock.ticker}&resolution=D&from=${startTs}&to=${endTs}&token=${FINNHUB_KEY}`
          );
          const data = await res.json();
          if (data.s === 'ok' && data.t?.length) {
            // Build date-string map
            const byDate: Record<string, number> = {};
            data.t.forEach((ts: number, i: number) => {
              byDate[tsToDateStr(ts)] = data.c[i];
            });

            // Find coverage price: first close on or after coverage date
            const coverageTs = new Date(stock.date).getTime() / 1000;
            let coveragePrice: number | null = null;
            const sortedTs: number[] = [...data.t].sort((a: number, b: number) => a - b);
            for (const ts of sortedTs) {
              if (ts >= coverageTs) { coveragePrice = byDate[tsToDateStr(ts)]; break; }
            }

            candleCache.current[stock.ticker] = { byDate, coveragePrice };
          }
        } catch { /* skip */ }
      }
      setCandlesLoaded(true);
    }

    fetchAll();
  }, []);

  // ─── Helper: % since covered for a ticker ────────────────────────────────
  const getPctSinceCovered = useCallback((ticker: string): number | null => {
    const q = quotes[ticker];
    const meta = stocks.find((s) => s.ticker === ticker);
    if (!q || !meta) return null;
    // Prefer frontmatter price (always reliable), fall back to candle-derived
    const base = meta.coveragePrice ?? candleCache.current[ticker]?.coveragePrice ?? null;
    if (!base) return null;
    return ((q.price - base) / base) * 100;
  }, [quotes, stocks]);

  // ─── Build chart when candles + selection ready ───────────────────────────
  useEffect(() => {
    if (!candlesLoaded || selectedTickers.length === 0) return;

    // Build per-stock date → % since coverage map
    const stockMaps: Record<string, Record<string, number>> = {};

    for (const ticker of selectedTickers) {
      const candle = candleCache.current[ticker];
      const meta = stocks.find((s) => s.ticker === ticker);
      const base = meta?.coveragePrice ?? candle?.coveragePrice ?? null;
      if (!candle || !base || !meta) continue;
      const coverageDateStr = Object.keys(candle.byDate)
        .sort()
        .find((d) => d >= meta.date) ?? meta.date;

      const map: Record<string, number> = {};
      for (const [dateStr, close] of Object.entries(candle.byDate)) {
        if (dateStr >= coverageDateStr) {
          map[dateStr] = parseFloat((((close - base) / base) * 100).toFixed(2));
        }
      }
      stockMaps[ticker] = map;
    }

    // Merge all date strings
    const allDates = new Set<string>();
    Object.values(stockMaps).forEach((m) => Object.keys(m).forEach((d) => allDates.add(d)));
    const sortedDates = Array.from(allDates).sort();

    const points: ChartPoint[] = sortedDates.map((dateStr) => {
      const pt: ChartPoint = { date: dateStrToLabel(dateStr) };
      for (const ticker of selectedTickers) {
        const val = stockMaps[ticker]?.[dateStr];
        pt[ticker] = val !== undefined ? val : null;
      }
      return pt;
    });

    setChartData(points);
  }, [selectedTickers, candlesLoaded]);

  // ─── Default selection + filter re-apply ─────────────────────────────────
  useEffect(() => {
    if (loadingQuotes) return;

    const ranked = [...tickers]
      .map((t) => ({ ticker: t, pct: getPctSinceCovered(t) ?? -Infinity }))
      .sort((a, b) => b.pct - a.pct);

    let pick: string[];
    if (filter === 'best') pick = ranked.slice(0, 5).map((r) => r.ticker);
    else if (filter === 'worst') pick = [...ranked].reverse().slice(0, 5).map((r) => r.ticker);
    else pick = ranked.map((r) => r.ticker);

    setSelectedTickers(pick);
  }, [loadingQuotes, filter, quotes]);

  // ─── WebSocket live prices ────────────────────────────────────────────────
  useEffect(() => {
    if (!FINNHUB_KEY || selectedTickers.length === 0) return;
    wsRef.current?.close();
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);
    wsRef.current = ws;
    ws.onopen = () => selectedTickers.forEach((t) => ws.send(JSON.stringify({ type: 'subscribe', symbol: t })));
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === 'trade' && msg.data) {
        msg.data.forEach((trade: { s: string; p: number }) => {
          setQuotes((prev) => {
            const ex = prev[trade.s];
            if (!ex) return prev;
            const change = trade.p - ex.prevClose;
            return { ...prev, [trade.s]: { ...ex, price: trade.p, change, changePercent: (change / ex.prevClose) * 100 } };
          });
        });
      }
    };
    return () => wsRef.current?.close();
  }, [selectedTickers]);

  // ─── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addTicker = useCallback((ticker: string) => {
    setSelectedTickers((prev) => prev.includes(ticker) ? prev : [...prev, ticker]);
    setSearchQuery(''); setSearchOpen(false);
  }, []);

  const removeTicker = useCallback((ticker: string) => {
    setSelectedTickers((prev) => prev.filter((t) => t !== ticker));
  }, []);

  const searchResults = tickers.filter((t) => {
    if (!searchQuery.trim()) return false;
    const meta = stocks.find((s) => s.ticker === t);
    const q = searchQuery.toLowerCase();
    return t.toLowerCase().includes(q) || meta?.title.toLowerCase().includes(q);
  });

  // Table sorted by % since covered (best first)
  const tableRows = [...tickers].sort((a, b) => {
    const pa = getPctSinceCovered(a) ?? -Infinity;
    const pb = getPctSinceCovered(b) ?? -Infinity;
    return pb - pa;
  });

  const filterLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? 'Best Since Coverage';
  const isLoading = loadingQuotes;

  const CustomTooltip = ({
    active, payload, label,
  }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="border border-[#e8e4de] bg-white p-3 text-xs shadow-sm">
        <p className="text-[#9ca3af] mb-2 font-sans">{label}</p>
        {payload.filter((e) => e.value != null).map((entry) => (
          <p key={entry.name} className="flex gap-4 justify-between font-sans">
            <span style={{ color: entry.color }} className="font-mono font-semibold">{entry.name}</span>
            <span className={entry.value >= 0 ? 'text-emerald-600' : 'text-red-500'}>
              {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
            </span>
          </p>
        ))}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-24 px-8 md:px-14 max-w-6xl mx-auto">

      {!FINNHUB_KEY && (
        <div className="mb-8 px-4 py-3 border border-[#c9a96e]/50 bg-[#c9a96e]/10 text-sm text-[#1a1a2e]">
          <strong>Setup required:</strong> Add <code className="font-mono bg-[#e8e4de] px-1">NEXT_PUBLIC_FINNHUB_KEY</code> to Vercel environment variables.{' '}
          <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-[#c9a96e] underline">Get a free key at finnhub.io</a>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#9ca3af] mb-3">Live Market Data</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">Stock Tracker</h1>
        <p className="mt-2 text-[#9ca3af] text-sm">Performance since coverage initiation - updated live</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-2 text-sm w-64 focus-within:border-[#c9a96e] transition-colors">
            <Search size={13} className="text-[#9ca3af] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search tickers or companies..."
              className="flex-1 outline-none bg-transparent text-[#1a1a2e] placeholder:text-[#9ca3af] text-sm"
            />
          </div>
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 border border-[#d4cfc8] bg-white shadow-md">
              {searchResults.map((ticker) => {
                const meta = stocks.find((s) => s.ticker === ticker);
                const isActive = selectedTickers.includes(ticker);
                return (
                  <button
                    key={ticker}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addTicker(ticker)}
                    disabled={isActive}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#faf8f5] flex items-center justify-between border-b border-[#e8e4de] last:border-0 disabled:opacity-40 transition-colors"
                  >
                    <span className="font-mono font-semibold text-[#1a1a2e]">{ticker}</span>
                    <span className="text-[#9ca3af] text-xs truncate ml-3 max-w-[130px]">{meta?.title?.split(':')[0]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div ref={filterRef} className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-2 text-sm text-[#1a1a2e] hover:border-[#c9a96e] transition-colors"
          >
            {filterLabel}
            <ChevronDown size={13} className="text-[#9ca3af]" />
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 z-30 border border-[#d4cfc8] bg-white shadow-md w-48">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilter(opt.value); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm border-b border-[#e8e4de] last:border-0 hover:bg-[#faf8f5] transition-colors ${filter === opt.value ? 'text-[#c9a96e]' : 'text-[#1a1a2e]'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chips */}
      {selectedTickers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedTickers.map((ticker, i) => {
            const pct = getPctSinceCovered(ticker);
            const isUp = (pct ?? 0) >= 0;
            return (
              <div key={ticker} className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-1.5 text-sm">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="font-mono font-semibold text-[#1a1a2e]">{ticker}</span>
                {pct !== null && (
                  <span className={`text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isUp ? '+' : ''}{pct.toFixed(2)}%
                  </span>
                )}
                <button onClick={() => removeTicker(ticker)} className="text-[#b0a898] hover:text-[#1a1a2e] transition-colors ml-0.5" aria-label={`Remove ${ticker}`}>
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="border border-[#e8e4de] bg-white p-6 mb-10">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-[#9ca3af] text-sm">Loading data...</div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-[#9ca3af] text-sm">
            {!FINNHUB_KEY ? 'API key required' : 'No chart data available'}
          </div>
        ) : (
          <>
            <p className="text-[10px] tracking-widest uppercase text-[#9ca3af] mb-4">% since coverage initiation</p>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#e8e4de" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#b0a898', fontFamily: 'Inter, sans-serif' }}
                  axisLine={false} tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#b0a898', fontFamily: 'Inter, sans-serif' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#d4cfc8" strokeDasharray="4 4" strokeWidth={1} />
                {selectedTickers.map((ticker, i) => (
                  <Line
                    key={ticker}
                    type="monotone"
                    dataKey={ticker}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0, fill: CHART_COLORS[i % CHART_COLORS.length] }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Coverage table */}
      <div>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-4">Coverage Universe</h2>
        <div className="border border-[#e8e4de] overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-[#e8e4de] bg-[#faf8f5]">
                <th className="text-left px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">Ticker</th>
                <th className="text-left px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af] hidden md:table-cell">Company</th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">Price</th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">Day %</th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">Since Covered</th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af] hidden md:table-cell">Coverage Date</th>
                <th className="text-center px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">Chart</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((ticker) => {
                const q = quotes[ticker];
                const meta = stocks.find((s) => s.ticker === ticker);
                const dayIsUp = (q?.changePercent ?? 0) >= 0;
                const pct = getPctSinceCovered(ticker);
                const pctIsUp = (pct ?? 0) >= 0;
                const isSelected = selectedTickers.includes(ticker);
                const colorIdx = selectedTickers.indexOf(ticker);
                return (
                  <tr key={ticker} className="border-b border-[#e8e4de] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
                          style={{ backgroundColor: isSelected ? CHART_COLORS[colorIdx % CHART_COLORS.length] : '#d4cfc8' }}
                        />
                        <Link
                          href={`/equity-research/${meta?.slug ?? ticker.toLowerCase()}`}
                          className="font-mono font-semibold text-[#1a1a2e] hover:text-[#c9a96e] transition-colors"
                        >
                          {ticker}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#444] hidden md:table-cell">{meta?.title?.split(':')[0] ?? ticker}</td>
                    <td className="px-4 py-3 text-right font-mono text-[#1a1a2e]">
                      {q ? `$${q.price.toFixed(2)}` : '--'}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono text-xs ${dayIsUp ? 'text-emerald-600' : 'text-red-500'}`}>
                      {q ? `${dayIsUp ? '+' : ''}${q.changePercent.toFixed(2)}%` : '--'}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${pctIsUp ? 'text-emerald-600' : 'text-red-500'}`}>
                      {pct !== null ? `${pctIsUp ? '+' : ''}${pct.toFixed(2)}%` : '--'}
                    </td>
                    <td className="px-4 py-3 text-right text-[#9ca3af] text-xs hidden md:table-cell">{meta?.date}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => isSelected ? removeTicker(ticker) : addTicker(ticker)}
                        className={`text-xs px-2.5 py-1 border transition-colors ${
                          isSelected
                            ? 'border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white'
                            : 'border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Remove' : 'Add'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
