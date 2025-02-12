"use client"

import Image from "next/image"
import { Dialog } from "@ark-ui/react/dialog"
import {
  FormProvider,
  getFormProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useActionState } from "react"
import { useUser } from "~/lib/promises"
import { updateProfile } from "~/lib/actions"
import { useFormToastError } from "~/lib/forms"
import { UpdateProfileFormSchema } from "~/lib/schemas"
import Icon from "~/components/Icon"
import FieldLength from "~/components/FieldLength"
import AspectRatio from "~/components/AspectRatio"
import DialogTitle from "../DialogTitle"
import Connections from "./Connections"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { sectionData } from "./lib"

export default function ProfileSectionProfile() {
  const user = useUser()

  if (!user) {
    throw Error("Unauthorized")
  }

  const section = sectionData["profile"]
  const [lastResult, action, isPending] = useActionState(updateProfile, null)

  useFormToastError(lastResult)

  const [form, fields] = useForm({
    lastResult: lastResult?.result,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: UpdateProfileFormSchema,
      })
    },
    defaultValue: {
      bio: user.bio,
    },
  })

  return (
    <ProfileDialogContainer id="profile">
      <Dialog.Title asChild>
        <DialogTitle sm="inter" className="md:sr-only">
          {section.label}
        </DialogTitle>
      </Dialog.Title>
      <DialogTitle sm="fraunces" className="md:pt:0 pb-4 pt-3 md:pb-6">
        {user.username}
      </DialogTitle>
      <form
        {...getFormProps(form)}
        action={action}
        className="flex grid-cols-3 flex-col gap-7 pb-6 md:grid md:gap-3 md:pb-3"
        onBlur={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return
          if (isPending) return
          event.currentTarget.requestSubmit()
        }}
      >
        <FormProvider context={form.context}>
          <div>
            <div className="flex items-center gap-x-2 px-3 pb-1 md:px-3.5">
              Avatar
            </div>
            <AspectRatio.Root ratio={1}>
              <AspectRatio.Content className="overflow-hidden rounded-4 bg-not-so-white">
                {user.avatar ? (
                  <Image
                    className="size-full object-cover"
                    alt="Your avatar"
                    src={user.avatar}
                    draggable={false}
                    unoptimized
                    fill
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Icon src="Face" alt="Your avatar" className="size-6" />
                  </div>
                )}
              </AspectRatio.Content>
            </AspectRatio.Root>
          </div>
          <div className="col-span-2 flex-col md:flex">
            <label
              htmlFor={fields.bio.id}
              className="flex flex-none items-center justify-between px-3 pb-1 md:px-3.5"
            >
              <span>Description</span>
              <FieldLength
                className="text-right"
                name={fields.bio.name}
                max={128}
              />
            </label>
            <textarea
              {...getTextareaProps(fields.bio)}
              placeholder="Hello! I am a creative person!"
              className="h-24 w-full flex-1 resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3 py-2.5 scrollbar-none placeholder:text-gunpla-white-300 md:h-auto md:px-3.5"
            />
          </div>
        </FormProvider>
      </form>
      <Connections />
      {/* <Fieldset.Root className="grid grid-cols-3 gap-2">
        <Fieldset.Legend className="flex items-center gap-x-2 px-3 md:px-3.5 pb-1">
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
