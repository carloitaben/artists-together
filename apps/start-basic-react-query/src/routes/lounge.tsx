import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/lounge")({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }
  },
  component: Component,
})

function Component() {
  return <div>Hello /_layout/lounge!</div>
}
