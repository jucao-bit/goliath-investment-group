import { Post } from './posts';

export interface SearchResult extends Post {
  relevance: number;
}

export function searchPosts(
  posts: Post[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/);

  const resultsWithRelevance: SearchResult[] = posts
    .map((post) => {
      let relevance = 0;

      const titleLower = post.title.toLowerCase();
      const excerptLower = post.excerpt.toLowerCase();
      const tagsLower = post.tags.map((t) => t.toLowerCase());
      const categoryLower = post.category.toLowerCase();

      for (const term of queryTerms) {
        if (titleLower.includes(term)) {
          relevance += 10;
        }

        if (excerptLower.includes(term)) {
          relevance += 5;
        }

        if (tagsLower.some((tag) => tag.includes(term))) {
          relevance += 8;
        }

        if (categoryLower.includes(term)) {
          relevance += 3;
        }

        if (post.author.toLowerCase().includes(term)) {
          relevance += 2;
        }
      }

      return {
        ...post,
        relevance,
      };
    })
    .filter((result) => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);

  return resultsWithRelevance;
}
