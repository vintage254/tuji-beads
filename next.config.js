/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  // Transpile jsonwebtoken and related packages
  transpilePackages: ['jsonwebtoken', 'jws', 'jwa'],
  // Configure environment for server components
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken'],
  },
  // Ignore JWT warnings in the Edge runtime
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
