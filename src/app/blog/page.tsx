import { getAllPosts } from '@/lib/posts';
import BlogClient from './BlogClient';

export default async function BlogPage() {
  const allPosts = getAllPosts();
  const blogPosts = allPosts.filter((post) => post.category === 'blog');

  const blogTags = Array.from(
    new Set<string>(
      blogPosts.flatMap((post) => post.tags)
    )
  ).sort();

  return (
    <BlogClient posts={blogPosts} tags={blogTags} />
  );
}
