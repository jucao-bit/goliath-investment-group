#!/usr/bin/env node

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { Feed } from "feed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const SITE_NAME = "Meridian Research";
const SITE_URL = "https://meridianresearch.co";
const SITE_DESCRIPTION =
  "Institutional-grade financial research, equity analysis, and market intelligence";

const postsDirectories = [
  "posts/equity-research",
  "posts/market-intelligence",
  "posts/blog",
];

const categoryMap = {
  "equity-research": "Equity Research",
  "market-intelligence": "Market Intelligence",
  blog: "Blog",
};

function extractExcerpt(content, maxLength = 200) {
  const text = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

  if (text.length > maxLength) {
    return text.substring(0, maxLength).trim() + "...";
  }
  return text;
}

function generateRSS() {
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/logo.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `${new Date().getFullYear()} ${SITE_NAME}`,
    updated: new Date(),
  });

  const allPosts = [];

  for (const dir of postsDirectories) {
    const fullPath = path.join(rootDir, dir);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Directory not found: ${fullPath}`);
      continue;
    }

    const files = fs.readdirSync(fullPath).filter((file) => file.endsWith(".mdx"));

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const slug = file.replace(".mdx", "");
      const category = dir.split("/")[1];

      const postUrl = `${SITE_URL}/${category}/${slug}`;
      const publishDate = new Date(data.publishedAt || data.date || new Date());

      allPosts.push({
        title: data.title || "",
        description: data.excerpt || extractExcerpt(content),
        id: postUrl,
        link: postUrl,
        author: data.author ? [{ name: data.author }] : [],
        category: data.tags || [],
        date: publishDate,
        content: content,
      });
    }
  }

  // Sort by date descending
  allPosts.sort((a, b) => b.date - a.date);

  // Add posts to feed
  for (const post of allPosts) {
    feed.addItem({
      title: post.title,
      id: post.id,
      link: post.link,
      description: post.description,
      author: post.author,
      date: post.date,
      category: post.category.map((tag) => ({ name: tag })),
      content: post.content,
    });
  }

  // Write to public directory
  const outputDir = path.join(rootDir, "public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "rss.xml");
  fs.writeFileSync(outputPath, feed.rss2());

  console.log(`RSS feed generated: ${outputPath}`);
  console.log(`Total posts in feed: ${allPosts.length}`);
}

generateRSS();
