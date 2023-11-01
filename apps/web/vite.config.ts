import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import { config } from "dotenv-mono"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

config()

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
