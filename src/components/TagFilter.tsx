'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onSelect,
}: TagFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    containerRef.current?.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      containerRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 200;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white dark:from-[#0a1628] to-transparent p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2a3a] transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-[#6b7280] dark:text-[#a0aec0]" />
        </button>
      )}

      {/* Tags Container */}
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-2"
      >
        {/* "All" Button */}
        <button
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all duration-200 flex-shrink-0 ${
            selectedTag === null
              ? 'bg-[#c9a96e] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-[#1a2a3a] text-[#6b7280] dark:text-[#a0aec0] hover:bg-gray-200 dark:hover:bg-[#254052]'
          }`}
        >
          All
        </button>

        {/* Tag Pills */}
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(selectedTag === tag ? null : tag)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all duration-200 flex-shrink-0 ${
              selectedTag === tag
                ? 'bg-[#c9a96e] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#1a2a3a] text-[#6b7280] dark:text-[#a0aec0] hover:bg-gray-200 dark:hover:bg-[#254052]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white dark:from-[#0a1628] to-transparent p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2a3a] transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-[#6b7280] dark:text-[#a0aec0]" />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
