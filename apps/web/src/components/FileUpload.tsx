"use client"

import { useState } from "react";
import { Button, DropZone, FileTrigger, type FileDropItem } from "react-aria-components";
import { getSignedURL } from "~/services/files/actions";

export default function FileUpload() {
  const [file, setFile] = useState<File>()
  return (
    <>
      <form action={async () => {
        if (!file) return
        const url = await getSignedURL(file?.name)

        await fetch(url, {
          body: file,
          method: "put",
          headers: {
            "Content-Type": file.type,
          },
        })

        alert("ole")
      }}>
        <DropZone
          onDrop={async (event) => {
            const item = event.items.find((file) => file.kind === 'file') as FileDropItem

            if (item) {
              const file = await item.getFile()
              setFile(file)
            }
          }}
        >
          <FileTrigger
            onSelect={(event) => {
              const file = event?.item(0)
              if (file) setFile(file)
            }}
          >
            <Button>Select files</Button>
          </FileTrigger>
        </DropZone>
        <Button type="submit" isDisabled={!file}>submit</Button>
      </form>
      {file ? file.name : null}
    </>
  )
}
