require("dotenv-mono").load()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ["db"],
}

module.exports = nextConfig
