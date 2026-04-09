import { Feed } from 'feed';
import { getAllPosts } from './posts';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, AUTHOR_NAME } from './constants';

export function generateRSS(siteUrl: string = SITE_URL): string {
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    copyright: `${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
    author: {
      name: AUTHOR_NAME,
      link: siteUrl,
    },
  });

  const posts = getAllPosts();

  for (const post of posts) {
    const postUrl = `${siteUrl}/posts/${post.category}/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.excerpt,
      content: post.content,
      author: [
        {
          name: post.author,
        },
      ],
      date: new Date(post.date),
      category: post.tags.map((tag) => ({
        name: tag,
      })),
      image: post.image,
    });
  }

  return feed.rss2();
}
