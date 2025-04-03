'use client';

import BlogPost from './BlogPost';
import { BlogPostMeta } from '@/lib/mdx';

interface BlogListProps {
  posts: (BlogPostMeta & { slug: string })[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No blog posts found</h2>
        <p className="text-muted-foreground">
          Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 grid-cols-1">
      {posts.map((post) => (
        <BlogPost
          key={post.slug}
          post={{
            slug: post.slug,
            frontmatter: {
              title: post.title,
              description: post.description,
              date: post.date,
              author: post.author,
              image: post.image,
              tags: post.tags,
            },
            content: null, // We don't need the content for the list view
          }}
        />
      ))}
    </div>
  );
} 