"use client"

import { FileUpload } from "@ark-ui/react"
import { motion } from "framer-motion"
import Icon from "./Icon"
import { useState } from "react"

export default function FileUploader() {
  return (
    <>
      <FileUpload.Dropzone className="grid aspect-square place-items-center overflow-hidden rounded-4 bg-not-so-white">
        <FileUpload.Trigger type="button" tabIndex={-1}>
          <Icon src="Add" alt="Choose file" className="size-8" />
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
      {/* <FileUpload.ItemGroup>
            <FileUpload.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview type="image/*">
                      <FileUpload.ItemPreviewImage />
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemPreview type=".*">
                      <FileIcon />
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger>
                      X
                    </FileUpload.ItemDeleteTrigger>
                  </FileUpload.Item>
                ))
              }
            </FileUpload.Context>
          </FileUpload.ItemGroup> */}
      <FileUpload.HiddenInput />
    </>
  )
}
