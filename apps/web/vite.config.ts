import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import { createSvgIconsSsrPlugin } from "vite-plugin-svg-icons-ssr"
import { qrcode } from "vite-plugin-qrcode"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import { env } from "./app/server/env.server"

// TODO: testing a thing ignore this atm
void env

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    qrcode(),
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
