import type { V2_MetaFunction } from "@vercel/remix"

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }]
}

export const config = { runtime: "edge" }

export default function Index() {
  return (
    <main>
      <div className="h-[75vh] bg-plushie-pink-100" />
      <div className="h-[75vh] bg-plushie-pink-200" />
      <div className="h-[75vh] bg-plushie-pink-300" />
      <div className="h-[75vh] bg-plushie-pink-400" />
      <div className="h-[75vh] bg-plushie-pink-500" />
    </main>
  )
}
