import "dotenv-mono/load"
import type { NextConfig } from "next"

export default {
  experimental: {
    ppr: "incremental",
  },
  env: {
    PORT: process.env.PORT || "3000",
  },
} satisfies NextConfig
