/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.microlink.io",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "glhckkdhdbpinqmzpcqs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/api/webhooks/:path*/",
        destination: "/api/webhooks/:path*",
        permanent: false, // Avoid 308
      },
      {
        source: "/api/webhooks/:path*",
        destination: "/api/webhooks/:path*/",
        permanent: false, // Avoid 308
      },
    ];
  },
};

export default nextConfig;
