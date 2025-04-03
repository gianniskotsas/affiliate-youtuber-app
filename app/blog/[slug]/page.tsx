import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/mdx';
import BlogPost from '@/components/blog/BlogPost';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug(params.slug);
    return {
      title: `${post.frontmatter.title} | Veevo Blog`,
      description: post.frontmatter.description,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        type: 'article',
        publishedTime: post.frontmatter.date,
        authors: [post.frontmatter.author],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found | Veevo',
      description: 'The requested blog post could not be found.',
    };
  }
}

export async function generateStaticParams() {
  const posts = getBlogPostSlugs();
  return posts;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    return (
      <div className="container py-10">
        <BlogPost post={post} isFullPost />
      </div>
    );
  } catch (error) {
    notFound();
  }
} 