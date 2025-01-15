import "dotenv-mono/load"
import { defineConfig } from "@tanstack/start/config"
import { imagetools } from "vite-imagetools"
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet"
import tsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  routers: {
    api: {
      entry: "src/router/entry-api.ts",
    },
    ssr: {
      entry: "src/router/entry-server.ts",
    },
    client: {
      entry: "src/router/entry-client.tsx",
    },
  },
  tsr: {
    generatedRouteTree: "src/router/router.generated.ts",
    appDirectory: "src",
    routeFileIgnorePrefix: ".",
  },
  server: {
    preset: "vercel-edge",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      iconsSpritesheet({
        fileName: "spritesheet.svg",
        inputDir: "./src/assets/icons",
        outputDir: "./src/assets/spritesheet",
        formatter: "prettier",
        withTypes: true,
      }),
      imagetools(),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  },
})
