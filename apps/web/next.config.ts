import "dotenv-mono/load"
import type { NextConfig } from "next"

export default {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    ppr: "incremental",
  },
  env: {
    PORT: process.env.PORT || "3000",
  },
} satisfies NextConfig
