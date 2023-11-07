import Container from "~/components/Container"
import * as ContextMenu from "~/components/ContextMenu"

export const handle = {
  actions: {},
  page: {
    name: "Debug",
  },
}

export default function Page() {
  return (
    <main>
      <Container grid>
        <div className="col-span-2">
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div>Trigger foo</div>
            </ContextMenu.Trigger>
            <ContextMenu.Trigger>
              <div>Trigger bar</div>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Report</ContextMenu.Item>
              <ContextMenu.Item>Quick actions</ContextMenu.Item>
              <ContextMenu.Item>Block</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
        <div className="col-span-2">
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div>Trigger baz</div>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Report</ContextMenu.Item>
              <ContextMenu.Item disabled>Quick actions</ContextMenu.Item>
              <ContextMenu.Item>Block</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
        <div className="col-span-2">
          <ContextMenu.Root render={(user) => !!user}>
            <ContextMenu.Trigger>
              <div>Root render condition</div>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Foo</ContextMenu.Item>
              <ContextMenu.Item>Bar</ContextMenu.Item>
              <ContextMenu.Item render={(user) => !!user?.bio}>
                Baz
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
      </Container>
    </main>
  )
}
