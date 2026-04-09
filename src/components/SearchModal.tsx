'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

interface SearchModalProps {
  posts: Post[];
}

export default function SearchModal({ posts }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter posts based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = posts.filter((post) => {
      const searchLower = query.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.category.toLowerCase().includes(searchLower)
      );
    });

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, [query, posts]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1a2a3a] hover:bg-gray-200 dark:hover:bg-[#254052] transition-colors text-[#6b7280] dark:text-[#a0aec0] text-sm"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <span className="ml-auto text-xs text-[#6b7280] dark:text-[#6b7b8d]">
          ⌘K
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-white dark:bg-[#1a2a3a] rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e5e5e5] dark:border-[#254052]">
            <Search className="w-5 h-5 text-[#6b7280] dark:text-[#a0aec0]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search research, articles, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-[#1a1a2e] dark:text-white placeholder-[#6b7280] dark:placeholder-[#6b7b8d] outline-none text-base"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-[#254052] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[#6b7280] dark:text-[#a0aec0]" />
            </button>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="divide-y divide-[#e5e5e5] dark:divide-[#254052]">
                  {results.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/research/${post.slug}`}
                        className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#0f1820] transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-[#1a1a2e] dark:text-white mb-1 line-clamp-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-[#6b7280] dark:text-[#a0aec0] line-clamp-1">
                              {post.excerpt}
                            </p>
                          </div>
                          <span className="whitespace-nowrap px-2 py-1 text-xs font-semibold text-white bg-[#c9a96e] rounded">
                            {post.category}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-[#6b7280] dark:text-[#a0aec0]">
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!query.trim() && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#6b7280] dark:text-[#a0aec0]">
                Start typing to search...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
