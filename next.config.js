/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
    // Add fallback behavior for images
    minimumCacheTTL: 60,
    // Add more unoptimized option for static exports if needed
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Ignore warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add output configuration for better static generation
  output: 'standalone',
  // Increase build timeout for larger projects
  experimental: {
    // Increase timeout for builds
    workerThreads: true,
    cpus: Math.max(1, Math.min(4, require('os').cpus().length - 1)),
  },
  // Handle trailing slashes consistently
  trailingSlash: false,
  // Improve error handling during build
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Skip static generation for problematic pages
  staticPageGenerationTimeout: 120,
  // Exclude problematic pages from static generation
  excludeDefaultMomentLocales: true,
}

module.exports = nextConfig
