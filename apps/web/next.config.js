/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  transpilePackages: ["db"],
}

module.exports = nextConfig
