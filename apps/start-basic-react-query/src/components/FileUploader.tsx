// "use client"

// import { FileUpload } from "@ark-ui/react/file-upload"
// import { motion } from "motion/react"
// import Icon from "./Icon"
// import { useState } from "react"

// export default function FileUploader() {
//   // return (
//   //   <>
//   //     <form
//   //       ref={ref}
//   //       className="relative aspect-square size-[9.625rem] overflow-hidden rounded-2xl bg-not-so-white"
//   //       action={async () => {
//   //         if (!file) return

//   //         startTransition(async () => {
//   //           console.log("starting transition")
//   //           await new Promise((resolve) => setTimeout(resolve, 5_000))
//   //           console.log("transition ok")
//   //           // const dimensions = await getFileDimensions(file)
//   //           // const urls = await getSignedURL({
//   //           //   bucket: "public",
//   //           //   folder: "avatar",
//   //           //   key: "avatar",
//   //           //   filename: file.name,
//   //           //   userId: auth.user.id,
//   //           //   dimensions,
//   //           // })

//   //           // await fetch(urls.signedUrl, {
//   //           //   body: file,
//   //           //   method: "put",
//   //           //   headers: {
//   //           //     "Content-Type": file.type,
//   //           //   },
//   //           // })
//   //         })

//   //         // setFile(undefined)
//   //         // alert(urls.fileUrl)
//   //       }}
//   //     >
//   //       <DropZone
//   //         className="size-full bg-acrylic-red-500/20"
//   //         onDrop={async (event) => {
//   //           const item = event.items.find(
//   //             (file) => file.kind === "file",
//   //           ) as FileDropItem

//   //           if (item) {
//   //             const file = await item.getFile()
//   //             setFile(file)
//   //             ref.current?.requestSubmit()
//   //           }
//   //         }}
//   //       >
//   //         <FileTrigger
//   //           onSelect={(event) => {
//   //             const file = event?.item(0)

//   //             if (file) {
//   //               setFile(file)
//   //               ref.current?.requestSubmit()
//   //             }
//   //           }}
//   //         >
//   //           <Button className="grid size-full place-items-center bg-acrylic-red-500/20">
//   //             <span className="size-12 bg-acrylic-red-500/20">+</span>
//   //           </Button>
//   //         </FileTrigger>
//   //       </DropZone>
//   //       <Button type="submit" isDisabled={!file}>
//   //         submit
//   //       </Button>
//   //       <AnimatePresence>
//   //         {isPending ? (
//   //           <motion.div
//   //             initial={{ y: "100%" }}
//   //             animate={{ y: "0%" }}
//   //             exit={{ opacity: 0, display: "none" }}
//   //             className="absolute inset-0 size-full bg-[url('/svgs/file-upload-wave.svg')] bg-top bg-repeat-x text-acrylic-red-500"
//   //           />
//   //         ) : null}
//   //       </AnimatePresence>
//   //     </form>
//   //     {file ? file.name : null}
//   //   </>
//   // )

//   return (
//     <>
//       <FileUpload.Dropzone className="grid aspect-square place-items-center overflow-hidden rounded-4 bg-not-so-white">
//         <FileUpload.Trigger type="button" tabIndex={-1}>
//           <Icon src="Add" alt="Choose file" className="size-8" />
//         </FileUpload.Trigger>
//       </FileUpload.Dropzone>
//       {/* <FileUpload.ItemGroup>
//             <FileUpload.Context>
//               {({ acceptedFiles }) =>
//                 acceptedFiles.map((file) => (
//                   <FileUpload.Item key={file.name} file={file}>
//                     <FileUpload.ItemPreview type="image/*">
//                       <FileUpload.ItemPreviewImage />
//                     </FileUpload.ItemPreview>
//                     <FileUpload.ItemPreview type=".*">
//                       <FileIcon />
//                     </FileUpload.ItemPreview>
//                     <FileUpload.ItemName />
//                     <FileUpload.ItemSizeText />
//                     <FileUpload.ItemDeleteTrigger>
//                       X
//                     </FileUpload.ItemDeleteTrigger>
//                   </FileUpload.Item>
//                 ))
//               }
//             </FileUpload.Context>
//           </FileUpload.ItemGroup> */}
//       <FileUpload.HiddenInput />
//     </>
//   )
// }
