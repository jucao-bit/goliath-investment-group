import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { MDXComponents } from '@/components/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts().filter((post) => post.category === 'equity-research');
  return posts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EquityResearchPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug('equity-research', slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl font-light text-[#1a1a2e] mb-6">Post not found.</p>
          <Link href="/equity-research" className="text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors">
            ← Back to Equity Research
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');

  // If substackUrl exists, redirect feel — just show a clean pass-through
  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* Page label — consistent with all other pages */}
      <div className="flex flex-col items-center pt-36 pb-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Equity Research
        </span>
        <div className="w-px h-16 bg-[#d4cfc8] mt-4" />
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-8 md:px-14 pb-32">

        {/* Back link */}
        <Link
          href="/equity-research"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors duration-300 mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          All Research
        </Link>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1a1a2e] leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#b0a898] font-light tracking-wide mb-10 pb-10 border-b border-[#e8e4de]">
          <span>{post.author}</span>
          <span>·</span>
          <time>{formattedDate}</time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* MDX Content */}
        <div className="prose">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
              },
            }}
            components={MDXComponents}
          />
        </div>

        {/* Bottom back link */}
        <div className="mt-20 pt-10 border-t border-[#e8e4de]">
          <Link
            href="/equity-research"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors duration-300 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            All Research
          </Link>
        </div>
      </article>
    </div>
  );
}
