import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: string;
  featured: boolean;
  image?: string;
  substackUrl?: string;
  content: string;
}

const POSTS_DIRECTORIES = [
  'posts/equity-research',
  'posts/market-intelligence',
  'posts/blog',
];

function getPostsDirectory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'equity-research': 'posts/equity-research',
    'market-intelligence': 'posts/market-intelligence',
    'blog': 'posts/blog',
  };

  return categoryMap[category] || 'posts/blog';
}

function parsePost(filePath: string, category: string): Post | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const reading = readingTime(content);

    return {
      slug: data.slug || path.basename(filePath, '.mdx'),
      title: data.title || 'Untitled',
      author: data.author || 'Unknown',
      date: data.date || new Date().toISOString().split('T')[0],
      category: category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt || '',
      readTime: reading.text,
      featured: data.featured === true,
      image: data.image,
      substackUrl: data.substackUrl,
      content: content,
    };
  } catch (error) {
    console.error(`Error parsing post at ${filePath}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const allPosts: Post[] = [];

  for (const postsDir of POSTS_DIRECTORIES) {
    const fullPath = path.join(process.cwd(), postsDir);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const files = fs.readdirSync(fullPath);

    for (const file of files) {
      if (!file.endsWith('.mdx')) {
        continue;
      }

      const filePath = path.join(fullPath, file);
      const category = postsDir.replace('posts/', '');
      const post = parsePost(filePath, category);

      if (post) {
        allPosts.push(post);
      }
    }
  }

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getPostBySlug(category: string, slug: string): Post | null {
  const postsDir = getPostsDirectory(category);
  const fullPath = path.join(process.cwd(), postsDir, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return parsePost(fullPath, category) || null;
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagsSet = new Set<string>();

  for (const post of allPosts) {
    post.tags.forEach((tag) => tagsSet.add(tag));
  }

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getFeaturedPosts(limit: number = 3): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.featured).slice(0, limit);
}
