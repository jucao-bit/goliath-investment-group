import { getPostsByCategory } from '@/lib/posts';
import StockTracker from '@/components/StockTracker';

export const metadata = {
  title: 'Stock Tracker | Goliath Investment Group',
  description: 'Live performance tracking of our equity research coverage universe.',
};

export interface StockMeta {
  ticker: string;
  title: string;
  slug: string;
  date: string;
  coveragePrice?: number;
}

export default function TrackerPage() {
  const posts = getPostsByCategory('equity-research');

  const stocks: StockMeta[] = [];
  const seen = new Set<string>();

  for (const post of posts) {
    const ticker = post.tags.find((tag) => /^[A-Z]{1,5}$/.test(tag));
    if (!ticker || seen.has(ticker)) continue;
    seen.add(ticker);
    stocks.push({
      ticker,
      title: post.title,
      slug: post.slug,
      date: post.date,
      coveragePrice: post.coveragePrice,
    });
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <StockTracker stocks={stocks} />
    </main>
  );
}
