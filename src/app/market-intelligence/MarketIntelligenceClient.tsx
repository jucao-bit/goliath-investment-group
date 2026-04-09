"use client";

import { Post } from "@/lib/posts";
import PostListPage from "@/components/PostListPage";

interface MarketIntelligenceClientProps {
  posts: Post[];
  tags: string[];
}

export default function MarketIntelligenceClient({ posts }: MarketIntelligenceClientProps) {
  return <PostListPage posts={posts} label="Market Intelligence" />;
}
