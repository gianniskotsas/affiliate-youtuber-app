import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// Define the blog post directory
const blogDirectory = path.join(process.cwd(), 'content/blog');

// Define the type for blog post metadata
export type BlogPostMeta = {
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  slug: string;
};

// Get all blog post slugs
export async function getBlogPostSlugs() {
  const fileNames = await fs.readdir(blogDirectory);
  return fileNames.map((fileName: string) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ''),
      },
    };
  });
}

// Get blog post data by slug
export async function getBlogPostBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');

  const { content, data } = matter(raw);

  return {
    slug,
    frontmatter: data as Omit<BlogPostMeta, 'slug'>,
    content, // Return raw MDX content
  };
}

// Get all blog posts
export async function getAllBlogPosts() {
  const fileNames = await fs.readdir(blogDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName: string) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      // Ensure all required fields are present
      const postData = {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'Veevo',
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      return postData;
    })
  );

  // Sort posts by date
  return allPostsData.sort((a: BlogPostMeta, b: BlogPostMeta) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
} 