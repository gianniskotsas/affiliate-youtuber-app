import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import { getAllBlogPosts } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog | Veevo',
  description: 'Latest articles, tutorials, and updates from the Veevo team',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Latest articles, tutorials, and updates from the Veevo team
        </p>
      </div>
      <BlogList posts={posts} />
    </div>
  );
} 