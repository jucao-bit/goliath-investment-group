import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { MDXComponents } from '@/components/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts().filter((post) => post.category === 'blog');
  return posts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug('blog', slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl font-light text-[#1a1a2e] mb-6">Post not found.</p>
          <Link href="/blog" className="text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="flex flex-col items-center pt-36 pb-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Blog
        </span>
        <div className="w-px h-16 bg-[#d4cfc8] mt-4" />
      </div>

      <article className="max-w-3xl mx-auto px-8 md:px-14 pb-32">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors duration-300 mb-12 group">
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          All Posts
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1a1a2e] leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#b0a898] font-light tracking-wide mb-10 pb-10 border-b border-[#e8e4de]">
          <span>{post.author}</span>
          <span>·</span>
          <time>{formattedDate}</time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <div className="max-w-none">
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

        <div className="mt-20 pt-10 border-t border-[#e8e4de]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#9ca3af] hover:text-[#1a1a2e] transition-colors duration-300 group">
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            All Posts
          </Link>
        </div>
      </article>
    </div>
  );
}
