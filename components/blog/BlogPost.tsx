'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { MDXContent } from '@/components/mdx/MDXContent';
import { BlogPostMeta } from '@/lib/mdx';
import { cn } from '@/lib/utils';

interface BlogPostProps {
  post: {
    slug: string;
    frontmatter: Omit<BlogPostMeta, 'slug'>;
    content: any;
  };
  isFullPost?: boolean;
}

// Helper function to safely parse dates
function formatDate(dateString: string) {
  try {
    // Try to parse the date using parseISO from date-fns
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (error) {
    // If parsing fails, return the original string
    console.error('Error parsing date:', dateString, error);
    return dateString;
  }
}

export default function BlogPost({ post, isFullPost = false }: BlogPostProps) {
  const { slug, frontmatter, content } = post;
  const { title, description, date, author, image, tags } = frontmatter;

  return (
    <article className={cn('mb-8', isFullPost ? 'max-w-3xl mx-auto' : '')}>
      {isFullPost ? (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span>{formatDate(date)}</span>
            <span className="mx-2">•</span>
            <span>{author}</span>
          </div>
          {image && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {content ? <MDXContent source={content} /> : <p>Content not available</p>}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {tags && tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link href={`/blog/${slug}`} className="block group">
          <div className="mb-4">
            {image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h2>
            <p className="text-muted-foreground mb-2">{description}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{formatDate(date)}</span>
              <span className="mx-2">•</span>
              <span>{author}</span>
            </div>
          </div>
        </Link>
      )}
    </article>
  );
} 