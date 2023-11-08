import { getPlaiceholder } from "plaiceholder"

export async function getRemoteLQIP(url: string) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer))
    .then((buffer) => getPlaiceholder(buffer))
}
