import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { config } from "dotenv-mono"
import { defineConfig } from "vite"
import { createSvgIconsSsrPlugin } from "vite-plugin-svg-icons-ssr"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

config()

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    createSvgIconsSsrPlugin({
      scanDir: path.resolve(process.cwd(), "app/assets/icons"),
      symbolId: "[name]",
    }),
  ],
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
