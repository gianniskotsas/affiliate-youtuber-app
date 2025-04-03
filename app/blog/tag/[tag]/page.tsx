import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
import { getAllBlogPosts } from '@/lib/mdx';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tag = params.tag;
  return {
    title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} | Veevo Blog`,
    description: `Blog posts tagged with ${tag} from the Veevo team`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = params.tag;
  const allPosts = await getAllBlogPosts();
  const filteredPosts = allPosts.filter((post) =>
    post.tags?.includes(tag)
  );

  if (filteredPosts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Posts tagged with &quot;{tag}&quot;
        </h1>
        <p className="text-xl text-muted-foreground">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <BlogList posts={filteredPosts} />
    </div>
  );
} 