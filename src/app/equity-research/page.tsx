import { getAllPosts } from '@/lib/posts';
import EquityResearchClient from './EquityResearchClient';

export default async function EquityResearchPage() {
  const allPosts = getAllPosts();
  const equityPosts = allPosts.filter((post) => post.category === 'equity-research');

  const equityTags = Array.from(
    new Set<string>(
      equityPosts.flatMap((post) => post.tags)
    )
  ).sort();

  return (
    <EquityResearchClient posts={equityPosts} tags={equityTags} />
  );
}
