import type { MetaFunction } from "@remix-run/node"
import ThemeWidget from "~/components/ThemeWidget"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export const handle = {
  actions: {},
}

export default function Index() {
  return (
    <div>
      <h1 className="text-red-500">:)</h1>
      <ThemeWidget />
    </div>
  )
}
