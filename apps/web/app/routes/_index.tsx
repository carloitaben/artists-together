import type { V2_MetaFunction } from "@vercel/remix"

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }]
}

export const config = { runtime: "edge" }

export default function Index() {
  return (
    <main>
      <h1>hello there</h1>
    </main>
  )
}
