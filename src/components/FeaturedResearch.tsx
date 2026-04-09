import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedResearchProps {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  image?: string;
}

export default function FeaturedResearch({
  title,
  excerpt,
  category,
  slug,
  image,
}: FeaturedResearchProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] dark:from-[#0f1820] to-white dark:to-[#0a1628]" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a96e] rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c9a96e] rounded-full opacity-5 translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#c9a96e] rounded-full">
                {category}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] dark:text-white mb-6 leading-tight">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-[#6b7280] dark:text-[#a0aec0] mb-8 leading-relaxed">
              {excerpt}
            </p>

            {/* CTA Button */}
            <Link
              href={`/research/${slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a2e] dark:bg-white text-white dark:text-[#1a1a2e] font-semibold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              Read Research
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image Placeholder or Visual */}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <div className="relative h-96 rounded-lg overflow-hidden border border-[#e5e5e5] dark:border-[#1a2a3a] shadow-lg">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-[#c9a96e] to-[#1a1a2e] border border-[#e5e5e5] dark:border-[#1a2a3a] shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="font-serif text-6xl text-white/20 mb-4">
                  ▲
                </div>
                <p className="text-white/40 font-serif text-lg">Research</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
