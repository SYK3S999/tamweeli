import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Optional: Use if fully static export is desired
  reactStrictMode: true,

  // Disable prerendering for /projects/create
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
