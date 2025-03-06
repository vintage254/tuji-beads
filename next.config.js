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
  // Increase static generation timeout
  staticPageGenerationTimeout: 180,
  // Note: SWC Minifier will be mandatory in the next major version
  // We'll keep it enabled for better performance
  swcMinify: true,
  // No need for experimental serverActions as they're enabled by default in Next.js 14+
}

module.exports = nextConfig
