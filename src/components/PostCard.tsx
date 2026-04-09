import Link from 'next/link';
import { format } from 'date-fns';

interface PostCardProps {
  title: string;
  date: Date | string;
  excerpt: string;
  category: string;
  tags?: string[];
  readTime?: number;
  slug: string;
  featured?: boolean;
}

export default function PostCard({
  title,
  date,
  excerpt,
  category,
  tags = [],
  readTime,
  slug,
  featured = false,
}: PostCardProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = format(dateObj, 'MMMM dd, yyyy');

  return (
    <Link href={`/research/${slug}`}>
      <article
        className={`group p-6 rounded-lg border border-[#e5e5e5] dark:border-[#1a2a3a] bg-white dark:bg-[#0a1628] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
          featured ? 'md:col-span-2' : ''
        }`}
      >
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#c9a96e] rounded-full">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1a1a2e] dark:text-white mb-3 line-clamp-2 group-hover:text-[#c9a96e] transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm md:text-base text-[#6b7280] dark:text-[#a0aec0] mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280] dark:text-[#a0aec0] mb-4">
          <time dateTime={dateObj.toISOString()}>{formattedDate}</time>
          {readTime && (
            <>
              <span className="text-[#e5e5e5] dark:text-[#1a2a3a]">•</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium text-[#6b7280] dark:text-[#a0aec0] bg-gray-100 dark:bg-[#1a2a3a] rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-[#6b7280] dark:text-[#a0aec0]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  );
}
