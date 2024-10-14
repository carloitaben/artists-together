import { Dialog } from "@ark-ui/react/dialog"
import { Field } from "@ark-ui/react/field"
import { Fieldset } from "@ark-ui/react/fieldset"
import { FileUpload } from "@ark-ui/react/file-upload"
import FileUploader from "~/components/FileUploader"
import InlineTooltip from "~/components/InlineTooltip"
import DialogContainer from "../DialogContainer"
import DialogTitle from "../DialogTitle"
import Connections from "./Connections"
import { sectionData } from "./lib"

const array = Array.from(Array(3))

export default function ProfileSectionProfile() {
  const section = sectionData["profile"]

  return (
    <DialogContainer id="profile">
      <Dialog.Title className="sr-only">{section.label}</Dialog.Title>
      <DialogTitle className="pb-6">Artist_00315</DialogTitle>
      <div className="grid grid-cols-3 gap-2 pb-3">
        <FileUpload.Root maxFiles={1}>
          <FileUpload.Label className="flex items-center gap-x-2 px-3.5 pb-1">
            <InlineTooltip tooltip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nobis, magni possimus qui neque soluta sequi, eligendi cum explicabo earum non consequatur in at repellat libero quod tempore enim necessitatibus!">
              Avatar
            </InlineTooltip>
          </FileUpload.Label>
          <FileUploader />
        </FileUpload.Root>
        <Field.Root className="col-span-2 flex flex-col">
          <Field.Label className="flex flex-none items-center justify-between px-3.5 pb-1">
            <span>Description</span>
            <span>30/128</span>
          </Field.Label>
          <Field.Textarea
            placeholder="Hello! I am a creative person!"
            className="w-full flex-1 resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3.5 py-2.5"
          />
        </Field.Root>
      </div>
      <Connections />
      <Fieldset.Root className="grid grid-cols-3 gap-2">
        <Fieldset.Legend className="flex items-center gap-x-2 px-3.5 pb-1">
          <InlineTooltip tooltip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nobis, magni possimus qui neque soluta sequi, eligendi cum explicabo earum non consequatur in at repellat libero quod tempore enim necessitatibus!">
            Content shared
          </InlineTooltip>
        </Fieldset.Legend>
        {array.map((_, index) => (
          <FileUpload.Root key={index} maxFiles={1}>
            <FileUpload.Label className="sr-only">
              Content shared {index}
            </FileUpload.Label>
            <FileUploader />
          </FileUpload.Root>
        ))}
      </Fieldset.Root>
    </DialogContainer>
  )
}
