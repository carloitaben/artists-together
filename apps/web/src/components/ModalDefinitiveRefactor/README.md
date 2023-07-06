```tsx
// Form with button outside of content
<Modal.Root>
  <Modal.Trigger />
  <Modal.Portal> {/* Portal, overlay, centering children, tab root */}
    <Modal.Content>
      <Form>
        <Modal.Container> {/* modal content, tab content, bg color, rounded, etc */}
          <Modal.Title>Log-in</Modal.Title>
          <Form.Field>
            <Form.Label />
            <Form.Input />
            <Form.Error />
          </Form.Field>
        </Modal.Container>
        <Form.Submit />
      </Form>
    </Modal.Content>
  </Modal.Portal>
</Modal.Root>

// Form with tabs (if cannot have anchors)
<Modal.Root> ✅
  <Modal.Trigger /> ✅
  <Modal.Portal> ✅ {/* Portal, overlay, centering children, tab root */}
    <Modal.Tabs> {/* tab list, grid, absolute positioning */}
      <Modal.TabTrigger icon={foo} value="foo"> ✅
        Foo
      </Modal.TabTrigger>
      <Modal.TabTrigger icon={bar} value="bar"> ✅
        Bar
      </Modal.TabTrigger>
      <Modal.TabTrigger icon={baz} value="baz"> ✅
        Baz
      </Modal.TabTrigger>
    </Modal.Tabs>
    <Modal.Tab value="foo"> {/* modal content, tab content */}
      <Modal.Container /> {/* bg white rounded, shadow etc */}
    </Modal.Tab>  
    <Modal.Tab value="bar"> {/* modal content, tab content */}
      <Modal.Container /> {/* bg white rounded, shadow etc */}
    </Modal.Tab>  
    <Modal.Tab value="baz"> {/* modal content, tab content */}
      <Modal.Container /> {/* bg white rounded, shadow etc */}
    </Modal.Tab>  
  </Modal.Portal>
</Modal.Root>

// Form with tabs (if anchors are another option)
<Modal.Root>
  <Modal.Trigger />
  <Modal.Portal> {/* Portal, overlay, centering children, tab root */}
    <Modal.Sidebar type="tabs"> {/* tab list, grid, absolute positioning */}
      <Modal.SidebarItem icon={foo} value="foo">
        Foo
      </Modal.SidebarItem>
      <Modal.SidebarItem icon={bar} value="bar">
        Bar
      </Modal.SidebarItem>
      <Modal.SidebarItem icon={baz} value="baz">
        Baz
      </Modal.SidebarItem>
    <Modal.Sidebar>
    <Modal.Content value="foo" /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value="bar" /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value="baz" /> {/* modal content, tab content, bg color, rounded, etc */}
  </Modal.Portal>
</Modal.Root>

// Form with anchors
<Modal.Root>
  <Modal.Trigger />
  <Modal.Portal> {/* Portal, overlay, centering children, tab root */}
    <Modal.Sidebar type="anchor"> {/* grid, absolute positioning */}
      <Modal.SidebarItem icon={foo} value="foo">
        Foo
      </Modal.SidebarItem>
      <Modal.SidebarItem icon={bar} value="bar">
        Bar
      </Modal.SidebarItem>
      <Modal.SidebarItem icon={baz} value="baz">
        Baz
      </Modal.SidebarItem>
    <Modal.Sidebar>
    <Modal.Content value="foo" /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value="bar" /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value="baz" /> {/* modal content, tab content, bg color, rounded, etc */}
  </Modal.Portal>
</Modal.Root>

// Form with steps
<Modal.Root>
  <Modal.Trigger />
  <Modal.Portal> {/* Portal, overlay, centering children, tab root */}
    <Modal.Steps> {/* flex, static positioning (above the items) */}
      <Modal.Step value={0}>
        Foo
      </Modal.Step>
      <Modal.Step value={1}>
        Bar
      </Modal.Step>
      <Modal.Step value={2}>
        Baz
      </Modal.Step>
    <Modal.Steps>
    <Modal.Content value={0} /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value={1} /> {/* modal content, tab content, bg color, rounded, etc */}
    <Modal.Content value={2} /> {/* modal content, tab content, bg color, rounded, etc */}
  </Modal.Portal>
</Modal.Root>
```