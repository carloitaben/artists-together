"use client"

import { redirect, useRouter } from "next/navigation"
import { z } from "zod"

import { help } from "~/components/Icons"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import Auth from "~/components/Auth"

const testEmailSchema = z.object({
  email: z.string().email(),
})

const testUserPassSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const emptySchema = z.object({})

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  const router = useRouter()

  return (
    <main className="flex flex-col items-start justify-start gap-2">
      <h1>Modal tests</h1>

      <Form.Root
        schema={emptySchema}
        initialValues={{}}
        onSubmit={async () => {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
          })

          if (response.ok) {
            router.refresh()
          } else {
            throw Error("Unknown error")
          }
        }}
      >
        <Form.Submit>Log out</Form.Submit>
      </Form.Root>

      <Auth className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
        Auth modal
      </Auth>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          Barebones
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Container>Hi</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          Style props
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Container fill={false} padding={false} className="p-8">
              cva rules
            </Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          With title and description
        </Modal.Trigger>
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
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          With form cta floating outside of container
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Content>
            <Form.Root
              schema={testEmailSchema}
              onSubmit={async (values) => console.log(values)}
              initialValues={{ email: "hello@carlo.works" }}
            >
              <Modal.Container>
                <Form.Field name="email">
                  <Form.Label>Email plz</Form.Label>
                  <Form.Input type="email" />
                  <Form.Error />
                </Form.Field>
                <Form.Loading />
              </Modal.Container>
              <Form.Submit className="mt-4 flex justify-end">
                Submit
              </Form.Submit>
            </Form.Root>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          With tabs
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Tabs>
            <Modal.Tab icon={help} value="foo">
              Foo
            </Modal.Tab>
            <Modal.Tab icon={help} value="bar">
              Bar
            </Modal.Tab>
            <Modal.Tab icon={help} value="baz">
              Baz
            </Modal.Tab>
          </Modal.Tabs>
          <Modal.Content value="foo">
            <Modal.Container>Foo content</Modal.Container>
          </Modal.Content>
          <Modal.Content value="bar">
            <Modal.Container>Bar content</Modal.Container>
          </Modal.Content>
          <Modal.Content value="baz">
            <Modal.Container>Baz content</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          With steps
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Steps>
            <Modal.Step value={0}>Foo</Modal.Step>
            <Modal.Step value={1}>Bar</Modal.Step>
            <Modal.Step value={2}>Baz</Modal.Step>
          </Modal.Steps>
          <Modal.Content value={0}>
            <Modal.Container>Foo content</Modal.Container>
          </Modal.Content>
          <Modal.Content value={1}>
            <Modal.Container>Bar content</Modal.Container>
          </Modal.Content>
          <Modal.Content value={2}>
            <Modal.Container>Baz content</Modal.Container>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger className="rounded-full bg-theme-800 px-10 py-3 text-center font-sans text-sm">
          With form tabs
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Tabs>
            <Modal.Tab icon={help} value="foo">
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
              <Modal.Container>
                <Modal.Title>Foo form</Modal.Title>
                <Form.Field name="email">
                  <Form.Label>Email plz</Form.Label>
                  <Form.Input type="email" />
                  <Form.Error />
                </Form.Field>
                <Form.Loading />
              </Modal.Container>
              <Form.Submit className="mt-4 flex justify-end">
                Submit
              </Form.Submit>
            </Form.Root>
          </Modal.Content>
          <Modal.Content value="bar">
            <Form.Root
              schema={testUserPassSchema}
              onSubmit={async (values) => console.log(values)}
              initialValues={{ username: "carlo", password: "password" }}
            >
              <Modal.Container>
                <Modal.Title>Bar form</Modal.Title>
                <Form.Field name="username">
                  <Form.Label>Username plz</Form.Label>
                  <Form.Input />
                  <Form.Error />
                </Form.Field>
                <Form.Field name="password">
                  <Form.Label>Password plz</Form.Label>
                  <Form.Input type="password" />
                  <Form.Error />
                </Form.Field>
                <Form.Loading />
              </Modal.Container>
              <Form.Submit className="mt-4 flex justify-end">
                Submit
              </Form.Submit>
            </Form.Root>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </main>
  )
}
