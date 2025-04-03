import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | Veevo',
  description: 'Read our latest blog posts about affiliate marketing and YouTube content creation.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              Veevo
            </Link>
            <Link
              href="/blog"
              className="hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Veevo. All rights reserved.
            </p>
            <nav className="flex space-x-4 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
} 