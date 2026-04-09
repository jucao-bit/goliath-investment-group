import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";

export default async function HomePage() {
  const allPosts = getAllPosts().slice(0, 5);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Hero — full viewport, cream, centered wordmark */}
      <section className="flex-1 flex flex-col justify-between min-h-screen px-8 md:px-14 pt-36 pb-14">

        {/* Main heading */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#1a1a2e] leading-[1.05] tracking-tight mb-10">
            Institutional<br />
            Investment<br />
            Research.
          </h1>
          <p className="text-sm md:text-base text-[#9ca3af] tracking-wide max-w-sm leading-relaxed font-light">
            Equity analysis, macro commentary, and market intelligence for serious investors.
          </p>
        </div>

        {/* Recent work — minimal list */}
        {allPosts.length > 0 && (
          <div className="mt-auto pt-16">
            <p className="text-xs tracking-[0.25em] uppercase text-[#c9a96e] mb-6 font-light">
              Recent Research
            </p>
            <ul className="space-y-0 divide-y divide-[#e8e4de]">
              {allPosts.map((post) => {
                const href = post.substackUrl || `/${post.category}/${post.slug}`;
                const isExternal = !!post.substackUrl;
                const dateStr = format(new Date(post.date), "MMM d, yyyy");

                return (
                  <li key={post.slug}>
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline justify-between py-4 hover:opacity-50 transition-opacity duration-300"
                      >
                        <span className="font-serif text-base md:text-lg text-[#1a1a2e] font-light leading-snug max-w-lg">
                          {post.title}
                        </span>
                        <span className="text-xs text-[#9ca3af] ml-6 shrink-0 font-light tabular-nums">
                          {dateStr}
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="group flex items-baseline justify-between py-4 hover:opacity-50 transition-opacity duration-300"
                      >
                        <span className="font-serif text-base md:text-lg text-[#1a1a2e] font-light leading-snug max-w-lg">
                          {post.title}
                        </span>
                        <span className="text-xs text-[#9ca3af] ml-6 shrink-0 font-light tabular-nums">
                          {dateStr}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Bottom footer line */}
        <div className="pt-14 flex items-center justify-between">
          <p className="text-xs text-[#9ca3af] tracking-widest uppercase font-light">
            © {new Date().getFullYear()} Goliath Investment Group
          </p>
          <a
            href="https://yoursubstack.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#9ca3af] tracking-widest uppercase font-light hover:text-[#1a1a2e] transition-colors duration-300"
          >
            Subscribe on Substack ↗
          </a>
        </div>
      </section>
    </div>
  );
}
