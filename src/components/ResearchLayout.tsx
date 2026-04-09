import { ReactNode } from 'react';
import { format } from 'date-fns';
import TableOfContents from './TableOfContents';
import ShareButtons from './ShareButtons';

interface ResearchLayoutProps {
  children: ReactNode;
  title: string;
  excerpt: string;
  author: string;
  date: Date | string;
  readTime: number;
  category: string;
  url: string;
}

export default function ResearchLayout({
  children,
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  url,
}: ResearchLayoutProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = format(dateObj, 'MMMM dd, yyyy');

  return (
    <article className="min-h-screen bg-white dark:bg-[#0a1628]">
      {/* Header Section */}
      <header className="border-b border-[#e5e5e5] dark:border-[#1a2a3a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#c9a96e] rounded-full">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] dark:text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-[#6b7280] dark:text-[#a0aec0] mb-8 max-w-2xl">
            {excerpt}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-[#e5e5e5] dark:border-[#1a2a3a]">
            <div>
              <p className="text-sm text-[#6b7280] dark:text-[#a0aec0]">By</p>
              <p className="font-semibold text-[#1a1a2e] dark:text-white">{author}</p>
            </div>

            <div className="h-6 w-px bg-[#e5e5e5] dark:bg-[#1a2a3a]" />

            <div>
              <p className="text-sm text-[#6b7280] dark:text-[#a0aec0]">Published</p>
              <time
                dateTime={dateObj.toISOString()}
                className="font-semibold text-[#1a1a2e] dark:text-white"
              >
                {formattedDate}
              </time>
            </div>

            <div className="h-6 w-px bg-[#e5e5e5] dark:bg-[#1a2a3a]" />

            <div>
              <p className="text-sm text-[#6b7280] dark:text-[#a0aec0]">Reading Time</p>
              <p className="font-semibold text-[#1a1a2e] dark:text-white">
                {readTime} min
              </p>
            </div>

            <div className="flex-1 flex justify-end">
              <ShareButtons url={url} title={title} />
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
            <div className="text-[#1a1a2e] dark:text-[#e5e7eb]">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <div className="border-t border-[#e5e5e5] dark:border-[#1a2a3a]" />
    </article>
  );
}
