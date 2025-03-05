/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
    unoptimized: true,
  },
  // Ignore warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable SWC minification
  swcMinify: false,
  // Increase static generation timeout
  staticPageGenerationTimeout: 180,
  // Add experimental configuration to help with Edge compatibility
  experimental: {
    // Enable serverActions
    serverActions: true,
  },
}

module.exports = nextConfig
