/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  // Transpile related packages but not jsonwebtoken
  transpilePackages: ['jws', 'jwa'],
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
