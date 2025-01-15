import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/(legal)/terms-of-service')({
  beforeLoad() {
    if (import.meta.env.PROD) {
      throw notFound()
    }
  },
  component: Component,
})

function Component() {
  return <div>Hello /_legal/terms-of-service!</div>
}
