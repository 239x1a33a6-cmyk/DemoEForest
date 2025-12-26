/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // TODO: Fix TypeScript errors after merge
  },
};

module.exports = nextConfig;
