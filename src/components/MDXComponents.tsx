import { ReactNode } from 'react';
import Link from 'next/link';
import { Copy } from 'lucide-react';

interface HeadingProps {
  children: ReactNode;
  id?: string;
}

interface AnchorProps {
  href: string;
  children: ReactNode;
}

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

interface TableProps {
  children: ReactNode;
}

interface ListProps {
  children: ReactNode;
  ordered?: boolean;
}

interface QuoteProps {
  children: ReactNode;
}

interface FootnoteProps {
  children: ReactNode;
}

const AnchorLink = ({ id }: { id?: string }) => {
  if (!id) return null;

  return (
    <a
      href={`#${id}`}
      className="ml-2 text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Copy link"
    >
      #
    </a>
  );
};

export const MDXComponents = {
  h1: ({ children, id }: HeadingProps) => (
    <h1
      id={id}
      className="group font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mt-8 mb-4 leading-tight"
    >
      {children}
      <AnchorLink id={id} />
    </h1>
  ),

  h2: ({ children, id }: HeadingProps) => (
    <h2
      id={id}
      className="group font-serif text-3xl md:text-4xl font-bold text-[#1a1a1a] mt-8 mb-4 leading-tight"
    >
      {children}
      <AnchorLink id={id} />
    </h2>
  ),

  h3: ({ children, id }: HeadingProps) => (
    <h3
      id={id}
      className="group font-serif text-2xl md:text-3xl font-semibold text-[#1a1a1a] mt-6 mb-3 leading-snug"
    >
      {children}
      <AnchorLink id={id} />
    </h3>
  ),

  h4: ({ children, id }: HeadingProps) => (
    <h4
      id={id}
      className="group font-serif text-xl md:text-2xl font-semibold text-[#1a1a1a] mt-6 mb-3"
    >
      {children}
      <AnchorLink id={id} />
    </h4>
  ),

  p: ({ children }: { children: ReactNode }) => (
    <p className="text-base md:text-lg text-[#444444] leading-relaxed mb-6">
      {children}
    </p>
  ),

  a: ({ href, children }: AnchorProps) => {
    const isExternal = href?.startsWith('http');

    return (
      <Link
        href={href || '#'}
        className="text-[#c9a96e] hover:text-[#b8975d] underline underline-offset-2 transition-colors"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  },

  blockquote: ({ children }: QuoteProps) => (
    <blockquote className="pl-6 py-4 mb-6 border-l-4 border-[#c9a96e] bg-[#f5f2ec] text-[#555555] italic">
      {children}
    </blockquote>
  ),

  code: ({ children, className }: CodeBlockProps) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code className="px-2 py-1 rounded bg-[#ede9e2] text-[#c9a96e] text-sm font-mono">
          {children}
        </code>
      );
    }

    return (
      <pre className="overflow-x-auto rounded-lg bg-[#1a1a1a] p-4 mb-6 border border-[#333]">
        <code className={`${className} text-sm text-gray-100 font-mono`}>
          {children}
        </code>
      </pre>
    );
  },

  table: ({ children }: TableProps) => (
    <div className="overflow-x-auto mb-6 border border-[#e5e5e5] rounded-lg">
      <table className="w-full">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-[#f0ece4] border-b border-[#e5e5e5]">
      {children}
    </thead>
  ),

  tbody: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,

  tr: ({ children }: { children: ReactNode }) => (
    <tr className="border-b border-[#e5e5e5] hover:bg-[#f5f2ec] transition-colors">
      {children}
    </tr>
  ),

  td: ({ children }: { children: ReactNode }) => (
    <td className="px-4 py-3 text-sm text-[#444444]">
      {children}
    </td>
  ),

  th: ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-3 text-sm font-semibold text-[#1a1a1a] text-left">
      {children}
    </th>
  ),

  ul: ({ children }: ListProps) => (
    <ul className="space-y-2 mb-6 ml-4 list-disc text-[#444444]">
      {children}
    </ul>
  ),

  ol: ({ children }: ListProps) => (
    <ol className="space-y-2 mb-6 ml-4 list-decimal text-[#444444]">
      {children}
    </ol>
  ),

  li: ({ children }: { children: ReactNode }) => (
    <li className="text-base md:text-lg leading-relaxed">{children}</li>
  ),

  hr: () => (
    <hr className="my-8 border-[#e5e5e5] dark:border-[#1a2a3a]" />
  ),

  img: ({
    src,
    alt,
    title,
  }: {
    src?: string;
    alt?: string;
    title?: string;
  }) => (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        title={title}
        className="rounded-lg w-full h-auto border border-[#e5e5e5] dark:border-[#1a2a3a]"
      />
      {alt && (
        <figcaption className="text-center text-sm text-[#6b7280] dark:text-[#a0aec0] mt-3">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // Footnote support
  sup: ({ children }: { children: ReactNode }) => (
    <sup className="text-[#c9a96e] font-semibold">{children}</sup>
  ),
};

export default MDXComponents;
