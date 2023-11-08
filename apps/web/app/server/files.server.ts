import type { GetPlaiceholderReturn } from "plaiceholder"
import { getPlaiceholder } from "plaiceholder"

export type Asset = {
  src: string
  placeholder: GetPlaiceholderReturn
}

export async function makeRemoteAsset(url: string): Promise<Asset> {
  const placeholder = await fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer))
    .then((buffer) => getPlaiceholder(buffer))

  return {
    src: url,
    placeholder,
  }
}
