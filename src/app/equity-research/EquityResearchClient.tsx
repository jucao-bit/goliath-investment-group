"use client";

import { useState, useMemo } from "react";
import { Post } from "@/lib/posts";
import { format } from "date-fns";

interface EquityResearchClientProps {
  posts: Post[];
  tags: string[];
}

// First all-caps tag = ticker
function getTicker(tags: string[]): string {
  return tags.find((t) => /^[A-Z]{1,5}$/.test(t)) || "";
}

// Non-ticker tags = focus areas
function getFocusAreas(tags: string[]): string[] {
  return tags.filter((t) => !/^[A-Z]{1,5}$/.test(t));
}

// All unique focus areas across all posts
function getAllFocusAreas(posts: Post[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => getFocusAreas(p.tags).forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

const PLACEHOLDER_COLORS = [
  "#e8e4dc", "#dfe8e4", "#e4dfe8", "#e8e2df", "#dfe4e8",
  "#e8e8df", "#e4e8df", "#e8dfdf", "#dfe8e8", "#e8dfe4",
];
function placeholderColor(key: string): string {
  let sum = 0;
  for (const c of key) sum += c.charCodeAt(0);
  return PLACEHOLDER_COLORS[sum % PLACEHOLDER_COLORS.length];
}

export default function EquityResearchClient({ posts }: EquityResearchClientProps) {
  const [sort, setSort] = useState<"recent" | "alpha">("recent");
  const [focusArea, setFocusArea] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);

  const allFocusAreas = useMemo(() => getAllFocusAreas(posts), [posts]);

  const filtered = useMemo(() => {
    let result = [...posts];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          getTicker(p.tags).toLowerCase().includes(q)
      );
    }

    if (focusArea !== "all") {
      result = result.filter((p) => getFocusAreas(p.tags).includes(focusArea));
    }

    if (sort === "recent") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [posts, search, focusArea, sort]);

  return (
    <div className="min-h-screen bg-[#faf8f5]" onClick={() => { setSortOpen(false); setFocusOpen(false); }}>

      {/* Page label */}
      <div className="flex flex-col items-center pt-36 pb-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Equity Research
        </span>
        <div className="w-px h-16 bg-[#d4cfc8] mt-4" />
      </div>

      {/* Toolbar — stacks on mobile, single row on desktop */}
      <div className="max-w-6xl mx-auto px-4 md:px-14 mb-12">
        <div className="flex flex-wrap items-stretch border-t border-b border-[#d4cfc8]">

          {/* Sort */}
          <div
            className="relative w-1/2 md:w-auto border-b md:border-b-0 border-r border-[#d4cfc8]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setSortOpen(!sortOpen); setFocusOpen(false); }}
              className="w-full flex items-center justify-between md:justify-start gap-2 px-4 md:px-5 py-4 text-xs tracking-[0.15em] uppercase font-light text-[#1a1a2e] hover:text-[#c9a96e] transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                Sort
                <span className="text-[#c9a96e] text-[10px]">
                  {sort === "recent" ? "Recent" : "A–Z"}
                </span>
              </span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute top-full left-0 bg-[#faf8f5] border border-[#d4cfc8] z-20 min-w-[140px] shadow-sm">
                {(["recent", "alpha"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setSortOpen(false); }}
                    className={`block w-full text-left px-5 py-3 text-xs tracking-[0.1em] uppercase font-light transition-colors duration-200 ${
                      sort === opt ? "text-[#c9a96e]" : "text-[#1a1a2e] hover:text-[#c9a96e]"
                    }`}
                  >
                    {opt === "recent" ? "Most Recent" : "Alphabetical"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Focus Area */}
          <div
            className="relative w-1/2 md:w-auto border-b md:border-b-0 md:border-r border-[#d4cfc8]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setFocusOpen(!focusOpen); setSortOpen(false); }}
              className="w-full flex items-center justify-between md:justify-start gap-2 px-4 md:px-5 py-4 text-xs tracking-[0.15em] uppercase font-light text-[#1a1a2e] hover:text-[#c9a96e] transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                Focus Area
                {focusArea !== "all" && (
                  <span className="text-[#c9a96e] text-[10px] capitalize">{focusArea}</span>
                )}
              </span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${focusOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {focusOpen && (
              <div className="absolute top-full left-0 bg-[#faf8f5] border border-[#d4cfc8] z-20 min-w-[180px] shadow-sm max-h-64 overflow-y-auto">
                <button
                  onClick={() => { setFocusArea("all"); setFocusOpen(false); }}
                  className={`block w-full text-left px-5 py-3 text-xs tracking-[0.1em] uppercase font-light transition-colors duration-200 ${
                    focusArea === "all" ? "text-[#c9a96e]" : "text-[#1a1a2e] hover:text-[#c9a96e]"
                  }`}
                >
                  All Areas
                </button>
                {allFocusAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => { setFocusArea(area); setFocusOpen(false); }}
                    className={`block w-full text-left px-5 py-3 text-xs tracking-[0.1em] uppercase font-light transition-colors duration-200 ${
                      focusArea === area ? "text-[#c9a96e]" : "text-[#1a1a2e] hover:text-[#c9a96e]"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search + result count — full width on mobile, flex-1 on desktop */}
          <div className="flex items-center w-full md:flex-1 px-4 md:px-5 py-4 gap-3">
            <svg className="w-3.5 h-3.5 text-[#b0a898] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search company or ticker…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs tracking-wide font-light text-[#1a1a2e] placeholder-[#c0bab2] outline-none flex-1 min-w-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#b0a898] hover:text-[#1a1a2e] transition-colors shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className="text-xs text-[#b0a898] font-light tracking-wide border-l border-[#d4cfc8] pl-4 whitespace-nowrap shrink-0">
              {filtered.length} {filtered.length === 1 ? "report" : "reports"}
            </span>
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-14 pb-32">
        {filtered.length === 0 ? (
          <p className="text-center text-[#9ca3af] font-light py-24 text-sm tracking-wide">
            No reports match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-[#e8e4de]">
            {filtered.map((post) => {
              const ticker = getTicker(post.tags);
              const href = post.substackUrl || `/${post.category}/${post.slug}`;
              const isExternal = !!post.substackUrl;
              const dateStr = format(new Date(post.date), "MMM d, yyyy");
              const bg = placeholderColor(ticker || post.title);

              const card = (
                <div className="group bg-[#faf8f5] hover:bg-[#f0ece4] transition-colors duration-300 cursor-pointer flex flex-col border-r border-b border-[#e8e4de] h-full">
                  {/* Square image area */}
                  <div
                    className="relative w-full aspect-square overflow-hidden"
                    style={{ backgroundColor: bg }}
                  >
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="font-serif font-light select-none text-[#1a1a2e] opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                          style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                        >
                          {ticker || post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text below */}
                  <div className="px-3 md:px-4 py-3 md:py-4 flex flex-col gap-1">
                    <h3 className="font-serif text-xs md:text-sm lg:text-base font-light text-[#1a1a2e] leading-snug line-clamp-2 group-hover:opacity-60 transition-opacity duration-300">
                      {post.title}
                    </h3>
                    {ticker && (
                      <p className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[#1a1a2e] font-light opacity-50">
                        {ticker}
                      </p>
                    )}
                    <p className="text-[10px] md:text-[11px] text-[#b0a898] font-light tracking-wide">
                      {dateStr}
                    </p>
                  </div>
                </div>
              );

              return isExternal ? (
                <a key={post.slug} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {card}
                </a>
              ) : (
                <a key={post.slug} href={href} className="block h-full">
                  {card}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
