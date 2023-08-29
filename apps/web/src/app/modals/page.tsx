"use client"

import { redirect } from "next/navigation"

import { help } from "~/components/Icons"
import * as Modal from "~/components/Modal"

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  return (
    <main className="flex flex-col items-start justify-start gap-2">
      <h1>Modal tests</h1>

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
    </main>
  )
}
