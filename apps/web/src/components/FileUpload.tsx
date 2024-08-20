"use client"

import { FileUpload as FileUploadPrimitive } from "@ark-ui/react"
import { useRef, useState, useTransition, type ComponentRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { getUser } from "~/services/auth/client"
import { getSignedURL } from "~/services/files/actions"
import { getFileDimensions } from "~/services/files/shared"
import * as AspectRatio from "~/components/AspectRatio"
import Icon from "./Icon"

type Props = {}

export default function FileUpload({}: Props) {
  const ref = useRef<ComponentRef<"form">>(null)
  const [file, setFile] = useState<File>()
  const [isPending, startTransition] = useTransition()

  // return (
  //   <>
  //     <form
  //       ref={ref}
  //       className="relative aspect-square size-[9.625rem] overflow-hidden rounded-2xl bg-not-so-white"
  //       action={async () => {
  //         if (!file) return

  //         startTransition(async () => {
  //           console.log("starting transition")
  //           await new Promise((resolve) => setTimeout(resolve, 5_000))
  //           console.log("transition ok")
  //           // const dimensions = await getFileDimensions(file)
  //           // const urls = await getSignedURL({
  //           //   bucket: "public",
  //           //   folder: "avatar",
  //           //   key: "avatar",
  //           //   filename: file.name,
  //           //   userId: auth.user.id,
  //           //   dimensions,
  //           // })

  //           // await fetch(urls.signedUrl, {
  //           //   body: file,
  //           //   method: "put",
  //           //   headers: {
  //           //     "Content-Type": file.type,
  //           //   },
  //           // })
  //         })

  //         // setFile(undefined)
  //         // alert(urls.fileUrl)
  //       }}
  //     >
  //       <DropZone
  //         className="size-full bg-acrylic-red-500/20"
  //         onDrop={async (event) => {
  //           const item = event.items.find(
  //             (file) => file.kind === "file",
  //           ) as FileDropItem

  //           if (item) {
  //             const file = await item.getFile()
  //             setFile(file)
  //             ref.current?.requestSubmit()
  //           }
  //         }}
  //       >
  //         <FileTrigger
  //           onSelect={(event) => {
  //             const file = event?.item(0)

  //             if (file) {
  //               setFile(file)
  //               ref.current?.requestSubmit()
  //             }
  //           }}
  //         >
  //           <Button className="grid size-full place-items-center bg-acrylic-red-500/20">
  //             <span className="size-12 bg-acrylic-red-500/20">+</span>
  //           </Button>
  //         </FileTrigger>
  //       </DropZone>
  //       <Button type="submit" isDisabled={!file}>
  //         submit
  //       </Button>
  //       <AnimatePresence>
  //         {isPending ? (
  //           <motion.div
  //             initial={{ y: "100%" }}
  //             animate={{ y: "0%" }}
  //             exit={{ opacity: 0, display: "none" }}
  //             className="absolute inset-0 size-full bg-[url('/svgs/file-upload-wave.svg')] bg-top bg-repeat-x text-acrylic-red-500"
  //           />
  //         ) : null}
  //       </AnimatePresence>
  //     </form>
  //     {file ? file.name : null}
  //   </>
  // )

  return (
    <AspectRatio.Root ratio={1}>
      <AspectRatio.Content asChild>
        <FileUploadPrimitive.Root
          maxFiles={1}
          className="overflow-hidden rounded-2xl bg-not-so-white"
        >
          <FileUploadPrimitive.Dropzone className="grid size-full place-items-center">
            <FileUploadPrimitive.Trigger type="button">
              <Icon
                name="close"
                className="size-8 rotate-45"
                alt="Choose file"
              />
            </FileUploadPrimitive.Trigger>
          </FileUploadPrimitive.Dropzone>
          <FileUploadPrimitive.ItemGroup>
            <FileUploadPrimitive.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.map((file) => (
                  <FileUploadPrimitive.Item key={file.name} file={file}>
                    <FileUploadPrimitive.ItemPreview type="image/*">
                      <FileUploadPrimitive.ItemPreviewImage />
                    </FileUploadPrimitive.ItemPreview>
                    <FileUploadPrimitive.ItemPreview type=".*">
                      <div>icon</div>
                    </FileUploadPrimitive.ItemPreview>
                    <FileUploadPrimitive.ItemName />
                    <FileUploadPrimitive.ItemSizeText />
                    <FileUploadPrimitive.ItemDeleteTrigger>
                      X
                    </FileUploadPrimitive.ItemDeleteTrigger>
                  </FileUploadPrimitive.Item>
                ))
              }
            </FileUploadPrimitive.Context>
          </FileUploadPrimitive.ItemGroup>
          <FileUploadPrimitive.HiddenInput />
        </FileUploadPrimitive.Root>
      </AspectRatio.Content>
    </AspectRatio.Root>
  )
}
