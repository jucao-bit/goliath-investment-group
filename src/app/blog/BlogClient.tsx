"use client";

import { Post } from "@/lib/posts";
import PostListPage from "@/components/PostListPage";

interface BlogClientProps {
  posts: Post[];
  tags: string[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  return <PostListPage posts={posts} label="Blog" />;
}
