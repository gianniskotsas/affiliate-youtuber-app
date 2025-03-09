/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
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
    ],
  },
};

export default nextConfig;
