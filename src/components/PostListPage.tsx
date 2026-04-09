"use client";

import { useState, useMemo } from "react";
import { Post } from "@/lib/posts";
import { format } from "date-fns";

interface PostListPageProps {
  posts: Post[];
  label: string;
}

export default function PostListPage({ posts, label }: PostListPageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Page label + divider line — centered, HOF style */}
      <div className="flex flex-col items-center pt-36 pb-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          {label}
        </span>
        <div className="w-px h-16 bg-[#d4cfc8] mt-4" />
      </div>

      {/* Post rows */}
      <div className="max-w-6xl mx-auto px-8 md:px-14 pb-32">
        {sortedPosts.length === 0 ? (
          <p className="text-center text-[#9ca3af] font-light py-24">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div>
            {sortedPosts.map((post, i) => {
              const href = post.substackUrl || `/${post.category}/${post.slug}`;
              const isExternal = !!post.substackUrl;
              const dateStr = format(new Date(post.date), "MMMM d, yyyy");

              const LinkWrapper = ({
                children,
                className,
              }: {
                children: React.ReactNode;
                className?: string;
              }) =>
                isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {children}
                  </a>
                ) : (
                  <a href={href} className={className}>
                    {children}
                  </a>
                );

              return (
                <div
                  key={post.slug}
                  className={`grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 md:gap-16 items-start py-16 md:py-20 ${
                    i < sortedPosts.length - 1
                      ? "border-b border-[#e8e4de]"
                      : ""
                  }`}
                >
                  {/* Left — text */}
                  <div className="flex flex-col">
                    {/* Date */}
                    <p className="text-xs text-[#b0a898] tracking-widest uppercase font-light mb-5">
                      {dateStr}
                    </p>

                    {/* Title */}
                    <LinkWrapper>
                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1a1a2e] leading-[1.15] tracking-tight mb-6 hover:opacity-60 transition-opacity duration-300">
                        {post.title}
                      </h2>
                    </LinkWrapper>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-base text-[#6b6560] font-light leading-relaxed mb-8 max-w-xl">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <LinkWrapper className="inline-flex items-center gap-2 text-sm text-[#1a1a2e] font-light tracking-wide hover:opacity-50 transition-opacity duration-300 group w-fit">
                      Read more
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </LinkWrapper>
                  </div>

                  {/* Right — image or placeholder */}
                  <LinkWrapper className="block w-full aspect-[4/3] overflow-hidden hover:opacity-90 transition-opacity duration-300">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#ede9e2] flex items-center justify-center">
                        <span className="font-serif text-6xl text-[#c9b99a] font-light select-none">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </LinkWrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
