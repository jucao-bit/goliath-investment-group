import { getAllPosts } from '@/lib/posts';
import MarketIntelligenceClient from './MarketIntelligenceClient';

export default async function MarketIntelligencePage() {
  const allPosts = getAllPosts();
  const marketPosts = allPosts.filter((post) => post.category === 'market-intelligence');

  const marketTags = Array.from(
    new Set<string>(
      marketPosts.flatMap((post) => post.tags)
    )
  ).sort();

  return (
    <MarketIntelligenceClient posts={marketPosts} tags={marketTags} />
  );
}
