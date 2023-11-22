import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import { createSvgIconsSsrPlugin } from "vite-plugin-svg-icons-ssr"
import { qrcode } from "vite-plugin-qrcode"
import type { OutputFormat, Picture } from "vite-imagetools"
import { builtinOutputFormats, imagetools } from "vite-imagetools"
import { getPlaiceholder } from "plaiceholder"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import type { Asset } from "./app/server/files.server"

const asset: OutputFormat = (args) => async (metadata) => {
  const picture = builtinOutputFormats.picture(args)(metadata) as Picture
  const placeholder = await getPlaiceholder(await metadata[0].image.toBuffer())
  return {
    placeholder,
    src: picture.img.src, // TODO: make this a Picture
  } satisfies Asset
}

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    qrcode(),
    imagetools({
      defaultDirectives: new URLSearchParams({ as: "asset" }),
      extendOutputFormats: (formats) => ({ ...formats, asset }),
    }),
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
