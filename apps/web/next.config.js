require("dotenv-mono").load()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["db"],
}

module.exports = nextConfig
