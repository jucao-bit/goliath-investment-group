#!/usr/bin/env node

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

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

function extractExcerpt(content, maxLength = 160) {
  // Remove markdown formatting
  const text = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links but keep text
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .trim();

  if (text.length > maxLength) {
    return text.substring(0, maxLength).trim() + "...";
  }
  return text;
}

function generateSearchIndex() {
  const searchIndex = [];

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
      const categoryTitle = categoryMap[category] || category;

      const searchEntry = {
        slug: `/${category}/${slug}`,
        title: data.title || "",
        excerpt: data.excerpt || extractExcerpt(content),
        category: categoryTitle,
        tags: data.tags || [],
        date: data.publishedAt || data.date || new Date().toISOString(),
      };

      searchIndex.push(searchEntry);
    }
  }

  // Sort by date descending
  searchIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write to public directory
  const outputDir = path.join(rootDir, "public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "search-index.json");
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

  console.log(`Search index generated: ${outputPath}`);
  console.log(`Total posts indexed: ${searchIndex.length}`);
}

generateSearchIndex();
