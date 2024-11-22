import { Dialog } from "@ark-ui/react/dialog"
import { Field } from "@ark-ui/react/field"
import Image from "~/components/Image"
import AspectRatio from "~/components/AspectRatio"
import DialogTitle from "../DialogTitle"
import Connections from "./Connections"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { sectionData } from "./lib"
import { useSuspenseQuery } from "@tanstack/react-query"
import { authenticateQueryOptions } from "~/services/auth/queries"
import Icon from "~/components/Icon"

// const array = Array.from(Array(3))

export default function ProfileSectionProfile() {
  const auth = useSuspenseQuery(authenticateQueryOptions)
  const section = sectionData["profile"]

  if (!auth.data) return null

  return (
    <ProfileDialogContainer id="profile">
      <Dialog.Title className="sr-only">{section.label}</Dialog.Title>
      <DialogTitle className="pb-6">{auth.data.user.username}</DialogTitle>
      <div className="flex grid-cols-3 flex-col gap-3 pb-3 md:grid">
        <div>
          <div className="flex items-center gap-x-2 px-3.5 pb-1">Avatar</div>
          <AspectRatio.Root ratio={1}>
            <AspectRatio.Content className="overflow-hidden rounded-4 bg-not-so-white">
              {auth.data.user.avatar ? (
                <Image
                  className="size-full object-cover"
                  alt="Your avatar"
                  src={auth.data.user.avatar}
                />
              ) : (
                <div className="grid size-full place-items-center">
                  <Icon src="Face" alt="Your avatar" className="size-6" />
                </div>
              )}
            </AspectRatio.Content>
          </AspectRatio.Root>
        </div>
        <Field.Root className="col-span-2 flex flex-col">
          <Field.Label className="flex flex-none items-center justify-between px-3.5 pb-1">
            <span>Description</span>
            {/* <FieldLength
              className="text-right"
              name={fields.message.name}
              max={300}
            /> */}
          </Field.Label>
          <Field.Textarea
            placeholder="Hello! I am a creative person!"
            className="scrollbar-none w-full flex-1 resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3.5 py-2.5 placeholder:text-gunpla-white-300"
          />
        </Field.Root>
      </div>
      <Connections />
      {/* <Fieldset.Root className="grid grid-cols-3 gap-2">
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
      </Fieldset.Root> */}
    </ProfileDialogContainer>
  )
}
