import { colors } from "~/../tailwind.config"
import opengraph from "~/assets/images/opengraph-image.jpg"

export function seo({
  title,
  description,
  keywords = "Art, Artist Community",
  image = opengraph,
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
}) {
  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "theme-color", content: colors["arpeggio-black"][900] },
    { name: "color-scheme", content: "dark" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    // { name: "og:url", content: "" },
    { name: "og:site_name", content: "Artists Together" },
    { name: "og:locale", content: "en" },
    { name: "og:image", content: image },
    { name: "og:image:width", content: "1200" },
    { name: "og:image:height", content: "630" },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ]
}
