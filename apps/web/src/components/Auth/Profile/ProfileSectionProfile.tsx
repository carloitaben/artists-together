"use client"

import Image from "next/image"
import { Dialog } from "@ark-ui/react/dialog"
import { Field } from "@ark-ui/react/field"
import { FormProvider, useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useActionState } from "react"
import { useUser } from "~/lib/promises"
import { updateProfile } from "~/lib/actions"
import { useHydrated } from "~/lib/react"
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
  const [lastResult, action] = useActionState(updateProfile, null)
  const hydrated = useHydrated()

  useFormToastError(lastResult)

  const [form, fields] = useForm({
    lastResult,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: UpdateProfileFormSchema,
      })
    },
  })

  return (
    <ProfileDialogContainer id="profile">
      <Dialog.Title asChild>
        <DialogTitle sm="inter" className="md:sr-only">
          {section.label}
        </DialogTitle>
      </Dialog.Title>
      <DialogTitle sm="fraunces" className="pb-6">
        {user.username}
      </DialogTitle>
      <FormProvider context={form.context}>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate={hydrated}
          className="flex grid-cols-3 flex-col gap-3 pb-3 md:grid"
        >
          <div>
            <div className="flex items-center gap-x-2 px-3.5 pb-1">Avatar</div>
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
          <Field.Root className="col-span-2 flex-col md:flex">
            <Field.Label className="flex flex-none items-center justify-between px-3.5 pb-1">
              <span>Description</span>
              <FieldLength
                className="text-right"
                name={fields.bio.name}
                max={128}
              />
            </Field.Label>
            <Field.Textarea
              name={fields.bio.name}
              defaultValue={fields.bio.initialValue}
              placeholder="Hello! I am a creative person!"
              className="h-24 w-full flex-1 resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3.5 py-2.5 scrollbar-none placeholder:text-gunpla-white-300 md:h-auto"
            />
          </Field.Root>
        </form>
      </FormProvider>
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
