"use client" // Forms require "use client" directive

import { z } from "zod"
import { home, help } from "~/components/Icons"
import * as Modal from "~/components/ModalDefinitiveRefactor"
import * as Form from "~/components/Form"

const testEmailSchema = z.object({
  email: z.string().email(),
})

const testUserPassSchema = z.object({
  username: z.string(),
  password: z.string(),
})

console.warn(
  "TODO: Merge Form.Root with Form.Form. Form.Root should also render the Form"
)

console.warn(
  "TODO: Add 'delay': boolean | number prop that adds fake delay on forms (true adds a default amount, number configures a custom value)"
)

console.warn("TODO: Integrate forms w/ server actions or trpc or whatever")

console.warn("TODO: Style modal tabs")

console.warn("TODO: Style modal steps")

console.warn("TODO: Style modal title")

console.warn("TODO: Animate modal")

export default function Page() {
  return (
    <main className="grid">
      <h1>Modal tests</h1>

      <Modal.Root>
        <Modal.Trigger>Barebones</Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Container>Hi</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>Style props</Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Container fill={false} padding={false} className="p-8">
              cva rules
            </Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>With title and description</Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Container>
              <Modal.Title>title</Modal.Title>
              <Modal.Description>description</Modal.Description>
            </Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          With form cta floating outside of container
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Form.Root
              schema={testEmailSchema}
              onSubmit={async (values) => console.log(values)}
              initialValues={{ email: "hello@carlo.works" }}
            >
              <Form.Form>
                <Modal.Container>
                  <Form.Field name="email">
                    <Form.Label>Email plz</Form.Label>
                    <Form.Input type="email" />
                    <Form.Error />
                  </Form.Field>
                  <Form.Loading />
                </Modal.Container>
                <Form.Submit>Submit</Form.Submit>
              </Form.Form>
            </Form.Root>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>With tabs</Modal.Trigger>
        <Modal.Portal>
          <Modal.Tabs>
            <Modal.Tab icon={home} value="foo">
              Foo
            </Modal.Tab>
            <Modal.Tab icon={help} value="bar">
              Bar
            </Modal.Tab>
          </Modal.Tabs>
          <Modal.Content value="foo">
            <Modal.Container>Foo content</Modal.Container>
          </Modal.Content>
          <Modal.Content value="bar">
            <Modal.Container>Bar content</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>With steps</Modal.Trigger>
        <Modal.Portal>
          <Modal.Steps>
            <Modal.Step value={0}>Foo</Modal.Step>
            <Modal.Step value={1}>Bar</Modal.Step>
          </Modal.Steps>
          <Modal.Content value={0}>
            <Modal.Container>Foo content</Modal.Container>
          </Modal.Content>
          <Modal.Content value={1}>
            <Modal.Container>Bar content</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>With form tabs</Modal.Trigger>
        <Modal.Portal>
          <Modal.Tabs>
            <Modal.Tab icon={home} value="foo">
              Foo
            </Modal.Tab>
            <Modal.Tab icon={help} value="bar">
              Bar
            </Modal.Tab>
          </Modal.Tabs>
          <Modal.Content value="foo">
            <Form.Root
              schema={testEmailSchema}
              onSubmit={async (values) => console.log(values)}
              initialValues={{ email: "hello@carlo.works" }}
            >
              <Form.Form>
                <Modal.Container>
                  <Modal.Title>Foo form</Modal.Title>
                  <Form.Field name="email">
                    <Form.Label>Email plz</Form.Label>
                    <Form.Input type="email" />
                    <Form.Error />
                  </Form.Field>
                  <Form.Loading />
                </Modal.Container>
                <Form.Submit>Submit</Form.Submit>
              </Form.Form>
            </Form.Root>
          </Modal.Content>
          <Modal.Content value="bar">
            <Form.Root
              schema={testUserPassSchema}
              onSubmit={async (values) => console.log(values)}
              initialValues={{ username: "carlo", password: "password" }}
            >
              <Form.Form>
                <Modal.Container>
                  <Modal.Title>Bar form</Modal.Title>
                  <Form.Field name="username">
                    <Form.Input />
                    <Form.Error />
                  </Form.Field>
                  <Form.Field name="password">
                    <Form.Input type="password" />
                    <Form.Error />
                  </Form.Field>
                  <Form.Loading />
                </Modal.Container>
                <Form.Submit>Submit</Form.Submit>
              </Form.Form>
            </Form.Root>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </main>
  )
}
