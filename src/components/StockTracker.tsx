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

interface ChartPoint {
  date: string;
  [ticker: string]: number | string;
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
  { value: 'top5', label: 'Top 5 YTD' },
  { value: 'bottom5', label: 'Bottom 5 YTD' },
  { value: 'all', label: 'All Covered' },
] as const;

type FilterType = (typeof FILTER_OPTIONS)[number]['value'];

function tsToLabel(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function StockTracker({ stocks }: { stocks: StockMeta[] }) {
  const tickers = stocks.map((s) => s.ticker);

  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);
  const [filter, setFilter] = useState<FilterType>('top5');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const candleCache = useRef<Record<string, { dates: number[]; closes: number[] }>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const defaultsSet = useRef(false);

  // Fetch all quotes on mount
  useEffect(() => {
    if (!FINNHUB_KEY || tickers.length === 0) {
      setLoadingQuotes(false);
      return;
    }

    async function fetchQuotes() {
      const results: Record<string, QuoteData> = {};
      for (const ticker of tickers) {
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`
          );
          const data = await res.json();
          if (data.c) {
            results[ticker] = {
              price: data.c,
              change: data.d ?? 0,
              changePercent: data.dp ?? 0,
              prevClose: data.pc ?? data.c,
            };
          }
        } catch {
          // silently skip missing quotes
        }
      }
      setQuotes(results);
      setLoadingQuotes(false);
    }

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Set default selected tickers once quotes load
  useEffect(() => {
    if (loadingQuotes || defaultsSet.current) return;
    const quotedTickers = tickers.filter((t) => quotes[t]);
    if (quotedTickers.length === 0 && tickers.length > 0) {
      // No quotes yet but we have tickers — just use first 5
      setSelectedTickers(tickers.slice(0, 5));
      defaultsSet.current = true;
      return;
    }
    const sorted = [...quotedTickers].sort(
      (a, b) => (quotes[b]?.changePercent ?? 0) - (quotes[a]?.changePercent ?? 0)
    );
    setSelectedTickers(sorted.slice(0, 5));
    defaultsSet.current = true;
  }, [loadingQuotes, quotes]);

  // Apply filter changes after initial defaults are set
  useEffect(() => {
    if (!defaultsSet.current) return;
    const quotedTickers = tickers.filter((t) => quotes[t]);
    if (quotedTickers.length === 0) return;
    const sorted = [...quotedTickers].sort(
      (a, b) => (quotes[b]?.changePercent ?? 0) - (quotes[a]?.changePercent ?? 0)
    );
    if (filter === 'top5') setSelectedTickers(sorted.slice(0, 5));
    else if (filter === 'bottom5') setSelectedTickers([...sorted].reverse().slice(0, 5));
    else setSelectedTickers(sorted);
  }, [filter]);

  // Fetch candle data and build chart whenever selection changes
  useEffect(() => {
    if (!FINNHUB_KEY || selectedTickers.length === 0) return;

    const startTs = Math.floor(new Date('2026-01-02').getTime() / 1000);
    const endTs = Math.floor(Date.now() / 1000);

    async function buildChart() {
      setLoadingChart(true);

      for (const ticker of selectedTickers) {
        if (candleCache.current[ticker]) continue;
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${startTs}&to=${endTs}&token=${FINNHUB_KEY}`
          );
          const data = await res.json();
          if (data.s === 'ok') {
            candleCache.current[ticker] = { dates: data.t, closes: data.c };
          }
        } catch {
          // skip
        }
      }

      const allTs = new Set<number>();
      for (const ticker of selectedTickers) {
        candleCache.current[ticker]?.dates.forEach((d) => allTs.add(d));
      }

      const sorted = Array.from(allTs).sort((a, b) => a - b);

      const points: ChartPoint[] = sorted.map((ts) => {
        const pt: ChartPoint = { date: tsToLabel(ts) };
        for (const ticker of selectedTickers) {
          const c = candleCache.current[ticker];
          if (!c) continue;
          const idx = c.dates.indexOf(ts);
          if (idx === -1) continue;
          const base = c.closes[0];
          pt[ticker] = parseFloat((((c.closes[idx] - base) / base) * 100).toFixed(2));
        }
        return pt;
      });

      setChartData(points);
      setLoadingChart(false);
    }

    buildChart();
  }, [selectedTickers]);

  // WebSocket real-time updates
  useEffect(() => {
    if (!FINNHUB_KEY || selectedTickers.length === 0) return;
    wsRef.current?.close();

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);
    wsRef.current = ws;

    ws.onopen = () => {
      selectedTickers.forEach((t) => ws.send(JSON.stringify({ type: 'subscribe', symbol: t })));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === 'trade' && msg.data) {
        msg.data.forEach((trade: { s: string; p: number }) => {
          setQuotes((prev) => {
            const existing = prev[trade.s];
            if (!existing) return prev;
            const change = trade.p - existing.prevClose;
            return {
              ...prev,
              [trade.s]: {
                ...existing,
                price: trade.p,
                change,
                changePercent: (change / existing.prevClose) * 100,
              },
            };
          });
        });
      }
    };

    return () => wsRef.current?.close();
  }, [selectedTickers]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addTicker = useCallback((ticker: string) => {
    setSelectedTickers((prev) => (prev.includes(ticker) ? prev : [...prev, ticker]));
    setSearchQuery('');
    setSearchOpen(false);
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

  const sortedByPerf = [...tickers]
    .filter((t) => quotes[t])
    .sort((a, b) => (quotes[b]?.changePercent ?? 0) - (quotes[a]?.changePercent ?? 0));

  const allTableTickers = sortedByPerf.length > 0 ? sortedByPerf : tickers;

  const filterLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? 'Top 5 YTD';

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="border border-[#e8e4de] bg-white p-3 text-xs font-sans shadow-sm">
        <p className="text-[#9ca3af] mb-2">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="flex gap-3 justify-between">
            <span style={{ color: entry.color }} className="font-mono font-semibold">{entry.name}</span>
            <span className={entry.value >= 0 ? 'text-emerald-600' : 'text-red-500'}>
              {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
            </span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-24 px-8 md:px-14 max-w-6xl mx-auto">

      {/* API key warning */}
      {!FINNHUB_KEY && (
        <div className="mb-8 px-4 py-3 border border-[#c9a96e]/50 bg-[#c9a96e]/10 text-sm text-[#1a1a2e]">
          <strong>Setup required:</strong> Add your Finnhub API key as{' '}
          <code className="font-mono bg-[#e8e4de] px-1">NEXT_PUBLIC_FINNHUB_KEY</code> in
          Vercel environment variables.{' '}
          <a
            href="https://finnhub.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a96e] underline"
          >
            Get a free key at finnhub.io
          </a>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#9ca3af] mb-3">Live Market Data</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">Stock Tracker</h1>
        <p className="mt-2 text-[#9ca3af] text-sm">
          Coverage universe YTD performance — updated live
        </p>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-2 text-sm w-64 focus-within:border-[#c9a96e] transition-colors">
            <Search size={13} className="text-[#9ca3af] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
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
                    <span className="text-[#9ca3af] text-xs truncate ml-3 max-w-[130px]">
                      {meta?.title?.split(':')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-2 text-sm text-[#1a1a2e] hover:border-[#c9a96e] transition-colors"
          >
            {filterLabel}
            <ChevronDown size={13} className="text-[#9ca3af]" />
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 z-30 border border-[#d4cfc8] bg-white shadow-md w-40">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm border-b border-[#e8e4de] last:border-0 hover:bg-[#faf8f5] transition-colors ${
                    filter === opt.value ? 'text-[#c9a96e]' : 'text-[#1a1a2e]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected ticker chips */}
      {selectedTickers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedTickers.map((ticker, i) => {
            const q = quotes[ticker];
            const isUp = (q?.changePercent ?? 0) >= 0;
            return (
              <div
                key={ticker}
                className="flex items-center gap-2 border border-[#d4cfc8] bg-white px-3 py-1.5 text-sm"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="font-mono font-semibold text-[#1a1a2e]">{ticker}</span>
                {q && (
                  <span
                    className={`text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}
                  >
                    {isUp ? '+' : ''}
                    {q.changePercent?.toFixed(2)}%
                  </span>
                )}
                <button
                  onClick={() => removeTicker(ticker)}
                  className="text-[#b0a898] hover:text-[#1a1a2e] transition-colors ml-0.5"
                  aria-label={`Remove ${ticker}`}
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="border border-[#e8e4de] bg-white p-6 mb-10">
        {loadingChart || (loadingQuotes && selectedTickers.length === 0) ? (
          <div className="h-80 flex items-center justify-center text-[#9ca3af] text-sm">
            Loading chart data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-[#9ca3af] text-sm">
            {!FINNHUB_KEY ? 'API key required' : 'Select stocks above to display chart'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 6" stroke="#e8e4de" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#b0a898', fontFamily: 'Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#b0a898', fontFamily: 'Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
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
        )}
      </div>

      {/* Coverage table */}
      <div>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-4">Coverage Universe</h2>
        <div className="border border-[#e8e4de] overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-[#e8e4de] bg-[#faf8f5]">
                <th className="text-left px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">
                  Ticker
                </th>
                <th className="text-left px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af] hidden md:table-cell">
                  Company
                </th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">
                  Price
                </th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">
                  Day %
                </th>
                <th className="text-right px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af] hidden md:table-cell">
                  Covered
                </th>
                <th className="text-center px-4 py-3 font-normal text-[10px] tracking-widest uppercase text-[#9ca3af]">
                  Chart
                </th>
              </tr>
            </thead>
            <tbody>
              {allTableTickers.map((ticker, i) => {
                const q = quotes[ticker];
                const meta = stocks.find((s) => s.ticker === ticker);
                const isUp = (q?.changePercent ?? 0) >= 0;
                const isSelected = selectedTickers.includes(ticker);
                const colorIdx = selectedTickers.indexOf(ticker);
                return (
                  <tr
                    key={ticker}
                    className="border-b border-[#e8e4de] last:border-0 hover:bg-[#faf8f5] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
                          style={{
                            backgroundColor: isSelected
                              ? CHART_COLORS[colorIdx % CHART_COLORS.length]
                              : '#d4cfc8',
                          }}
                        />
                        <Link
                          href={`/equity-research/${meta?.slug ?? ticker.toLowerCase()}`}
                          className="font-mono font-semibold text-[#1a1a2e] hover:text-[#c9a96e] transition-colors"
                        >
                          {ticker}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#444] hidden md:table-cell">
                      {meta?.title?.split(':')[0] ?? ticker}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#1a1a2e]">
                      {q ? `$${q.price.toFixed(2)}` : '--'}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono text-xs ${
                        isUp ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {q
                        ? `${isUp ? '+' : ''}${q.changePercent.toFixed(2)}%`
                        : '--'}
                    </td>
                    <td className="px-4 py-3 text-right text-[#9ca3af] text-xs hidden md:table-cell">
                      {meta?.date}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          isSelected ? removeTicker(ticker) : addTicker(ticker)
                        }
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
