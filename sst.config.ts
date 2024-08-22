/// <reference path="./.sst/platform/config.d.ts" />

import { readdirSync } from "fs"

export default $config({
  app(input) {
    return {
      name: "artists-together",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: true,
        random: true,
        vercel: true,
      },
    }
  },
  async run() {
    for (const value of readdirSync("./infra/")) {
      await import("./infra/" + value)
    }
  },
})
