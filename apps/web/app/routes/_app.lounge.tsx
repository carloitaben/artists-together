import type { MetaFunction } from "@remix-run/react"
import { guardDisabledRoute } from "~/lib/routes"
import * as Form from "~/components/Form"

export const meta: MetaFunction = () => [
  {
    title: "Artists Lounge – Artists Together",
  },
]

export const handle = {
  actions: {
    search: () => console.log("search"),
    filter: () => console.log("filter"),
  },
  page: {
    name: "Artists Lounge",
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return (
    <main>
      <Form.Root>
        <Form.Field name="name">
          <Form.Label>
            This is a label
            <Form.Value<string>>{(value = "") => value.length}</Form.Value>
          </Form.Label>
          <Form.Input
            className="w-full"
            type="text"
            placeholder="Enter your name"
          />
          <Form.Error />
        </Form.Field>
        <Form.Field name="password">
          <Form.Label>This is a label</Form.Label>
          <Form.Input
            className="w-full"
            type="text"
            placeholder="Enter your name"
          />
          <Form.Error />
        </Form.Field>
      </Form.Root>
    </main>
  )
}
