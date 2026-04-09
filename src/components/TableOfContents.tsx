'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the page
    const headingElements = document.querySelectorAll('h2, h3, h4');
    const extractedHeadings: Heading[] = [];

    headingElements.forEach((element) => {
      // Ensure element has an id, or create one
      if (!element.id) {
        element.id = element.textContent
          ?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '') || `heading-${extractedHeadings.length}`;
      }

      extractedHeadings.push({
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName[1], 10),
      });
    });

    setHeadings(extractedHeadings);

    // Setup Intersection Observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-6rem)]">
      <nav className="text-sm">
        <h3 className="font-serif font-bold text-[#1a1a2e] dark:text-white mb-6">
          Contents
        </h3>
        <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const paddingLeft =
              heading.level === 2 ? '0' : heading.level === 3 ? '1rem' : '2rem';

            return (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={`block py-1 transition-all duration-200 ${
                    isActive
                      ? 'text-[#c9a96e] font-medium'
                      : 'text-[#6b7280] dark:text-[#a0aec0] hover:text-[#1a1a2e] dark:hover:text-white'
                  }`}
                  style={{ paddingLeft }}
                >
                  {isActive && (
                    <span className="inline-block w-1.5 h-1.5 bg-[#c9a96e] rounded-full mr-2" />
                  )}
                  <span className="line-clamp-2">{heading.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
